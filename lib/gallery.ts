import { readdir } from "node:fs/promises";
import path from "node:path";
import galleryManifest from "@/content/gallery.manifest.json";
import pujasManifest from "@/content/pujas.manifest.json";
import { prisma } from "@/lib/db";
import { syncAdminMediaFolderToPublicGallery } from "@/lib/sync-admin-media-gallery";

export type GalleryItem = {
  src: string;
  alt: string;
  slug?: string;
};

function mapGalleryFiles(files: string[], prefix: string, altBase: string): GalleryItem[] {
  return files
    .filter((f) => /\.(png|jpe?g|webp|gif|svg)$/i.test(f))
    .map((f) => ({
      src: `${prefix}/${f}`,
      alt: `${altBase} — ${f.replace(/\.[^.]+$/, "")}`,
    }));
}

/** Image files placed directly in public/gallery (no DB row required). */
async function getDiskGalleryInPublicFolder(): Promise<GalleryItem[]> {
  const dir = path.join(process.cwd(), "public", "gallery");
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && /\.(png|jpe?g|webp|gif|svg)$/i.test(e.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
      .map((e) => ({
        src: `/gallery/${e.name}`,
        alt: `Gokarna puja — ${e.name.replace(/\.[^.]+$/, "")}`,
      }));
  } catch {
    return [];
  }
}

function mergeBySrc(first: GalleryItem[], ...rest: GalleryItem[][]): GalleryItem[] {
  const seen = new Set<string>();
  const out: GalleryItem[] = [];
  for (const group of [first, ...rest]) {
    for (const item of group) {
      if (seen.has(item.src)) continue;
      seen.add(item.src);
      out.push(item);
    }
  }
  return out;
}

export async function getGeneralGalleryImages(): Promise<GalleryItem[]> {
  await syncAdminMediaFolderToPublicGallery();

  let dbItems: GalleryItem[] = [];
  try {
    const rows = await prisma.mediaAsset.findMany({
      where: { kind: "GENERAL" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    dbItems = rows.map((item) => ({ src: item.path, alt: item.alt }));
  } catch {
    /* DB unavailable — still show manifest + disk */
  }

  const manifestFiles = (galleryManifest as { images: string[] }).images ?? [];
  const manifestItems = manifestFiles.length
    ? mapGalleryFiles(manifestFiles, "/gallery", "Gokarna puja")
    : [];

  const diskItems = await getDiskGalleryInPublicFolder();

  return mergeBySrc(dbItems, manifestItems, diskItems);
}

export async function getPujaGalleryImages(slug: string): Promise<GalleryItem[]> {
  try {
    const puja = await prisma.pujaType.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (puja?.id) {
      const dbItems = await prisma.mediaAsset.findMany({
        where: { kind: "PUJA", pujaTypeId: puja.id },
        orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      });
      if (dbItems.length) {
        return dbItems.map((item) => ({ src: item.path, alt: item.alt, slug }));
      }
    }
  } catch {
    /* fallback to manifests */
  }
  const bySlug = (pujasManifest as { bySlug: Record<string, string[]> }).bySlug ?? {};
  const files = bySlug[slug] ?? [];
  if (!files.length) return [];
  return mapGalleryFiles(files, `/pujas/${slug}`, slug);
}

export async function hasAnyGalleryImages(): Promise<boolean> {
  await syncAdminMediaFolderToPublicGallery();
  try {
    const count = await prisma.mediaAsset.count();
    if (count > 0) return true;
  } catch {
    /* continue with manifests fallback */
  }
  const g = (galleryManifest as { images: string[] }).images ?? [];
  if (g.length) return true;
  const disk = await getDiskGalleryInPublicFolder();
  if (disk.length) return true;
  const bySlug = (pujasManifest as { bySlug: Record<string, string[]> }).bySlug ?? {};
  return Object.values(bySlug).some((arr) => arr.length > 0);
}

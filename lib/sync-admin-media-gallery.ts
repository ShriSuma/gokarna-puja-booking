import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const DROP_DIR = path.join(process.cwd(), "app", "admin", "media");
const PUBLIC_GALLERY = path.join(process.cwd(), "public", "gallery");

const imageExt = /\.(jpe?g|png|webp|gif)$/i;

/** Skip Next.js route modules and non-images placed in the admin media folder by mistake. */
function isSkippableFile(name: string): boolean {
  if (name.startsWith(".")) return true;
  if (/\.(tsx?|jsx?|json|md)$/i.test(name)) return true;
  return false;
}

/**
 * Copies image files from app/admin/media into public/gallery so /gallery can serve them.
 * Copies when source is new or newer than the destination (simple sync).
 */
export async function syncAdminMediaFolderToPublicGallery(): Promise<void> {
  let entries: import("node:fs").Dirent[];
  try {
    entries = await readdir(DROP_DIR, { withFileTypes: true });
  } catch {
    return;
  }

  await mkdir(PUBLIC_GALLERY, { recursive: true });

  for (const e of entries) {
    if (!e.isFile() || isSkippableFile(e.name)) continue;
    if (!imageExt.test(e.name)) continue;

    const from = path.join(DROP_DIR, e.name);
    const to = path.join(PUBLIC_GALLERY, e.name);

    try {
      const [stFrom, stTo] = await Promise.all([
        stat(from),
        stat(to).catch(() => null),
      ]);
      if (stTo && stTo.mtimeMs >= stFrom.mtimeMs) continue;
      await copyFile(from, to);
    } catch {
      /* ignore individual file errors */
    }
  }
}

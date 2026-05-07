import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const maxFileSize = 5 * 1024 * 1024;

function extensionFrom(fileName: string) {
  const ext = path.extname(fileName || "").toLowerCase();
  return ext || ".jpg";
}

export function validateUpload(file: File) {
  if (!allowedTypes.has(file.type)) throw new Error("Unsupported file type. Use jpg, png, webp, gif, or svg.");
  if (file.size > maxFileSize) throw new Error("Image is too large. Maximum size is 5MB.");
}

export async function saveUpload(file: File, bucket: "gallery" | "pujas", slug?: string) {
  validateUpload(file);
  const ext = extensionFrom(file.name);
  const id = randomUUID();
  const folder = bucket === "gallery" ? path.join("uploads", "gallery") : path.join("uploads", "pujas", slug || "general");
  const absoluteFolder = path.join(process.cwd(), "public", folder);
  await mkdir(absoluteFolder, { recursive: true });
  const fileName = `${id}${ext}`;
  const absolutePath = path.join(absoluteFolder, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);
  return `/${folder.replace(/\\/g, "/")}/${fileName}`;
}

export async function removeUpload(publicPath: string) {
  const cleaned = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
  const absolute = path.join(process.cwd(), "public", cleaned);
  await unlink(absolute).catch(() => undefined);
}


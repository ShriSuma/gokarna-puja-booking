/**
 * Copy image files from a folder into public/gallery so they appear on /gallery.
 *
 * Usage (PowerShell):
 *   node scripts/copy-images-to-public-gallery.mjs "C:\path\to\your\images"
 *
 * The app route folder app/admin/media is NOT used for storage — only public/gallery
 * (or uploads via Admin → Media form into the database) are shown.
 */

import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const destDir = path.join(root, "public", "gallery");

const srcDir = process.argv[2];
if (!srcDir) {
  console.error("Usage: node scripts/copy-images-to-public-gallery.mjs <source-folder>");
  process.exit(1);
}

const extOk = /\.(png|jpe?g|webp|gif|svg)$/i;

async function main() {
  await mkdir(destDir, { recursive: true });
  const names = await readdir(srcDir, { withFileTypes: true });
  const files = names.filter((e) => e.isFile() && extOk.test(e.name));
  if (!files.length) {
    console.error(`No image files found in: ${srcDir}`);
    process.exit(1);
  }
  for (const e of files) {
    const from = path.join(srcDir, e.name);
    const to = path.join(destDir, e.name);
    await copyFile(from, to);
    console.log("Copied:", e.name);
  }
  console.log(`\nDone. Open /gallery — files are under public/gallery/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

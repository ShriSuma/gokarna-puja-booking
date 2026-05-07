/**
 * Scans public/gallery and public/pujas/<slug>/ and writes manifests.
 * Run: npm run manifests
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const galleryDir = path.join(publicDir, "gallery");
const pujasDir = path.join(publicDir, "pujas");

const imageRe = /\.(png|jpe?g|webp|gif|svg)$/i;

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && imageRe.test(e.name))
    .map((e) => e.name)
    .sort();
}

const galleryImages = listImages(galleryDir);

const bySlug = {};
if (fs.existsSync(pujasDir)) {
  for (const entry of fs.readdirSync(pujasDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const imgs = listImages(path.join(pujasDir, slug));
    if (imgs.length) bySlug[slug] = imgs;
  }
}

fs.writeFileSync(
  path.join(root, "content", "gallery.manifest.json"),
  JSON.stringify({ images: galleryImages }, null, 2) + "\n",
);

fs.writeFileSync(
  path.join(root, "content", "pujas.manifest.json"),
  JSON.stringify({ bySlug }, null, 2) + "\n",
);

console.log(
  `Wrote ${galleryImages.length} gallery images and ${Object.keys(bySlug).length} puja folders with images.`,
);

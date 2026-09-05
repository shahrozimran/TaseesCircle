// Mechanical exports of the edited, transparent symbol without lettering.
// Preserve the master PNG's alpha channel when resizing the website assets.
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "assets/brand/tasees-circle-symbol.png");
const output = path.join(root, "public/brand");
const app = path.join(root, "src/app");
await mkdir(output, { recursive: true });

const original = await readFile(source);
const metadata = await sharp(original).metadata();
const stats = await sharp(original).stats();
if (!metadata.hasAlpha || stats.isOpaque) {
  throw new Error("The symbol master must have real alpha transparency, not a painted background.");
}
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const background = { r: 252, g: 249, b: 246, alpha: 1 };
const symbol = await sharp(original).trim().png().toBuffer();
const logo = await sharp(symbol)
  .resize(1024, 512, { fit: "contain", background: transparent }).png().toBuffer();

await writeFile(path.join(output, "logo.png"), logo);
await sharp(logo).resize({ width: 520 }).webp({ lossless: true }).toFile(path.join(output, "logo.webp"));

async function square(size, maskable = false, opaque = false) {
  // The maskable symbol fits entirely inside the central 80% safe circle.
  const insetSize = Math.round(size * (maskable ? 0.7 : 0.92));
  const scaled = await sharp(symbol).resize({ width: insetSize }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: maskable || opaque ? background : transparent } })
    .composite([{ input: scaled, gravity: "centre" }]).png().toBuffer();
}

await sharp(await square(128)).webp({ lossless: true }).toFile(path.join(output, "mark.webp"));
for (const size of [192, 512]) {
  await writeFile(path.join(output, `icon-${size}.png`), await square(size));
}
await writeFile(path.join(output, "icon-maskable-512.png"), await square(512, true));
await writeFile(path.join(app, "icon.png"), await square(48));
await writeFile(path.join(app, "apple-icon.png"), await square(180, false, true));

// ICO supports PNG frames, retaining crisp artwork at each native icon size.
const sizes = [16, 32, 48, 64, 256];
const images = await Promise.all(sizes.map((size) => square(size)));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index] % 256;
  directory[entry + 1] = sizes[index] % 256;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(image.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile(path.join(app, "favicon.ico"), Buffer.concat([directory, ...images]));

const socialLogo = await sharp(logo).resize({ width: 860 }).png().toBuffer();
const social = await sharp({ create: { width: 1200, height: 630, channels: 3, background } })
  .composite([{ input: socialLogo, gravity: "centre" }]).png().toBuffer();
await writeFile(path.join(app, "opengraph-image.png"), social);
await writeFile(path.join(app, "twitter-image.png"), social);
console.log("Exported website logo, browser icons, app icons and social previews.");

// Mechanical exports of the approved artwork: crop empty margins and resize.
// Keep the original colours, lettering and geometry; never redraw the logo.
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "assets/brand/tasees-circle-original.png");
const output = path.join(root, "public/brand");
const app = path.join(root, "src/app");
await mkdir(output, { recursive: true });

const original = await readFile(source);
const pixel = await sharp(original).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer();
const background = { r: pixel[0], g: pixel[1], b: pixel[2], alpha: 1 };
const logo = await sharp(original)
  .extract({ left: 110, top: 298, width: 1040, height: 632 })
  .png().toBuffer();
const symbol = await sharp(original)
  .extract({ left: 195, top: 301, width: 870, height: 460 })
  .png().toBuffer();

await writeFile(path.join(output, "logo.png"), logo);
await sharp(logo).resize({ width: 520 }).webp({ lossless: true }).toFile(path.join(output, "logo.webp"));

async function square(size, maskable = false) {
  // The maskable symbol fits entirely inside the central 80% safe circle.
  const insetSize = Math.round(size * (maskable ? 0.7 : 0.92));
  const scaled = await sharp(symbol).resize({ width: insetSize }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: scaled, gravity: "centre" }]).png().toBuffer();
}

await sharp(await square(128)).webp({ lossless: true }).toFile(path.join(output, "mark.webp"));
for (const size of [192, 512]) {
  await writeFile(path.join(output, `icon-${size}.png`), await square(size));
}
await writeFile(path.join(output, "icon-maskable-512.png"), await square(512, true));
await writeFile(path.join(app, "icon.png"), await square(48));
await writeFile(path.join(app, "apple-icon.png"), await square(180));

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

const socialLogo = await sharp(logo).resize({ height: 510 }).png().toBuffer();
const social = await sharp({ create: { width: 1200, height: 630, channels: 3, background } })
  .composite([{ input: socialLogo, gravity: "centre" }]).png().toBuffer();
await writeFile(path.join(app, "opengraph-image.png"), social);
await writeFile(path.join(app, "twitter-image.png"), social);
console.log("Exported website logo, browser icons, app icons and social previews.");

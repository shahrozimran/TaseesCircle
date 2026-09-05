// Owner-approved extraction from the original PNG, without redrawing the emblem.
import sharp from "sharp";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const input = path.join(root, "assets/brand/tasees-circle-original.png");
// This rectangle contains the full emblem and excludes all lettering.
const { data, info } = await sharp(input)
  .extract({ left: 195, top: 301, width: 870, height: 460 })
  .removeAlpha().raw().toBuffer({ resolveWithObject: true });
const matte = [...data.subarray(0, 3)];
const rgba = Buffer.alloc(info.width * info.height * 4);

for (let pixel = 0; pixel < info.width * info.height; pixel++) {
  const colour = [...data.subarray(pixel * 3, pixel * 3 + 3)];
  const distance = Math.max(...colour.map((value, channel) => Math.abs(matte[channel] - value)));
  let alpha = 0;
  let foreground = colour;
  if (distance > 10) {
    // Preserve solid gold/black pixels exactly; only unmatte boundary pixels.
    if (colour[2] < 150 && (colour[0] - colour[2] > 25 || Math.max(...colour) < 130)) {
      alpha = 1;
    } else {
      // Find the nearest solid artwork colour for accurate edge anti-aliasing.
      const x = pixel % info.width;
      const y = Math.floor(pixel / info.width);
      let nearest = Infinity;
      let seed = colour[0] - colour[2] > 12 ? [192, 150, 47] : [29, 29, 28];
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= info.width || ny >= info.height) continue;
          const start = (ny * info.width + nx) * 3;
          const candidate = [...data.subarray(start, start + 3)];
          const squaredDistance = dx * dx + dy * dy;
          if (squaredDistance >= nearest || candidate[2] >= 110) continue;
          if (!(candidate[0] - candidate[2] > 35 || Math.max(...candidate) < 90)) continue;
          nearest = squaredDistance;
          seed = candidate;
        }
      }
      const direction = seed.map((value, channel) => value - matte[channel]);
      const numerator = direction.reduce((sum, value, channel) => sum + value * (colour[channel] - matte[channel]), 0);
      const denominator = direction.reduce((sum, value) => sum + value * value, 0);
      alpha = Math.min(1, Math.max(0, numerator / denominator));
      // Use the neighbouring artwork colour beneath the edge alpha. Dividing
      // near-white compression noise by a tiny alpha would create colour halos.
      if (alpha > 0 && alpha < 1) foreground = seed;
    }
  }
  for (let channel = 0; channel < 3; channel++) rgba[pixel * 4 + channel] = alpha ? foreground[channel] : 0;
  rgba[pixel * 4 + 3] = Math.round(alpha * 255);
}

await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png().toFile(path.join(root, "assets/brand/tasees-circle-symbol.png"));
console.log("Extracted the original emblem with real alpha transparency and no lettering.");

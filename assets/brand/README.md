# Ta'sees Circle logo assets

`tasees-circle-original.png` preserves the original artwork supplied by the owner.
`tasees-circle-symbol.png` is the updated master with the lettering removed and a transparent background.
The site uses only the linked-circle symbol in both languages, with a compact header/footer size.

The built-in image editor was tried for the edit but returned RGB images with painted checkerboards.
The owner then explicitly approved local processing of the original PNG. The deployed master
comes from `node scripts/extract-brand-symbol.mjs`, which excludes the text and removes the cream
matte while preserving solid artwork pixels. Generated redraws are not used.

Image-edit prompt: remove all lettering and the cream background, including gaps inside the rings;
preserve the gold/black linked-circle emblem's contours, mosque, skyline, proportions and orientation;
export a genuine transparent RGBA PNG without a checkerboard, shadows or additional artwork.

Run `node scripts/generate-brand-assets.mjs` to reproduce these exports:

- `public/brand/logo.png`: transparent symbol at 1024 × 512; also used in email and organization metadata.
- `public/brand/logo.webp`: compact, lossless website export at 520 pixels wide.
- `public/brand/mark.webp`: linked-circle symbol for small official-account avatars.
- `src/app/favicon.ico`: 16, 32, 48, 64 and 256 pixel frames for browser tabs and shortcuts.
- `src/app/icon.png`: 48 pixel browser/search icon.
- `src/app/apple-icon.png`: 180 pixel Apple touch icon.
- `public/brand/icon-192.png` and `icon-512.png`: application and taskbar icons referenced by the web manifest.
- `public/brand/icon-maskable-512.png`: symbol padded within the safe area for masked app icons.
- `src/app/opengraph-image.png` and `twitter-image.png`: 1200 × 630 sharing previews.

Website PNG/WebP images and standard browser icons preserve the master PNG's alpha channel.
Apple/maskable icons and sharing cards use a light background for their platform presentation.
On dark site surfaces a CSS contrast filter makes the dark half light while keeping the gold hue.
The public header uses a 72–80 pixel wide symbol; the footer uses 88 pixels.
The source is raster artwork; these exports do not claim to be vector originals.

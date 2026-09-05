# Ta'sees Circle approved logo

`tasees-circle-original.png` is the unmodified final artwork supplied by the owner.
Keep its lettering, colours and linked-circle design intact in both languages.

Run `node scripts/generate-brand-assets.mjs` to reproduce these exports:

- `public/brand/logo.png`: full logo with excess outer whitespace cropped; also used in email and organization metadata.
- `public/brand/logo.webp`: compact, lossless website export at 520 pixels wide.
- `public/brand/mark.webp`: linked-circle symbol for small official-account avatars.
- `src/app/favicon.ico`: 16, 32, 48, 64 and 256 pixel frames for browser tabs and shortcuts.
- `src/app/icon.png`: 48 pixel browser/search icon.
- `src/app/apple-icon.png`: 180 pixel Apple touch icon.
- `public/brand/icon-192.png` and `icon-512.png`: application and taskbar icons referenced by the web manifest.
- `public/brand/icon-maskable-512.png`: symbol padded within the safe area for masked app icons.
- `src/app/opengraph-image.png` and `twitter-image.png`: 1200 × 630 sharing previews.

The small icons use the symbol without the wordmark so the artwork remains recognizable.
All exports retain the supplied light background to preserve contrast on dark and light surfaces.
The source is raster artwork; these exports do not claim to be vector originals.

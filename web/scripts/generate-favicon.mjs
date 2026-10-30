import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/**
 * Favicon, app icon and Apple touch icon from the TSA THINK mark (T12).
 *
 * The mark is a wide wordmark (about 2.95:1), so each icon is a square of
 * brand blue #2b4c7f with the white mark centred and inset by `pad` of the
 * side on the left and right. White on blue was chosen over blue on white:
 * the solid square stays visible on both light and dark browser tab bars,
 * and the white letters keep more contrast at 16px (7.9:1).
 *
 * Run: node scripts/generate-favicon.mjs
 */
const root = path.resolve(import.meta.dirname, "..");
const appDir = path.join(root, "src/app");
const iconsDir = path.join(root, "public/icons");
const mark = path.join(root, "public/brand/tsa-logo-mark-white.png");
const BLUE = "#2b4c7f";

async function squareIcon(size, { pad = 0.1, radius = 0 } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const markPng = await sharp(mark).resize({ width: inner, fit: "inside" }).png().toBuffer();
  const meta = await sharp(markPng).metadata();
  const left = Math.round((size - meta.width) / 2);
  // Optical centre: the dot over the I sits above the cap height, so nudge
  // the mark down a touch so the letters, not the dot, read as centred.
  const top = Math.round((size - meta.height) / 2 + size * 0.02);
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${BLUE}"/></svg>`,
  );
  return sharp(bg)
    .composite([{ input: markPng, left, top }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** ICO container holding PNG frames (supported by every current browser). */
function pngsToIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  const dirs = [];
  let offset = 6 + 16 * frames.length;
  for (const { size, png } of frames) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(size >= 256 ? 0 : size, 0);
    dir.writeUInt8(size >= 256 ? 0 : size, 1);
    dir.writeUInt8(0, 2);
    dir.writeUInt8(0, 3);
    dir.writeUInt16LE(1, 4);
    dir.writeUInt16LE(32, 6);
    dir.writeUInt32LE(png.length, 8);
    dir.writeUInt32LE(offset, 12);
    offset += png.length;
    dirs.push(dir);
  }
  return Buffer.concat([header, ...dirs, ...frames.map((f) => f.png)]);
}

// Tiny sizes get the least padding so the letters stay as large as possible.
const ico16 = await squareIcon(16, { pad: 0.04 });
const ico32 = await squareIcon(32, { pad: 0.06 });
const ico48 = await squareIcon(48, { pad: 0.08 });
// Browsers and Android round/mask these; keep the mark inside the safe zone.
const icon512 = await squareIcon(512, { pad: 0.16 });
const icon192 = await squareIcon(192, { pad: 0.16 });
// iOS applies its own rounded mask, so this is a full square.
const apple = await squareIcon(180, { pad: 0.14 });

fs.mkdirSync(iconsDir, { recursive: true });
fs.rmSync(path.join(appDir, "icon.svg"), { force: true });
fs.writeFileSync(path.join(appDir, "icon.png"), icon512);
fs.writeFileSync(path.join(appDir, "apple-icon.png"), apple);
fs.writeFileSync(
  path.join(appDir, "favicon.ico"),
  pngsToIco([
    { size: 16, png: ico16 },
    { size: 32, png: ico32 },
    { size: 48, png: ico48 },
  ]),
);
fs.writeFileSync(path.join(iconsDir, "icon-192.png"), icon192);
fs.writeFileSync(path.join(iconsDir, "icon-512.png"), icon512);

console.log("wrote favicon.ico, icon.png, apple-icon.png to src/app and icons to public/icons");

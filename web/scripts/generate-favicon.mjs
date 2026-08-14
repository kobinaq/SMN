import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve(import.meta.dirname, "../src/app");

const letters = `
  <path
    fill="none"
    stroke="#0b0d12"
    stroke-width="2.45"
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M9.55 11.1c-3.2-.65-3.35 3.6-.7 4.75 2.7.85 2.85 4.85-1.15 5.3"
  />
  <g fill="#0b0d12">
    <path d="M13.05 22.5V9.5h2.08l1.55 7.15h.06L18.29 9.5h2.08v13h-1.98v-8.05h-.06l-1.52 6.25h-1.22l-1.52-6.25h-.06V22.5h-1.98z"/>
    <path d="M21.55 22.5V9.5h2.08l3.22 9.05h.06V9.5h1.98v13h-2.08l-3.22-9.05h-.06V22.5h-1.98z"/>
  </g>
`;

/** Browser tab icon: white rounded square, transparent outside the corners. */
const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="7" fill="#ffffff"/>
  ${letters}
</svg>
`;

/** iOS applies its own mask, so this is a full white square. */
const appleSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" fill="#ffffff"/>
  ${letters}
</svg>
`;

function pngToIco(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const dir = Buffer.alloc(16);
  dir.writeUInt8(32, 0);
  dir.writeUInt8(32, 1);
  dir.writeUInt8(0, 2);
  dir.writeUInt8(0, 3);
  dir.writeUInt16LE(1, 4);
  dir.writeUInt16LE(32, 6);
  dir.writeUInt32LE(png.length, 8);
  dir.writeUInt32LE(22, 12);
  return Buffer.concat([header, dir, png]);
}

const faviconBuffer = Buffer.from(faviconSvg);
const icon32 = await sharp(faviconBuffer, { density: 384 }).resize(32, 32).png().toBuffer();
const apple = await sharp(Buffer.from(appleSvg), { density: 2160 }).resize(180, 180).png().toBuffer();

fs.writeFileSync(path.join(outDir, "icon.svg"), faviconSvg);
fs.writeFileSync(path.join(outDir, "icon.png"), icon32);
fs.writeFileSync(path.join(outDir, "apple-icon.png"), apple);
fs.writeFileSync(path.join(outDir, "favicon.ico"), pngToIco(icon32));

console.log("wrote favicon assets to src/app");

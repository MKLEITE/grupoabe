import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pngPath = path.join(root, "public", "logos", "abe.png");
const outPath = path.join(root, "public", "favicon.svg");
const pngOutPath = path.join(root, "public", "favicon.png");

if (fs.existsSync(pngPath)) {
  const pngBuf = fs.readFileSync(pngPath);
  const b64 = pngBuf.toString("base64");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <image href="data:image/png;base64,${b64}" width="32" height="32" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;
  fs.writeFileSync(outPath, svg, "utf8");
  fs.writeFileSync(pngOutPath, pngBuf);
  console.log("Wrote", outPath, Buffer.byteLength(svg), "bytes,", pngOutPath, pngBuf.length, "bytes");
} else if (fs.existsSync(outPath)) {
  const svg = fs.readFileSync(outPath, "utf8");
  const m = svg.match(/href="data:image\/png;base64,([^"]+)"/);
  if (!m) {
    throw new Error("Could not extract PNG from public/favicon.svg; add public/logos/abe.png");
  }
  fs.writeFileSync(pngOutPath, Buffer.from(m[1], "base64"));
  console.log("Wrote", pngOutPath, "from embedded data in favicon.svg (no public/logos/abe.png)");
} else {
  throw new Error("Need public/logos/abe.png or existing public/favicon.svg");
}

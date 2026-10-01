// Generates the Clees brand assets (logos, icons, OG images).
// Run: node scripts/build-brand.mjs
import { writeFile, mkdir } from "node:fs/promises";
import sharp from "sharp";
import { shape } from "./lib/shape.mjs";

const PRIMARY = "#0F3D3E";
const ACCENT = "#3DDC97";
const SAND = "#F6F3EE";
const WHITE = "#FFFFFF";

const PLEX = "scripts/fonts/plex-arabic-700.ttf";
const PLEX_SEMI = "scripts/fonts/plex-arabic-600.ttf";
const INTER = "scripts/fonts/inter-700.ttf";
const INTER_SEMI = "scripts/fonts/inter-600.ttf";

/* ---------- Latin wordmark: geometric monoline "clees" ---------- */
// x-height circle: center y=40, r=16, stroke 8 → letters span y 20..60
const SW = 8;
const R = 16;
const k = +(R * Math.SQRT1_2).toFixed(2); // 11.31
const c = (cx) => `M${cx + k} ${40 - k}A${R} ${R} 0 1 0 ${cx + k} ${40 + k}`;
const l = (x) => `M${x} 6V56`;
const e = (cx) => `M${cx - R} 40H${cx + R}A${R} ${R} 0 1 0 ${cx + k} ${40 + k}`;
const s = (cx) =>
  `M${cx + 11} 27.5C${cx + 6} 22.5 ${cx - 12} 22 ${cx - 12} 31.5C${cx - 12} 41 ${cx + 12} 38 ${cx + 12} 48C${cx + 12} 58.5 ${cx - 7} 58.5 ${cx - 13} 52.5`;

const LATIN_STROKES = [c(22), l(52), e(80), e(122), s(160)].join("");
// 4-point sparkle centred at (x,y) with radius r
const sparkle = (x, y, r) => {
  const q = r * 0.18;
  return `M${x} ${y - r}C${x + q} ${y - q} ${x + q} ${y - q} ${x + r} ${y}C${x + q} ${y + q} ${x + q} ${y + q} ${x} ${y + r}C${x - q} ${y + q} ${x - q} ${y + q} ${x - r} ${y}C${x - q} ${y - q} ${x - q} ${y - q} ${x} ${y - r}Z`;
};
const LATIN_SPARKLE = sparkle(137, 9, 9) + sparkle(150, 18, 4);
const LATIN_VIEWBOX = "0 0 178 62";

function latinLogo(ink, spark) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LATIN_VIEWBOX}" role="img" aria-label="Clees"><path d="${LATIN_STROKES}" fill="none" stroke="${ink}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/><path d="${LATIN_SPARKLE}" fill="${spark}"/></svg>`;
}

/* ---------- Arabic wordmark: IBM Plex Sans Arabic, softened corners ---------- */
function bbox(d) {
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    minX = Math.min(minX, nums[i]); maxX = Math.max(maxX, nums[i]);
    minY = Math.min(minY, nums[i + 1]); maxY = Math.max(maxY, nums[i + 1]);
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

const ar = await shape(PLEX, "كلييز");
const arBox = bbox(ar.d);
const PAD = 40;
const arSparkX = ar.glyphs[0].x + 470; // above the teeth of the final "يز"
const arSparkY = -600;
const AR_SPARKLE = sparkle(arSparkX, arSparkY, 95) + sparkle(arSparkX + 150, arSparkY + 95, 42);
const arTop = Math.min(arBox.minY, arSparkY - 95) - PAD;
const AR_VIEWBOX = `${arBox.minX - PAD} ${arTop} ${arBox.w + PAD * 2} ${arBox.maxY + PAD - arTop}`;

function arabicLogo(ink, spark) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${AR_VIEWBOX}" role="img" aria-label="كلييز"><path d="${ar.d}" fill="${ink}" stroke="${ink}" stroke-width="22" stroke-linejoin="round"/><path d="${AR_SPARKLE}" fill="${spark}"/></svg>`;
}

/* ---------- Icon: rounded square, white "c" + mint sparkle ---------- */
function icon(size = 512) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}"><rect width="512" height="512" rx="116" fill="${PRIMARY}"/><g transform="translate(100 52) scale(6.2)"><path d="${c(22)}" fill="none" stroke="${WHITE}" stroke-width="${SW}" stroke-linecap="round"/></g><path d="${sparkle(372, 150, 62)}" fill="${ACCENT}"/><path d="${sparkle(424, 226, 26)}" fill="${ACCENT}"/></svg>`;
}

/* ---------- Text as paths for OG images ---------- */
async function textPath(font, text, size, x, y, fill, anchor = "start") {
  const r = await shape(font, text);
  const scale = size / r.upem;
  const w = r.width * scale;
  const tx = anchor === "end" ? x - w : anchor === "middle" ? x - w / 2 : x;
  return `<path transform="translate(${tx} ${y}) scale(${scale})" d="${r.d}" fill="${fill}"/>`;
}

async function og(locale) {
  const isAr = locale === "ar";
  const W = 1200, H = 630;
  const title = isAr ? "سلّم المفتاح.. والباقي على كلييز" : "Hand over the keys. Clees handles the rest.";
  const sub = isAr ? "إدارة وتنظيف الشقق المفروشة في أبها" : "Furnished apartment management & cleaning in Abha";
  const font = isAr ? PLEX : INTER;
  const fontSemi = isAr ? PLEX_SEMI : INTER_SEMI;
  const anchor = isAr ? "end" : "start";
  const x = isAr ? W - 96 : 96;
  const titleSvg = await textPath(font, title, isAr ? 64 : 54, x, 360, WHITE, anchor);
  const subSvg = await textPath(fontSemi, sub, 32, x, 430, "#CDE7DC", anchor);
  const logoScale = 1.6;
  const logoW = 178 * logoScale;
  const logoX = isAr ? W - 96 - logoW : 96;
  const logo = `<g transform="translate(${logoX} 110) scale(${logoScale})"><path d="${LATIN_STROKES}" fill="none" stroke="${WHITE}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/><path d="${LATIN_SPARKLE}" fill="${ACCENT}"/></g>`;
  const deco = `<circle cx="${isAr ? 120 : 1080}" cy="560" r="260" fill="#14504F"/><circle cx="${isAr ? 120 : 1080}" cy="560" r="170" fill="#1A5E5C"/><rect x="${isAr ? W - 96 - 120 : 96}" y="500" width="120" height="10" rx="5" fill="${ACCENT}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${PRIMARY}"/>${deco}${logo}${titleSvg}${subSvg}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(`public/og/og-${locale}.png`);
}

await mkdir("public/brand", { recursive: true });
await mkdir("public/og", { recursive: true });

await writeFile("public/brand/clees-logo.svg", latinLogo(PRIMARY, ACCENT));
await writeFile("public/brand/clees-logo-white.svg", latinLogo(WHITE, ACCENT));
await writeFile("public/brand/clees-logo-ar.svg", arabicLogo(PRIMARY, ACCENT));
await writeFile("public/brand/clees-logo-ar-white.svg", arabicLogo(WHITE, ACCENT));
await writeFile("public/brand/clees-icon.svg", icon());
await writeFile("src/app/icon.svg", icon());
await sharp(Buffer.from(icon(180))).png().toFile("src/app/apple-icon.png");
await sharp(Buffer.from(icon(192))).png().toFile("public/brand/icon-192.png");
await sharp(Buffer.from(icon(512))).png().toFile("public/brand/icon-512.png");
await og("ar");
await og("en");

// Path data for the inline React logo component
const ts = `// Generated by scripts/build-brand.mjs — do not edit by hand.
export const LATIN = {
  viewBox: ${JSON.stringify(LATIN_VIEWBOX)},
  strokes: ${JSON.stringify(LATIN_STROKES)},
  strokeWidth: ${SW},
  sparkle: ${JSON.stringify(LATIN_SPARKLE)},
};
export const ARABIC = {
  viewBox: ${JSON.stringify(AR_VIEWBOX)},
  glyphs: ${JSON.stringify(ar.d)},
  sparkle: ${JSON.stringify(AR_SPARKLE)},
};
`;
await mkdir("src/components/brand", { recursive: true });
await writeFile("src/components/brand/logo-paths.ts", ts);

// Preview sheet for review
const preview = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520"><rect width="900" height="520" fill="${SAND}"/>
<g transform="translate(40 30) scale(2)">${latinLogo(PRIMARY, ACCENT).replace(/<svg[^>]*>|<\/svg>/g, "")}</g>
<rect x="420" y="20" width="440" height="160" rx="24" fill="${PRIMARY}"/><g transform="translate(460 40) scale(2)">${latinLogo(WHITE, ACCENT).replace(/<svg[^>]*>|<\/svg>/g, "")}</g>
<svg x="40" y="210" width="340" height="150" viewBox="${AR_VIEWBOX}">${arabicLogo(PRIMARY, ACCENT).replace(/<svg[^>]*>|<\/svg>/g, "")}</svg>
<svg x="440" y="210" width="260" height="260" viewBox="0 0 512 512">${icon().replace(/<svg[^>]*>|<\/svg>/g, "")}</svg>
<svg x="740" y="380" width="64" height="64" viewBox="0 0 512 512">${icon().replace(/<svg[^>]*>|<\/svg>/g, "")}</svg>
<svg x="820" y="400" width="32" height="32" viewBox="0 0 512 512">${icon().replace(/<svg[^>]*>|<\/svg>/g, "")}</svg>
</svg>`;
await sharp(Buffer.from(preview)).png().toFile(process.env.PREVIEW ?? "/tmp/brand-preview.png");
console.log("Brand assets generated.");

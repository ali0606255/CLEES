// Generates illustrated placeholder images in public/images.
// Replace any of these files with real photos using the SAME file name.
// Run: node scripts/generate-placeholders.mjs
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const P = "#0F3D3E", A = "#3DDC97", S = "#F6F3EE";

const mountains = (w, h, y) => `
  <path d="M0 ${y} L${w * 0.18} ${y - h * 0.22} L${w * 0.32} ${y - h * 0.1} L${w * 0.5} ${y - h * 0.3} L${w * 0.7} ${y - h * 0.12} L${w * 0.86} ${y - h * 0.24} L${w} ${y - h * 0.08} L${w} ${h} L0 ${h}Z" fill="#7FA89A"/>
  <path d="M0 ${y + h * 0.06} L${w * 0.25} ${y - h * 0.1} L${w * 0.45} ${y + h * 0.02} L${w * 0.62} ${y - h * 0.14} L${w * 0.82} ${y} L${w} ${y - h * 0.06} L${w} ${h} L0 ${h}Z" fill="#4F8576"/>`;

const windowScene = (x, y, w, h) => `
  <svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" fill="#CFE6EE"/>
    <circle cx="${w * 0.78}" cy="${h * 0.25}" r="${h * 0.08}" fill="#FFF6DA"/>
    <ellipse cx="${w * 0.3}" cy="${h * 0.2}" rx="${w * 0.14}" ry="${h * 0.04}" fill="#FFFFFF" opacity=".9"/>
    ${mountains(w, h, h * 0.72)}
  </svg>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#FFFFFF" stroke-width="${w * 0.03}"/>
  <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="#FFFFFF" stroke-width="${w * 0.02}"/>`;

const plant = (x, y, s) => `
  <rect x="${x - s * 0.18}" y="${y - s * 0.35}" width="${s * 0.36}" height="${s * 0.35}" rx="${s * 0.06}" fill="#D9CFC1"/>
  <ellipse cx="${x - s * 0.15}" cy="${y - s * 0.6}" rx="${s * 0.12}" ry="${s * 0.3}" fill="#3E7A62" transform="rotate(-25 ${x} ${y - s * 0.4})"/>
  <ellipse cx="${x + s * 0.15}" cy="${y - s * 0.62}" rx="${s * 0.12}" ry="${s * 0.3}" fill="#4F9B7B" transform="rotate(25 ${x} ${y - s * 0.4})"/>
  <ellipse cx="${x}" cy="${y - s * 0.75}" rx="${s * 0.11}" ry="${s * 0.32}" fill="#2F6B55"/>`;

const scenes = {
  living: (w, h) => `
    <rect width="${w}" height="${h}" fill="#EFE9E0"/>
    <rect y="${h * 0.74}" width="${w}" height="${h * 0.26}" fill="#E2D7C8"/>
    ${windowScene(w * 0.52, h * 0.12, w * 0.36, h * 0.44)}
    <rect x="${w * 0.08}" y="${h * 0.5}" width="${w * 0.48}" height="${h * 0.18}" rx="${h * 0.04}" fill="${P}"/>
    <rect x="${w * 0.06}" y="${h * 0.6}" width="${w * 0.52}" height="${h * 0.12}" rx="${h * 0.03}" fill="#16504F"/>
    <rect x="${w * 0.12}" y="${h * 0.53}" width="${w * 0.1}" height="${h * 0.08}" rx="${h * 0.02}" fill="${A}"/>
    <rect x="${w * 0.42}" y="${h * 0.53}" width="${w * 0.1}" height="${h * 0.08}" rx="${h * 0.02}" fill="${S}"/>
    <ellipse cx="${w * 0.36}" cy="${h * 0.86}" rx="${w * 0.2}" ry="${h * 0.04}" fill="#D5C8B6"/>
    <rect x="${w * 0.28}" y="${h * 0.76}" width="${w * 0.16}" height="${h * 0.03}" rx="${h * 0.01}" fill="#B89A74"/>
    ${plant(w * 0.92, h * 0.78, h * 0.3)}`,
  bedroom: (w, h) => `
    <rect width="${w}" height="${h}" fill="#F1ECE4"/>
    <rect y="${h * 0.76}" width="${w}" height="${h * 0.24}" fill="#E0D4C3"/>
    ${windowScene(w * 0.08, h * 0.14, w * 0.26, h * 0.4)}
    <rect x="${w * 0.4}" y="${h * 0.3}" width="${w * 0.46}" height="${h * 0.3}" rx="${h * 0.04}" fill="${P}"/>
    <rect x="${w * 0.38}" y="${h * 0.56}" width="${w * 0.5}" height="${h * 0.2}" rx="${h * 0.03}" fill="#FFFFFF"/>
    <rect x="${w * 0.38}" y="${h * 0.62}" width="${w * 0.5}" height="${h * 0.14}" rx="${h * 0.03}" fill="#E7F7EF"/>
    <rect x="${w * 0.43}" y="${h * 0.48}" width="${w * 0.16}" height="${h * 0.1}" rx="${h * 0.03}" fill="#FFFFFF"/>
    <rect x="${w * 0.65}" y="${h * 0.48}" width="${w * 0.16}" height="${h * 0.1}" rx="${h * 0.03}" fill="#FFFFFF"/>
    <rect x="${w * 0.38}" y="${h * 0.66}" width="${w * 0.5}" height="${h * 0.03}" fill="${A}"/>
    <circle cx="${w * 0.93}" cy="${h * 0.4}" r="${h * 0.05}" fill="#FFF6DA"/>
    <rect x="${w * 0.925}" y="${h * 0.45}" width="${w * 0.01}" height="${h * 0.2}" fill="#B89A74"/>`,
  kitchen: (w, h) => `
    <rect width="${w}" height="${h}" fill="#EEF2EF"/>
    <rect x="${w * 0.06}" y="${h * 0.12}" width="${w * 0.88}" height="${h * 0.2}" rx="${h * 0.02}" fill="#FFFFFF"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${w * (0.08 + i * 0.215)}" y="${h * 0.14}" width="${w * 0.2}" height="${h * 0.16}" rx="${h * 0.015}" fill="#F6F3EE"/>`).join("")}
    <rect x="${w * 0.06}" y="${h * 0.56}" width="${w * 0.88}" height="${h * 0.32}" rx="${h * 0.02}" fill="${P}"/>
    <rect x="${w * 0.04}" y="${h * 0.53}" width="${w * 0.92}" height="${h * 0.04}" rx="${h * 0.01}" fill="#E4DCD0"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${w * (0.1 + i * 0.215)}" y="${h * 0.66}" width="${w * 0.12}" height="${h * 0.012}" rx="4" fill="${A}"/>`).join("")}
    <circle cx="${w * 0.3}" cy="${h * 0.47}" r="${h * 0.06}" fill="#FFFFFF"/>
    <rect x="${w * 0.6}" y="${h * 0.42}" width="${w * 0.06}" height="${h * 0.11}" rx="${h * 0.01}" fill="#B89A74"/>
    ${plant(w * 0.8, h * 0.53, h * 0.18)}`,
  abha: (w, h) => `
    <rect width="${w}" height="${h}" fill="#D7EAF0"/>
    <circle cx="${w * 0.8}" cy="${h * 0.2}" r="${h * 0.07}" fill="#FFF6DA"/>
    <ellipse cx="${w * 0.25}" cy="${h * 0.22}" rx="${w * 0.12}" ry="${h * 0.035}" fill="#FFFFFF"/>
    <ellipse cx="${w * 0.55}" cy="${h * 0.32}" rx="${w * 0.16}" ry="${h * 0.04}" fill="#FFFFFF" opacity=".9"/>
    ${mountains(w, h, h * 0.62)}
    <path d="M${w * 0.62} ${h * 0.12} L${w * 0.62} ${h * 0.5}" stroke="${P}" stroke-width="3"/>
    <path d="M${w * 0.18} ${h * 0.2} Q${w * 0.4} ${h * 0.35} ${w * 0.62} ${h * 0.12}" stroke="${P}" stroke-width="2" fill="none"/>
    <rect x="${w * 0.4}" y="${h * 0.24}" width="${w * 0.03}" height="${h * 0.04}" rx="4" fill="${A}"/>
    <rect y="${h * 0.8}" width="${w}" height="${h * 0.2}" fill="#3E6F61"/>
    ${[0.1, 0.22, 0.34].map((x) => `<rect x="${w * x}" y="${h * 0.66}" width="${w * 0.08}" height="${h * 0.16}" fill="#F3E9DA"/><rect x="${w * x}" y="${h * 0.66}" width="${w * 0.08}" height="${h * 0.02}" fill="#C46A4A"/><rect x="${w * (x + 0.025)}" y="${h * 0.72}" width="${w * 0.03}" height="${h * 0.04}" fill="#5B8FA8"/>`).join("")}`,
  cleaning: (w, h) => `
    <rect width="${w}" height="${h}" fill="#EAF6F0"/>
    <rect y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="#DCEDE4"/>
    ${[0, 1, 2].map((i) => `<rect x="${w * 0.2}" y="${h * (0.36 + i * 0.12)}" width="${w * 0.32}" height="${h * 0.11}" rx="${h * 0.03}" fill="${["#FFFFFF", "#F6F3EE", A][i]}"/>`).join("")}
    <rect x="${w * 0.62}" y="${h * 0.4}" width="${w * 0.1}" height="${h * 0.32}" rx="${h * 0.03}" fill="${P}"/>
    <rect x="${w * 0.645}" y="${h * 0.32}" width="${w * 0.05}" height="${h * 0.1}" rx="${h * 0.01}" fill="#16504F"/>
    <rect x="${w * 0.64}" y="${h * 0.5}" width="${w * 0.06}" height="${h * 0.08}" rx="6" fill="#FFFFFF"/>
    <path d="M${w * 0.82} ${h * 0.2} l${w * 0.015} ${h * 0.04} l${w * 0.04} ${h * 0.015} l-${w * 0.04} ${h * 0.015} l-${w * 0.015} ${h * 0.04} l-${w * 0.015} -${h * 0.04} l-${w * 0.04} -${h * 0.015} l${w * 0.04} -${h * 0.015}Z" fill="${A}"/>
    <path d="M${w * 0.32} ${h * 0.14} l${w * 0.01} ${h * 0.025} l${w * 0.025} ${h * 0.01} l-${w * 0.025} ${h * 0.01} l-${w * 0.01} ${h * 0.025} l-${w * 0.01} -${h * 0.025} l-${w * 0.025} -${h * 0.01} l${w * 0.025} -${h * 0.01}Z" fill="${P}"/>`,
  keys: (w, h) => `
    <rect width="${w}" height="${h}" fill="#F3EEE6"/>
    <circle cx="${w * 0.4}" cy="${h * 0.45}" r="${h * 0.14}" fill="none" stroke="${P}" stroke-width="${h * 0.045}"/>
    <rect x="${w * 0.46}" y="${h * 0.43}" width="${w * 0.3}" height="${h * 0.045}" rx="${h * 0.02}" fill="${P}"/>
    <rect x="${w * 0.66}" y="${h * 0.47}" width="${w * 0.03}" height="${h * 0.08}" rx="4" fill="${P}"/>
    <rect x="${w * 0.71}" y="${h * 0.47}" width="${w * 0.03}" height="${h * 0.06}" rx="4" fill="${P}"/>
    <rect x="${w * 0.22}" y="${h * 0.58}" width="${w * 0.14}" height="${h * 0.16}" rx="${h * 0.03}" fill="${A}" transform="rotate(-12 ${w * 0.29} ${h * 0.66})"/>`,
};

const images = [
  ["hero-apartment.jpg", "living", 1600, 1200],
  ["owners-hero.jpg", "keys", 1600, 1200],
  ["service-cleaning.jpg", "cleaning", 1200, 900],
  ["service-management.jpg", "living", 1200, 900],
  ["why-abha.jpg", "abha", 1600, 1000],
  ["about-story.jpg", "abha", 1200, 900],
  ["unit-01.jpg", "living", 1200, 900],
  ["unit-02.jpg", "bedroom", 1200, 900],
  ["unit-03.jpg", "kitchen", 1200, 900],
  ["unit-04.jpg", "bedroom", 1200, 900],
  ["unit-05.jpg", "living", 1200, 900],
  ["unit-06.jpg", "kitchen", 1200, 900],
];

await mkdir("public/images", { recursive: true });
for (const [name, scene, w, h] of images) {
  const label = `PLACEHOLDER · ${name} · ${w}×${h}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${scenes[scene](w, h)}
    <rect x="24" y="${h - 64}" rx="20" width="${label.length * 11 + 40}" height="40" fill="#14181F" opacity=".55"/>
    <text x="44" y="${h - 37}" font-family="DejaVu Sans, sans-serif" font-size="18" fill="#FFFFFF">${label}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, progressive: true }).toFile(`public/images/${name}`);
}
console.log(`Generated ${images.length} placeholder images.`);

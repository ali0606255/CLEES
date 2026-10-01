// Shapes text with HarfBuzz and returns SVG path markup (font units, y-down).
import { readFile } from "node:fs/promises";
import * as hb from "harfbuzzjs";

const cache = new Map();

async function loadFont(file) {
  if (cache.has(file)) return cache.get(file);
  const data = await readFile(file);
  const blob = new hb.Blob(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
  const face = new hb.Face(blob);
  const font = new hb.Font(face);
  const entry = { font, upem: face.upem };
  cache.set(file, entry);
  return entry;
}

/**
 * @returns {{ d: string, width: number, upem: number, glyphs: {cluster:number,x:number,adv:number}[] }}
 * `d` is a single path in font units, baseline at y=0, y pointing down.
 */
export async function shape(file, text) {
  const { font, upem } = await loadFont(file);
  const buffer = new hb.Buffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  hb.shape(font, buffer);
  const infos = buffer.getGlyphInfos();
  const positions = buffer.getGlyphPositions();
  let x = 0;
  const parts = [];
  const glyphs = [];
  infos.forEach((info, i) => {
    const pos = positions[i];
    const raw = font.glyphToPath(info.codepoint);
    const ox = x + pos.xOffset;
    const oy = pos.yOffset;
    // Transform path coordinates: flip y and translate.
    const transformed = raw.replace(/([MLQCZ])([^MLQCZ]*)/g, (_, cmd, args) => {
      const nums = args.trim().length ? args.trim().split(/[ ,]+/).map(Number) : [];
      const out = [];
      for (let k = 0; k < nums.length; k += 2) {
        out.push(+(nums[k] + ox).toFixed(1), +(-(nums[k + 1] + oy)).toFixed(1));
      }
      return cmd + out.join(" ");
    });
    parts.push(transformed);
    glyphs.push({ cluster: info.cluster, x, adv: pos.xAdvance });
    x += pos.xAdvance;
  });
  return { d: parts.join(""), width: x, upem, glyphs };
}

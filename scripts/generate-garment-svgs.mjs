// Regenerates the placeholder garment illustrations in public/products/.
// Run with: node scripts/generate-garment-svgs.mjs
// Kept as a script (rather than committing hand-edited SVGs) so the art
// stays in sync with lib/products.ts if products are added or recolored.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SHAPES = {
  tshirt:
    "M130,55 L165,25 Q200,50 235,25 L270,55 L335,110 L295,155 L270,130 L270,470 L130,470 L130,130 L105,155 L65,110 Z",
  dress:
    "M148,30 L170,18 L230,18 L252,30 L262,120 L330,470 L70,470 L138,120 Z",
  jacket:
    "M128,50 L168,22 Q200,45 200,45 Q200,45 232,22 L272,50 L340,112 L300,158 L275,132 L275,470 L200,470 L200,90 L125,470 L125,132 L100,158 L60,112 Z",
};

function garmentSvg(shape, fill) {
  const path = SHAPES[shape];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <path d="${path}" fill="${fill}" stroke="#00000022" stroke-width="3"/>
  <path d="${path}" fill="none" stroke="#ffffff33" stroke-width="1.5"/>
</svg>
`;
}

const products = [
  { id: "tee-blanc", shape: "tshirt", fill: "#f5f5f2" },
  { id: "tee-noir", shape: "tshirt", fill: "#1c1c1c" },
  { id: "pull-moutarde", shape: "tshirt", fill: "#d99a2b" },
  { id: "robe-rouge", shape: "dress", fill: "#b5322f" },
  { id: "robe-emeraude", shape: "dress", fill: "#1f6f5c" },
  { id: "veste-jean", shape: "jacket", fill: "#5c7c9c" },
  { id: "veste-trench", shape: "jacket", fill: "#c9b28a" },
];

const outDir = path.join(__dirname, "..", "public", "products");
mkdirSync(outDir, { recursive: true });

for (const p of products) {
  const svg = garmentSvg(p.shape, p.fill);
  writeFileSync(path.join(outDir, `${p.id}.svg`), svg, "utf8");
  console.log(`wrote ${p.id}.svg`);
}

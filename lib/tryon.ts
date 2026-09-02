import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { Product } from "./products";

export interface TryOnResult {
  /** Either a remote URL (AI mode) or a data: URL (demo mode). */
  imageUrl: string;
  mode: "ai" | "demo";
}

interface TryOnInput {
  photoBuffer: Buffer;
  product: Product;
  /** Absolute origin (e.g. https://shopglobe.example.com) of this deployment,
   *  needed so the fal.ai workers can fetch our product image over the
   *  public internet. Not required in demo mode. */
  origin: string;
}

export async function runTryOn({
  photoBuffer,
  product,
  origin,
}: TryOnInput): Promise<TryOnResult> {
  if (process.env.FAL_KEY) {
    return runAiTryOn({ photoBuffer, product, origin });
  }
  return runDemoTryOn({ photoBuffer, product });
}

async function runAiTryOn({
  photoBuffer,
  product,
  origin,
}: TryOnInput): Promise<TryOnResult> {
  // Dynamic import: keeps @fal-ai/client (and its dependency on a real
  // FAL_KEY) out of the demo-mode code path entirely.
  const { fal } = await import("@fal-ai/client");
  fal.config({ credentials: process.env.FAL_KEY });

  const humanImageUrl = await fal.storage.upload(
    new Blob([new Uint8Array(photoBuffer)], { type: "image/jpeg" }),
  );

  const result = await fal.subscribe("fal-ai/idm-vton", {
    input: {
      human_image_url: humanImageUrl,
      garment_image_url: `${origin}${product.image}`,
      description: `${product.name}, ${product.colorLabel.toLowerCase()}`,
    },
  });

  const data = result.data as { image?: { url?: string } };
  const imageUrl = data.image?.url;
  if (!imageUrl) {
    throw new Error("fal.ai n'a renvoyé aucune image (réponse inattendue).");
  }

  return { imageUrl, mode: "ai" };
}

/**
 * Demo fallback used when no FAL_KEY is configured: composites the flat
 * garment illustration over the uploaded photo. It is not a realistic
 * try-on, just enough to demonstrate the end-to-end flow without any
 * paid API key.
 */
async function runDemoTryOn({
  photoBuffer,
  product,
}: Pick<TryOnInput, "photoBuffer" | "product">): Promise<TryOnResult> {
  const photo = sharp(photoBuffer).rotate();
  const { width = 800, height = 1000 } = await photo.metadata();

  const garmentPath = path.join(
    process.cwd(),
    "public",
    product.image.replace(/^\//, ""),
  );
  const garmentSvg = await readFile(garmentPath);

  // Most uploads are close-up selfies (face + shoulders filling the frame)
  // rather than full-body shots, so anchor the garment around where
  // shoulders typically sit in that framing — just below the frame's
  // midpoint — instead of near the top (which would land on the face).
  const garmentWidth = Math.round(width * 0.5);
  const top = Math.round(height * 0.46);
  const maxHeight = Math.round(height - top - height * 0.04);
  const garmentHeight = Math.min(Math.round(garmentWidth * 1.25), maxHeight);
  // The generated SVGs have no background rect, so the rasterized PNG is
  // transparent outside the garment silhouette — the default "over" blend
  // below lets the photo show through everywhere except the garment shape.
  const garmentPng = await sharp(garmentSvg)
    .resize(garmentWidth, garmentHeight, { fit: "contain" })
    .ensureAlpha()
    .png()
    .toBuffer();

  const left = Math.round((width - garmentWidth) / 2);

  const composed = await sharp(photoBuffer)
    .rotate()
    .composite([{ input: garmentPng, left, top }])
    .png()
    .toBuffer();

  return {
    imageUrl: `data:image/png;base64,${composed.toString("base64")}`,
    mode: "demo",
  };
}

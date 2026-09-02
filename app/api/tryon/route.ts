import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { runTryOn } from "@/lib/tryon";

export const runtime = "nodejs";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const productId = formData.get("productId");
  const photo = formData.get("photo");

  if (typeof productId !== "string" || !productId) {
    return NextResponse.json(
      { error: "Identifiant produit manquant." },
      { status: 400 },
    );
  }

  const product = getProduct(productId);
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  if (!(photo instanceof File)) {
    return NextResponse.json({ error: "Photo manquante." }, { status: 400 });
  }

  if (!photo.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Le fichier envoyé doit être une image." },
      { status: 400 },
    );
  }

  if (photo.size > MAX_PHOTO_BYTES) {
    return NextResponse.json(
      { error: "La photo dépasse la taille maximale autorisée (8 Mo)." },
      { status: 413 },
    );
  }

  try {
    const photoBuffer = Buffer.from(await photo.arrayBuffer());
    const result = await runTryOn({
      photoBuffer,
      product,
      origin: req.nextUrl.origin,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Échec de l'essayage virtuel", err);
    return NextResponse.json(
      { error: "L'essayage virtuel a échoué. Merci de réessayer." },
      { status: 502 },
    );
  }
}

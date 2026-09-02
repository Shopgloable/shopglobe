"use client";

import { useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

interface TryOnResponse {
  imageUrl: string;
  mode: "ai" | "demo";
}

export function TryOnWidget({ product }: { product: Product }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [result, setResult] = useState<TryOnResponse | null>(null);
  const [size, setSize] = useState(product.sizes[Math.floor(product.sizes.length / 2)]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { addLine } = useCart();

  function onPhotoSelected(file: File | undefined) {
    if (!file) return;
    setPhotoFile(file);
    setResult(null);
    setStatus("idle");
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function runTryOn() {
    if (!photoFile) {
      fileInputRef.current?.click();
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append("photo", photoFile);
      formData.append("productId", product.id);
      const res = await fetch("/api/tryon", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue.");
      setResult(data as TryOnResponse);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Erreur inconnue.");
    }
  }

  const previewSrc = result?.imageUrl ?? photoPreview;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold text-ink">
        Essayage virtuel
      </h3>

      <div className="mb-4 flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-[#f4f2ef]">
        {previewSrc ? (
          <img
            src={previewSrc}
            alt="Aperçu de l'essayage"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="p-6 text-center text-sm text-gray-400">
            Ajoutez une photo de vous pour voir ce vêtement sur vous.
          </div>
        )}
      </div>

      {result && (
        <p className="mb-3 text-xs text-gray-500">
          {result.mode === "ai"
            ? "✨ Rendu généré par IA (fal.ai IDM-VTON)."
            : "🧪 Aperçu en mode démo — ajoutez une clé FAL_KEY pour un rendu réaliste par IA."}
        </p>
      )}

      {status === "error" && errorMessage && (
        <p className="mb-3 text-xs text-red-600">{errorMessage}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPhotoSelected(e.target.files?.[0])}
      />

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 rounded-lg border border-ink px-4 py-2 text-sm font-medium hover:bg-ink hover:text-white transition"
        >
          {photoFile ? "Changer la photo" : "Ajouter ma photo"}
        </button>
        <button
          type="button"
          onClick={runTryOn}
          disabled={status === "loading" || !photoFile}
          className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-accent2"
        >
          {status === "loading" ? "Génération…" : "Voir sur moi"}
        </button>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-xs font-medium text-gray-500">
          Taille
        </label>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                s === size
                  ? "border-ink bg-ink text-white"
                  : "border-gray-300 text-gray-600 hover:border-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => addLine(product, size)}
        className="w-full rounded-lg bg-ink py-3 text-sm font-semibold text-white transition hover:bg-accent"
      >
        Ajouter au panier — {product.price.toFixed(2)} €
      </button>
    </div>
  );
}

import Link from "next/link";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produit/${product.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
    >
      <div className="flex aspect-[4/5] items-center justify-center bg-[#f4f2ef] p-6">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition group-hover:scale-105"
        />
      </div>
      <div className="space-y-1 p-4">
        <p className="text-sm font-medium text-ink">{product.name}</p>
        <p className="text-xs text-gray-500">{product.colorLabel}</p>
        <p className="text-sm font-semibold">{product.price.toFixed(2)} €</p>
      </div>
    </Link>
  );
}

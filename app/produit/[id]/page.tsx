import { notFound } from "next/navigation";
import { PRODUCTS, getProduct } from "@/lib/products";
import { TryOnWidget } from "@/components/TryOnWidget";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-[#f4f2ef] p-10">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-ink">{product.name}</h1>
          <p className="mt-1 text-lg font-semibold text-accent">
            {product.price.toFixed(2)} €
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>

          <div className="mt-8">
            <TryOnWidget product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}

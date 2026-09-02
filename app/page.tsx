import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function HomePage() {
  return (
    <main>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Voyez-le sur vous avant de l&apos;acheter
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Envoyez une photo, essayez virtuellement le vêtement grâce à
            l&apos;IA, et achetez en toute confiance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        {CATEGORIES.map((category) => {
          const items = PRODUCTS.filter((p) => p.category === category.id);
          return (
            <div key={category.id} className="mb-14 last:mb-0">
              <h2 className="mb-6 text-xl font-semibold text-ink">
                {category.label}
              </h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

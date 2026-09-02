"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { totalCount, open } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-ink">
          ShopGlobe<span className="text-accent">.</span>
        </Link>
        <button
          onClick={open}
          className="relative rounded-full border border-ink px-4 py-2 text-sm font-medium hover:bg-ink hover:text-white transition"
        >
          Panier
          {totalCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
              {totalCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

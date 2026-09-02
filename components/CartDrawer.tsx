"use client";

import { useCart } from "@/lib/cart-context";

export function CartDrawer() {
  const { isOpen, close, lines, removeLine, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Fermer le panier"
        onClick={close}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Votre panier</h2>
          <button
            onClick={close}
            className="text-2xl leading-none text-gray-500 hover:text-black"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="text-sm text-gray-500">Votre panier est vide.</p>
        ) : (
          <ul className="flex-1 space-y-4 overflow-y-auto">
            {lines.map((line) => (
              <li
                key={`${line.product.id}-${line.size}`}
                className="flex items-center gap-3 border-b pb-4"
              >
                <img
                  src={line.product.image}
                  alt={line.product.name}
                  className="h-16 w-16 rounded bg-neutral-100 object-contain p-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{line.product.name}</p>
                  <p className="text-xs text-gray-500">
                    Taille {line.size} · Qté {line.quantity}
                  </p>
                  <p className="text-sm font-semibold">
                    {(line.product.price * line.quantity).toFixed(2)} €
                  </p>
                </div>
                <button
                  onClick={() => removeLine(line.product.id, line.size)}
                  className="text-xs text-gray-400 hover:text-red-600"
                >
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 border-t pt-4">
          <div className="mb-4 flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span>{totalPrice.toFixed(2)} €</span>
          </div>
          <button
            disabled={lines.length === 0}
            onClick={() =>
              alert(
                "Paiement à venir — cette démo se concentre sur l'essayage virtuel.",
              )
            }
            className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-accent2"
          >
            Passer commande
          </button>
        </div>
      </div>
    </div>
  );
}

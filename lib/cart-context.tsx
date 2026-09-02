"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./products";

export interface CartLine {
  product: Product;
  size: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addLine: (product: Product, size: string) => void;
  removeLine: (productId: string, size: string) => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "shopglobe-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // One-time hydration from localStorage after mount, so the server-
      // rendered (empty) markup matches the client's first render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // Ignore corrupt/unavailable storage; start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addLine = useCallback((product: Product, size: string) => {
    setLines((prev) => {
      const existing = prev.find(
        (l) => l.product.id === product.id && l.size === size,
      );
      if (existing) {
        return prev.map((l) =>
          l === existing ? { ...l, quantity: l.quantity + 1 } : l,
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeLine = useCallback((productId: string, size: string) => {
    setLines((prev) =>
      prev.filter((l) => !(l.product.id === productId && l.size === size)),
    );
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const totalCount = lines.reduce((sum, l) => sum + l.quantity, 0);
    const totalPrice = lines.reduce(
      (sum, l) => sum + l.quantity * l.product.price,
      0,
    );
    return {
      lines,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addLine,
      removeLine,
      totalCount,
      totalPrice,
    };
  }, [lines, isOpen, addLine, removeLine]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

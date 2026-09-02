import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "ShopGlobe — Essayez avant d'acheter",
  description:
    "La marketplace où vous voyez le vêtement, l'accessoire ou le bijou sur vous avant d'acheter, grâce à l'essayage virtuel par IA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <CartProvider>
          <Header />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

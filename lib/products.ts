export type Category = "haut" | "robe" | "veste";
export type GarmentShape = "tshirt" | "dress" | "jacket";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  sizes: string[];
  colorLabel: string;
  shape: GarmentShape;
  fill: string;
  image: string;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "haut", label: "Hauts" },
  { id: "robe", label: "Robes" },
  { id: "veste", label: "Vestes" },
];

export const PRODUCTS: Product[] = [
  {
    id: "tee-blanc",
    name: "T-shirt essentiel blanc",
    category: "haut",
    price: 24.9,
    description:
      "Coupe droite en coton biologique, le basique qui se porte avec tout.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colorLabel: "Blanc",
    shape: "tshirt",
    fill: "#f5f5f2",
    image: "/products/tee-blanc.svg",
  },
  {
    id: "tee-noir",
    name: "T-shirt essentiel noir",
    category: "haut",
    price: 24.9,
    description: "Le même coupe droite, en noir profond et intemporel.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colorLabel: "Noir",
    shape: "tshirt",
    fill: "#1c1c1c",
    image: "/products/tee-noir.svg",
  },
  {
    id: "pull-moutarde",
    name: "Pull col rond moutarde",
    category: "haut",
    price: 44.0,
    description: "Maille douce épaisse, parfait pour la mi-saison.",
    sizes: ["S", "M", "L", "XL"],
    colorLabel: "Moutarde",
    shape: "tshirt",
    fill: "#d99a2b",
    image: "/products/pull-moutarde.svg",
  },
  {
    id: "robe-rouge",
    name: "Robe fluide rouge coquelicot",
    category: "robe",
    price: 59.0,
    description: "Robe midi évasée en viscose fluide, doublée.",
    sizes: ["XS", "S", "M", "L"],
    colorLabel: "Rouge",
    shape: "dress",
    fill: "#b5322f",
    image: "/products/robe-rouge.svg",
  },
  {
    id: "robe-emeraude",
    name: "Robe satinée émeraude",
    category: "robe",
    price: 69.0,
    description: "Robe de soirée satinée, coupe cintrée et bas évasé.",
    sizes: ["XS", "S", "M", "L"],
    colorLabel: "Émeraude",
    shape: "dress",
    fill: "#1f6f5c",
    image: "/products/robe-emeraude.svg",
  },
  {
    id: "veste-jean",
    name: "Veste en jean brut",
    category: "veste",
    price: 65.0,
    description: "Veste denim classique, coupe légèrement oversize.",
    sizes: ["S", "M", "L", "XL"],
    colorLabel: "Denim",
    shape: "jacket",
    fill: "#5c7c9c",
    image: "/products/veste-jean.svg",
  },
  {
    id: "veste-trench",
    name: "Trench beige",
    category: "veste",
    price: 89.0,
    description: "Trench imperméable ceinturé, doublure amovible.",
    sizes: ["S", "M", "L", "XL"],
    colorLabel: "Beige",
    shape: "jacket",
    fill: "#c9b28a",
    image: "/products/veste-trench.svg",
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

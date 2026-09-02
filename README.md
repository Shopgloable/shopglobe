# ShopGlobe — Essayage virtuel

Application e-commerce qui permet à un client d'envoyer une photo de lui et
de voir un vêtement (t-shirt, robe, veste...) superposé sur cette photo
avant l'achat, grâce à l'IA.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript + React 19
- [Tailwind CSS](https://tailwindcss.com) 4 pour le style
- [fal.ai](https://fal.ai) (modèle `fal-ai/idm-vton`) pour l'essayage virtuel réaliste
- [sharp](https://sharp.pixelplumbing.com) pour un mode démo local sans IA

Le catalogue et le panier sont volontairement simples (données en mémoire,
panier en `localStorage`) : le cœur de cette V1 est le flux d'essayage
virtuel, pas le paiement.

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000), cliquez sur un
produit, ajoutez une photo et cliquez sur « Voir sur moi ».

### Mode démo vs mode IA réel

- **Sans clé API** : l'app fonctionne quand même. Elle superpose
  simplement l'illustration du vêtement sur la photo envoyée
  (`lib/tryon.ts` → `runDemoTryOn`). C'est un aperçu du parcours, pas un
  rendu réaliste.
- **Avec une clé fal.ai** : copiez `.env.example` vers `.env.local`,
  renseignez `FAL_KEY` (clé obtenue sur
  [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys)), puis relancez
  `npm run dev`. Chaque essayage appelle alors le modèle
  [`fal-ai/idm-vton`](https://fal.ai/models/fal-ai/idm-vton) pour générer un
  rendu réaliste du vêtement sur la personne.

  Le modèle a besoin d'une URL publique pour l'image du vêtement : en
  local (`localhost`) cette URL n'est pas joignable depuis les serveurs
  fal.ai, donc le mode IA réel doit être testé sur un déploiement
  accessible publiquement (Vercel, etc.) — en local vous resterez en
  pratique sur le mode démo tant que le site n'est pas déployé.

## Architecture

```
app/
  page.tsx                 catalogue (accueil)
  produit/[id]/page.tsx    fiche produit + widget d'essayage
  api/tryon/route.ts       endpoint POST qui reçoit la photo + productId
components/
  TryOnWidget.tsx          upload photo, appel API, affichage du résultat
  ProductCard.tsx, Header.tsx, CartDrawer.tsx
lib/
  products.ts              catalogue produits (données statiques)
  tryon.ts                 logique d'essayage : IA (fal.ai) ou démo (sharp)
  cart-context.tsx          panier client (React context + localStorage)
public/products/*.svg      illustrations des vêtements (générées, voir
                            scripts/generate-garment-svgs.mjs)
```

## Étendre le projet

- **Vrai catalogue** : remplacer `lib/products.ts` par un appel à une vraie
  source de données (ex. Shopify, via le connecteur déjà disponible dans
  cet environnement).
- **Autres catégories** (lunettes, bijoux, casquettes, sacs) : ajouter des
  produits avec la bonne catégorie, une image de face du produit, et
  utiliser un modèle d'essayage adapté (l'essayage de vêtements type
  IDM-VTON n'est pas conçu pour des accessoires — un modèle de retouche
  d'image générale, ou une superposition ancrée sur la détection de
  visage/main, conviendrait mieux).
- **Paiement** : le bouton « Passer commande » est un placeholder ; il
  faudrait y brancher un vrai fournisseur de paiement (Stripe, Shopify
  Checkout, etc.).

import type { CategoryId, Product } from '../types';

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  postres: 'Postres',
  dulceria: 'Dulcería',
  bebidas: 'Bebidas',
  alimentos: 'Alimentos',
};

const IMG = {
  cake:
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  donuts:
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80',
  coffee:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
  juice:
    'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80',
  sandwich:
    'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&q=80',
  taco:
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
  cookie:
    'https://images.unsplash.com/photo-1499636136210-6f4ee9155836?w=400&q=80',
  brownie:
    'https://images.unsplash.com/photo-1607920592828-e91c67aa608c?w=400&q=80',
  soda:
    'https://images.unsplash.com/photo-1581636625402-29b2a704ef49?w=400&q=80',
  salad:
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
};

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Pastel de chocolate',
    price: 45,
    imageUrl: IMG.cake,
    categoryId: 'postres',
  },
  {
    id: 'p2',
    name: 'Flan napolitano',
    price: 28,
    imageUrl: IMG.brownie,
    categoryId: 'postres',
  },
  {
    id: 'p3',
    name: 'Donas glaseadas',
    price: 18,
    imageUrl: IMG.donuts,
    categoryId: 'postres',
  },
  {
    id: 'd1',
    name: 'Galletas surtidas',
    price: 22,
    imageUrl: IMG.cookie,
    categoryId: 'dulceria',
  },
  {
    id: 'd2',
    name: 'Brownie con nuez',
    price: 32,
    imageUrl: IMG.brownie,
    categoryId: 'dulceria',
  },
  {
    id: 'd3',
    name: 'Chocolates variados',
    price: 55,
    imageUrl: IMG.donuts,
    categoryId: 'dulceria',
  },
  {
    id: 'b1',
    name: 'Café americano',
    price: 25,
    imageUrl: IMG.coffee,
    categoryId: 'bebidas',
  },
  {
    id: 'b2',
    name: 'Jugo natural',
    price: 30,
    imageUrl: IMG.juice,
    categoryId: 'bebidas',
  },
  {
    id: 'b3',
    name: 'Refresco',
    price: 20,
    imageUrl: IMG.soda,
    categoryId: 'bebidas',
  },
  {
    id: 'a1',
    name: 'Sándwich club',
    price: 65,
    imageUrl: IMG.sandwich,
    categoryId: 'alimentos',
  },
  {
    id: 'a2',
    name: 'Tacos dorados',
    price: 58,
    imageUrl: IMG.taco,
    categoryId: 'alimentos',
  },
  {
    id: 'a3',
    name: 'Ensalada fresca',
    price: 52,
    imageUrl: IMG.salad,
    categoryId: 'alimentos',
  },
];

/** IDs marcados como más vendidos para la pantalla de inicio */
const BEST_SELLER_IDS = ['p1', 'b1', 'a1', 'd2'];

export function getBestSellers(): Product[] {
  return BEST_SELLER_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
    (p): p is Product => p !== undefined
  );
}

export function getProductsByCategory(categoryId: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
}

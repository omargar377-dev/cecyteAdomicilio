import {
  CATEGORY_LABELS,
  getBestSellers,
  getProductsByCategory,
  searchProducts,
} from '../mockProducts';

describe('mockProducts', () => {
  it('getBestSellers devuelve cuatro ítems', () => {
    expect(getBestSellers()).toHaveLength(4);
  });

  it('getProductsByCategory filtra por categoría', () => {
    const postres = getProductsByCategory('postres');
    expect(postres.length).toBeGreaterThan(0);
    expect(postres.every((p) => p.categoryId === 'postres')).toBe(true);
  });

  it('searchProducts encuentra por nombre', () => {
    const hits = searchProducts('café');
    expect(hits.some((p) => p.name.toLowerCase().includes('café'))).toBe(true);
  });

  it('CATEGORY_LABELS tiene las cuatro categorías', () => {
    expect(Object.keys(CATEGORY_LABELS)).toHaveLength(4);
  });
});

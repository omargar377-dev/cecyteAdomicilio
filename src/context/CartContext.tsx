import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { CartItem, Product } from '../types';

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  getQuantity: (productId: string) => number;
  setLineQuantity: (product: Product, quantity: number) => void;
  increment: (product: Product) => void;
  decrement: (product: Product) => void;
  clearCart: () => void;
  removeLine: (productId: string) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const getQuantity = useCallback(
    (productId: string) =>
      items.find((line) => line.product.id === productId)?.quantity ?? 0,
    [items]
  );

  const setLineQuantity = useCallback((product: Product, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((line) => line.product.id !== product.id);
      }
      const idx = prev.findIndex((line) => line.product.id === product.id);
      if (idx === -1) {
        return [...prev, { product, quantity }];
      }
      const next = [...prev];
      next[idx] = { ...next[idx], quantity };
      return next;
    });
  }, []);

  const increment = useCallback((product: Product) => {
    setItems((prev) => {
      const idx = prev.findIndex((line) => line.product.id === product.id);
      if (idx === -1) {
        return [...prev, { product, quantity: 1 }];
      }
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        quantity: next[idx].quantity + 1,
      };
      return next;
    });
  }, []);

  const decrement = useCallback((product: Product) => {
    setItems((prev) => {
      const idx = prev.findIndex((line) => line.product.id === product.id);
      if (idx === -1) return prev;
      const q = prev[idx].quantity - 1;
      if (q <= 0) {
        return prev.filter((line) => line.product.id !== product.id);
      }
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: q };
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const removeLine = useCallback((productId: string) => {
    setItems((prev) => prev.filter((line) => line.product.id !== productId));
  }, []);

  const totalQuantity = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, line) => sum + line.product.price * line.quantity,
        0
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalQuantity,
      totalPrice,
      getQuantity,
      setLineQuantity,
      increment,
      decrement,
      clearCart,
      removeLine,
    }),
    [
      items,
      totalQuantity,
      totalPrice,
      getQuantity,
      setLineQuantity,
      increment,
      decrement,
      clearCart,
      removeLine,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return ctx;
}

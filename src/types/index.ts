export type CategoryId = 'postres' | 'dulceria' | 'bebidas' | 'alimentos';

export type PaymentMethod = 'card' | 'cash';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: CategoryId;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TicketLine {
  name: string;
  quantity: number;
  unitPrice: number;
}

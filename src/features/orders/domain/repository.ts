import type { OrderRecord } from '../../../types/orders';

export interface OrdersRepository {
  appendOrder(order: OrderRecord): Promise<void>;
  listOrdersForUser(userEmail: string): Promise<OrderRecord[]>;
  clearOrdersForUser(userEmail: string): Promise<void>;
}


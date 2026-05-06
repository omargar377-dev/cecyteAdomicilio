import type { OrdersRepository } from '../domain/repository';
import type { OrderRecord } from '../../../types/orders';
import {
  deleteOrdersForUser,
  readOrdersForUser,
  writeOrdersForUser,
} from './ordersStore';

export class LocalOrdersAdapter implements OrdersRepository {
  async appendOrder(order: OrderRecord): Promise<void> {
    const current = await readOrdersForUser(order.userEmail);
    const next = [order, ...current].slice(0, 100); // keep last 100 orders
    await writeOrdersForUser(order.userEmail, next);
  }

  async listOrdersForUser(userEmail: string): Promise<OrderRecord[]> {
    return readOrdersForUser(userEmail);
  }

  async clearOrdersForUser(userEmail: string): Promise<void> {
    await deleteOrdersForUser(userEmail);
  }
}


import type { OrdersRepository } from '../domain/repository';
import type { OrderRecord } from '../../../types/orders';
import {
  appendOrderLocally,
  deleteOrdersForUser,
  readOrdersForUser,
} from './ordersStore';

export class LocalOrdersAdapter implements OrdersRepository {
  async appendOrder(order: OrderRecord): Promise<void> {
    await appendOrderLocally(order);
  }

  async listOrdersForUser(userEmail: string): Promise<OrderRecord[]> {
    return readOrdersForUser(userEmail);
  }

  async clearOrdersForUser(userEmail: string): Promise<void> {
    await deleteOrdersForUser(userEmail);
  }
}

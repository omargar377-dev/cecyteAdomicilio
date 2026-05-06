import type { OrdersRepository } from '../domain/repository';
import type { OrderRecord } from '../../../types/orders';

export class OrdersService {
  constructor(private readonly repository: OrdersRepository) {}

  appendOrder(order: OrderRecord) {
    return this.repository.appendOrder(order);
  }

  listOrdersForUser(userEmail: string) {
    return this.repository.listOrdersForUser(userEmail);
  }

  clearOrdersForUser(userEmail: string) {
    return this.repository.clearOrdersForUser(userEmail);
  }
}


import type { PaymentMethod, TicketLine } from './index';

export type OrderId = string;

export type OrderRecord = {
  id: OrderId;
  orderNumber: string;
  ticketCode: string;
  userEmail: string;
  userName: string | null;
  paymentMethod: PaymentMethod;
  total: number;
  lines: TicketLine[];
  createdAt: string; // ISO date string
};


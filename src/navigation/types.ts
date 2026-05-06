import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { CategoryId, PaymentMethod, TicketLine } from '../types';

export type RootStackParamList = {
  Home: undefined;
  Products: { categoryId: CategoryId };
  Cart: undefined;
  History: undefined;
  Ticket: {
    orderNumber: string;
    ticketCode: string;
    paymentMethod: PaymentMethod;
    total: number;
    lines: TicketLine[];
  };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type ProductsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Products'
>;
export type CartScreenProps = NativeStackScreenProps<RootStackParamList, 'Cart'>;
export type HistoryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'History'
>;
export type TicketScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Ticket'
>;

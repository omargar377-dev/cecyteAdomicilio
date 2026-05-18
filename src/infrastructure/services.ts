import { AuthService } from '../features/auth/application/AuthService';
import { ProvisionalAuthAdapter } from '../features/auth/infrastructure/ProvisionalAuthAdapter';
import { OrdersService } from '../features/orders/application/OrdersService';
import { LocalOrdersAdapter } from '../features/orders/infrastructure/LocalOrdersAdapter';

/** Auth y pedidos persistidos solo en el dispositivo (expo-secure-store). */
export const authService = new AuthService(new ProvisionalAuthAdapter());
export const ordersService = new OrdersService(new LocalOrdersAdapter());

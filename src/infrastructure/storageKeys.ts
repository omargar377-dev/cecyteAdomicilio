/** Claves en expo-secure-store (datos solo en el dispositivo). */
export const AUTH_STORAGE_KEYS = {
  users: 'cecyte_auth_users_v1',
  session: 'cecyte_auth_session_v1',
} as const;

export type AuthStorageKey = keyof typeof AUTH_STORAGE_KEYS;

export const ORDERS_STORAGE_PREFIX = 'cecyte_orders_v1';

/** Historial global de compras en el dispositivo (AsyncStorage). */
export const DEVICE_PURCHASE_HISTORY_KEY = 'cecyte_purchase_history_v1';

export function ordersStorageKeyForEmailHash(emailHash: string) {
  return `${ORDERS_STORAGE_PREFIX}::${emailHash}`;
}

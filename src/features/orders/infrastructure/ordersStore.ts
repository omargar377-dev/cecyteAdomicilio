import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

import type { OrderRecord } from '../../../types/orders';

const STORE_PREFIX = 'cecyte_orders_v1';

async function keyForEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `orders::${normalized}`
  );
  return `${STORE_PREFIX}::${digest}`;
}

export async function readOrdersForUser(email: string): Promise<OrderRecord[]> {
  const key = await keyForEmail(email);
  const raw = await SecureStore.getItemAsync(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as OrderRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    await SecureStore.deleteItemAsync(key);
    return [];
  }
}

export async function writeOrdersForUser(
  email: string,
  orders: OrderRecord[]
): Promise<void> {
  const key = await keyForEmail(email);
  await SecureStore.setItemAsync(key, JSON.stringify(orders));
}

export async function deleteOrdersForUser(email: string): Promise<void> {
  const key = await keyForEmail(email);
  await SecureStore.deleteItemAsync(key);
}


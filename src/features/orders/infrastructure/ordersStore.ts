import * as Crypto from 'expo-crypto';

import { readLocalJson, removeLocalKey, writeLocalJson } from '../../../infrastructure/localPersistence';
import {
  DEVICE_PURCHASE_HISTORY_KEY,
  ordersStorageKeyForEmailHash,
} from '../../../infrastructure/storageKeys';
import type { OrderRecord } from '../../../types/orders';

const MAX_ORDERS_PER_USER = 100;
const MAX_DEVICE_ORDERS = 200;

async function keyForEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `orders::${normalized}`
  );
  return ordersStorageKeyForEmailHash(digest);
}

async function readDeviceHistory(): Promise<OrderRecord[]> {
  const list = await readLocalJson<OrderRecord[]>(DEVICE_PURCHASE_HISTORY_KEY);
  return Array.isArray(list) ? list : [];
}

async function appendToDeviceHistory(order: OrderRecord) {
  const current = await readDeviceHistory();
  const next = [order, ...current.filter((o) => o.id !== order.id)].slice(
    0,
    MAX_DEVICE_ORDERS
  );
  await writeLocalJson(DEVICE_PURCHASE_HISTORY_KEY, next);
}

export async function readOrdersForUser(email: string): Promise<OrderRecord[]> {
  const key = await keyForEmail(email);
  const perUser = await readLocalJson<OrderRecord[]>(key);
  if (Array.isArray(perUser) && perUser.length > 0) {
    return perUser;
  }

  const normalized = email.trim().toLowerCase();
  const fromDevice = await readDeviceHistory();
  return fromDevice.filter((o) => o.userEmail.trim().toLowerCase() === normalized);
}

export async function writeOrdersForUser(
  email: string,
  orders: OrderRecord[]
): Promise<void> {
  const key = await keyForEmail(email);
  await writeLocalJson(key, orders.slice(0, MAX_ORDERS_PER_USER));
}

export async function appendOrderLocally(order: OrderRecord): Promise<void> {
  const current = await readOrdersForUser(order.userEmail);
  const next = [order, ...current.filter((o) => o.id !== order.id)].slice(
    0,
    MAX_ORDERS_PER_USER
  );
  await writeOrdersForUser(order.userEmail, next);
  await appendToDeviceHistory(order);
}

export async function deleteOrdersForUser(email: string): Promise<void> {
  const key = await keyForEmail(email);
  await removeLocalKey(key);
}

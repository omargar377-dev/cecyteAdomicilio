import * as SecureStore from 'expo-secure-store';

import {
  AUTH_STORAGE_KEYS,
  type AuthStorageKey,
} from '../../../infrastructure/storageKeys';

export async function readSecureJson<T>(key: AuthStorageKey) {
  const storageKey = AUTH_STORAGE_KEYS[key];
  const raw = await SecureStore.getItemAsync(storageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    await SecureStore.deleteItemAsync(storageKey);
    return null;
  }
}

export async function writeSecureJson<T>(key: AuthStorageKey, value: T) {
  await SecureStore.setItemAsync(
    AUTH_STORAGE_KEYS[key],
    JSON.stringify(value)
  );
}

export async function deleteSecureKey(key: AuthStorageKey) {
  await SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS[key]);
}

import * as SecureStore from 'expo-secure-store';

const STORE_KEYS = {
  users: 'cecyte_auth_users_v1',
  session: 'cecyte_auth_session_v1',
} as const;

export async function readSecureJson<T>(key: keyof typeof STORE_KEYS) {
  const raw = await SecureStore.getItemAsync(STORE_KEYS[key]);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    await SecureStore.deleteItemAsync(STORE_KEYS[key]);
    return null;
  }
}

export async function writeSecureJson<T>(
  key: keyof typeof STORE_KEYS,
  value: T
) {
  await SecureStore.setItemAsync(STORE_KEYS[key], JSON.stringify(value));
}

export async function deleteSecureKey(key: keyof typeof STORE_KEYS) {
  await SecureStore.deleteItemAsync(STORE_KEYS[key]);
}

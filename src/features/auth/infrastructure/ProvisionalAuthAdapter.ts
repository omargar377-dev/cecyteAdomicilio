import * as Crypto from 'expo-crypto';

import { AuthError } from '../domain/errors';
import type {
  AuthRepository,
  ForgotPasswordResult,
} from '../domain/repository';
import type {
  AuthSession,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from '../domain/types';
import { deleteSecureKey, readSecureJson, writeSecureJson } from './secureStore';

type StoredUser = {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

function makeToken() {
  return `${Date.now()}_${Math.random().toString(36).slice(2)}_${Math.random()
    .toString(36)
    .slice(2)}`;
}

async function hashPassword(rawPassword: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `cecyte-provisional-salt::${rawPassword}`
  );
}

async function getUsers() {
  return (await readSecureJson<StoredUser[]>('users')) ?? [];
}

function toSession(user: StoredUser): AuthSession {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 6);
  return {
    accessToken: makeToken(),
    refreshToken: makeToken(),
    expiresAt: expires.toISOString(),
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
}

export class ProvisionalAuthAdapter implements AuthRepository {
  async register(input: RegisterInput): Promise<AuthSession> {
    const users = await getUsers();
    if (users.some((u) => u.email === input.email)) {
      throw new AuthError(
        'ACCOUNT_EXISTS',
        'Este correo institucional ya está registrado.'
      );
    }

    const user: StoredUser = {
      id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      fullName: input.fullName,
      email: input.email,
      passwordHash: await hashPassword(input.password),
      createdAt: new Date().toISOString(),
    };

    await writeSecureJson('users', [...users, user]);
    const session = toSession(user);
    await writeSecureJson('session', session);
    return session;
  }

  async login(input: LoginInput): Promise<AuthSession> {
    const users = await getUsers();
    const user = users.find((item) => item.email === input.email);
    if (!user) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Correo o contraseña incorrectos.'
      );
    }
    const incomingHash = await hashPassword(input.password);
    if (incomingHash !== user.passwordHash) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Correo o contraseña incorrectos.'
      );
    }
    const session = toSession(user);
    await writeSecureJson('session', session);
    return session;
  }

  async forgotPassword(
    _input: ForgotPasswordInput
  ): Promise<ForgotPasswordResult> {
    return { accepted: true };
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    const session = await readSecureJson<AuthSession>('session');
    if (!session) return null;
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      await deleteSecureKey('session');
      return null;
    }
    return session;
  }

  async logout(): Promise<void> {
    await deleteSecureKey('session');
  }
}

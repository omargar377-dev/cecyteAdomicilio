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

export class SupabaseAuthAdapter implements AuthRepository {
  async register(_input: RegisterInput): Promise<AuthSession> {
    throw new AuthError(
      'SUPABASE_NOT_CONFIGURED',
      'La integración con Supabase aún no está configurada.'
    );
  }

  async login(_input: LoginInput): Promise<AuthSession> {
    throw new AuthError(
      'SUPABASE_NOT_CONFIGURED',
      'La integración con Supabase aún no está configurada.'
    );
  }

  async forgotPassword(
    _input: ForgotPasswordInput
  ): Promise<ForgotPasswordResult> {
    throw new AuthError(
      'SUPABASE_NOT_CONFIGURED',
      'La integración con Supabase aún no está configurada.'
    );
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    return null;
  }

  async logout(): Promise<void> {}
}

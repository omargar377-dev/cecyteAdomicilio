import { mapAuthError } from '../domain/errors';
import type { AuthRepository } from '../domain/repository';
import type {
  AuthSession,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from '../domain/types';
import {
  validateForgotPasswordInput,
  validateLoginInput,
  validateRegisterInput,
} from '../domain/validation';

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async register(input: RegisterInput): Promise<AuthSession> {
    try {
      return await this.repository.register(validateRegisterInput(input));
    } catch (error) {
      throw new Error(mapAuthError(error));
    }
  }

  async login(input: LoginInput): Promise<AuthSession> {
    try {
      return await this.repository.login(validateLoginInput(input));
    } catch (error) {
      throw new Error(mapAuthError(error));
    }
  }

  async forgotPassword(input: ForgotPasswordInput) {
    try {
      return await this.repository.forgotPassword(
        validateForgotPasswordInput(input)
      );
    } catch (error) {
      throw new Error(mapAuthError(error));
    }
  }

  async getCurrentSession() {
    try {
      return await this.repository.getCurrentSession();
    } catch {
      return null;
    }
  }

  logout() {
    return this.repository.logout();
  }
}

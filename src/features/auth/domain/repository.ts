import type {
  AuthSession,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from './types';

export type ForgotPasswordResult = {
  accepted: true;
};

export interface AuthRepository {
  register(input: RegisterInput): Promise<AuthSession>;
  login(input: LoginInput): Promise<AuthSession>;
  forgotPassword(input: ForgotPasswordInput): Promise<ForgotPasswordResult>;
  getCurrentSession(): Promise<AuthSession | null>;
  logout(): Promise<void>;
}

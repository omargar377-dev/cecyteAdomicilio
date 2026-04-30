import { AuthError } from './errors';
import type { ForgotPasswordInput, LoginInput, RegisterInput } from './types';

const CECYTE_EMAIL_REGEX = /^[a-z0-9._%+-]+@cecytebc\.edu\.mx$/i;

function clean(value: string) {
  return value.trim();
}

export function normalizeEmail(email: string) {
  return clean(email).toLowerCase();
}

export function assertCecyteEmail(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    throw new AuthError('EMAIL_REQUIRED', 'El correo institucional es obligatorio.');
  }
  if (!CECYTE_EMAIL_REGEX.test(normalized)) {
    throw new AuthError(
      'EMAIL_INVALID',
      'Usa un correo institucional válido con dominio @cecytebc.edu.mx.'
    );
  }
}

export function validateRegisterInput(input: RegisterInput) {
  const fullName = clean(input.fullName);
  const email = normalizeEmail(input.email);
  const password = input.password.trim();
  const confirmPassword = input.confirmPassword.trim();

  if (!fullName) {
    throw new AuthError('NAME_REQUIRED', 'Ingresa tu nombre completo.');
  }
  assertCecyteEmail(email);
  if (password.length < 8) {
    throw new AuthError(
      'PASSWORD_TOO_SHORT',
      'La contraseña debe tener al menos 8 caracteres.'
    );
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new AuthError(
      'PASSWORD_WEAK',
      'La contraseña debe incluir letras y números.'
    );
  }
  if (password !== confirmPassword) {
    throw new AuthError(
      'PASSWORD_MISMATCH',
      'La confirmación de contraseña no coincide.'
    );
  }

  return {
    fullName,
    email,
    password,
    confirmPassword,
  };
}

export function validateLoginInput(input: LoginInput) {
  const email = normalizeEmail(input.email);
  const password = input.password.trim();
  assertCecyteEmail(email);
  if (!password) {
    throw new AuthError('PASSWORD_REQUIRED', 'La contraseña es obligatoria.');
  }
  return { email, password };
}

export function validateForgotPasswordInput(input: ForgotPasswordInput) {
  const email = normalizeEmail(input.email);
  assertCecyteEmail(email);
  return { email };
}

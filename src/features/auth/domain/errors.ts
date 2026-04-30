export class AuthError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'AuthError';
  }
}

export function mapAuthError(error: unknown): string {
  if (error instanceof AuthError) return error.message;
  return 'No fue posible completar la operación. Intenta nuevamente.';
}

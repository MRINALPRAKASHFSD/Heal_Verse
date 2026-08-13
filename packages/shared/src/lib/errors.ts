import { DEFAULT_API_ERROR_MESSAGE } from '../constants/app.constants';

export class AppError extends Error {
  constructor(
    message: string = DEFAULT_API_ERROR_MESSAGE,
    public readonly code: string = 'APP_ERROR',
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return DEFAULT_API_ERROR_MESSAGE;
}
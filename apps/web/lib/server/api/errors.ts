import { ZodError } from 'zod';

export type ApiErrorCode = 'bad_request' | 'unauthorized' | 'forbidden' | 'not_found' | 'conflict' | 'rate_limited' | 'internal_error';

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required', details?: Record<string, unknown>) {
    super('unauthorized', message, 401, details);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Access forbidden', details?: Record<string, unknown>) {
    super('forbidden', message, 403, details);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('bad_request', message, 400, details);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('not_found', message, 404, details);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('conflict', message, 409, details);
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('rate_limited', message, 429, details);
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal server error', details?: Record<string, unknown>) {
    super('internal_error', message, 500, details);
  }
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new BadRequestError('Request validation failed', {
      issues: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    });
  }

  if (error instanceof Error) {
    return new InternalError(error.message);
  }

  return new InternalError();
}
import { apiErrorResponseSchema } from './contracts';

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId?: string;
  readonly details?: Record<string, unknown>;

  constructor(input: { message: string; code: string; status: number; requestId?: string; details?: Record<string, unknown> }) {
    super(input.message);
    this.name = 'ApiError';
    this.code = input.code;
    this.status = input.status;
    this.requestId = input.requestId;
    this.details = input.details;
  }
}

function buildUrl(path: string, searchParams?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(path, process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000');

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined) {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();

  if (!response.ok) {
    const normalized = apiErrorResponseSchema.safeParse(payload);

    if (normalized.success) {
      throw new ApiError({
        message: normalized.data.error.message,
        code: normalized.data.error.code,
        status: response.status,
        requestId: normalized.data.requestId,
        details: normalized.data.error.details,
      });
    }

    throw new ApiError({
      message: 'Request failed',
      code: 'unknown_error',
      status: response.status,
    });
  }

  return payload as T;
}

export async function apiGet<T>(path: string, searchParams?: Record<string, string | number | boolean | undefined>): Promise<T> {
  const response = await fetch(buildUrl(path, searchParams), {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
    },
  });

  return parseResponse<T>(response);
}

export async function apiSend<T>(path: string, body: unknown, init?: { method?: 'POST' | 'PATCH' | 'DELETE' }): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: init?.method ?? 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return parseResponse<T>(response);
}

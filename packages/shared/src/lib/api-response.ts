import type { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from './types';

export function createSuccessResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

export function createErrorResponse(message: string, code: string): ApiErrorResponse {
  return {
    success: false,
    error: {
      message,
      code,
    },
  };
}

export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.success;
}
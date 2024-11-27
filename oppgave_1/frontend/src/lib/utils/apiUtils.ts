import { API_CONFIG, ERROR_MESSAGES } from '../../config/config';
import { ApiResponse } from '../../types/types';

interface FetchOptions extends RequestInit {
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchWithTimeout(
  resource: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = API_CONFIG.timeout } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
      }
    }
    throw error;
  }
}

export async function fetchWithRetry<T>(
  resource: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    retryAttempts = API_CONFIG.retryAttempts,
    retryDelay = API_CONFIG.retryDelay,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retryAttempts; attempt++) {
    try {
      const response = await fetchWithTimeout(resource, {
        ...fetchOptions,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });
      
      // Consider both 200 and 201 as successful responses
      if (![200, 201].includes(response.status)) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || ERROR_MESSAGES.UNKNOWN_ERROR);
      }

      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      lastError = error instanceof Error ? error : new Error(ERROR_MESSAGES.UNKNOWN_ERROR);

      if (error instanceof Error && error.message === ERROR_MESSAGES.TIMEOUT_ERROR) {
        throw error;
      }

      if (attempt < retryAttempts - 1) {
        await wait(retryDelay * Math.pow(2, attempt));
        continue;
      }
    }
  }

  throw lastError || new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
}

export function validateResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.error?.message || ERROR_MESSAGES.UNKNOWN_ERROR);
  }
  return response.data;
}

export async function handleApiError(error: unknown): Promise<never> {
  if (error instanceof Error) {
    if (error.message === ERROR_MESSAGES.TIMEOUT_ERROR) {
      throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
    }
    if (error.message.includes('Failed to fetch')) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
  throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
}

export function createQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && (
    error.message.includes('Failed to fetch') ||
    error.message.includes('Network request failed') ||
    error.message === ERROR_MESSAGES.NETWORK_ERROR
  );
}

export function isTimeoutError(error: unknown): boolean {
  return error instanceof Error && error.message === ERROR_MESSAGES.TIMEOUT_ERROR;
}

export function isServerError(error: unknown): boolean {
  return error instanceof Error && error.message === ERROR_MESSAGES.SERVER_ERROR;
}

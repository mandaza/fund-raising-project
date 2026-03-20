const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const DEFAULT_REQUEST_TIMEOUT_MS = 15000;

export class APIError extends Error {
  constructor(
    public status: number,
    public detail: string,
    public data?: any
  ) {
    super(detail);
    this.name = "APIError";
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const method = (options.method || "GET").toUpperCase();
  const shouldRetry = method === "GET";
  const maxAttempts = shouldRetry ? 2 : 1;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorDetail = response.statusText;
        let errorData = null;

        try {
          errorData = await response.json();
          errorDetail = errorData.detail || errorDetail;
        } catch {
          // If response is not JSON, use statusText
        }

        throw new APIError(response.status, errorDetail, errorData);
      }

      return response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      const isLastAttempt = attempt === maxAttempts - 1;
      if (!isLastAttempt) {
        // Brief backoff before retrying transient network failures.
        await new Promise((resolve) => setTimeout(resolve, 300));
        continue;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new APIError(0, "Request timed out. Please try again.", null);
      }

      // Network error or other fetch errors
      throw new APIError(0, "Network error. Please check your connection.", null);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new APIError(0, "Network error. Please check your connection.", null);
}

export function getApiUrl(): string {
  return API_URL;
}

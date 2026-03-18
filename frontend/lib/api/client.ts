const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  try {
    const response = await fetch(url, {
      ...options,
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

    // Network error or other fetch errors
    throw new APIError(0, "Network error. Please check your connection.", null);
  }
}

export function getApiUrl(): string {
  return API_URL;
}

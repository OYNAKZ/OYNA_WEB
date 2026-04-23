import type {
  BackendOperationalReservation,
  BackendOperationsSummary,
  BackendPaymentListItem,
  BackendUser,
  PaginatedResponse,
} from "../types/backend";

const viteEnv = ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}) as Record<
  string,
  string | undefined
>;

const rawBaseUrl = viteEnv.VITE_API_BASE_URL?.trim() || "http://localhost:8000";
const apiBaseUrl = `${rawBaseUrl.replace(/\/+$/, "")}/api/v1`;
const tokenStorageKey = "oyna.web.access_token";

let accessToken = typeof window !== "undefined" ? window.localStorage.getItem(tokenStorageKey) : null;
let unauthorizedHandler: (() => void) | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
  }
}

const normalizePath = (path: string): string => (path.startsWith("/") ? path : `/${path}`);

const parseResponse = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${apiBaseUrl}${normalizePath(path)}`, {
    ...init,
    headers,
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    if (response.status === 401) {
      unauthorizedHandler?.();
    }
    const message =
      typeof payload === "object" && payload && "detail" in payload
        ? String((payload as { detail: unknown }).detail)
        : response.statusText || "Request failed";
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
};

export const authTokenStore = {
  read(): string | null {
    return accessToken;
  },
  write(token: string | null): void {
    accessToken = token;
    if (typeof window === "undefined") {
      return;
    }
    if (token) {
      window.localStorage.setItem(tokenStorageKey, token);
    } else {
      window.localStorage.removeItem(tokenStorageKey);
    }
  },
};

export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  unauthorizedHandler = handler;
};

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const backendApi = {
  baseUrl: apiBaseUrl,
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async getCurrentUser(): Promise<BackendUser> {
    return apiRequest<BackendUser>("/users/me", { method: "GET" });
  },
  async getUsers(): Promise<BackendUser[]> {
    return apiRequest<BackendUser[]>("/users", { method: "GET" });
  },
  async getOperationalReservations(): Promise<PaginatedResponse<BackendOperationalReservation>> {
    return apiRequest<PaginatedResponse<BackendOperationalReservation>>("/operations/reservations?page=1&page_size=100", {
      method: "GET",
    });
  },
  async getPayments(): Promise<PaginatedResponse<BackendPaymentListItem>> {
    return apiRequest<PaginatedResponse<BackendPaymentListItem>>("/payments?page=1&page_size=100", {
      method: "GET",
    });
  },
  async getOperationsSummary(): Promise<BackendOperationsSummary> {
    return apiRequest<BackendOperationsSummary>("/operations/summary", { method: "GET" });
  },
};

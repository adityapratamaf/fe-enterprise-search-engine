import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_CONFIG } from "./config";
import { ENDPOINTS } from "./endpoints";
import { ApiError, toApiError } from "./ApiError";
import { tokenStore } from "./tokenStore";
import type { ApiEnvelope } from "./contracts/common";
import type { AuthResponse } from "./contracts/auth";

type RequestConfig = AxiosRequestConfig & {
  /** Set on /auth/login and /auth/refresh so a 401 there is not "retry me". */
  skipAuthRefresh?: boolean;
};

type RetriableConfig = InternalAxiosRequestConfig & {
  skipAuthRefresh?: boolean;
  _retry?: boolean;
};

/**
 * ASP.NET Core binds repeated keys (`produk=A&produk=B`) to `string[]`; axios'
 * default would emit `produk[]=A`, which does not bind. Empty values are dropped
 * so unset filters never reach the query string at all.
 */
function serializeParams(params: Record<string, unknown>): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry === undefined || entry === null || entry === "") continue;
        search.append(key, String(entry));
      }
      continue;
    }

    search.append(key, String(value));
  }

  return search.toString();
}

/**
 * No default `Content-Type`: axios sets `application/json` for plain objects on
 * its own, and leaves FormData alone so the browser can add the multipart
 * boundary. An instance-wide JSON default would survive into an upload and break
 * it — axios only strips a boundary-less `multipart/form-data`, never JSON.
 */
export const http = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeoutMs,
  paramsSerializer: serializeParams,
});

http.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------------------------------------------------------------------------
// Token refresh
// ---------------------------------------------------------------------------

let refreshInFlight: Promise<string> | null = null;
let onUnauthorized: (() => void) | null = null;

/**
 * Lets the auth layer react when refresh is no longer possible. Kept as a
 * callback rather than an import so this module stays free of React.
 */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

/**
 * Single-flight refresh: concurrent 401s all await the same request instead of
 * the previous behaviour, where the first one refreshed and every other request
 * was rejected outright.
 */
function refreshAccessToken(): Promise<string> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) {
      throw new ApiError("Sesi berakhir. Silakan masuk kembali.", { status: 401 });
    }

    const { data } = await axios.post<ApiEnvelope<AuthResponse>>(
      `${API_CONFIG.baseURL}${ENDPOINTS.auth.refresh}`,
      { refreshToken },
      { timeout: API_CONFIG.timeoutMs },
    );

    if (!data.success || !data.data?.access) {
      throw new ApiError(data.message || "Gagal memperbarui sesi.", {
        status: 401,
        errors: data.errors,
      });
    }

    tokenStore.save(data.data);
    return data.data.access;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const config = axios.isAxiosError(error)
      ? (error.config as RetriableConfig | undefined)
      : undefined;
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;

    if (status !== 401 || !config || config._retry || config.skipAuthRefresh) {
      return Promise.reject(toApiError(error));
    }

    config._retry = true;

    try {
      const token = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
      return await http(config);
    } catch (refreshError) {
      tokenStore.clear();
      onUnauthorized?.();
      return Promise.reject(toApiError(refreshError));
    }
  },
);

// ---------------------------------------------------------------------------
// Envelope unwrapping
// ---------------------------------------------------------------------------

/**
 * Every backend endpoint answers with `Result<T>`. Callers want `T`, so the
 * envelope is peeled here — and a `success: false` body becomes a thrown
 * `ApiError` rather than a 200 that silently carries no data.
 */
async function unwrap<T>(request: Promise<AxiosResponse<ApiEnvelope<T>>>): Promise<T> {
  let response: AxiosResponse<ApiEnvelope<T>>;
  try {
    response = await request;
  } catch (error) {
    throw toApiError(error);
  }

  const envelope = response.data;

  if (!envelope || typeof envelope !== "object" || !("success" in envelope)) {
    throw new ApiError("Format respons server tidak dikenali.", { status: response.status });
  }

  if (!envelope.success) {
    throw new ApiError(envelope.message || "Permintaan ditolak server.", {
      status: response.status,
      errors: envelope.errors,
    });
  }

  if (envelope.data === undefined || envelope.data === null) {
    throw new ApiError(envelope.message || "Server tidak mengirimkan data.", {
      status: response.status,
    });
  }

  return envelope.data;
}

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>, config?: RequestConfig) =>
    unwrap<T>(http.get<ApiEnvelope<T>>(url, { ...config, params })),

  post: <T>(url: string, data?: unknown, config?: RequestConfig) =>
    unwrap<T>(http.post<ApiEnvelope<T>>(url, data, config)),

  put: <T>(url: string, data?: unknown, config?: RequestConfig) =>
    unwrap<T>(http.put<ApiEnvelope<T>>(url, data, config)),

  patch: <T>(url: string, data?: unknown, config?: RequestConfig) =>
    unwrap<T>(http.patch<ApiEnvelope<T>>(url, data, config)),

  delete: <T>(url: string, config?: RequestConfig) =>
    unwrap<T>(http.delete<ApiEnvelope<T>>(url, config)),
};

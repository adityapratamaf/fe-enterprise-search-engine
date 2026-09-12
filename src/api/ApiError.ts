import { isAxiosError } from "axios";
import type { ApiEnvelope } from "./contracts/common";

/**
 * One error type for every failure mode, so callers never have to know whether
 * the request died in the network, in the HTTP layer, or inside the backend's
 * `Result<T>` envelope.
 */
export class ApiError extends Error {
  readonly status: number | undefined;
  readonly errors: unknown;
  /** True when the request never got an HTTP response (offline, CORS, timeout). */
  readonly isNetwork: boolean;

  constructor(
    message: string,
    options: { status?: number; errors?: unknown; isNetwork?: boolean; cause?: unknown } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.status = options.status;
    this.errors = options.errors;
    this.isNetwork = options.isNetwork ?? false;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

const FALLBACK_MESSAGE = "Permintaan gagal diproses. Silakan coba lagi.";

/** Normalises anything thrown by axios into an `ApiError`. */
export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;

  if (isAxiosError(error)) {
    if (!error.response) {
      const offline =
        error.code === "ECONNABORTED"
          ? "Permintaan melebihi batas waktu."
          : "Tidak dapat menghubungi server. Periksa koneksi atau pastikan backend berjalan.";
      return new ApiError(offline, { isNetwork: true, cause: error });
    }

    const envelope = error.response.data as ApiEnvelope<unknown> | undefined;
    return new ApiError(envelope?.message?.trim() || error.message || FALLBACK_MESSAGE, {
      status: error.response.status,
      errors: envelope?.errors,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new ApiError(error.message || FALLBACK_MESSAGE, { cause: error });
  }

  return new ApiError(FALLBACK_MESSAGE, { cause: error });
}

/**
 * Mirror of the backend's `Result<T>`: every endpoint wraps its payload in this
 * envelope, so nothing reads `response.data` directly — see `unwrap` in http.ts.
 */
export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data?: T | null;
  errors?: unknown;
};

/** Mirror of `PaginationRequest`, which every list endpoint inherits from. */
export type PaginationParams = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  isDescending?: boolean;
};

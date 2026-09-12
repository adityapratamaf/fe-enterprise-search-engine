import { apiClient } from "./client";

export abstract class BaseResource {
  protected get<T>(url: string, params?: Record<string, unknown>) {
    return apiClient.get<T>(url, { params });
  }

  protected post<T>(url: string, data?: unknown) {
    return apiClient.post<T>(url, data);
  }

  protected put<T>(url: string, data?: unknown) {
    return apiClient.put<T>(url, data);
  }

  protected patch<T>(url: string, data?: unknown) {
    return apiClient.patch<T>(url, data);
  }

  protected delete<T>(url: string) {
    return apiClient.delete<T>(url);
  }
}

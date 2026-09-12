import axios from "axios";
import { API_CONFIG, STORAGE_KEYS } from "./config";

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.accessToken);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queuedRequests: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };
    if (error.response?.status !== 401 || original?._retry) {
      return Promise.reject(error);
    }

    original._retry = true;
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    if (!refreshToken || isRefreshing) {
      return Promise.reject(error);
    }

    isRefreshing = true;
    try {
      // Backend refresh contract can be wired here without changing resource consumers.
      const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, { refreshToken });
      const nextToken = response.data?.accessToken as string | undefined;
      if (!nextToken) throw new Error("Refresh response did not include accessToken");
      localStorage.setItem(STORAGE_KEYS.accessToken, nextToken);
      queuedRequests.forEach((resolve) => resolve(nextToken));
      queuedRequests = [];
      original.headers.Authorization = `Bearer ${nextToken}`;
      return apiClient(original);
    } catch (refreshError) {
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
      queuedRequests = [];
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export function queueRefreshRequest(resolve: (token: string) => void) {
  queuedRequests.push(resolve);
}

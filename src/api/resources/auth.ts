import { api } from "../http";
import { ENDPOINTS } from "../endpoints";
import type { AuthResponse, LoginPayload, UserResponse } from "../contracts/auth";

export const authApi = {
  /** `skipAuthRefresh`: a 401 here means wrong credentials, not a stale token. */
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>(ENDPOINTS.auth.login, payload, { skipAuthRefresh: true }),

  logout: () => api.post<unknown>(ENDPOINTS.auth.logout),

  profile: () => api.get<UserResponse>(ENDPOINTS.auth.profile),
};

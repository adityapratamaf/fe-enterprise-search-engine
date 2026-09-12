import type { AuthResponse, LoginPayload, ModulePermission, UserResponse } from "../contracts/auth";
import type { authApi as LiveAuthApi } from "../resources/auth";

const MOCK_USER: UserResponse = {
  id: "mock-user-1",
  username: "apratama",
  email: "aditya.pratama@pertamina.com",
  firstName: "Aditya",
  lastName: "Pratama",
  role: "Admin",
  isActive: true,
  isSuperUser: false,
};

/**
 * Grants shaped like the backend's `ModulePermissionResponse`: `moduleId` is the
 * business code and `actions` are lowercase, which is what `hasPermission` checks.
 */
const MOCK_MODULES: ModulePermission[] = [
  {
    moduleId: "search",
    moduleName: "Pencarian SPBU",
    modulePath: "/",
    actions: ["view", "execute"],
  },
];

/** One hour out, so nothing in the UI treats the preview session as expired. */
function mockAuthResponse(email?: string): AuthResponse {
  return {
    access: "mock-access-token",
    refresh: "mock-refresh-token",
    expiry: Math.floor(Date.now() / 1000) + 3600,
    user: email ? { ...MOCK_USER, email } : MOCK_USER,
    modules: MOCK_MODULES,
  };
}

/** The session the app starts with while running without a backend. */
export const MOCK_SESSION = {
  user: MOCK_USER,
  modules: MOCK_MODULES,
};

/**
 * Offline stand-in for `authApi`. Accepts any credentials — it exists so the
 * login screen can be exercised, not to authenticate anyone.
 */
export const authMockApi = {
  login: (payload: LoginPayload): Promise<AuthResponse> =>
    new Promise((resolve) => {
      setTimeout(() => resolve(mockAuthResponse(payload.email || undefined)), 350);
    }),

  logout: (): Promise<unknown> => Promise.resolve(null),

  profile: (): Promise<UserResponse> => Promise.resolve(MOCK_USER),
} satisfies typeof LiveAuthApi;

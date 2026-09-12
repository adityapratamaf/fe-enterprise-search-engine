import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  API_CONFIG,
  authApi,
  MOCK_SESSION,
  setUnauthorizedHandler,
  tokenStore,
  type LoginPayload,
  type ModulePermission,
  type UserResponse,
} from "@/api";
import { hasPermission } from "./permissions";

type AuthState = {
  user: UserResponse | null;
  modules: ModulePermission[];
};

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  displayName: string;
  initials: string;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  /** Checks a `{module}.{action}` grant from the session, same rule as the API. */
  can: (module: string, action: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const EMPTY: AuthState = { user: null, modules: [] };

/**
 * Rehydrates from storage synchronously so a reload does not flash the login
 * screen. The stored access token may already be expired; that is fine — the
 * first API call refreshes it, and if refresh fails the HTTP layer calls back
 * into `setUnauthorizedHandler` below and the session is dropped.
 *
 * In mock mode there is nothing to authenticate against, so the app simply
 * starts with the preview session and the login screen stays optional.
 */
function readStoredState(): AuthState {
  const session = tokenStore.getSession();
  if (session && tokenStore.getRefresh()) {
    return { user: session.user, modules: session.modules };
  }
  return API_CONFIG.useMock ? MOCK_SESSION : EMPTY;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(readStoredState);

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setState(EMPTY);
  }, []);

  // Only a live backend can invalidate a session; mock mode has no 401 to react to.
  const watchUnauthorized = !API_CONFIG.useMock;

  useEffect(() => {
    if (!watchUnauthorized) return;
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, [clearSession, watchUnauthorized]);

  const login = useCallback(async (payload: LoginPayload) => {
    const auth = await authApi.login(payload);
    tokenStore.save(auth);
    setState({ user: auth.user, modules: auth.modules });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // The server may already consider the session gone; local state is what
      // matters, and it is cleared either way.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(() => {
    const { user, modules } = state;
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();

    return {
      user,
      modules,
      isAuthenticated: user !== null,
      displayName: fullName || user?.username || "Guest",
      initials:
        [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("").toUpperCase() ||
        user?.username?.slice(0, 2).toUpperCase() ||
        "?",
      login,
      logout,
      can: (module, action) => hasPermission(modules, module, action),
    };
  }, [state, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

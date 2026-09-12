import { STORAGE_KEYS } from "./config";
import type { AuthResponse, ModulePermission, UserResponse } from "./contracts/auth";

export type Session = {
  user: UserResponse;
  modules: ModulePermission[];
  expiry: number;
};

/**
 * Single owner of persisted credentials. The HTTP layer and the auth context
 * both read through here, so they can never disagree about what is stored.
 * Every access is guarded: storage throws in private mode and when site data
 * is blocked.
 */
function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // A session that only lives in memory is still a usable session.
  }
}

function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to do; the value is unreachable either way.
  }
}

export const tokenStore = {
  getAccess: () => read(STORAGE_KEYS.accessToken),
  getRefresh: () => read(STORAGE_KEYS.refreshToken),

  getSession(): Session | null {
    const raw = read(STORAGE_KEYS.session);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Session;
    } catch {
      remove(STORAGE_KEYS.session);
      return null;
    }
  },

  save(auth: AuthResponse) {
    write(STORAGE_KEYS.accessToken, auth.access);
    write(STORAGE_KEYS.refreshToken, auth.refresh);
    write(
      STORAGE_KEYS.session,
      JSON.stringify({ user: auth.user, modules: auth.modules, expiry: auth.expiry }),
    );
  },

  clear() {
    remove(STORAGE_KEYS.accessToken);
    remove(STORAGE_KEYS.refreshToken);
    remove(STORAGE_KEYS.session);
  },
};

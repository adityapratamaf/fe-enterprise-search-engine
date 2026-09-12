export type UserResponse = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isSuperUser: boolean;
};

export type ModulePermission = {
  moduleId: string;
  moduleName: string;
  modulePath: string;
  actions: string[];
};

/**
 * Mirror of `AuthResponse`. Note `access`/`refresh` — the previous client read
 * a non-existent `accessToken` field, so token refresh could never succeed.
 */
export type AuthResponse = {
  access: string;
  refresh: string;
  /** Unix epoch of access-token expiry, as sent by the backend. */
  expiry: number;
  user: UserResponse;
  modules: ModulePermission[];
};

export type LoginPayload = {
  email: string;
  password: string;
};

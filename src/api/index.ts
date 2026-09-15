import { API_CONFIG } from "./config";
import { authApi as liveAuthApi } from "./resources/auth";
import { spbuApi as liveSpbuApi } from "./resources/spbu";
import { authMockApi } from "./mock/auth";
import { spbuMockApi } from "./mock/spbu";

export { ApiError, isApiError, toApiError } from "./ApiError";
export { API_CONFIG } from "./config";
export { ENDPOINTS } from "./endpoints";
export { api, http, setUnauthorizedHandler } from "./http";
export { tokenStore, type Session } from "./tokenStore";
export { MOCK_SESSION } from "./mock/auth";
export type * from "./contracts/auth";
export type * from "./contracts/common";
export type * from "./contracts/spbu";
export { FACET_KEYS, SORT_FIELDS } from "./contracts/spbu";

/**
 * The rest of the app imports these two and never learns which implementation it
 * got. Both sides are checked against the same contract types, so flipping the
 * relevant env var is the only change needed to go live — independently for
 * auth and for SPBU search.
 */
export const spbuApi = API_CONFIG.useMockSpbu ? spbuMockApi : liveSpbuApi;
export const authApi = API_CONFIG.useMockAuth ? authMockApi : liveAuthApi;

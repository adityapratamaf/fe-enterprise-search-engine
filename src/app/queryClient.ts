import { QueryClient } from "@tanstack/react-query";
import { isApiError } from "@/api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /** Search results stay usable for a minute; paging back is then instant. */
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Auth, permission and validation failures will not fix themselves on a
        // retry, and the HTTP layer already handles the one legitimate 401 retry.
        if (isApiError(error) && (error.isUnauthorized || error.isForbidden)) return false;
        if (isApiError(error) && error.status === 400) return false;
        return failureCount < 2;
      },
    },
  },
});

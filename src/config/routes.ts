export const ROUTES = {
  search: "/search",
  analytics: "/analytics",
  benchmark: "/benchmark",
  about: "/about",
  login: "/login",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

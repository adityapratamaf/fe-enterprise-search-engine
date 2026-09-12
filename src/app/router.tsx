import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { AppProviders } from "./AppProviders";
import { RouteError } from "./RouteError";

/**
 * Nested routes: `MainLayout` is mounted once and persists across navigation,
 * instead of being repeated per route and remounted on every transition.
 * Pages load lazily so the initial bundle carries only the search screen.
 */
export const router = createBrowserRouter([
  {
    element: <AppProviders />,
    errorElement: <RouteError />,
    children: [
      {
        path: ROUTES.login,
        lazy: async () => ({ Component: (await import("@/features/auth/LoginPage")).LoginPage }),
      },
      {
        lazy: async () => ({
          Component: (await import("@/features/auth/RequireAuth")).RequireAuth,
        }),
        children: [
          {
            lazy: async () => ({
              Component: (await import("@/components/layout/MainLayout")).MainLayout,
            }),
            errorElement: <RouteError />,
            children: [
              {
                index: true,
                lazy: async () => ({
                  Component: (await import("@/features/search/SearchPage")).SearchPage,
                }),
              },
              {
                path: ROUTES.map,
                lazy: async () => ({
                  Component: (await import("@/features/misc/MapPage")).MapPage,
                }),
              },
              {
                path: ROUTES.benchmark,
                lazy: async () => ({
                  Component: (await import("@/features/misc/BenchmarkPage")).BenchmarkPage,
                }),
              },
              {
                path: ROUTES.analytics,
                lazy: async () => ({
                  Component: (await import("@/features/misc/AnalyticsPage")).AnalyticsPage,
                }),
              },
              {
                path: ROUTES.about,
                lazy: async () => ({
                  Component: (await import("@/features/misc/AboutPage")).AboutPage,
                }),
              },
            ],
          },
        ],
      },
      { path: "*", element: <Navigate to={ROUTES.search} replace /> },
    ],
  },
]);

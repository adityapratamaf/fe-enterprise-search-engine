import { createBrowserRouter, redirect, type RouteObject } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { AppProviders } from "./AppProviders";
import { RouteError } from "./RouteError";

/**
 * Nested routes: `MainLayout` is mounted once and persists across navigation,
 * instead of being repeated per route and remounted on every transition.
 * Pages load lazily so the initial bundle carries only the search screen.
 *
 * Semua halaman di bawah `MainLayout` diproteksi `RequireAuth`; sebaliknya
 * `/login` diproteksi `RedirectIfAuthenticated` supaya yang sudah masuk tidak
 * bisa kembali ke sana.
 *
 * Exported separately from the browser router so the same tree can be mounted in
 * a memory router by tests.
 */
export const routes: RouteObject[] = [
  {
    element: <AppProviders />,
    errorElement: <RouteError />,
    children: [
      /**
       * "/" is no longer a page of its own. Redirecting from a loader rather
       * than rendering `<Navigate>` means no component mounts just to bounce
       * straight back out.
       */
      { index: true, loader: () => redirect(ROUTES.search) },
      {
        lazy: async () => ({
          Component: (await import("@/features/auth/RedirectIfAuthenticated"))
            .RedirectIfAuthenticated,
        }),
        children: [
          {
            path: ROUTES.login,
            lazy: async () => ({
              Component: (await import("@/features/auth/LoginPage")).LoginPage,
            }),
          },
        ],
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
                path: ROUTES.search,
                lazy: async () => ({
                  Component: (await import("@/features/search/SearchPage")).SearchPage,
                }),
              },
              {
                path: ROUTES.map,
                lazy: async () => ({
                  Component: (await import("@/features/map/MapPage")).MapPage,
                }),
              },
              {
                path: ROUTES.benchmark,
                lazy: async () => ({
                  Component: (await import("@/features/benchmark/BenchmarkPage")).BenchmarkPage,
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
      { path: "*", loader: () => redirect(ROUTES.search) },
    ],
  },
];

export const router = createBrowserRouter(routes);

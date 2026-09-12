import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AppErrorBoundary } from "./components/shared/AppErrorBoundary";

/**
 * Composition root. Providers live inside the router (see `app/AppProviders`),
 * so all this owns is the router itself and a last-resort boundary for failures
 * that happen before any route can render.
 */
export default function App() {
  return (
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  );
}

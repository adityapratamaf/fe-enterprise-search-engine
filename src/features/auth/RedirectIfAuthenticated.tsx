import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/contexts/AuthContext";

/** Mirror of `RequireAuth`: keeps a logged-in user off the login screen. */
export function RedirectIfAuthenticated() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.search} replace />;
  }

  return <Outlet />;
}

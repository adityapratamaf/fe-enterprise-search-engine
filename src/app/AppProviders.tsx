import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { queryClient } from "./queryClient";

/**
 * Root route element, so providers live *inside* the router and can use router
 * hooks. Previously they wrapped `RouterProvider` and could not navigate.
 */
export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}

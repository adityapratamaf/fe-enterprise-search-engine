import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AppErrorBoundary } from "./components/shared/AppErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarContext";

function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <SidebarProvider>
          <RouterProvider router={router} />
        </SidebarProvider>
      </AuthProvider>
    </AppErrorBoundary>
  );
}

export default App;

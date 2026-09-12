import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "./index.css";
import { router } from "./app/router";
import { AppErrorBoundary } from "./components/shared/AppErrorBoundary";

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root is missing from index.html");

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    {/* Last resort only: route-level errors are handled by RouteError. */}
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  </React.StrictMode>,
);

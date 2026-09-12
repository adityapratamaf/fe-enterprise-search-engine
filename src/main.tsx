import React from "react";
import ReactDOM from "react-dom/client";
// Self-hosted Inter: a variable font covering weights 100-900 in one file, so
// there is no external CDN request and no fake-bold synthesis. Imported before
// index.css so the @font-face rules are registered before anything uses them.
import "@fontsource-variable/inter";
import "remixicon/fonts/remixicon.css";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root is missing from index.html");

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

import React from "react";
import ReactDOM from "react-dom/client";
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

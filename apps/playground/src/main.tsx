import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "@repo/ui/styles.css";
import "./styles.css";
import { App } from "./app";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

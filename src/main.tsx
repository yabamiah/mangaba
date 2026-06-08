import React from "react";
import ReactDOM from "react-dom/client";
import "@pequiplan/ui/styles";
import "./styles/app.css";
import "./i18n";
import { App } from "./app/App";
import { ToastProvider } from "./components/Toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);

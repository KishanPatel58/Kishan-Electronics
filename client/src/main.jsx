import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminProvider>   
      <App />
    </AdminProvider>
  </BrowserRouter>
);
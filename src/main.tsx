import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import 'lenis/dist/lenis.css';
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found!");
}

const root = createRoot(rootElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

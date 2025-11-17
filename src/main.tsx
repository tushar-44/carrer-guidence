import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import 'lenis/dist/lenis.css';
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found!");
}

// Scroll to top on page load/refresh
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

const root = createRoot(rootElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

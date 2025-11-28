import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import 'lenis/dist/lenis.css';
import "./index.css";
import App from "./App.tsx";
import { gsap } from 'gsap';

// Suppress GSAP warnings in development for missing targets
// This is safe because we handle null checks in our animation code
if (import.meta.env.DEV) {
  gsap.config({ nullTargetWarn: false });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found!");
}

// Scroll to top on page load/refresh
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

// Add error boundary
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const root = createRoot(rootElement);

try {
  root.render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </BrowserRouter>,
  );
} catch (error) {
  console.error('Error rendering app:', error);
  root.render(
    <div style={{ padding: '20px', color: 'white', background: '#1a1a1a', minHeight: '100vh' }}>
      <h1>Error Loading App</h1>
      <p>{String(error)}</p>
      <pre>{error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}</pre>
    </div>
  );
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import App from "./App";

// Manually set default theme on <html> tag
// This is required by theme-change to function properly on initial load
document.documentElement.setAttribute("data-theme", "light");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
     <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);

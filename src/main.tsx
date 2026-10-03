import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionPreferences } from "./components/motion/MotionPreferences";
import "./styles/fonts.css";
import App from "./App";
import "./styles/globals.css";
import "./styles/hero.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionPreferences>
      <App />
    </MotionPreferences>
  </StrictMode>,
);

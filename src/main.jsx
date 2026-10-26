import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import "./index.css";

const renderApp = () => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

const init = async () => {
  try {
    if (document.fonts) {
      await Promise.race([
        Promise.all([
          document.fonts.load("80px Blanka"),
          document.fonts.ready,
        ]),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
    }
  } catch (e) {
    // Ignore font loading errors and proceed
  }
  renderApp();
};

init();

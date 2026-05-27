import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initMoonbase } from "./lib/moonbase";
import { bindMoonbaseEvents } from "./lib/moonbase-state";

initMoonbase();
bindMoonbaseEvents();

createRoot(document.getElementById("root")!).render(<App />);

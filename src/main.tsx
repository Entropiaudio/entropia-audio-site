import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initMoonbase } from "./lib/moonbase";

initMoonbase();

createRoot(document.getElementById("root")!).render(<App />);

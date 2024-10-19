import { createRoot } from "react-dom/client";
import RouteControl from "./RouteControl/RouteControl";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <RouteControl />
  </BrowserRouter>
);

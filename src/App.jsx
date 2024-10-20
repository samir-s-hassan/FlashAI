import { createRoot } from "react-dom/client";
import RouteControl from "./RouteControl";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById("root")).render(
 <GoogleOAuthProvider clientId="952706422048-le31tg2306ledodpi2bhm02d9qvn2fu2.apps.googleusercontent.com">
   <BrowserRouter>
     <RouteControl />
   </BrowserRouter>
 </GoogleOAuthProvider>
);

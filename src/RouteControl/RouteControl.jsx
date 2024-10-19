import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage.jsx";
import GenerateFlashcardsPage from "../pages/GenerateFlashcardsPage.jsx";

const RouteControl = () => {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<GenerateFlashcardsPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
  );
};

export default RouteControl;

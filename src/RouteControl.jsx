import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ExtractNotesPage from "./pages/ExtractNotesPage";
import GenerateFlashcardsPage from "./pages/GenerateFlashcardsPage"

const RouteControl = () => {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<GenerateFlashcardsPage />} />
        <Route path="/xtract" element={<ExtractNotesPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
  );
};

export default RouteControl;

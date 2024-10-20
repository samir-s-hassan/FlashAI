import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ExtractNotesPage from "./pages/ExtractNotesPage";
import GenerateFlashcardsPage from "./pages/GenerateFlashcardsPage";
import Note2FlashcardsPage from "./pages/Note2FlashcardsPage";
import ViewCollectionsPage from "./pages/ViewCollectionsPage";
import StudyPage from "./pages/StudyPage";

const RouteControl = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/generate" element={<GenerateFlashcardsPage />} />
      <Route path="/extract" element={<ExtractNotesPage />} />
      <Route path="/study" element={<StudyPage />} />
      <Route path="/view" element={<ViewCollectionsPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default RouteControl;

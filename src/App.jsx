import { Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import GenerateFlashcardsPage from "./GenerateFlashcardsPage.jsx";

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<GenerateFlashcardsPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
  );
};

export default App;

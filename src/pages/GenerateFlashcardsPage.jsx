import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import FlashcardComponent from "../components/FlashcardComponent"; 
import RetreiveData from "../services/RetrieveData";

const GenerateFlashcardsPage = () => {
  const [inputText, setInputText] = useState("");
  const [clickedGenerate, setClickedGenerate] = useState(0);

  const promptSuggestions = [
    "Explain the key concepts of photosynthesis",
    "Summarize the main events of World War II",
    "List the fundamental principles of economics",
    "Describe the structure of a human cell",
    "Outline the plot of Shakespeare's Hamlet",
  ];

  return (
    <div className="scaled-container">
      <header className="header">
        <h1 className="app-name">FlashAI</h1>
      </header>

      <main className="container">
        <h2 className="hero-title">Generate Flashcards</h2>
        <p className="hero-description">
          <a href="#" className="text-link">
            View Existing Flashcards
          </a>
        </p>

        <div className="content-section">
          <textarea
            className="input-textarea"
            placeholder="Enter your learning material or choose a prompt suggestion below"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>

          <button
            onClick={() => setClickedGenerate((prev) => prev + 1)}
            className="btn btn-primary"
          >
            Generate Flashcards
          </button>

          <div>
            <h3 className="section-title">Prompt Suggestions:</h3>
            <div className="prompt-suggestions">
              {promptSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="prompt-btn"
                  onClick={() => setInputText(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
        {clickedGenerate > 0 && inputText !== "" && (
          <RetreiveData key={clickedGenerate} input={inputText} />
        )}
      </main>
    </div>
  );
};

export default GenerateFlashcardsPage;

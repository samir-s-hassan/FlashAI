import { useState } from "react";
import RetrieveData from "../services/RetrieveData";
import { Link } from "react-router-dom";

const GenerateFlashcardsPage = () => {
  const [inputText, setInputText] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState(""); // New state for file name
  const [clickedGenerate, setClickedGenerate] = useState(0);
  const [finalInput, setFinalInput] = useState(""); // New state to store the final input
  const [isDragging, setIsDragging] = useState(false); // For drag-and-drop visual

  const promptSuggestions = [
    "Explain the steps of the scientific method",
    "Summarize the main events of World War I",
    "List the fundamental principles of economics",
    "Describe the structure of a human cell",
    "Outline the plot of Romeo and Juliet",
  ];

  const handleGenerateClick = () => {
    if (inputText.trim() !== "" || fileContent.trim() !== "") {
      setFinalInput(inputText);
      setClickedGenerate((prev) => prev + 1);
    }
  };

  const handleFileUpload = (file) => {
    setFileName(file.name); // Set the file name to display
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content); // You can process content later for images/PDFs
      setInputText(""); // Clear input text when file is uploaded
    };
    reader.readAsText(file); // Keep as text for .txt files, otherwise handle different types below
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="scaled-container">
      <header className="header">
        <Link to="/" className="app-name">FlashAI</Link>
      </header>

      <main className="container">
        <h2 className="hero-title">Generate Flashcards</h2>
        <p className="hero-description">
          <Link to="/view" className="text-link">
            View Existing Flashcards
          </Link>
        </p>

        <div className="content-section">
          <textarea
            className="input-textarea"
            placeholder="Enter your learning material or choose a prompt suggestion below"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!!fileContent} // Disable text input when file is uploaded
          ></textarea>

          <div
            className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleFileDrop}
          >
            {fileName ? (
              <p>File uploaded: {fileName}</p> // Display the file name
            ) : (
              <p>Drag and drop a file here, or click to select one</p>
            )}
            <input
              type="file"
              className="file-input"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </div>

          <button
            onClick={handleGenerateClick}
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
        {clickedGenerate > 0 && (finalInput !== "" || fileContent !== "") && (
          <RetrieveData 
            key={clickedGenerate} 
            input={finalInput} 
            fileContent={fileContent}
          />
        )}
      </main>
    </div>
  );
};

export default GenerateFlashcardsPage;

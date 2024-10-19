import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "../index.css";

const ExtractNotesPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedText, setExtractedText] = useState(""); // Store the extracted text
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setError(null);
      setExtractedText(""); // Clear any previous extracted text
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select or drop a file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setExtractedText("");

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("userFunction", "extractText");  // Adding user function to FormData

    try {
      // Send the image and userFunction to your backend
      const uploadResponse = await fetch(
        "https://igojsrmb51.execute-api.us-west-2.amazonaws.com/dev",
        {
          method: "POST",
          body: formData,  // Include the image and userFunction in form data
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed or extraction failed.");
      }

      // Handle the returned text response
      const data = await uploadResponse.json(); // Assuming the response is JSON
      setExtractedText(data.extractedText); // Assuming `extractedText` is returned from the backend

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const downloadExtractedText = () => {
    // Create a downloadable file for the extracted text
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted_text.txt"; // You can change this to a .docx if needed
    a.click();
  };

  return (
    <div className="scaled-container">
      <header className="header">
        <h1 className="app-name">FlashAI</h1>
      </header>

      <main className="container">
        <h2 className="hero-title">Extract Notes from Images</h2>

        <div className="content-section">
          <form onSubmit={handleSubmit} className="file-upload-form">
            <div
              {...getRootProps({
                className: `dropzone ${isDragActive ? "active" : ""}`,
              })}
              style={{
                border: "2px dashed #ccc",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragActive ? "#f0f8ff" : "#fafafa",
                transition: "background-color 0.3s ease",
                marginBottom: "20px",
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here...</p>
              ) : selectedFile ? (
                <p>File selected: {selectedFile.name}</p> // Display selected file name
              ) : (
                <p>
                  Drag 'n' drop an image here, or click here to select a file
                  (JPG, PNG, etc.)
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className={`btn btn-primary ${
                isUploading || !selectedFile ? "disabled" : ""
              }`}
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}

          {/* Display extracted text */}
          {extractedText && (
            <div className="extracted-text-container">
              <h3>Extracted Text:</h3>
              <textarea
                className="extracted-text-area"
                value={extractedText}
                readOnly
              ></textarea>

              <button onClick={downloadExtractedText} className="btn btn-secondary">
                Download Extracted Text
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExtractNotesPage;

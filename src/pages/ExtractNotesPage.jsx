import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "../index.css";

const ExtractNotesPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setError(null);
      setDownloadUrl(null);
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
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // First, upload the image
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      // Then, request the processed document
      const downloadResponse = await fetch("/api/process", {
        method: "GET",
      });

      if (!downloadResponse.ok) {
        throw new Error("Failed to process the image");
      }

      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="scaled-container">
      <header className="header">
        <h1 className="app-name">FlashAI</h1>
      </header>

      <main className="container">
        <h2 className="hero-title">Extract Notes from Images</h2>
        <p className="hero-description">
          <a href="#" className="text-link">
            View Extracted Notes
          </a>
        </p>

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
                marginBottom: "20px", // Add space below the dropzone
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here...</p>
              ) : (
                <p>
                  Drag 'n' drop an image here, or click here to select a file (JPG, PNG, etc.)
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
          {downloadUrl && (
            <div className="download-container">
              <a
                href={downloadUrl}
                download="extracted_text.docx"
                className="download-link"
              >
                Download Extracted Text (.docx)
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExtractNotesPage;

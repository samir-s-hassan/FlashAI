import React, { useState } from "react";
import "./ExtractNotesPage.css";

const ExtractNotes = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null);
      setDownloadUrl(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload.");
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
    <div className="file-upload-container">
      <div className="file-upload-card">
        <h2 className="file-upload-title">Image Upload and Text Extraction</h2>
        <form onSubmit={handleSubmit} className="file-upload-form">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="file-input"
            />
          </div>
          <button
            type="submit"
            disabled={isUploading || !selectedFile}
            className={`submit-button ${
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
              Download Text (.docx)
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtractNotes;

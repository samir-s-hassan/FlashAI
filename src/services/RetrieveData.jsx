/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

// Custom base64 encoding function that handles Unicode characters
function utf8_to_b64(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

export default function RetrieveData({ input, fileContent }) {
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const flashcardsRef = useRef(null);
  const [flashcards, setFlashcards] = useState([]);
  const [generationCount, setGenerationCount] = useState(1);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({ question: "", answer: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const apiUrl = "https://igojsrmb51.execute-api.us-west-2.amazonaws.com/dev";
      const payload = fileContent 
        ? { fileContent: utf8_to_b64(fileContent) }
        : { userTopic: input };
      
      console.log("Sending payload:", payload);
      
      const { data: response } = await axios.post(apiUrl, payload);
      
      if (response.flashcards && typeof response.flashcards === 'string') {
        const filteredData = response.flashcards.split('\n\n').slice(1);
        const formattedFlashcards = filteredData.map(card => {
          const [question, answer] = card.replace(/^\d+\.\s*/, "").replace("Q:", "").replace("A:", "").split('\n');
          return {
            id: uuidv4(),
            question: question?.trim() || "No Question",
            answer: answer?.trim() || "No Answer"
          };
        });
        setFlashcards(prevCards => [...prevCards, ...formattedFlashcards]);
      } else {
        console.error("Invalid response format:", response);
      }
      
      setLoading(false);
      flashcardsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error("Error details:", error.response?.data);
      console.error("Full error object:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [input, fileContent, generationCount]);

  const handleCardClick = (index) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleEditCard = (id, updatedCard) => {
    setFlashcards(cards => cards.map(card => 
      card.id === id ? { ...card, ...updatedCard } : card
    ));
  };

  const handleDeleteCard = (id) => {
    setFlashcards(cards => cards.filter(card => card.id !== id));
  };

  const handleAddCard = () => {
    setIsAddingCard(true);
  };

  const handleSaveNewCard = () => {
    if (newCard.question.trim() && newCard.answer.trim()) {
      setFlashcards(cards => [...cards, { ...newCard, id: uuidv4() }]);
      setNewCard({ question: "", answer: "" });
      setIsAddingCard(false);
    }
  };

  const handleSaveCollection = () => {
    if (flashcards.length === 0) {
      console.log("No flashcards to save");
      return;
    }
  
    setIsSaving(true);
    setSaveError(null);
  
    try {
      const collectionId = Date.now().toString(); // Generate a unique ID
      const collectionName = input || "Generated Collection"; // Use input or default name
      const collection = {
        id: collectionId,
        topic: collectionName,
        flashcards: flashcards,
        createdAt: new Date().toISOString()
      };
  
      // Get existing collections from local storage
      const existingCollections = JSON.parse(localStorage.getItem('flashcardCollections')) || [];
  
      // Add new collection
      existingCollections.push(collection);
  
      // Save updated collections to local storage
      localStorage.setItem('flashcardCollections', JSON.stringify(existingCollections));
  
      // Show an alert when the collection is successfully saved
      window.alert(`Collection "${collectionName}" has been saved successfully!`);
  
      console.log("Collection saved successfully:", collectionId);
    } catch (error) {
      console.error("Error saving collection:", error);
      setSaveError("Failed to save collection. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleGenerateMore = () => {
    setGenerationCount(prev => prev + 1);
  };

  return (
    <div className="flashcard-section-custom">
      <div className="flashcard-header-custom">
        <h2>Flashcards Preview</h2>
        <button className="flashcard-action-button" onClick={handleGenerateMore}>
          Generate More
        </button>
      </div>
      
      {flashcards.length > 0 && (
        <div className="existing-flashcards">
          <div className="flashcard-grid-custom" ref={flashcardsRef}>
            {flashcards.map((flashcard, index) => (
              <FlashcardItem
                key={flashcard.id}
                flashcard={flashcard}
                isFlipped={flippedCards[index]}
                onFlip={() => handleCardClick(index)}
                onEdit={handleEditCard}
                onDelete={handleDeleteCard}
              />
            ))}
          </div>
        </div>
      )}
      
      {loading && (
        <div className="new-flashcards-loading">
          <h3>Generating New Flashcards...</h3>
          <div className="loading-grid">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="loading-card"></div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flashcard-actions-container">
        <button className="flashcard-action-button" onClick={handleAddCard}>
          Add New Flashcard
        </button>
        <button 
          className="flashcard-action-button" 
          onClick={handleSaveCollection}
          disabled={isSaving || flashcards.length === 0}
        >
          {isSaving ? "Saving..." : "Save Collection"}
        </button>
      </div>

      {isAddingCard && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Flashcard</h2>
            <input
              value={newCard.question}
              onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
              placeholder="Question"
            />
            <input
              value={newCard.answer}
              onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
              placeholder="Answer"
            />
            <div className="modal-actions">
              <button onClick={handleSaveNewCard}>Save</button>
              <button onClick={() => setIsAddingCard(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {saveError && <p className="error-message">{saveError}</p>}
    </div>
  );
}

function FlashcardItem({ flashcard, isFlipped, onFlip, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState(flashcard);

  const handleSave = () => {
    onEdit(flashcard.id, editedCard);
    setIsEditing(false);
  };

  return (
    <>
      <div className={`flashcard-custom ${isFlipped ? 'flipped' : ''}`} onClick={onFlip}>
        <div className="flashcard-content-custom">
          <div className="front">{flashcard.question}</div>
          <div className="back">{flashcard.answer}</div>
        </div>
        <div className="flashcard-actions">
          <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>Edit</button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(flashcard.id); }}>Delete</button>
        </div>
      </div>
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Flashcard</h2>
            <input
              value={editedCard.question}
              onChange={(e) => setEditedCard({ ...editedCard, question: e.target.value })}
              placeholder="Question"
            />
            <input
              value={editedCard.answer}
              onChange={(e) => setEditedCard({ ...editedCard, answer: e.target.value })}
              placeholder="Answer"
            />
            <div className="modal-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

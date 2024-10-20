import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const StudyPage = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    const storedCollections = JSON.parse(localStorage.getItem('flashcardCollections')) || [];
    setCollections(storedCollections);
  }, []);

  const handleCollectionSelect = (collection) => {
    setSelectedCollection(collection);
    setFlippedCards({});
  };

  const handleCardFlip = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Function to send flashcards (only question and answer) to a blank URL
  const sendFlashcardsToBackend = async () => {
    const url = "https://t6yofgmc52.execute-api.us-west-2.amazonaws.com/dev/flashAIquestionanswerNEW"; // Replace with actual URL

    if (selectedCollection) {
      const flashcardsArray = selectedCollection.flashcards.map(card => ({
        question: card.question,
        answer: card.answer
      }));

      // Log the flashcards array to see what's being sent
      console.log("Sending flashcards to backend:", flashcardsArray);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ flashcards: flashcardsArray }),
        });

        if (response.ok) {
          console.log("Flashcards sent successfully!");
        } else {
          console.error("Failed to send flashcards");
        }
      } catch (error) {
        console.error("Error sending flashcards:", error);
      }
    }
  };

  return (
    <div className="collections-page">
      <h1 className="hero-title">Your Flashcard Collections</h1>

      {collections.length === 0 ? (
        <div className="no-collections-message">
          <p>No collections found. Please create a collection to start studying.</p>
          <Link to="/generate" className="btn btn-primary">Create New Collection</Link>
        </div>
      ) : (
        <div>
          <div className="collections-list">
            {collections.map(collection => (
              <button
                key={collection.id}
                className="collection-button"
                onClick={() => handleCollectionSelect(collection)}
              >
                {collection.topic}
              </button>
            ))}
          </div>

          {selectedCollection ? (
            <div className="selected-collection">
              <h2>{selectedCollection.topic}</h2>
              <div className="flashcard-grid-custom">
                {selectedCollection.flashcards.map(card => (
                  <div
                    key={card.id}
                    className={`flashcard-custom ${flippedCards[card.id] ? 'flipped' : ''}`}
                    onClick={() => handleCardFlip(card.id)}
                  >
                    <div className="flashcard-content-custom">
                      <div className="front">
                        <p>{card.question}</p>
                      </div>
                      <div className="back">
                        <p>{card.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Please select a collection to study.</p>
          )}
        </div>
      )}

      <div className="button-container">
        {selectedCollection && (
          <button onClick={sendFlashcardsToBackend} className="btn btn-secondary">
            Generate Questions
          </button>
        )}
      </div>
    </div>
  );
};

export default StudyPage;

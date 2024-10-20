import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ViewCollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedCollections =
      JSON.parse(localStorage.getItem("flashcardCollections")) || [];
    setCollections(storedCollections);
  }, []);

  const handleCollectionSelect = (collection) => {
    setSelectedCollection(collection);
    setFlippedCards({});
  };

  const handleCardFlip = (id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTestMode = () => {
    if (selectedCollection) {
      navigate("/test", { state: { collection: selectedCollection } });
    }
  };

  return (
    <div className="collections-page">
      <h1 className="hero-title">Your Flashcard Collections</h1>
      <div className="collections-list">
        {collections.map((collection) => (
          <button
            key={collection.id}
            className="collection-button"
            onClick={() => handleCollectionSelect(collection)}
          >
            {collection.topic}
          </button>
        ))}
      </div>
      {selectedCollection && (
        <div className="selected-collection">
          <h2>{selectedCollection.topic}</h2>
          <div className="flashcard-grid-custom">
            {selectedCollection.flashcards.map((card) => (
              <div
                key={card.id}
                className={`flashcard-custom ${
                  flippedCards[card.id] ? "flipped" : ""
                }`}
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
          <div className="flashcard-actions-container">
            <button
              className="flashcard-action-button"
              onClick={handleTestMode}
            >
              Test Mode
            </button>
          </div>
        </div>
      )}
      <div className="button-container">
        <div className="button-wrapper">
          <Link to="/generate" className="btn btn-primary">
            Create New Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewCollectionsPage;

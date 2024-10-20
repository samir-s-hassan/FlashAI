import { useEffect, useState, useRef } from "react";
import axios from "axios";

// Custom base64 encoding function that handles Unicode characters
function utf8_to_b64(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

export default function RetreiveData({ input, fileContent }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState({});
  const flashcardsRef = useRef(null);

  useEffect(() => {
    const apiUrl = "https://igojsrmb51.execute-api.us-west-2.amazonaws.com/dev";
    const fetchData = async () => {
      setLoading(true);
      try {
        const payload = fileContent 
          ? { fileContent: utf8_to_b64(fileContent) }
          : { userTopic: input };
        
        console.log("Sending payload:", payload);
        
        const { data: response } = await axios.post(apiUrl, payload);
        
        if (response.flashcards && typeof response.flashcards === 'string') {
          const filteredData = response.flashcards.split('\n\n').slice(1);
          setData(filteredData);
        } else {
          console.error("Invalid response format:", response);
          setData([]);
        }
        
        setLoading(false);
        flashcardsRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error("Error details:", error.response?.data);
        console.error("Full error object:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [input, fileContent]);

  const handleCardClick = (index) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="flashcard-section-custom">
      {loading ? (
        <div className="loading">
          <h2 className="loading-title">Generating Flashcards...</h2>
          <div className="loading-grid">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="loading-card"></div>
            ))}
          </div>
        </div>
      ) : data && (
        <>
          <h2 className="flashcard-header-custom">Flashcards Preview</h2>
          <div className="flashcard-grid-custom" ref={flashcardsRef}>
            {data.map((flashcard, index) => {
              const [question, answer] = flashcard.replace("Q:", "").replace("A:", "").split('\n');
              const isFlipped = flippedCards[index];
              
              return (
                <div 
                  key={index} 
                  className={`flashcard-custom ${isFlipped ? 'flipped' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="flashcard-content-custom">
                    <div className="front">{question?.trim() || "No Question"}</div>
                    <div className="back">{answer?.trim() || "No Answer"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
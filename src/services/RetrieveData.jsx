import { useEffect, useState, useRef } from "react";
import axios from "axios";

const RetreiveData = ({ input }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState({});  // Track flipped state for each card
  const flashcardsRef = useRef(null);  // Ref to the flashcards section

  useEffect(() => {
    const apiUrl = "https://igojsrmb51.execute-api.us-west-2.amazonaws.com/dev";
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.post(apiUrl, {
          userTopic: input  // Pass 'userTopic' in the body for the POST request
        });
        // Filter out the first instruction card
        const filteredData = response.flashcards.split('\n\n').slice(1);
        setData(filteredData);  // Handle the response
        setLoading(false);
        
        // Scroll down to the flashcards after loading
        flashcardsRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [input]);

  const handleCardClick = (index) => {
    // Toggle the flipped state of the card
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="flashcard-section-custom">
      {loading && (
        <div className="loading">
          <div className="spinner">
            <div className="dot1"></div>
            <div className="dot2"></div>
            <div className="dot3"></div>
            <div className="dot4"></div>
            <div className="dot5"></div>
          </div>
        </div>
      )}
      {!loading && data && (
        <>
          <h2 className="flashcard-header-custom">Flashcards Preview</h2>
          <div className="flashcard-grid-custom" ref={flashcardsRef}>
            {data.map((flashcard, index) => {
              // Remove the "Q: " and "A: " parts by splitting and trimming
              const [question, answer] = flashcard.replace("Q:", "").replace("A:", "").split('\n'); 
              const isFlipped = flippedCards[index]; // Check if the card is flipped
              
              return (
                <div 
                  key={index} 
                  className={`flashcard-custom ${isFlipped ? 'flipped' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="flashcard-content-custom">
                    <div className="front">{question.trim()}</div>
                    <div className="back">{answer.trim()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default RetreiveData;

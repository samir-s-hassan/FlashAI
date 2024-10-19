import { useEffect, useState } from "react";
import axios from "axios";

const RetreiveData = ({ input }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState({});  // Track flipped state for each card

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
      {loading && <div className="loading">Loading...</div>}
      {!loading && data && (
        <>
          <h2 className="flashcard-header-custom">Flashcards Preview</h2>
          <div className="flashcard-grid-custom">
            {data.map((flashcard, index) => {
              const [question, answer] = flashcard.split('\n'); // Separate question and answer
              const isFlipped = flippedCards[index]; // Check if the card is flipped
              
              return (
                <div 
                  key={index} 
                  className={`flashcard-custom ${isFlipped ? 'flipped' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="flashcard-content-custom">
                    <div className="front">{question}</div>
                    <div className="back">{answer}</div>
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

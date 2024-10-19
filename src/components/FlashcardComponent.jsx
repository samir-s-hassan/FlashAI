import { useState, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
function FlashcardComponent({ input }) {
  const [flashcards, setFlashcards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);

  useEffect(() => {
    // Simulating API call with the mock data
    const mockData = [
      { question: "What is the capital of France?", answer: "Paris" },
      { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
      { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
      { question: "What is the chemical symbol for water?", answer: "H2O" },
      { question: "What is the process by which plants make food called?", answer: "Photosynthesis" },
      { question: "Who is the current President of the United States?", answer: "Joe Biden" },
      { question: "What is the square root of 64?", answer: "8" },
      { question: "What is the fastest land animal?", answer: "Cheetah" },
      { question: "Which element has the atomic number 1?", answer: "Hydrogen" },
      { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
      { question: "What is the largest ocean on Earth?", answer: "Pacific Ocean" },
      { question: "What is the currency of Japan?", answer: "Yen" },
      { question: "Who developed the theory of relativity?", answer: "Albert Einstein" },
      { question: "What is the main ingredient in guacamole?", answer: "Avocado" },
      { question: "Which planet is known as the Red Planet?", answer: "Mars" },
      { question: "What is the smallest prime number?", answer: "2" },
      { question: "What is the longest river in the world?", answer: "The Nile" },
      { question: "In which year did World War I begin?", answer: "1914" },
      { question: "What is the powerhouse of the cell?", answer: "Mitochondria" },
      { question: "Who is known as the father of computers?", answer: "Charles Babbage" },
    ];

    setFlashcards(mockData);
    setRevealedCards(new Array(mockData.length).fill(false));
  }, [input]);

  const toggleCard = (index) => {
    setRevealedCards((prev) => {
      const newRevealed = [...prev];
      newRevealed[index] = !newRevealed[index];
      return newRevealed;
    });
  };

  if (flashcards.length === 0) {
    return <div>Loading flashcards...</div>;
  }

  return (
    <div className="flashcard-section-custom">
      <h3 className="flashcard-header-custom">Total number of flashcards generated: {flashcards.length}</h3>
      <div className="flashcard-grid-custom">
        {flashcards.map((card, index) => (
          <div
            key={index}
            className={`flashcard-custom ${revealedCards[index] ? 'revealed' : ''}`}
            onClick={() => toggleCard(index)}
          >
            <div className="flashcard-content-custom">
              {revealedCards[index] ? (
                <p className="answer-custom">{card.answer}</p>
              ) : (
                <p className="question-custom">{card.question}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlashcardComponent;

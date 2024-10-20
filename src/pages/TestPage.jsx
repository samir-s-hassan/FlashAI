import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Levenshtein distance function
function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Function to calculate similarity percentage
function calculateSimilarity(str1, str2) {
  const maxLength = Math.max(str1.length, str2.length);
  const distance = levenshteinDistance(str1, str2);
  return ((maxLength - distance) / maxLength) * 100;
}

const TestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [similarity, setSimilarity] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [testCompleted, setTestCompleted] = useState(false);

  useEffect(() => {
    if (location.state && location.state.collection) {
      setCollection(location.state.collection);
    } else {
      navigate('/view');
    }
  }, [location, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctAnswer = collection.flashcards[currentCardIndex].answer.toLowerCase().trim();
    const userAnswerTrimmed = userAnswer.toLowerCase().trim();
    const similarityScore = calculateSimilarity(correctAnswer, userAnswerTrimmed);
    setSimilarity(similarityScore);
    const isAnswerCorrect = similarityScore >= 63;
    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);

    // Store user's answer and correctness
    setUserAnswers([...userAnswers, { 
      question: collection.flashcards[currentCardIndex].question,
      userAnswer: userAnswerTrimmed,
      correctAnswer,
      isCorrect: isAnswerCorrect,
      similarity: similarityScore
    }]);
  };

  const handleNextCard = () => {
    if (currentCardIndex < collection.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      resetCardState();
    } else {
      setTestCompleted(true);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      resetCardState();
    }
  };

  const resetCardState = () => {
    setShowAnswer(false);
    setUserAnswer('');
    setIsCorrect(null);
    setSimilarity(null);
  };

  const restartTest = () => {
    setCurrentCardIndex(0);
    setUserAnswers([]);
    setTestCompleted(false);
    resetCardState();
  };

  if (!collection) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (testCompleted) {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const totalQuestions = collection.flashcards.length;
    const score = (correctAnswers / totalQuestions) * 100;

    return (
      <div style={styles.testPage}>
        <h1 style={styles.title}>Test Results</h1>
        <div style={styles.resultsSummary}>
          <h2>Your Score: {score.toFixed(2)}%</h2>
          <p>Correct Answers: {correctAnswers} out of {totalQuestions}</p>
        </div>
        <div style={styles.answerReview}>
          <h3>Answer Review:</h3>
          {userAnswers.map((answer, index) => (
            <div key={index} style={styles.reviewItem}>
              <p><strong>Question:</strong> {answer.question}</p>
              <p><strong>Your Answer:</strong> {answer.userAnswer}</p>
              <p><strong>Correct Answer:</strong> {answer.correctAnswer}</p>
              <p style={answer.isCorrect ? styles.correct : styles.incorrect}>
                {answer.isCorrect ? 'Correct' : 'Incorrect'} (Similarity: {answer.similarity.toFixed(2)}%)
              </p>
            </div>
          ))}
        </div>
        <div style={styles.actionButtons}>
          <button onClick={restartTest} style={styles.restartButton}>Retake Test</button>
          <button onClick={() => navigate('/view')} style={styles.backButton}>Back to Collections</button>
        </div>
      </div>
    );
  }

  const currentCard = collection.flashcards[currentCardIndex];

  return (
    <div style={styles.testPage}>
      <h1 style={styles.title}>{collection.topic} - Test Mode</h1>
      <div style={styles.progressBar}>
        <div style={{...styles.progressFill, width: `${((currentCardIndex + 1) / collection.flashcards.length) * 100}%`}}></div>
      </div>
      <div style={styles.cardNumber}>
        {currentCardIndex + 1} of {collection.flashcards.length}
      </div>
      <div style={styles.flashcardTest}>
        <h2 style={styles.questionTitle}>Definition</h2>
        <p style={styles.questionText}>{currentCard.question}</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Your answer
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              style={styles.input}
              placeholder="Type the answer"
              disabled={showAnswer}
            />
          </label>
          {!showAnswer && (
            <button type="submit" style={styles.submitButton}>
              Submit
            </button>
          )}
        </form>
        {showAnswer && (
          <div style={styles.answerSection}>
            <h3 style={styles.answerTitle}>Correct Answer:</h3>
            <p style={styles.answerText}>{currentCard.answer}</p>
            {isCorrect !== null && (
              <div style={isCorrect ? styles.correct : styles.incorrect}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
                <p>Similarity: {similarity.toFixed(2)}%</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div style={styles.navigationButtons}>
        <button onClick={handlePreviousCard} disabled={currentCardIndex === 0} style={styles.navButton}>
          Previous
        </button>
        <button
          onClick={handleNextCard}
          style={styles.navButton}
        >
          {currentCardIndex === collection.flashcards.length - 1 ? 'Finish Test' : 'Next'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  testPage: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  progressBar: {
    width: '100%',
    height: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: '10px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.3s ease-in-out',
  },
  cardNumber: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '18px',
    color: '#666',
  },
  flashcardTest: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  questionTitle: {
    fontSize: '24px',
    marginBottom: '10px',
    color: '#333',
  },
  questionText: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#444',
  },
  form: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    color: '#666',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginTop: '5px',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  answerSection: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  answerTitle: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#333',
  },
  answerText: {
    fontSize: '16px',
    color: '#444',
  },
  correct: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  incorrect: {
    color: '#f44336',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  navButton: {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ccc',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    alignSelf: 'center',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '24px',
    color: '#666',
  },
  resultsSummary: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  answerReview: {
    marginBottom: '20px',
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  restartButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default TestPage;

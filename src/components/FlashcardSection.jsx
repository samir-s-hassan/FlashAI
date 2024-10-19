// src/components/FlashcardSection.tsx
import { motion } from "framer-motion";

const FlashcardSection = () => {
  const fadeInWithDelay = (delay) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 2, delay },
  });

  return (
    <motion.section className="flashcard-section" {...fadeInWithDelay(0.9)}>
      <div className="container flashcard-container">
        <div className="flashcard">
          <h3 className="flashcard-title">Time-Saving</h3>
          <p className="flashcard-description">
            Generate flashcards in seconds, not hours.
          </p>
        </div>
        <div className="flashcard">
          <h3 className="flashcard-title">AI-Powered Content</h3>
          <p className="flashcard-description">
            Leverage AI for optimal, curated content.
          </p>
        </div>
        <div className="flashcard">
          <h3 className="flashcard-title">Flexible Learning</h3>
          <p className="flashcard-description">
            Learn anytime, anywhere with a mobile-friendly interface.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default FlashcardSection;

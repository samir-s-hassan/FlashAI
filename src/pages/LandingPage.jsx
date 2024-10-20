import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PricingSection from "../components/PricingSection";
import FlashcardSection from "../components/FlashcardSection";
import { Link } from "react-router-dom";
import "../index.css"

const images = ["/ai-3.webp", "/ai-4.png", "/ai-5.png", "/ai-6.png"];

const LandingPage = () => {
  // eslint-disable-next-line no-unused-vars
  const [scrollY, setScrollY] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 2 },
  };

  const fadeInWithDelay = (delay) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 2, delay },
  });

  return (
    <div className="landing-page">
      <motion.header className="header" {...fadeInWithDelay(0.1)}>
        <div className="container">
          <h1 className="app-name">FlashAI</h1>
        </div>
      </motion.header>

      <main>
        <motion.section className="hero" {...fadeInWithDelay(0.3)}>
          <div className="container text-center">
            <motion.h2
              className="hero-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
            >
              AI Superpowers for your Learning
            </motion.h2>
            <motion.p className="hero-description" {...fadeIn}>
              Create personalized AI-powered flashcards in seconds. Boost your
              study efficiency and retain information like never before.
            </motion.p>
            <motion.div {...fadeIn} className="button-container">
              <div className="button-wrapper">
                <Link to="/generate" className="btn btn-primary">
                  Generate Flashcards
                </Link>
              </div>
            </motion.div>{" "}
          </div>
        </motion.section>

        {/* New Rotating Image Panel */}
        <motion.section className="rotating-images" {...fadeInWithDelay(0.6)}>
          <div className="image-panel">
            <img
              src={images[currentImageIndex]}
              alt="AI learning example"
              className="rotating-image"
            />
          </div>
        </motion.section>

        {/* First Feature Section */}
        <motion.section
          className="feature-section feature-left"
          {...fadeInWithDelay(0.9)}
        >
          <div className="feature-container">
            <div className="feature-image">
              <img
                src="/ai-based-learning.jpg"
                alt="AI-powered flashcard generation"
              />
            </div>
            <div className="feature-text">
              <h3 className="feature-highlight gold">Ensuring Accuracy</h3>
              <p className="feature-subtext">
                Using AI for reliable information
              </p>
            </div>
          </div>
        </motion.section>

        {/* Second Feature Section */}
        <motion.section
          className="feature-section feature-right"
          {...fadeInWithDelay(1)}
        >
          <div className="feature-container">
            <div className="feature-text">
              <h3 className="feature-highlight gold">Personalized Learning</h3>
              <p className="feature-subtext">
                Tailored flashcards for better retention
              </p>
            </div>
            <div className="feature-image">
              <img
                src="/ai-learning.webp"
                alt="Personalized study experience"
              />
            </div>
          </div>
        </motion.section>
        {/* Flashcards Section */}
        <motion.section className="flashcard-section" {...fadeInWithDelay(0.9)}>
          <FlashcardSection />
        </motion.section>
        <motion.section>
          <PricingSection />
        </motion.section>
      </main>
    </div>
  );
};

export default LandingPage;

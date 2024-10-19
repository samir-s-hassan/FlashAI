import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa"; // Import check and cross icons

const PricingSection = () => {
  const fadeInWithDelay = (delay) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 2, delay },
  });

  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        { feature: "100 AI-generated flashcards per month", included: true },
        { feature: "Basic customization options", included: true },
        { feature: "Web access only", included: true },
        { feature: "Progress tracking", included: false },
        { feature: "Mobile access", included: false },
      ],
    },
    {
      name: "Plus",
      price: "$9.99",
      features: [
        { feature: "Unlimited AI-generated flashcards", included: true },
        { feature: "Advanced customization options", included: true },
        { feature: "Web and mobile access", included: true },
        { feature: "Progress tracking", included: true },
        { feature: "Collaborative flashcard creation", included: false },
      ],
    },
    {
      name: "Premium",
      price: "19.99",
      features: [
        { feature: "Everything in Plus", included: true },
        { feature: "Priority AI processing", included: true },
        { feature: "Collaborative flashcard creation", included: true },
        { feature: "Advanced analytics and insights", included: true },
      ],
    },
  ];

  return (
    <motion.section className="pricing-section" {...fadeInWithDelay(1.2)}>
      <div className="container">
        <h2 className="pricing-title">Choose Your Plan</h2>
        <div className="pricing-container">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="pricing-card"
              {...fadeInWithDelay(1.2 + index * 0.2)}
            >
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-price">
                {plan.price}
                <span>{plan.price == "Free" ? "" : "/month"}</span>
              </p>
              <ul className="plan-features">
                {plan.features.map((featureObj, featureIndex) => (
                  <li key={featureIndex} className="feature-item">
                    {featureObj.included ? (
                      <span className="feature-check">
                        <FaCheck /> {featureObj.feature}
                      </span>
                    ) : (
                      <span className="feature-cross">
                        <FaTimes /> {featureObj.feature}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary">Choose {plan.name}</button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default PricingSection;

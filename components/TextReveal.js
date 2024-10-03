// componenets/TextReveal.js
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const TextReveal = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
  }, []);

  const wordVariant = {
    hidden: { y: "100%" },
    visible: (i) => ({
      y: 0,
      transition: {
        delay: i * 0.005,  // Cascade effect for each word
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const words = text.split(" ");  // Split text into words

  return (
    <div ref={ref} style={{ display: 'inline' }}>
      {words.map((word, index) => (
        <div className="text-reveal-container" key={index}>
          <motion.span
            custom={index}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={wordVariant}
            className="text-reveal-word"
          >
            {word}&nbsp;
          </motion.span>
        </div>
      ))}
    </div>
  );
};

export default TextReveal;

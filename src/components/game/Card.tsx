
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CardType } from "@/types/game";

interface CardProps {
  card: CardType;
  onFlip: (id: number) => void;
  isDisabled: boolean;
}

export const Card = ({ card, onFlip, isDisabled }: CardProps) => {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleClick = () => {
    if (!isDisabled && !card.isFlipped && !card.isMatched) {
      setIsFlipping(true);
      onFlip(card.id);
    }
  };

  useEffect(() => {
    if (isFlipping) {
      const timer = setTimeout(() => setIsFlipping(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isFlipping]);

  return (
    <motion.div
      className={`relative w-20 h-28 cursor-pointer perspective-1000 ${
        isDisabled ? "pointer-events-none" : ""
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <div
        className={`absolute w-full h-full transition-transform duration-600 transform-style-3d ${
          (card.isFlipped || card.isMatched) ? "rotate-y-180" : ""
        } ${isFlipping ? "animate-card-flip" : ""}`}
      >
        <div className="absolute w-full h-full backface-hidden bg-game-purple rounded-lg shadow-lg border-2 border-white flex items-center justify-center">
          <span className="text-3xl">?</span>
        </div>
        <div 
          className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg shadow-lg overflow-hidden"
          style={{ backgroundColor: card.image }}
        >
        </div>
      </div>
    </motion.div>
  );
};

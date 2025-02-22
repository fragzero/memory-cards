
import { useState, useEffect } from "react";
import { Card } from "./Card";
import { CardType, GameState } from "@/types/game";
import { Timer } from "./Timer";
import { Trophy, Timer as TimerIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const INITIAL_TIME = 60;

const cardColors = [
  "#9b87f5", // Primary Purple
  "#7E69AB", // Secondary Purple
  "#6E59A5", // Tertiary Purple
  "#D6BCFA", // Light Purple
  "#F2FCE2", // Soft Green
  "#FEF7CD", // Soft Yellow
  "#FEC6A1", // Soft Orange
  "#FFDEE2", // Soft Pink
  "#FDE1D3", // Soft Peach
  "#D3E4FD", // Soft Blue
  "#8B5CF6", // Vivid Purple
  "#D946EF", // Magenta Pink
  "#F97316", // Bright Orange
  "#0EA5E9", // Ocean Blue
  "#1EAEDB", // Bright Blue
  "#33C3F0", // Sky Blue
  "#FFA99F", // Coral
  "#FFE29F", // Light Yellow
];

// Create pairs of cards with matching colors
const createInitialCards = () => {
  const cards: CardType[] = [];
  cardColors.forEach((color, index) => {
    // Create two cards with the same color (a pair)
    const pair = [
      {
        id: index * 2 + 1,
        image: color, // Using color as the image identifier
        isFlipped: false,
        isMatched: false,
      },
      {
        id: index * 2 + 2,
        image: color, // Same color for the matching pair
        isFlipped: false,
        isMatched: false,
      },
    ];
    cards.push(...pair);
  });
  return cards.sort(() => Math.random() - 0.5); // Shuffle the cards
};

const initialCards = createInitialCards();

export const GameBoard = () => {
  const [gameState, setGameState] = useState<GameState>({
    cards: initialCards,
    moves: 0,
    score: 0,
    timeLeft: INITIAL_TIME,
    gameMode: "classic",
    isGameOver: false,
  });

  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsProcessing(true);
      const [firstId, secondId] = flippedCards;
      const firstCard = gameState.cards.find((card) => card.id === firstId);
      const secondCard = gameState.cards.find((card) => card.id === secondId);

      if (firstCard?.image === secondCard?.image && firstId !== secondId) {
        setGameState((prev) => ({
          ...prev,
          cards: prev.cards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          ),
          score: prev.score + 10,
        }));
        toast.success("Match found!");
      } else {
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            cards: prev.cards.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            ),
          }));
        }, 1000);
      }

      setTimeout(() => {
        setFlippedCards([]);
        setIsProcessing(false);
      }, 1000);

      setGameState((prev) => ({
        ...prev,
        moves: prev.moves + 1,
      }));
    }
  }, [flippedCards]);

  const handleCardFlip = (id: number) => {
    if (flippedCards.length < 2 && !isProcessing) {
      setGameState((prev) => ({
        ...prev,
        cards: prev.cards.map((card) =>
          card.id === id ? { ...card, isFlipped: true } : card
        ),
      }));
      setFlippedCards((prev) => [...prev, id]);
    }
  };

  const gameOver = () => {
    setGameState((prev) => ({ ...prev, isGameOver: true }));
    toast.error("Game Over!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-8 p-4"
    >
      <div className="flex items-center justify-between w-full max-w-4xl">
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-2 bg-game-purple px-4 py-2 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">{gameState.score}</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 bg-game-pink px-4 py-2 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <TimerIcon className="w-5 h-5" />
            <Timer
              initialTime={INITIAL_TIME}
              gameMode={gameState.gameMode}
              onTimeUp={gameOver}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-6 gap-3 md:gap-4"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {gameState.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onFlip={handleCardFlip}
            isDisabled={isProcessing || gameState.isGameOver}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

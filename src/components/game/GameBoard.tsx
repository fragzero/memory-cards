
import { useState, useEffect } from "react";
import { Card } from "./Card";
import { CardType, GameState } from "@/types/game";
import { Timer } from "./Timer";
import { Trophy, Timer as TimerIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const INITIAL_TIME = 60;

const initialCards: CardType[] = [
  // Example cards - replace with actual images
  { id: 1, image: "/placeholder.svg", isFlipped: false, isMatched: false },
  { id: 2, image: "/placeholder.svg", isFlipped: false, isMatched: false },
  // Add more cards here
];

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

      if (firstCard?.image === secondCard?.image) {
        // Match found
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
        // No match
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
      <div className="flex items-center justify-between w-full max-w-2xl">
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
        className="grid grid-cols-4 gap-4 md:gap-6"
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

import { useState, useEffect } from "react";
import { Card } from "./Card";
import { CardType, GameState } from "@/types/game";
import { Timer } from "./Timer";
import { Trophy, Timer as TimerIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Confetti from "react-confetti";

const INITIAL_TIME = 60;
const PREVIEW_TIME = 5000; // 5 seconds preview

const cardColors = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
  "#FFC0CB", // Pink
  "#A52A2A", // Brown
  "#808080", // Gray
  "#FFFFFF", // White
  "#000000", // Black
  "#FFD700", // Gold
  "#FF4500", // Orange Red
  "#32CD32", // Lime Green
];

const createInitialCards = () => {
  const cards: CardType[] = [];
  // Create pairs for a 4x4 grid (16 cards total)
  for (let i = 0; i < 8; i++) { // 8 pairs for a 4x4 grid
    const color = cardColors[i % cardColors.length]; // Use basic colors
    const pair = [
      {
        id: i * 2 + 1,
        image: color,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: i * 2 + 2,
        image: color,
        isFlipped: false,
        isMatched: false,
      },
    ];
    cards.push(...pair);
  }
  return cards.sort(() => Math.random() - 0.5);
};

const initialCards = createInitialCards();

export const GameBoard = () => {
  const [gameState, setGameState] = useState<GameState>({
    cards: initialCards.map(card => ({ ...card, isFlipped: true })),
    moves: 0,
    score: 0,
    timeLeft: INITIAL_TIME,
    gameMode: "classic",
    isGameOver: false,
  });

  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const previewTimer = setTimeout(() => {
      setShowPreview(false);
      setGameState(prev => ({
        ...prev,
        cards: prev.cards.map(card => ({ ...card, isFlipped: false }))
      }));
    }, PREVIEW_TIME);

    return () => clearTimeout(previewTimer);
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsProcessing(true);
      const [firstId, secondId] = flippedCards;
      const firstCard = gameState.cards.find((card) => card.id === firstId);
      const secondCard = gameState.cards.find((card) => card.id === secondId);

      if (firstCard?.image === secondCard?.image && firstId !== secondId) {
        setGameState((prev) => {
          const newCards = prev.cards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          );
          return {
            ...prev,
            cards: newCards,
            score: prev.score + 10,
          };
        }, (newState) => {
          // newState is the state after the above update
          toast.success("Match found!");
          const allCardsMatched = newState.cards.every(card => card.isMatched);
          if (allCardsMatched) {
            setGameState(prev => ({ ...prev, isGameOver: true }));
            toast.success("Congratulations! You've matched all pairs!");
          }
        });
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
    if (!gameStarted) {
      setGameStarted(true);
      setGameState(prev => ({ ...prev, timeLeft: INITIAL_TIME }));
    }

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

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timerInterval);
          gameOver();
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameStarted]);

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
      {confetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
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
              gameStarted={gameStarted}
              isGameOver={gameState.isGameOver}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-4 gap-3 md:gap-4"
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
            isDisabled={isProcessing || gameState.isGameOver || showPreview}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

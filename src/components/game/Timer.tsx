
import { useState, useEffect } from "react";
import { GameMode } from "@/types/game";

interface TimerProps {
  initialTime: number;
  gameMode: GameMode;
  onTimeUp: () => void;
}

export const Timer = ({ initialTime, gameMode, onTimeUp }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (gameMode !== "timeAttack") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameMode, onTimeUp]);

  return (
    <span className="font-mono font-semibold">
      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
    </span>
  );
};


export type CardType = {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export type GameMode = "classic" | "timeAttack";

export type GameState = {
  cards: CardType[];
  moves: number;
  score: number;
  timeLeft?: number;
  gameMode: GameMode;
  isGameOver: boolean;
};

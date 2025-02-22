
import { GameBoard } from "@/components/game/GameBoard";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-game-purple/20">
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-block px-4 py-1 rounded-full bg-game-accent/10 text-game-accent text-sm font-medium mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Memory Game
          </motion.div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-game-accent to-purple-500">
            Paw Pair Memory
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Match the adorable cats and dogs in this memory game. Challenge yourself in Time Attack mode!
          </p>
        </motion.div>

        <GameBoard />
      </div>
    </div>
  );
};

export default Index;

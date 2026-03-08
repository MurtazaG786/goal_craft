import { motion } from "motion/react";
import { Zap, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

interface DailyTaskCardProps {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  xpReward: number;
  completed: boolean;
  onComplete: (id: string, xp: number) => void;
}

const difficultyColors = {
  Easy: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400",
  Medium: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400",
  Hard: "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400",
};

export function DailyTaskCard({
  id,
  title,
  difficulty,
  xpReward,
  completed,
  onComplete,
}: DailyTaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  const handleComplete = () => {
    if (!completed) {
      setShowXPAnimation(true);
      setTimeout(() => {
        onComplete(id, xpReward);
        setShowXPAnimation(false);
      }, 600);
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className={`
          relative p-4 rounded-xl backdrop-blur-sm border transition-all duration-300
          ${completed 
            ? "bg-gray-800/30 border-gray-600/30" 
            : "bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-cyan-500/20"
          }
        `}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Glow effect when hovered */}
        {isHovered && !completed && (
          <motion.div
            className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-lg -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <motion.button
            onClick={handleComplete}
            className="flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            ) : (
              <Circle className="w-6 h-6 text-gray-500 hover:text-cyan-400 transition-colors" />
            )}
          </motion.button>

          {/* Task Info */}
          <div className="flex-1">
            <h4 className={`font-medium ${completed ? "text-gray-500 line-through" : "text-gray-200"}`}>
              {title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`
                  text-xs px-2 py-0.5 rounded-full bg-gradient-to-r backdrop-blur-sm border
                  ${difficultyColors[difficulty]}
                `}
              >
                {difficulty}
              </span>
            </div>
          </div>

          {/* XP Reward */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">+{xpReward}</span>
          </div>
        </div>

        {/* XP Animation */}
        {showXPAnimation && (
          <motion.div
            className="absolute top-0 right-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500"
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -30, scale: 1.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Zap className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white">+{xpReward} XP</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

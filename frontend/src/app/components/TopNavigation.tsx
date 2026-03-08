import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import * as Progress from "@radix-ui/react-progress";
import { useState, useEffect } from "react";

interface TopNavigationProps {
  currentXP: number;
  xpToNextLevel: number;
  level: number;
  userAvatar: string;
  onXPIncrease?: () => void;
}

export function TopNavigation({ 
  currentXP, 
  xpToNextLevel, 
  level, 
  userAvatar 
}: TopNavigationProps) {
  const xpPercentage = (currentXP / xpToNextLevel) * 100;
  const [mascotExpression, setMascotExpression] = useState("🚀");

  useEffect(() => {
    // Change mascot expression based on XP percentage
    if (xpPercentage > 80) {
      setMascotExpression("🎉");
    } else if (xpPercentage > 50) {
      setMascotExpression("😊");
    } else if (xpPercentage > 20) {
      setMascotExpression("🚀");
    } else {
      setMascotExpression("💪");
    }
  }, [xpPercentage]);

  return (
    <nav className="h-20 bg-gradient-to-r from-[#0a0e27] via-[#0d1128] to-[#0a0e27] border-b border-cyan-500/20 backdrop-blur-xl">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              GoalCraft
            </h1>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400">Level {level}</span>
              <span className="text-gray-400">{currentXP} / {xpToNextLevel} XP</span>
            </div>
            <Progress.Root
              className="relative h-3 w-full overflow-hidden rounded-full bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20"
              value={xpPercentage}
            >
              <Progress.Indicator
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500 ease-out relative"
                style={{ width: `${xpPercentage}%` }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </Progress.Indicator>
            </Progress.Root>
          </div>
        </div>

        {/* User Info & Mascot */}
        <div className="flex items-center gap-4">
          {/* Mascot */}
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 cursor-pointer"
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="text-2xl"
              key={mascotExpression}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {mascotExpression}
            </motion.span>
          </motion.div>

          {/* Level Badge */}
          <div className="relative">
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-400">Level {level}</span>
              </div>
            </div>
            <motion.div
              className="absolute -inset-1 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 blur-md -z-10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* User Avatar */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={userAvatar}
              alt="User Avatar"
              className="w-12 h-12 rounded-full border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/30 object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0a0e27]" />
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
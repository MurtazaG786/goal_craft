import { motion } from "motion/react";
import { Flame, Trophy, Star } from "lucide-react";

interface MotivationPanelProps {
  streak: number;
  tasksCompletedToday: number;
  totalTasksToday: number;
}

const motivationalMessages = [
  "You're on fire! Keep it up! 🔥",
  "Amazing progress today! 🌟",
  "You're crushing your goals! 💪",
  "Keep the momentum going! 🚀",
  "Outstanding work! You're unstoppable! ⚡",
];

export function MotivationPanel({
  streak,
  tasksCompletedToday,
  totalTasksToday,
}: MotivationPanelProps) {
  const completionRate = totalTasksToday > 0
    ? (tasksCompletedToday / totalTasksToday) * 100
    : 0;
  const messageIndex = Math.min(
    Math.floor((completionRate / 100) * motivationalMessages.length),
    motivationalMessages.length - 1
  );

  return (
    <div className="space-y-4">
      {/* Motivational Message */}
      <motion.div
        className="relative p-5 rounded-2xl bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border border-yellow-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 blur-lg -z-10"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="flex items-start gap-4">
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-2xl">🚀</span>
          </motion.div>
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-1">Your Mascot Says:</p>
            <p className="text-base font-medium text-white">
              {motivationalMessages[messageIndex]}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Streak Card */}
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-sm border border-orange-500/30"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 15px rgba(249, 115, 22, 0.3)",
                  "0 0 25px rgba(249, 115, 22, 0.5)",
                  "0 0 15px rgba(249, 115, 22, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Flame className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <p className="text-xs text-gray-400">Streak</p>
              <p className="text-xl font-bold text-orange-400">{streak} days</p>
            </div>
          </div>
        </motion.div>

        {/* Daily Progress Card */}
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-green-500/30"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 15px rgba(34, 197, 94, 0.3)",
                  "0 0 25px rgba(34, 197, 94, 0.5)",
                  "0 0 15px rgba(34, 197, 94, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Trophy className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <p className="text-xs text-gray-400">Today</p>
              <p className="text-xl font-bold text-green-400">
                {tasksCompletedToday}/{totalTasksToday}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Achievement Preview */}
      <motion.div
        className="p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-xs text-gray-400">Next Achievement</p>
              <p className="text-sm font-medium text-purple-400">Complete 10 Hard Tasks</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Progress</p>
            <p className="text-sm font-bold text-purple-400">7/10</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

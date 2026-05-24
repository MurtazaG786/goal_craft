import { motion } from "motion/react";
import { Target, TrendingUp } from "lucide-react";
import * as Progress from "@radix-ui/react-progress";

interface MilestoneCardProps {
  title: string;
  description: string;
  currentProgress: number;
  totalSteps: number;
}

export function MilestoneCard({
  title,
  description,
  currentProgress,
  totalSteps,
}: MilestoneCardProps) {
  const progressPercentage = totalSteps > 0
    ? (currentProgress / totalSteps) * 100
    : 0;

  return (
    <motion.div
      className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 backdrop-blur-sm border border-purple-500/30"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 blur-xl -z-10"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 20px rgba(168, 85, 247, 0.4)",
                "0 0 30px rgba(168, 85, 247, 0.6)",
                "0 0 20px rgba(168, 85, 247, 0.4)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Target className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="font-bold text-lg text-white">Current Milestone</h3>
            <p className="text-sm text-gray-400">Keep pushing forward!</p>
          </div>
        </div>
        <motion.div
          className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30"
          whileHover={{ scale: 1.05 }}
        >
          <TrendingUp className="w-4 h-4 text-cyan-400" />
        </motion.div>
      </div>

      {/* Milestone Info */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-cyan-400 font-medium">Progress</span>
            <span className="text-gray-400">
              {currentProgress} / {totalSteps} steps completed
            </span>
          </div>

          <Progress.Root
            className="relative h-4 w-full overflow-hidden rounded-full bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20"
            value={progressPercentage}
          >
            <Progress.Indicator
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-700 ease-out relative"
              style={{ width: `${progressPercentage}%` }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
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

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {progressPercentage.toFixed(0)}%
            </span>
            <span className="text-xs text-gray-500">
              {totalSteps - currentProgress} steps remaining
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from "motion/react";
import { Trophy, Target, Zap, Calendar, Award, Star, TrendingUp } from "lucide-react";

const achievements = [
  { id: 1, title: "First Steps", description: "Complete your first quest", icon: "🎯", unlocked: true },
  { id: 2, title: "Week Warrior", description: "Maintain a 7-day streak", icon: "🔥", unlocked: true },
  { id: 3, title: "Task Master", description: "Complete 50 tasks", icon: "⚡", unlocked: true },
  { id: 4, title: "Milestone Achiever", description: "Complete 5 milestones", icon: "🏆", unlocked: false },
  { id: 5, title: "Side Quest Hero", description: "Complete 25 side quests", icon: "🌟", unlocked: false },
  { id: 6, title: "Century Club", description: "Reach level 100", icon: "💯", unlocked: false },
];

const stats = [
  { label: "Total XP Earned", value: "4,750", icon: Zap, color: "yellow" },
  { label: "Tasks Completed", value: "47", icon: Target, color: "cyan" },
  { label: "Current Streak", value: "7 days", icon: Calendar, color: "orange" },
  { label: "Milestones Reached", value: "2", icon: Trophy, color: "purple" },
];

export function Profile() {
  const level = 5;
  const totalXP = 4750;
  const xpToNextLevel = 1000;
  const currentLevelXP = 450;
  const progressPercentage = (currentLevelXP / xpToNextLevel) * 100;

  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-[#0a0e27] via-[#0d1128] to-[#0a0e27]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div
          className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 backdrop-blur-sm border border-purple-500/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="https://images.unsplash.com/photo-1712168567859-e24cbc155219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGF2YXRhciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjgzMzQ2MXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Profile Avatar"
                className="w-32 h-32 rounded-full border-4 border-cyan-400/50 shadow-2xl object-cover"
              />
              <motion.div
                className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-4 border-[#0a0e27]"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(251, 191, 36, 0.4)",
                    "0 0 30px rgba(251, 191, 36, 0.6)",
                    "0 0 20px rgba(251, 191, 36, 0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-xl font-bold text-white">{level}</span>
              </motion.div>
            </motion.div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">Champion Sarah</h1>
              <p className="text-cyan-400 text-lg mb-4">Level {level} Adventurer</p>
              
              {/* XP Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Progress to Level {level + 1}</span>
                  <span className="text-cyan-400">{currentLevelXP} / {xpToNextLevel} XP</span>
                </div>
                <div className="h-4 bg-gray-800/50 rounded-full overflow-hidden border border-cyan-500/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
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
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Mascot */}
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-5xl">🚀</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className={`
                  p-6 rounded-xl backdrop-blur-sm border
                  ${stat.color === "yellow"
                    ? "bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30"
                    : stat.color === "cyan"
                    ? "bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30"
                    : stat.color === "orange"
                    ? "bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30"
                    : "bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30"
                  }
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center mb-3
                    ${stat.color === "yellow"
                      ? "bg-yellow-500/20"
                      : stat.color === "cyan"
                      ? "bg-cyan-500/20"
                      : stat.color === "orange"
                      ? "bg-orange-500/20"
                      : "bg-purple-500/20"
                    }
                  `}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className={`
                    w-6 h-6
                    ${stat.color === "yellow"
                      ? "text-yellow-400"
                      : stat.color === "cyan"
                      ? "text-cyan-400"
                      : stat.color === "orange"
                      ? "text-orange-400"
                      : "text-purple-400"
                    }
                  `} />
                </motion.div>
                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className={`
                  text-2xl font-bold
                  ${stat.color === "yellow"
                    ? "text-yellow-400"
                    : stat.color === "cyan"
                    ? "text-cyan-400"
                    : stat.color === "orange"
                    ? "text-orange-400"
                    : "text-purple-400"
                  }
                `}>
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Achievements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className={`
                  relative p-5 rounded-xl backdrop-blur-sm border
                  ${achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30"
                    : "bg-gray-900/20 border-gray-700/30"
                  }
                `}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                {achievement.unlocked && (
                  <motion.div
                    className="absolute -inset-1 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 blur-lg -z-10"
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                <div className="flex items-start gap-4">
                  <motion.div
                    className={`
                      text-4xl flex-shrink-0
                      ${!achievement.unlocked && "grayscale opacity-40"}
                    `}
                    animate={achievement.unlocked ? {
                      rotate: [0, -10, 10, -10, 0],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {achievement.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className={`
                      font-bold mb-1
                      ${achievement.unlocked ? "text-yellow-400" : "text-gray-500"}
                    `}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Chart Placeholder */}
        <motion.div
          className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-cyan-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Progress Overview</h2>
          </div>
          
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700/50 rounded-xl">
            <div className="text-center">
              <p className="text-gray-400 mb-2">Activity chart coming soon</p>
              <p className="text-sm text-gray-500">Track your daily progress and streaks</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

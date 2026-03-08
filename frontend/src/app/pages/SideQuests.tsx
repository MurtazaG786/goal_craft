import { useState } from "react";
import { motion } from "motion/react";
import { Book, Dumbbell, Brain, Coffee, Music, Heart, Zap, CheckCircle2 } from "lucide-react";

interface SideQuest {
  id: number;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  difficulty: "Easy" | "Medium" | "Hard";
  icon: any;
  completed: boolean;
}

const mockSideQuests: SideQuest[] = [
  {
    id: 1,
    title: "Read a Book Chapter",
    description: "Expand your knowledge by reading 20+ pages",
    category: "Learning",
    xpReward: 75,
    difficulty: "Easy",
    icon: Book,
    completed: false,
  },
  {
    id: 2,
    title: "30-Minute Workout",
    description: "Complete any physical exercise for 30 minutes",
    category: "Health",
    xpReward: 100,
    difficulty: "Medium",
    icon: Dumbbell,
    completed: false,
  },
  {
    id: 3,
    title: "Meditation Session",
    description: "Practice mindfulness for 15 minutes",
    category: "Wellness",
    xpReward: 60,
    difficulty: "Easy",
    icon: Brain,
    completed: true,
  },
  {
    id: 4,
    title: "Learn Something New",
    description: "Complete an online tutorial or course module",
    category: "Learning",
    xpReward: 150,
    difficulty: "Hard",
    icon: Coffee,
    completed: false,
  },
  {
    id: 5,
    title: "Creative Time",
    description: "Spend 30 minutes on a creative hobby",
    category: "Creativity",
    xpReward: 80,
    difficulty: "Medium",
    icon: Music,
    completed: false,
  },
  {
    id: 6,
    title: "Help Someone",
    description: "Perform a random act of kindness",
    category: "Social",
    xpReward: 120,
    difficulty: "Medium",
    icon: Heart,
    completed: false,
  },
];

export function SideQuests() {
  const [quests, setQuests] = useState(mockSideQuests);
  const [filter, setFilter] = useState<string>("all");

  const handleCompleteQuest = (questId: number) => {
    setQuests(prev =>
      prev.map(quest =>
        quest.id === questId ? { ...quest, completed: true } : quest
      )
    );
  };

  const filteredQuests = filter === "all" 
    ? quests 
    : quests.filter(q => q.category.toLowerCase() === filter);

  const categories = ["all", "learning", "health", "wellness", "creativity", "social"];

  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-[#0a0e27] via-[#0d1128] to-[#0a0e27]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-3">
            Side Quests
          </h1>
          <p className="text-gray-400 text-lg">
            Bonus challenges to earn extra XP and build healthy habits
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Available Quests", value: quests.filter(q => !q.completed).length, color: "cyan" },
            { label: "Completed Today", value: quests.filter(q => q.completed).length, color: "green" },
            { label: "Potential XP", value: quests.filter(q => !q.completed).reduce((sum, q) => sum + q.xpReward, 0), color: "yellow" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`
                p-5 rounded-xl backdrop-blur-sm border
                ${stat.color === "cyan"
                  ? "bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30"
                  : stat.color === "green"
                  ? "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30"
                  : "bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30"
                }
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
              <p className={`
                text-3xl font-bold
                ${stat.color === "cyan" ? "text-cyan-400" : stat.color === "green" ? "text-green-400" : "text-yellow-400"}
              `}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          className="flex gap-3 mb-6 overflow-x-auto pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setFilter(category)}
              className={`
                px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-all
                ${filter === category
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Quest Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map((quest, index) => {
            const Icon = quest.icon;
            const difficultyColor = 
              quest.difficulty === "Easy" ? "green" :
              quest.difficulty === "Medium" ? "yellow" : "red";

            return (
              <motion.div
                key={quest.id}
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.div
                  className={`
                    relative p-6 rounded-2xl backdrop-blur-sm border h-full flex flex-col
                    ${quest.completed
                      ? "bg-gray-800/30 border-gray-600/30"
                      : "bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-cyan-500/20"
                    }
                  `}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {/* Glow effect */}
                  {!quest.completed && (
                    <motion.div
                      className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  )}

                  {/* Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      className={`
                        w-14 h-14 rounded-xl flex items-center justify-center
                        ${quest.completed
                          ? "bg-gray-700/50"
                          : "bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
                        }
                      `}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`w-7 h-7 ${quest.completed ? "text-gray-500" : "text-cyan-400"}`} />
                    </motion.div>

                    {quest.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      </motion.div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-2 ${quest.completed ? "text-gray-500" : "text-white"}`}>
                      {quest.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {quest.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${difficultyColor === "green"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : difficultyColor === "yellow"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }
                      `}>
                        {quest.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {quest.category}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/30">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-bold text-yellow-400">+{quest.xpReward} XP</span>
                    </div>

                    {!quest.completed && (
                      <motion.button
                        onClick={() => handleCompleteQuest(quest.id)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Complete
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

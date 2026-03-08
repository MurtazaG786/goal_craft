import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Circle, Lock, Target, X } from "lucide-react";

interface Milestone {
  id: number;
  title: string;
  description: string;
  status: "completed" | "active" | "locked";
  tasks: {
    id: number;
    title: string;
    completed: boolean;
  }[];
}

const mockMilestones: Milestone[] = [
  {
    id: 1,
    title: "Research & Planning",
    description: "Define your project scope and requirements",
    status: "completed",
    tasks: [
      { id: 1, title: "Market research", completed: true },
      { id: 2, title: "Define target audience", completed: true },
      { id: 3, title: "Create project roadmap", completed: true },
    ],
  },
  {
    id: 2,
    title: "Design Phase",
    description: "Create wireframes and visual designs",
    status: "completed",
    tasks: [
      { id: 1, title: "Wireframe mockups", completed: true },
      { id: 2, title: "UI/UX design", completed: true },
      { id: 3, title: "Design system", completed: true },
    ],
  },
  {
    id: 3,
    title: "Development Setup",
    description: "Set up development environment and architecture",
    status: "active",
    tasks: [
      { id: 1, title: "Initialize project", completed: true },
      { id: 2, title: "Set up database", completed: true },
      { id: 3, title: "Configure deployment", completed: false },
    ],
  },
  {
    id: 4,
    title: "Core Features",
    description: "Build the main functionality",
    status: "locked",
    tasks: [
      { id: 1, title: "User authentication", completed: false },
      { id: 2, title: "Main dashboard", completed: false },
      { id: 3, title: "Data management", completed: false },
    ],
  },
  {
    id: 5,
    title: "Testing & Launch",
    description: "Test thoroughly and deploy to production",
    status: "locked",
    tasks: [
      { id: 1, title: "Unit testing", completed: false },
      { id: 2, title: "User acceptance testing", completed: false },
      { id: 3, title: "Production deployment", completed: false },
    ],
  },
];

export function MilestoneJourney() {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-[#0a0e27] via-[#0d1128] to-[#0a0e27]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Your Quest Journey
          </h1>
          <p className="text-gray-400 text-lg">
            Navigate through milestones to reach your ultimate goal
          </p>
        </motion.div>

        {/* Journey Path */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-gray-700/20 -translate-x-1/2 hidden md:block" />

          {/* Milestones */}
          <div className="space-y-12">
            {mockMilestones.map((milestone, index) => {
              const isLeft = index % 2 === 0;
              const completedTasks = milestone.tasks.filter(t => t.completed).length;
              const progress = (completedTasks / milestone.tasks.length) * 100;

              return (
                <motion.div
                  key={milestone.id}
                  className={`relative flex items-center ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-8`}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Milestone Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.button
                      onClick={() => setSelectedMilestone(milestone)}
                      className={`
                        w-20 h-20 rounded-full border-4 flex items-center justify-center relative
                        ${milestone.status === "completed"
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400"
                          : milestone.status === "active"
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400"
                          : "bg-gray-800 border-gray-700"
                        }
                      `}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {milestone.status === "completed" ? (
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      ) : milestone.status === "active" ? (
                        <Target className="w-10 h-10 text-white" />
                      ) : (
                        <Lock className="w-8 h-8 text-gray-500" />
                      )}

                      {/* Glow effect */}
                      {milestone.status !== "locked" && (
                        <motion.div
                          className={`
                            absolute -inset-2 rounded-full blur-xl -z-10
                            ${milestone.status === "completed" ? "bg-green-500/40" : "bg-cyan-500/40"}
                          `}
                          animate={{
                            opacity: [0.4, 0.8, 0.4],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </motion.button>

                    {/* Progress ring for active milestone */}
                    {milestone.status === "active" && (
                      <svg className="absolute inset-0 w-20 h-20 -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          className="text-cyan-500/30"
                        />
                        <motion.circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 36}`}
                          strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                          className="text-cyan-400"
                          initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 36 * (1 - progress / 100) }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </svg>
                    )}
                  </div>

                  {/* Milestone Card */}
                  <motion.div
                    className={`
                      flex-1 p-6 rounded-2xl backdrop-blur-sm border
                      ${milestone.status === "completed"
                        ? "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30"
                        : milestone.status === "active"
                        ? "bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30"
                        : "bg-gray-900/20 border-gray-700/30"
                      }
                    `}
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className={`
                          text-xl font-bold mb-1
                          ${milestone.status === "completed"
                            ? "text-green-400"
                            : milestone.status === "active"
                            ? "text-cyan-400"
                            : "text-gray-500"
                          }
                        `}>
                          {milestone.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{milestone.description}</p>
                      </div>
                      
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${milestone.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : milestone.status === "active"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-gray-700/20 text-gray-500"
                        }
                      `}>
                        {milestone.status === "completed" ? "Completed" : milestone.status === "active" ? "In Progress" : "Locked"}
                      </span>
                    </div>

                    {milestone.status !== "locked" && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                          <span>Progress</span>
                          <span>{completedTasks}/{milestone.tasks.length} tasks</span>
                        </div>
                        <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${
                              milestone.status === "completed" ? "bg-green-500" : "bg-cyan-500"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Goal End Point */}
        <motion.div
          className="mt-12 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center relative"
            animate={{
              boxShadow: [
                "0 0 40px rgba(251, 191, 36, 0.4)",
                "0 0 60px rgba(251, 191, 36, 0.6)",
                "0 0 40px rgba(251, 191, 36, 0.4)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-4xl">🎯</span>
          </motion.div>
          <h3 className="text-2xl font-bold text-yellow-400 mt-4">Final Goal</h3>
          <p className="text-gray-400 text-center max-w-md mt-2">
            Launch My First Product
          </p>
        </motion.div>
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMilestone(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-1">
                    {selectedMilestone.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{selectedMilestone.description}</p>
                </div>
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Tasks</h4>
                {selectedMilestone.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${task.completed ? "text-gray-400 line-through" : "text-white"}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

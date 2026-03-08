import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useOutletContext } from "react-router";
import { DailyTaskCard } from "../components/DailyTaskCard";
import { MilestoneCard } from "../components/MilestoneCard";
import { MotivationPanel } from "../components/MotivationPanel";
import { Confetti } from "../components/Confetti";

interface Task {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  xpReward: number;
  completed: boolean;
}

interface OutletContext {
  onXPGain: (xp: number) => void;
}

const initialTasks: Task[] = [
  { 
    id: "1", 
    title: "Morning meditation - 10 minutes", 
    difficulty: "Easy", 
    xpReward: 50, 
    completed: false 
  },
  { 
    id: "2", 
    title: "Read 30 pages of a book", 
    difficulty: "Medium", 
    xpReward: 100, 
    completed: false 
  },
  { 
    id: "3", 
    title: "Complete coding project milestone", 
    difficulty: "Hard", 
    xpReward: 200, 
    completed: false 
  },
  { 
    id: "4", 
    title: "Exercise for 30 minutes", 
    difficulty: "Medium", 
    xpReward: 100, 
    completed: false 
  },
  { 
    id: "5", 
    title: "Plan tomorrow's tasks", 
    difficulty: "Easy", 
    xpReward: 50, 
    completed: false 
  },
];

export function Dashboard() {
  const { onXPGain } = useOutletContext<OutletContext>();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showConfetti, setShowConfetti] = useState(false);

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const allTasksCompleted = completedTasksCount === tasks.length;

  useEffect(() => {
    if (allTasksCompleted && completedTasksCount > 0) {
      setShowConfetti(true);
    }
  }, [allTasksCompleted, completedTasksCount]);

  const handleTaskComplete = (taskId: string, xp: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
    onXPGain(xp);
  };

  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-[#0a0e27] via-[#0d1128] to-[#0a0e27]">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, Champion! 👋
          </h2>
          <p className="text-gray-400">
            You have {tasks.length - completedTasksCount} quests waiting for you today
          </p>
        </motion.div>

        {/* Current Mission Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MilestoneCard
            title="Launch My First Product"
            description="Build and ship a complete web application to production"
            currentProgress={12}
            totalSteps={20}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Quests Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Daily Quests</h3>
              <span className="text-sm text-gray-400">
                {completedTasksCount}/{tasks.length} completed
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DailyTaskCard
                    id={task.id}
                    title={task.title}
                    difficulty={task.difficulty}
                    xpReward={task.xpReward}
                    completed={task.completed}
                    onComplete={handleTaskComplete}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Motivation Panel */}
          <div className="space-y-6">
            <MotivationPanel
              streak={7}
              tasksCompletedToday={completedTasksCount}
              totalTasksToday={tasks.length}
            />
          </div>
        </div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && <Confetti />}
    </div>
  );
}
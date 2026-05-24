import API from "../../api/goalApi";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DailyTaskCard } from "../components/DailyTaskCard";
import { MotivationPanel } from "../components/MotivationPanel";
import { Confetti } from "../components/Confetti";
import { useAuth } from "../context/AuthContext";
import { MilestoneCard } from "../components/MilestoneCard";

interface Task {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  xp: number;
  completed: boolean;
}

interface Milestone {
  id: number;
  title: string;
  status: "completed" | "active" | "locked";
}

export function Dashboard() {
  const { updateUser, user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [milestoneProgress, setMilestoneProgress] = useState({ completed: 0, total: 0 });

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const allTasksCompleted = tasks.length > 0 && completedTasksCount === tasks.length;

  // Fetch daily tasks
  useEffect(() => {

    async function loadTasks() {

      try {

        const res = await API.get("/goal/daily");
        const data = res.data;

        if (Array.isArray(data)) {

          const formatted = data.map((t: any) => ({
            id: t.id,
            title: t.title,
            difficulty: t.difficulty,
            xp: t.xp,
            completed: t.completed
          }));

          setTasks(formatted);

        } else {
          setTasks([]);
        }

      } catch (err) {
        console.error("Failed to load daily quests", err);
      }

      setLoading(false);
    }

    loadTasks();

    async function loadMilestones() {
      try {
        const milestoneRes = await API.get("/goal/milestones");
        const milestoneData = Array.isArray(milestoneRes.data)
          ? milestoneRes.data
          : milestoneRes.data.milestones || [];

        const active = milestoneData.find((m: Milestone) => m.status === "active")
          || milestoneData[0]
          || null;

        setCurrentMilestone(active || null);

        if (active) {
          const taskRes = await API.get(`/goal/milestone/${active.id}/tasks`);
          const taskData = Array.isArray(taskRes.data) ? taskRes.data : [];
          const completed = taskData.filter((t: any) => t.completed).length;
          setMilestoneProgress({ completed, total: taskData.length });
        } else {
          setMilestoneProgress({ completed: 0, total: 0 });
        }
      } catch (err) {
        console.error("Failed to load milestones", err);
        setCurrentMilestone(null);
        setMilestoneProgress({ completed: 0, total: 0 });
      }
    }

    loadMilestones();

  }, []);

  useEffect(() => {
    if (allTasksCompleted && completedTasksCount > 0) {
      setShowConfetti(true);
    }
  }, [allTasksCompleted, completedTasksCount]);

  async function handleTaskComplete(taskId: number) {

    try {
      const res = await API.post(`/goal/task/${taskId}/complete`);
      const data = res.data;

      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
      updateUser({
        xp: data.total_xp,
        level: data.level,
        streak: data.streak
      });
      window.dispatchEvent(new CustomEvent("questCompleted"));

    } catch (err) {
      console.error("Failed to complete task", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading daily quests...
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-[#0a0e27] via-[#0d1128] to-[#0a0e27]">

      {/* Background particles */}

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

        {/* Welcome */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, Champion 👋
          </h2>

          <p className="text-gray-400">
            You have {tasks.length - completedTasksCount} quests waiting for you today
          </p>

        </motion.div>

        {/* If no tasks yet */}

        {tasks.length === 0 && (

          <div className="bg-gray-900/40 border border-cyan-500/20 rounded-xl p-8 text-center">

            <h3 className="text-xl font-bold text-white mb-3">
              No active quest yet
            </h3>

            <p className="text-gray-400 mb-6">
              Create your first goal to start your journey.
            </p>

            <a
              href="/create-goal"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium hover:scale-105 transition"
            >
              Create Your First Goal
            </a>

          </div>

        )}

        {/* Current Mission */}

        {currentMilestone && (
          <MilestoneCard
            title={currentMilestone.title}
            description="Milestone in your journey"
            currentProgress={milestoneProgress.completed}
            totalSteps={milestoneProgress.total}
          />
        )}

        {/* Daily Tasks */}

        {tasks.length > 0 && (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 space-y-4">

              <div className="flex items-center justify-between mb-4">

                <h3 className="text-xl font-bold text-white">
                  Daily Quests
                </h3>

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
                      xp={task.xp}
                      completed={task.completed}
                      onComplete={() => handleTaskComplete(task.id)}
                    />

                  </motion.div>

                ))}

              </div>

            </div>

            {/* Motivation Panel */}

            <div className="space-y-6">

              <MotivationPanel
                streak={user?.streak ?? 0}
                tasksCompletedToday={completedTasksCount}
                totalTasksToday={tasks.length}
              />

            </div>

          </div>

        )}

      </div>

      {/* Confetti */}

      {showConfetti && <Confetti />}

    </div>
  );
}
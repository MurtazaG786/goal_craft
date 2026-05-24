import API from "../../api/goalApi";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Circle, Lock, Target, X } from "lucide-react";

interface Task {
  id: number;
  title: string;
  difficulty: string;
  xp: number;
  completed?: boolean;
}

interface Milestone {
  id: number;
  title: string;
  description?: string;
  status: "completed" | "active" | "locked";
}

export function MilestoneJourney() {

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
  }, []);

  async function fetchMilestones() {

    try {

      const res = await API.get("/goal/milestones");
      const data = res.data;
      console.log("milestones api ")
      if (Array.isArray(data)) {
        setMilestones(data || []);
      } else if (data.milestones || []) {
        setMilestones(data.milestones || []);
      } else {
        setMilestones([]);
      }

    } catch (err) {
      console.error("Failed to load milestones", err);
    }

    setLoading(false);
  }

  async function openMilestone(milestone: Milestone) {

    try {

      const res = await API.get(`/goal/milestone/${milestone.id}/tasks`);

      const data = res.data;

      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
      }

      setSelectedMilestone(milestone);

    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  }

  async function completeTask(taskId: number) {

    try {

      await API.post(`/goal/task/${taskId}/complete`);

      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, completed: true } : t
        )
      );

    } catch (err) {
      console.error("Task completion failed", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading journey...
      </div>
    );
  }

  if (!milestones.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <h2 className="text-2xl mb-3">No quest started yet</h2>
        <p>Create your first goal to begin your journey.</p>
      </div>
    );
  }

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

        {/* Milestones */}

        <div className="space-y-10">

          {milestones.map((milestone) => (

            <motion.div
              key={milestone.id}
              className="flex items-center gap-8"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
            >

              {/* Milestone Node */}

              <motion.button
                onClick={() => milestone.status !== "locked" && openMilestone(milestone)}
                className={`w-20 h-20 rounded-full border-4 flex items-center justify-center
                ${milestone.status === "completed"
                    ? "border-green-400 bg-gradient-to-br from-green-500 to-emerald-600"
                    : milestone.status === "active"
                      ? "border-cyan-400 bg-gradient-to-br from-cyan-500 to-blue-600"
                      : "border-gray-700 bg-gray-800"
                  }`}
                whileHover={{ scale: milestone.status !== "locked" ? 1.1 : 1 }}
              >
                {milestone.status === "completed" ? (
                  <CheckCircle2 className="w-10 h-10 text-white" />
                ) : milestone.status === "active" ? (
                  <Target className="w-10 h-10 text-white" />
                ) : (
                  <Lock className="w-8 h-8 text-gray-500" />
                )}
              </motion.button>

              {/* Milestone Card */}

              <motion.div
                className="flex-1 p-6 rounded-2xl backdrop-blur-sm border bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30"
                whileHover={{ y: -4 }}
              >

                <h3 className="text-xl font-bold text-cyan-400 mb-1">
                  {milestone.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {milestone.description ?? "Milestone in your journey"}
                </p>

              </motion.div>

            </motion.div>

          ))}

        </div>

      </div>

      {/* Task Modal */}

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

                  <p className="text-gray-400 text-sm">
                    Tasks for this milestone
                  </p>

                </div>

                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="p-2 rounded-lg hover:bg-gray-700/50"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>

              </div>

              {/* Tasks */}

              <div className="space-y-3">

                {tasks.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No tasks available
                  </p>
                )}

                {tasks.map((task) => (

                  <div
                    key={task.id}
                    onClick={() => completeTask(task.id)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 cursor-pointer hover:bg-gray-700/40"
                  >

                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    )}

                    <span
                      className={`text-sm ${task.completed
                          ? "line-through text-gray-500"
                          : "text-white"
                        }`}
                    >
                      {task.title}
                    </span>

                    <span className="ml-auto text-xs text-cyan-400">
                      +{task.xp} XP
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
import { createGoal } from "../../api/goalApi";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Calendar as CalendarIcon, Sparkles, Target, Loader2 } from "lucide-react";

export function CreateGoal() {

  const navigate = useNavigate();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    difficulty: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setIsGenerating(true);
    setError("");

    try {

      const payload = {
        goal: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        deadline: formData.deadline
      };

      console.log("Sending goal:", payload);

      const data = await createGoal(payload);

      console.log("Backend response:", data);

      if (data.goal_id) {
        localStorage.setItem("goal_id", data.goal_id);
      }

      navigate("/milestone-journey");

    } catch (err) {

      const errorMessage = (err as any)?.response?.data?.detail || "Goal creation failed";
      console.error("Goal creation failed:", err);
      setError(errorMessage);
      setIsGenerating(false);

    }
  };

  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-[#0a0e27] via-[#0d1128] to-[#0a0e27]">

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 mb-6"
            animate={{
              boxShadow: [
                "0 0 30px rgba(168, 85, 247, 0.4)",
                "0 0 50px rgba(168, 85, 247, 0.7)",
                "0 0 30px rgba(168, 85, 247, 0.4)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Target className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Start a New Adventure
          </h1>

          <p className="text-gray-400 text-lg">
            Every great journey begins with a single goal
          </p>

          {error && (
            <p className="mt-4 text-red-400 text-sm">{error}</p>
          )}

        </motion.div>

        <AnimatePresence mode="wait">

          {!isGenerating ? (

            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >

              {/* Goal Title */}
              <motion.div
                className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-cyan-500/20"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <label className="block text-sm font-medium text-cyan-400 mb-3">
                  Quest Title
                </label>

                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Launch my startup, Master React, Run a marathon..."
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  required
                />
              </motion.div>

              {/* Goal Description */}
              <motion.div
                className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-cyan-500/20"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <label className="block text-sm font-medium text-cyan-400 mb-3">
                  Quest Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your goal in detail..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                  required
                />
              </motion.div>

              {/* Deadline */}
              <motion.div
                className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-cyan-500/20"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <label className="block text-sm font-medium text-cyan-400 mb-3">
                  Target Deadline
                </label>

                <div className="relative">

                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    className="w-full px-4 py-3 pl-12 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    required
                  />

                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                </div>
              </motion.div>

              {/* Difficulty */}
              <motion.div
                className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-cyan-500/20"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <label className="block text-sm font-medium text-cyan-400 mb-4">
                  Difficulty Preference (Optional)
                </label>

                <div className="grid grid-cols-3 gap-4">

                  {["easy", "medium", "hard"].map((level) => (

                    <motion.button
                      key={level}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, difficulty: level })
                      }
                      className={`px-4 py-3 rounded-xl border-2 transition-all font-medium capitalize
                      ${
                        formData.difficulty === level
                          ? level === "easy"
                            ? "bg-green-500/20 border-green-500 text-green-400"
                            : level === "medium"
                            ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                            : "bg-red-500/20 border-red-500 text-red-400"
                          : "bg-gray-900/30 border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {level}
                    </motion.button>

                  ))}

                </div>
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg shadow-lg relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <span className="relative flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Begin Your Quest
                </span>
              </motion.button>

            </motion.form>

          ) : (

           <motion.div

          key="loading"

          className="flex flex-col items-center justify-center py-20"

          initial={{ opacity: 0, scale: 0.8 }}

          animate={{ opacity: 1, scale: 1 }}

          exit={{ opacity: 0, scale: 0.8 }}

        >

          <motion.div

            className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-8"

            animate={{

              rotate: 360,

              boxShadow: [

                "0 0 40px rgba(168, 85, 247, 0.5)",

                "0 0 80px rgba(6, 182, 212, 0.8)",

                "0 0 40px rgba(168, 85, 247, 0.5)",

              ],

            }}

            transition={{

              rotate: { duration: 2, repeat: Infinity, ease: "linear" },

              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },

            }}

          >

            <Loader2 className="w-16 h-16 text-white" />

          </motion.div>

          

          <h3 className="text-2xl font-bold text-white mb-3">

            Crafting Your Adventure...

          </h3>

          <p className="text-gray-400 text-center max-w-md">

            Our AI is generating personalized milestones and daily quests for your goal

          </p>

          

          <div className="mt-8 space-y-2">

            {["Analyzing your goal...", "Creating milestones...", "Generating daily tasks..."].map((text, index) => (

              <motion.div

                key={index}

                className="text-cyan-400 flex items-center gap-2"

                initial={{ opacity: 0, x: -20 }}

                animate={{ opacity: 1, x: 0 }}

                transition={{ delay: index * 0.5 }}

              >

                <motion.div

                  className="w-2 h-2 rounded-full bg-cyan-400"

                  animate={{

                    scale: [1, 1.5, 1],

                    opacity: [0.5, 1, 0.5],

                  }}

                  transition={{

                    duration: 1,

                    repeat: Infinity,

                    delay: index * 0.5,

                  }}

                />

                {text}

              </motion.div>

            ))}

          </div>

        </motion.div>

      )}

        </AnimatePresence>

      </div>

    </div>
  );
}
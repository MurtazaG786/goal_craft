import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Circle, CheckCircle2, Target } from "lucide-react";

interface DayData {
  date: number;
  tasksCompleted: number;
  totalTasks: number;
  hasMilestone: boolean;
  isGoalDeadline: boolean;
  isCurrentMonth: boolean;
}

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2)); // March 2026
  
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  
  // Generate calendar days
  const generateCalendarDays = (): DayData[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days: DayData[] = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        tasksCompleted: 0,
        totalTasks: 0,
        hasMilestone: false,
        isGoalDeadline: false,
        isCurrentMonth: false,
      });
    }
    
    // Current month days with mock data
    for (let i = 1; i <= daysInMonth; i++) {
      const hasTask = i <= 20;
      const completed = i <= 8;
      days.push({
        date: i,
        tasksCompleted: completed ? 3 : 0,
        totalTasks: hasTask ? 3 : 0,
        hasMilestone: i === 10 || i === 20,
        isGoalDeadline: i === 30,
        isCurrentMonth: true,
      });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        tasksCompleted: 0,
        totalTasks: 0,
        hasMilestone: false,
        isGoalDeadline: false,
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  const days = generateCalendarDays();

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-[#0a0e27] via-[#0d1128] to-[#0a0e27]">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quest Calendar</h1>
            <p className="text-gray-400">Track your progress and upcoming milestones</p>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              onClick={prevMonth}
              className="p-2 rounded-lg bg-gray-800/50 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            
            <h2 className="text-xl font-bold text-white min-w-[200px] text-center">
              {monthName}
            </h2>
            
            <motion.button
              onClick={nextMonth}
              className="p-2 rounded-lg bg-gray-800/50 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex items-center gap-6 p-4 rounded-xl bg-gray-800/30 border border-gray-700/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm text-gray-400">Milestone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-gray-400">Goal Deadline</span>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-cyan-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-cyan-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-4">
            {days.map((day, index) => {
              const isCompleted = day.tasksCompleted > 0 && day.tasksCompleted === day.totalTasks;
              const hasPartialProgress = day.tasksCompleted > 0 && day.tasksCompleted < day.totalTasks;

              return (
                <motion.div
                  key={index}
                  className={`
                    relative aspect-square rounded-xl border-2 transition-all cursor-pointer
                    ${!day.isCurrentMonth 
                      ? "bg-gray-900/20 border-gray-800/30 opacity-40" 
                      : day.isGoalDeadline
                      ? "bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-500/50"
                      : isCompleted
                      ? "bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/50"
                      : hasPartialProgress
                      ? "bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-cyan-500/30"
                      : "bg-gray-900/30 border-gray-700/30 hover:border-cyan-500/50"
                    }
                  `}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {/* Glow effect for special days */}
                  {(day.isGoalDeadline || isCompleted || day.hasMilestone) && (
                    <motion.div
                      className={`
                        absolute -inset-1 rounded-xl blur-lg -z-10
                        ${day.isGoalDeadline 
                          ? "bg-yellow-500/20" 
                          : isCompleted 
                          ? "bg-green-500/20" 
                          : "bg-purple-500/20"
                        }
                      `}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  <div className="p-2 h-full flex flex-col">
                    {/* Date */}
                    <div className={`
                      text-sm font-medium mb-1
                      ${!day.isCurrentMonth 
                        ? "text-gray-600" 
                        : day.isGoalDeadline 
                        ? "text-yellow-400" 
                        : isCompleted 
                        ? "text-green-400" 
                        : "text-gray-300"
                      }
                    `}>
                      {day.date}
                    </div>

                    {/* Indicators */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-1">
                      {day.isGoalDeadline && (
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <Target className="w-5 h-5 text-yellow-400" />
                        </motion.div>
                      )}
                      
                      {day.hasMilestone && !day.isGoalDeadline && (
                        <Circle className="w-4 h-4 text-purple-400 fill-purple-400" />
                      )}
                      
                      {day.totalTasks > 0 && (
                        <div className="flex gap-0.5">
                          {[...Array(day.totalTasks)].map((_, i) => (
                            <div
                              key={i}
                              className={`
                                w-1.5 h-1.5 rounded-full
                                ${i < day.tasksCompleted ? "bg-green-400" : "bg-gray-600"}
                              `}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Days Completed", value: "8", color: "green" },
            { label: "Current Streak", value: "7", color: "orange" },
            { label: "Days Until Deadline", value: "22", color: "cyan" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`
                p-4 rounded-xl backdrop-blur-sm border
                ${stat.color === "green" 
                  ? "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30" 
                  : stat.color === "orange"
                  ? "bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30"
                  : "bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30"
                }
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
              <p className={`
                text-2xl font-bold
                ${stat.color === "green" 
                  ? "text-green-400" 
                  : stat.color === "orange"
                  ? "text-orange-400"
                  : "text-cyan-400"
                }
              `}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

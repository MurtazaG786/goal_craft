import API from "../../api/goalApi";
import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { ChevronLeft, ChevronRight, Circle, Target } from "lucide-react"

interface Task {
  id: number
  title: string
  difficulty: string
  xp: number
  completed: boolean
  scheduled_date?: string
}

interface Milestone {
  id: number
  title: string
  status: string
}

interface DayData {
  date: number
  tasksCompleted: number
  totalTasks: number
  hasMilestone: boolean
  isGoalDeadline: boolean
  isCurrentMonth: boolean
}

export function Calendar() {

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [goalDeadline, setGoalDeadline] = useState<string | null>(null)

  const goalId = Number(localStorage.getItem("goal_id")) || null

  useEffect(() => {
    loadCalendarData()
  }, [])

  async function loadCalendarData() {

    try {

      const dailyRes = await API.get("/goal/daily")
      const dailyData = dailyRes.data

      setTasks(dailyData)

      if (goalId) {

        const milestoneRes = await API.get(`/goal/${goalId}/milestones`)
        const milestoneData = milestoneRes.data

        setMilestones(milestoneData.milestones || [])

        const goalRes = await API.get(`/goal/${goalId}`)
        const goalData = goalRes.data

        setGoalDeadline(goalData.deadline)

      }

    } catch (err) {
      console.error("Calendar loading failed", err)
    }

  }

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  function generateCalendarDays(): DayData[] {

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: DayData[] = []

    for (let i = 0; i < firstDay; i++) {
      days.push({
        date: 0,
        tasksCompleted: 0,
        totalTasks: 0,
        hasMilestone: false,
        isGoalDeadline: false,
        isCurrentMonth: false,
      })
    }

    for (let day = 1; day <= daysInMonth; day++) {

      const dateStr = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`

      const tasksToday = tasks.filter(t => t.scheduled_date === dateStr)

      const completed = tasksToday.filter(t => t.completed).length

      const milestoneDay = milestones.length > 0 && day === 1

      const isDeadline = goalDeadline === dateStr

      days.push({
        date: day,
        tasksCompleted: completed,
        totalTasks: tasksToday.length,
        hasMilestone: milestoneDay,
        isGoalDeadline: isDeadline,
        isCurrentMonth: true,
      })

    }

    return days

  }

  const days = generateCalendarDays()

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const completedDays = tasks.filter(t => t.completed).length

  const deadlineDays = goalDeadline
    ? Math.ceil((new Date(goalDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-[#0a0e27] via-[#0d1128] to-[#0a0e27]">

      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quest Calendar
            </h1>
            <p className="text-gray-400">
              Track your progress
            </p>
          </div>

          <div className="flex items-center gap-4">

            <button onClick={prevMonth}>
              <ChevronLeft className="text-cyan-400"/>
            </button>

            <h2 className="text-xl font-bold text-white">
              {monthName}
            </h2>

            <button onClick={nextMonth}>
              <ChevronRight className="text-cyan-400"/>
            </button>

          </div>

        </div>

        <div className="grid grid-cols-7 gap-4">

          {days.map((day,index) => {

            if (!day.isCurrentMonth)
              return <div key={index} />

            const completed =
              day.tasksCompleted > 0 &&
              day.tasksCompleted === day.totalTasks

            return (
              <motion.div
                key={index}
                className={`p-4 rounded-xl border
                ${completed
                  ? "bg-green-900/40 border-green-500"
                  : "bg-gray-900/40 border-gray-700"}
                `}
              >

                <div className="text-sm text-gray-300">
                  {day.date}
                </div>

                {day.isGoalDeadline && (
                  <Target className="text-yellow-400 w-5 h-5"/>
                )}

                {day.hasMilestone && (
                  <Circle className="text-purple-400 w-4 h-4"/>
                )}

              </motion.div>
            )

          })}

        </div>

        <div className="grid grid-cols-3 gap-4">

          <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
            <p className="text-gray-400 text-sm">
              Completed Tasks
            </p>
            <p className="text-green-400 text-2xl font-bold">
              {completedDays}
            </p>
          </div>

          <div className="p-4 bg-orange-900/20 border border-orange-500/30 rounded-xl">
            <p className="text-gray-400 text-sm">
              Current Streak
            </p>
            <p className="text-orange-400 text-2xl font-bold">
              {completedDays}
            </p>
          </div>

          <div className="p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-xl">
            <p className="text-gray-400 text-sm">
              Days Until Deadline
            </p>
            <p className="text-cyan-400 text-2xl font-bold">
              {deadlineDays}
            </p>
          </div>

        </div>

      </div>

    </div>
  )

}
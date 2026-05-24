import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import * as Progress from "@radix-ui/react-progress";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function TopNavigation() {
  const { user } = useAuth();
  const xp = user?.xp ?? 0;
  const avatar = user?.avatar || "🧑‍🚀";
  const [bounceKey, setBounceKey] = useState(0)
  const [spinKey, setSpinKey] = useState(0)

  // XP curve (same as Profile)
  function xpForLevel(level:number){
    return 100 + (level-1)*50
  }

  function calculateLevel(totalXP:number){

    let level = 1
    let xpRemaining = totalXP

    while(xpRemaining >= xpForLevel(level)){
      xpRemaining -= xpForLevel(level)
      level++
    }

    return {
      level,
      currentXP: xpRemaining,
      xpToNext: xpForLevel(level)
    }

  }

  const {level,currentXP,xpToNext} = calculateLevel(xp)

  const xpPercentage = (currentXP / xpToNext) * 100

  useEffect(() => {
    const handleQuestCompleted = () => {
      setBounceKey((prev) => prev + 1)
    }

    const handleLevelUp = () => {
      setSpinKey((prev) => prev + 1)
    }

    window.addEventListener("questCompleted", handleQuestCompleted)
    window.addEventListener("levelUp", handleLevelUp)

    return () => {
      window.removeEventListener("questCompleted", handleQuestCompleted)
      window.removeEventListener("levelUp", handleLevelUp)
    }
  }, [])

  const isAvatarUrl = avatar.startsWith("http")

  return(

  <nav className="h-20 bg-gradient-to-r from-[#0a0e27] via-[#0d1128] to-[#0a0e27] border-b border-cyan-500/20 backdrop-blur-xl">

  <div className="h-full px-6 flex items-center justify-between">

  {/* LOGO */}

  <div className="flex items-center gap-3">

  <motion.div
  className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50"
  whileHover={{scale:1.05,rotate:5}}
  >

  <Sparkles className="w-6 h-6 text-white"/>

  </motion.div>

  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
  GoalCraft
  </h1>

  </div>

  {/* XP BAR */}

  <div className="flex-1 max-w-md mx-8">

  <div className="space-y-2">

  <div className="flex items-center justify-between text-xs">

  <span className="text-cyan-400">
  Level {level}
  </span>

  <span className="text-gray-400">
  {currentXP} / {xpToNext} XP
  </span>

  </div>

  <Progress.Root
  className="relative h-3 w-full overflow-hidden rounded-full bg-gray-800/50 border border-cyan-500/20"
  value={xpPercentage}
  >

  <Progress.Indicator
  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500 relative"
  style={{width:`${xpPercentage}%`}}
  >

  <motion.div
  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
  animate={{x:["-100%","200%"]}}
  transition={{
  duration:2,
  repeat:Infinity,
  ease:"linear"
  }}
  />

  </Progress.Indicator>

  </Progress.Root>

  </div>

  </div>

  {/* RIGHT SIDE */}

  <div className="flex items-center gap-4">

  {/* Mascot */}

  <motion.div
  key={`spin-${spinKey}`}
  className="flex items-center justify-center"
  animate={{ rotate: spinKey > 0 ? [0, 360] : 0 }}
  transition={{ duration: 0.8, ease: "easeInOut" }}
  >

  <motion.span
  key={`bounce-${bounceKey}`}
  className="text-3xl"
  animate={{ y: bounceKey > 0 ? [0, -10, 0] : 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  >

  {isAvatarUrl ? (
    <img src={avatar} alt="Mascot avatar" className="w-8 h-8" />
  ) : (
    avatar
  )}

  </motion.span>

  </motion.div>

  {/* LEVEL BADGE */}

  <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">

  <span className="text-sm font-bold text-yellow-400">
  Level {level}
  </span>

  </div>

  {/* USER AVATAR */}

  <motion.div
  className="w-12 h-12 flex items-center justify-center text-3xl rounded-full border-2 border-cyan-400/50"
  whileHover={{scale:1.1}}
  >

  <div className="w-10 h-10 rounded-full bg-gray-800 border border-cyan-500/30 flex items-center justify-center overflow-hidden">
  {isAvatarUrl ? (
    <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
  ) : (
    <span className="text-xl">{avatar}</span>
  )}
  </div>
  </motion.div>

  </div>

  </div>

  </nav>

  )

}
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import * as Progress from "@radix-ui/react-progress";
import { useState, useEffect } from "react";

export function TopNavigation() {

  const [xp, setXP] = useState(0)
  const [avatar, setAvatar] = useState("🧑‍🚀")
  const [mascotExpression, setMascotExpression] = useState("🚀")

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

  // Sync with localStorage
  useEffect(()=>{

    function loadUserData(){

      const storedXP = Number(localStorage.getItem("xp")) || 0
      const storedAvatar = localStorage.getItem("avatar") || "🧑‍🚀"

      setXP(storedXP)
      setAvatar(storedAvatar)

    }

    loadUserData()

    const interval = setInterval(loadUserData,1000)

    return ()=>clearInterval(interval)

  },[])

  // Mascot reaction
  useEffect(()=>{

    if(xpPercentage > 80){
      setMascotExpression("🎉")
    }
    else if(xpPercentage > 50){
      setMascotExpression("😎")
    }
    else if(xpPercentage > 20){
      setMascotExpression("🚀")
    }
    else{
      setMascotExpression("💪")
    }

  },[xpPercentage])

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
  className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg cursor-pointer"
  animate={{y:[0,-4,0]}}
  transition={{
  duration:2,
  repeat:Infinity,
  ease:"easeInOut"
  }}
  >

  <motion.span
  className="text-2xl"
  key={mascotExpression}
  initial={{scale:0}}
  animate={{scale:1}}
  >

  {mascotExpression}

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

  {avatar}

  </motion.div>

  </div>

  </div>

  </nav>

  )

}
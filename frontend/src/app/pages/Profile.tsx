import { motion } from "motion/react"
import { useState, useEffect } from "react"
import { Award, Pencil } from "lucide-react"

interface Task {
  id:number
  completed:boolean
}

interface Achievement {
  id:number
  title:string
  description:string
  icon:string
  xp:number
  unlocked:boolean
}

const avatarList = [
"🧙","🧑‍🚀","🐱","🐸","🐼","🦊","🐵","👾","🤖","🐯","🐨","🐧"
]

export function Profile(){

const [avatar,setAvatar] = useState(localStorage.getItem("avatar") || "🧑‍🚀")
const [name,setName] = useState(localStorage.getItem("username") || "GoalCraft Adventurer")

const [editOpen,setEditOpen] = useState(false)
const [tempAvatar,setTempAvatar] = useState(avatar)
const [tempName,setTempName] = useState(name)

const [tasks,setTasks] = useState<Task[]>([])
const [xp,setXP] = useState(Number(localStorage.getItem("xp")) || 0)

function xpForLevel(level:number){
return 100 + (level-1)*50
}

function calculateLevel(totalXP:number){

let level=1
let xpRemaining=totalXP

while(xpRemaining>=xpForLevel(level)){
xpRemaining-=xpForLevel(level)
level++
}

return {level,currentXP:xpRemaining,xpToNext:xpForLevel(level)}
}

const {level,currentXP,xpToNext} = calculateLevel(xp)
const progress = (currentXP/xpToNext)*100

const [achievements,setAchievements] = useState<Achievement[]>([
{ id:1,title:"First Quest",description:"Complete your first task",icon:"🎯",xp:50,unlocked:false},
{ id:2,title:"Getting Serious",description:"Complete 10 tasks",icon:"⚡",xp:100,unlocked:false},
{ id:3,title:"Productivity Mode",description:"Complete 25 tasks",icon:"🚀",xp:150,unlocked:false},
{ id:4,title:"Task Destroyer",description:"Complete 50 tasks",icon:"💥",xp:250,unlocked:false},
{ id:5,title:"Legend Begins",description:"Reach Level 5",icon:"👑",xp:200,unlocked:false},
{ id:6,title:"Mastermind",description:"Reach Level 10",icon:"🧠",xp:400,unlocked:false},
{ id:7,title:"Unstoppable",description:"Complete 100 tasks",icon:"🏆",xp:500,unlocked:false}
])

useEffect(()=>{
loadProfile()
},[])

async function loadProfile(){

try{

const res = await fetch("http://localhost:8000/goal/daily")
const data = await res.json()

setTasks(data)
checkAchievements(data)

}catch(err){
console.error("profile load error",err)
}

}

function addXP(amount:number){

const newXP = xp + amount
setXP(newXP)
localStorage.setItem("xp",String(newXP))

}

function checkAchievements(taskList:Task[]){

const completed = taskList.filter(t=>t.completed).length

setAchievements(prev =>
prev.map(a=>{

if(a.unlocked) return a

let unlock=false

if(a.id===1 && completed>=1) unlock=true
if(a.id===2 && completed>=10) unlock=true
if(a.id===3 && completed>=25) unlock=true
if(a.id===4 && completed>=50) unlock=true
if(a.id===5 && level>=5) unlock=true
if(a.id===6 && level>=10) unlock=true
if(a.id===7 && completed>=100) unlock=true

if(unlock){
addXP(a.xp)
return {...a,unlocked:true}
}

return a

})
)

}

function saveProfile(){

setAvatar(tempAvatar)
setName(tempName)

localStorage.setItem("avatar",tempAvatar)
localStorage.setItem("username",tempName)

setEditOpen(false)

}

const completedTasks = tasks.filter(t=>t.completed).length

return(

<div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-[#0a0e27] via-[#0d1128] to-[#0a0e27]">

<div className="max-w-6xl mx-auto space-y-8">

{/* PROFILE HEADER */}

<motion.div
className="p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 backdrop-blur-sm border border-purple-500/30"
initial={{opacity:0,y:-20}}
animate={{opacity:1,y:0}}
>

<div className="flex flex-col md:flex-row items-center gap-8">

<div className="relative">

<div className="text-7xl">
{avatar}
</div>

<button
onClick={()=>{

setTempAvatar(avatar)
setTempName(name)
setEditOpen(true)

}}
className="absolute bottom-0 right-0 p-2 bg-black rounded-full border border-cyan-400"
>

<Pencil size={14}/>

</button>

</div>

<div className="flex-1 text-center md:text-left">

<h1 className="text-3xl font-bold text-white mb-2">
{name}
</h1>

<p className="text-cyan-400 mb-4">
Level {level}
</p>

<div className="h-4 bg-gray-800 rounded-full overflow-hidden">

<motion.div
className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
initial={{width:0}}
animate={{width:`${progress}%`}}
transition={{duration:1}}
/>

</div>

<p className="text-sm text-gray-400 mt-2">
{currentXP} / {xpToNext} XP
</p>

</div>

</div>

</motion.div>

{/* STATS */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

<div className="p-5 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
<p className="text-gray-400 text-sm">Total XP</p>
<p className="text-yellow-400 text-2xl font-bold">{xp}</p>
</div>

<div className="p-5 bg-cyan-900/20 border border-cyan-500/30 rounded-xl">
<p className="text-gray-400 text-sm">Tasks Completed</p>
<p className="text-cyan-400 text-2xl font-bold">{completedTasks}</p>
</div>

<div className="p-5 bg-purple-900/20 border border-purple-500/30 rounded-xl">
<p className="text-gray-400 text-sm">Level</p>
<p className="text-purple-400 text-2xl font-bold">{level}</p>
</div>

<div className="p-5 bg-orange-900/20 border border-orange-500/30 rounded-xl">
<p className="text-gray-400 text-sm">Achievements</p>
<p className="text-orange-400 text-2xl font-bold">
{achievements.filter(a=>a.unlocked).length}
</p>
</div>

</div>

{/* ACHIEVEMENTS */}

<div>

<div className="flex items-center gap-3 mb-6">

<Award className="w-6 h-6 text-yellow-400"/>
<h2 className="text-2xl font-bold text-white">
Achievements
</h2>

</div>

<div className="grid md:grid-cols-3 gap-4">

{achievements.map(a=>(
<motion.div
key={a.id}
className={`p-5 rounded-xl border
${a.unlocked
?"bg-yellow-900/20 border-yellow-500/30"
:"bg-gray-900/20 border-gray-700/30"}
`}
whileHover={{scale:1.02}}
>

<div className="flex items-start gap-4">

<div className={`text-4xl ${!a.unlocked && "grayscale opacity-40"}`}>
{a.icon}
</div>

<div>

<h3 className={`font-bold ${a.unlocked?"text-yellow-400":"text-gray-500"}`}>
{a.title}
</h3>

<p className="text-sm text-gray-400">
{a.description}
</p>

{a.unlocked && (
<p className="text-xs text-green-400 mt-1">
+{a.xp} XP
</p>
)}

</div>

</div>

</motion.div>
))}

</div>

</div>

</div>

{/* EDIT PROFILE MODAL */}

{editOpen && (

<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

<motion.div
className="bg-[#0d1128] p-6 rounded-xl w-[420px]"
initial={{scale:0.8}}
animate={{scale:1}}
>

<h2 className="text-xl font-bold mb-4 text-white">
Edit Profile
</h2>

<input
value={tempName}
onChange={(e)=>setTempName(e.target.value)}
className="w-full p-3 rounded bg-gray-800 mb-4 text-white"
/>

<div className="grid grid-cols-6 gap-3 mb-6">

{avatarList.map(a=>(
<button
key={a}
onClick={()=>setTempAvatar(a)}
className={`text-3xl p-2 rounded
${tempAvatar===a?"bg-cyan-500":"bg-gray-800"}
`}
>
{a}
</button>
))}

</div>

<div className="flex justify-end gap-3">

<button
onClick={()=>setEditOpen(false)}
className="px-4 py-2 bg-gray-700 rounded"
>
Cancel
</button>

<button
onClick={saveProfile}
className="px-4 py-2 bg-cyan-500 rounded"
>
Save
</button>

</div>

</motion.div>

</div>

)}

</div>

)

}
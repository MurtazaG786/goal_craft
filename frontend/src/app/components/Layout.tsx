import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { TopNavigation } from "./TopNavigation";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const [currentXP, setCurrentXP] = useState(450);
  const [level, setLevel] = useState(5);
  const xpToNextLevel = 1000;
  const location = useLocation();

  const handleXPGain = (xp: number) => {
    const newXP = currentXP + xp;
    
    if (newXP >= xpToNextLevel) {
      setLevel(prev => prev + 1);
      setCurrentXP(newXP - xpToNextLevel);
    } else {
      setCurrentXP(newXP);
    }
  };

  // Determine active menu item from current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    if (path === "/create-goal") return "create-goal";
    if (path === "/calendar") return "calendar";
    if (path === "/milestone-journey") return "milestone";
    if (path === "/side-quests") return "quests";
    if (path === "/profile") return "profile";
    return "dashboard";
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0e27] text-white flex flex-col">
      <TopNavigation
        currentXP={currentXP}
        xpToNextLevel={xpToNextLevel}
        level={level}
        userAvatar="https://images.unsplash.com/photo-1712168567859-e24cbc155219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGF2YXRhciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjgzMzQ2MXww&ixlib=rb-4.1.0&q=80&w=1080"
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeItem={getActiveItem()} />
        
        <main className="flex-1 overflow-hidden">
          <Outlet context={{ onXPGain: handleXPGain }} />
        </main>
      </div>
    </div>
  );
}

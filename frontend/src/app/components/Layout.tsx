import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { TopNavigation } from "./TopNavigation";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import { LevelUpOverlay } from "./LevelUpOverlay";

export function Layout() {
  const location = useLocation();
  const { user } = useAuth();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [leveledTo, setLeveledTo] = useState<number | null>(null);
  const previousLevel = useRef<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const prev = previousLevel.current;
    if (prev !== null && user.level > prev) {
      setLeveledTo(user.level);
      setShowLevelUp(true);
      window.dispatchEvent(new CustomEvent("levelUp"));
    }

    previousLevel.current = user.level;
  }, [user]);

  useEffect(() => {
    if (!showLevelUp) return;

    const timer = setTimeout(() => {
      setShowLevelUp(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, [showLevelUp]);

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
      <TopNavigation />
      <LevelUpOverlay level={leveledTo} show={showLevelUp} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeItem={getActiveItem()} />
        
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

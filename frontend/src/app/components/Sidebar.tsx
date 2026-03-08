import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  Calendar, 
  Target, 
  Zap, 
  User,
  PlusCircle
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

interface SidebarProps {
  activeItem?: string;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { id: "create-goal", label: "Create Goal", icon: PlusCircle, path: "/create-goal" },
  { id: "calendar", label: "Calendar", icon: Calendar, path: "/calendar" },
  { id: "milestone", label: "Milestone Journey", icon: Target, path: "/milestone-journey" },
  { id: "quests", label: "Side Quests", icon: Zap, path: "/side-quests" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

export function Sidebar({ activeItem = "dashboard" }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside className="w-64 h-full bg-gradient-to-b from-[#0a0e27] to-[#0d1128] border-r border-cyan-500/20 backdrop-blur-xl">
      <div className="p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <Link key={item.id} to={item.path}>
              <motion.button
                className="w-full relative"
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div
                  className={`
                    relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                    ${isActive 
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50" 
                      : "bg-gray-800/20 border border-transparent hover:border-cyan-500/30"
                    }
                  `}
                >
                  {/* Glow effect */}
                  {(isActive || isHovered) && (
                    <motion.div
                      className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-lg -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 0.6 : 0.3 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    animate={{
                      rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
                      scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    <Icon 
                      className={`w-5 h-5 ${
                        isActive ? "text-cyan-400" : "text-gray-400"
                      }`} 
                    />
                  </motion.div>

                  {/* Label */}
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-cyan-400" : "text-gray-300"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="ml-auto w-2 h-2 rounded-full bg-cyan-400"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                </div>
              </motion.button>
            </Link>
          );
        })}
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 left-6 right-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.4)",
                  "0 0 30px rgba(168, 85, 247, 0.6)",
                  "0 0 20px rgba(168, 85, 247, 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-lg">✨</span>
            </motion.div>
            <div>
              <p className="text-xs text-gray-400">Keep going!</p>
              <p className="text-sm font-bold text-purple-400">7 day streak</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
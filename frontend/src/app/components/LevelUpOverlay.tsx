import { motion, AnimatePresence } from "motion/react";
import { Confetti } from "./Confetti";

interface LevelUpOverlayProps {
  level: number | null;
  show: boolean;
}

export function LevelUpOverlay({ level, show }: LevelUpOverlayProps) {
  return (
    <AnimatePresence>
      {show && level !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Confetti active={show} />
          <motion.div
            className="relative px-10 py-8 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-400/40 shadow-2xl"
            initial={{ scale: 0.6, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <motion.div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-2xl"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-2">Level Up</p>
              <motion.h2
                className="text-4xl md:text-5xl font-extrabold text-white"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                Level {level}
              </motion.h2>
              <p className="text-sm text-gray-300 mt-3">New powers unlocked. Keep pushing.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

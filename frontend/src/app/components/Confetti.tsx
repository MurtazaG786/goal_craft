import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ConfettiProps {
  active?: boolean;
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
}

const colors = [
  "#06b6d4", // cyan
  "#8b5cf6", // purple
  "#eab308", // yellow
  "#ec4899", // pink
  "#3b82f6", // blue
  "#f97316", // orange
];

export function Confetti({ active = true, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.3,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${piece.x}%`,
            top: -20,
            backgroundColor: piece.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: [1, 1, 0],
            rotate: Math.random() * 720 - 360,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: piece.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
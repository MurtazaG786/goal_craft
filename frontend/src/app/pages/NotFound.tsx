import { motion } from "motion/react";
import { Link } from "react-router";
import { Home, Search } from "lucide-react";

export function NotFound() {
  return (
    <div className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-[#0a0e27] via-[#0d1128] to-[#0a0e27]">
      <div className="text-center">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-4 border-cyan-500/30 mb-6"
            animate={{
              boxShadow: [
                "0 0 30px rgba(6, 182, 212, 0.3)",
                "0 0 50px rgba(6, 182, 212, 0.5)",
                "0 0 30px rgba(6, 182, 212, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Search className="w-16 h-16 text-cyan-400" />
          </motion.div>
          
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              404
            </span>
          </h1>
          
          <h2 className="text-2xl font-bold text-white mb-3">
            Quest Not Found
          </h2>
          
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Looks like you've wandered off the map! This page doesn't exist in your adventure.
          </p>
        </motion.div>

        <Link to="/">
          <motion.button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5" />
            Return to Dashboard
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export default function GlassCard({ className, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("glass-panel rounded-3xl p-6 shadow-glass", className)}
    >
      {children}
    </motion.div>
  );
}

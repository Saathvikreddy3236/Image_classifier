import { AnimatePresence, motion } from "framer-motion";

export default function Modal({ open, title, children, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="glass-panel w-full max-w-lg rounded-3xl p-6 shadow-glass"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">{title}</h3>
              <button onClick={onClose} className="rounded-full px-3 py-1 text-sm text-slate-500">
                Close
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

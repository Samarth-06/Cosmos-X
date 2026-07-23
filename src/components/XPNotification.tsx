import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface XPNotificationProps {
  amount: number;
  label?: string;
  visible: boolean;
  onHide: () => void;
}

export default function XPNotification({ amount, label = "Task Complete!", visible, onHide }: XPNotificationProps) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 2800);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-amber-950/90 px-5 py-3.5 shadow-[0_0_40px_rgba(245,158,11,0.3)] backdrop-blur-xl"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40">
            <Zap className="h-4 w-4 fill-current" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400/80">{label}</div>
            <div className="mt-0.5 font-display text-lg font-bold text-amber-300">+{amount} XP</div>
          </div>
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 2.6, ease: "linear" }}
            className="absolute bottom-0 left-0 h-0.5 rounded-full bg-amber-500/60"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for triggering XP notifications
export function useXPNotification() {
  const [notification, setNotification] = useState<{ amount: number; label: string; key: number } | null>(null);

  const show = (amount: number, label = "Task Complete!") => {
    setNotification({ amount, label, key: Date.now() });
  };

  const hide = () => setNotification(null);

  return { notification, show, hide };
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";

const STAT_LABEL: Record<string, string> = {
  vitality: "Vitality",
  intelligence: "Intelligence",
  focus: "Focus",
  social: "Social",
};

export function XpToast({
  toast,
  onDone,
}: {
  toast: { id: number; xp: number; statDelta: number; statName: string } | null;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onDone, 900);
    return () => window.clearTimeout(timer);
  }, [toast, onDone]);

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          key={toast.id}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-accent-success/40 bg-surface-raised px-5 py-3 shadow-2xl"
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          initial={{ opacity: 0, y: -18, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Sparkles className="h-4 w-4 text-accent-success" aria-hidden />
          <span className="font-mono text-sm text-accent-success">+{toast.xp} XP</span>
          <span className="text-sm text-text-secondary">
            {STAT_LABEL[toast.statName] ?? toast.statName} +{toast.statDelta}
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

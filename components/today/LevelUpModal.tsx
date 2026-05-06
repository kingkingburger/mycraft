"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Trophy } from "lucide-react";

export function LevelUpModal({
  levelUp,
  onClose,
}: {
  levelUp?: { from: number; to: number };
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {levelUp ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-sm rounded-lg border border-surface-line bg-surface-raised p-6 text-center shadow-2xl"
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
          >
            <Trophy className="mx-auto h-10 w-10 text-accent-warning" aria-hidden />
            <h2 className="mt-4 text-2xl font-semibold text-text-primary">Level {levelUp.to}</h2>
            <p className="mt-2 text-sm text-text-secondary">Lv {levelUp.from}에서 한 단계 성장했습니다.</p>
            <button
              className="mt-6 h-11 w-full rounded-md bg-text-primary px-4 text-sm font-semibold text-surface-base"
              onClick={onClose}
            >
              확인
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

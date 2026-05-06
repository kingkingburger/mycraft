import { Brain, Dumbbell, Sparkles, Users } from "lucide-react";
import type { StatName, UserState } from "@/lib/domain";

const STAT_META: Record<StatName, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  vitality: { label: "Vitality", color: "text-stat-vitality", icon: Dumbbell },
  intelligence: { label: "Intelligence", color: "text-stat-intelligence", icon: Brain },
  focus: { label: "Focus", color: "text-stat-focus", icon: Sparkles },
  social: { label: "Social", color: "text-stat-social", icon: Users },
};

export function StatPanel({ state }: { state?: UserState }) {
  const stats: StatName[] = ["vitality", "intelligence", "focus", "social"];

  return (
    <section className="rounded-lg border border-surface-line bg-surface-raised p-4">
      <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-text-secondary">Stats</h2>
      <div className="mt-4 grid gap-3">
        {stats.map((name) => {
          const meta = STAT_META[name];
          const Icon = meta.icon;

          return (
            <div key={name} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Icon className={`h-5 w-5 ${meta.color}`} aria-hidden />
                <span className="truncate text-sm text-text-primary">{meta.label}</span>
              </div>
              <span className={`font-mono text-lg ${meta.color}`}>{state?.[name] ?? 0}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-surface-line pt-4 text-sm">
        <div>
          <div className="text-text-secondary">Streak</div>
          <div className="mt-1 font-mono text-lg text-text-primary">{state?.currentStreakDays ?? 0}d</div>
        </div>
        <div>
          <div className="text-text-secondary">Best</div>
          <div className="mt-1 font-mono text-lg text-text-primary">{state?.longestStreakDays ?? 0}d</div>
        </div>
      </div>
    </section>
  );
}

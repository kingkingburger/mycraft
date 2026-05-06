export function LevelBar({
  level,
  xpInLevel,
  xpToNext,
}: {
  level: number;
  xpInLevel: number;
  xpToNext: number;
}) {
  const progress = xpToNext > 0 ? Math.min((xpInLevel / xpToNext) * 100, 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-text-primary">Lv {level}</span>
        <span className="font-mono text-xs text-text-secondary">
          {xpInLevel}/{xpToNext}
        </span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-accent-success transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

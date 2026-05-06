"use client";

import { CalendarDays, Plus, RotateCw } from "lucide-react";
import { useMemo, useState } from "react";
import { AddCategorySheet } from "@/components/today/AddCategorySheet";
import { CategoryCard } from "@/components/today/CategoryCard";
import { LevelBar } from "@/components/today/LevelBar";
import { LevelUpModal } from "@/components/today/LevelUpModal";
import { StatPanel } from "@/components/today/StatPanel";
import { XpToast } from "@/components/today/XpToast";
import { useCategories } from "@/hooks/useCategories";
import { useCreateLog, useLogs } from "@/hooks/useLogs";
import { useStats } from "@/hooks/useStats";
import type { CreateLogResponse } from "@/lib/domain";
import { todayDateKey } from "@/lib/timezone";

type ToastState = {
  id: number;
  xp: number;
  statDelta: number;
  statName: string;
};

export function TodayScreen() {
  const date = useMemo(() => todayDateKey(), []);
  const categories = useCategories();
  const logs = useLogs(date);
  const stats = useStats(date);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [levelUp, setLevelUp] = useState<CreateLogResponse["levelUp"]>(undefined);
  const [sheetOpen, setSheetOpen] = useState(false);

  const createLog = useCreateLog(date, (response) => {
    const category = categories.data?.find((candidate) => candidate.id === response.log.categoryId);
    setToast({
      id: Date.now(),
      xp: response.xpEarned,
      statDelta: response.statDelta,
      statName: category?.mappedStat ?? "stat",
    });
    setLevelUp(response.levelUp);
  });

  const summary = logs.data?.summary ?? { totalXp: 0, byCategory: {} };
  const userState = stats.data?.userState;
  const isLoading = categories.isLoading || logs.isLoading || stats.isLoading;
  const hasError = categories.isError || logs.isError || stats.isError;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-5 md:px-6 md:py-8">
      <header className="grid gap-4 md:grid-cols-[minmax(0,1fr)_360px] md:items-end">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2 text-sm text-text-secondary">
            <CalendarDays className="h-4 w-4" aria-hidden />
            <span>{date}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-normal text-text-primary md:text-5xl">오늘의 루틴</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary md:text-base">
            활동을 기록하면 XP와 스탯이 즉시 반영된다.
          </p>
        </div>

        <div className="rounded-lg border border-surface-line bg-surface-raised p-4">
          <LevelBar
            level={userState?.level ?? 1}
            xpInLevel={userState?.xpInLevel ?? 0}
            xpToNext={userState?.xpToNext ?? 50}
          />
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-sm text-text-secondary">오늘 획득</span>
            <strong className="font-mono text-2xl text-accent-success">+{summary.totalXp} XP</strong>
          </div>
        </div>
      </header>

      {hasError ? (
        <section className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-lg border border-surface-line bg-surface-raised px-6 text-center">
          <RotateCw className="h-8 w-8 text-accent-warning" aria-hidden />
          <h2 className="text-lg font-semibold">데이터를 불러오지 못했습니다</h2>
          <button
            className="rounded-md bg-text-primary px-4 py-2 text-sm font-semibold text-surface-base"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </section>
      ) : (
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-text-secondary">Activities</h2>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-md border border-surface-line px-3 text-sm text-text-primary hover:bg-surface-muted"
                onClick={() => setSheetOpen(true)}
              >
                <Plus className="h-4 w-4" aria-hidden />
                추가
              </button>
            </div>

            <div className="grid gap-3">
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-24 animate-pulse rounded-lg bg-surface-raised" />
                  ))
                : categories.data?.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      today={summary.byCategory[category.id]}
                      isSaving={createLog.isPending}
                      onSave={(value, note) =>
                        createLog.mutate({
                          categoryId: category.id,
                          logDate: date,
                          value,
                          note,
                        })
                      }
                    />
                  ))}
            </div>
          </div>

          <aside className="grid content-start gap-4">
            <StatPanel state={userState} />
            <section className="rounded-lg border border-surface-line bg-surface-raised p-4">
              <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-text-secondary">Recent</h2>
              <div className="mt-4 grid gap-3">
                {logs.data?.logs.length ? (
                  logs.data.logs.slice(0, 6).map((log) => {
                    const category = categories.data?.find((candidate) => candidate.id === log.categoryId);
                    return (
                      <div key={log.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate text-text-primary">
                          {category?.emoji} {category?.name}
                        </span>
                        <span className="font-mono text-accent-success">+{log.xpEarned} XP</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm leading-6 text-text-secondary">아직 오늘 기록이 없습니다.</p>
                )}
              </div>
            </section>
          </aside>
        </section>
      )}

      <AddCategorySheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      <XpToast toast={toast} onDone={() => setToast(null)} />
      <LevelUpModal levelUp={levelUp} onClose={() => setLevelUp(undefined)} />
    </main>
  );
}

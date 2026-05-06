import type { RoutineUnit, StatName, UserState } from "@/lib/domain";

const CATEGORY_DAILY_CAP = 100;

export function computeXp(
  unit: RoutineUnit,
  value: number | null | undefined,
  dailyExisting: { count: number; xp: number },
): { xp: number; capped: boolean } {
  const normalizedValue = normalizeValue(value);
  const baseXp = 10;
  const timeBonus = unit === "minutes" && normalizedValue ? Math.floor(normalizedValue / 10) * 5 : 0;
  const countBonus = unit === "count" && normalizedValue ? Math.min(Math.max(normalizedValue - 1, 0) * 5, 20) : 0;
  const rawXp = baseXp + Math.max(timeBonus, countBonus);
  const remaining = Math.max(CATEGORY_DAILY_CAP - dailyExisting.xp, 0);
  const xp = Math.min(rawXp, remaining);

  return {
    xp,
    capped: xp < rawXp,
  };
}

export function statDeltaFromXp(xp: number): number {
  return Math.floor(xp / 10);
}

export function xpToNextLevel(level: number): number {
  return level * level * 50;
}

export function levelFromTotalXp(totalXp: number): { level: number; xpInLevel: number; xpToNext: number } {
  let level = 1;
  let remainingXp = Math.max(Math.floor(totalXp), 0);
  let next = xpToNextLevel(level);

  while (remainingXp >= next) {
    remainingXp -= next;
    level += 1;
    next = xpToNextLevel(level);
  }

  return {
    level,
    xpInLevel: remainingXp,
    xpToNext: next,
  };
}

export function applyXpToState(
  state: UserState,
  stat: StatName,
  xp: number,
  statDelta: number,
  logDate: string,
): { state: UserState; levelUp?: { from: number; to: number } } {
  const previousLevel = state.level;
  const totalXp = state.totalXp + xp;
  const level = levelFromTotalXp(totalXp);
  const streak = nextStreak(state, logDate);

  const nextState: UserState = {
    ...state,
    totalXp,
    level: level.level,
    xpInLevel: level.xpInLevel,
    xpToNext: level.xpToNext,
    [stat]: state[stat] + statDelta,
    currentStreakDays: streak.current,
    longestStreakDays: Math.max(state.longestStreakDays, streak.current),
    lastLogDate: maxDateKey(state.lastLogDate, logDate),
  };

  return {
    state: nextState,
    levelUp: level.level > previousLevel ? { from: previousLevel, to: level.level } : undefined,
  };
}

function normalizeValue(value: number | null | undefined): number | null {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return Math.max(Math.floor(value), 0);
}

function nextStreak(state: UserState, logDate: string): { current: number } {
  if (!state.lastLogDate) return { current: 1 };
  if (state.lastLogDate === logDate) return { current: state.currentStreakDays || 1 };

  const previous = parseDateKey(state.lastLogDate);
  const current = parseDateKey(logDate);
  const dayDiff = Math.round((current.getTime() - previous.getTime()) / 86_400_000);

  if (dayDiff === 1) return { current: state.currentStreakDays + 1 };
  if (dayDiff > 1) return { current: 1 };
  return { current: state.currentStreakDays || 1 };
}

function parseDateKey(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

function maxDateKey(left: string | null, right: string): string {
  if (!left) return right;
  return left > right ? left : right;
}

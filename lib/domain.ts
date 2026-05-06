export type StatName = "vitality" | "intelligence" | "focus" | "social";
export type RoutineUnit = "minutes" | "count";

export type Category = {
  id: string;
  name: string;
  emoji: string;
  mappedStat: StatName;
  unit: RoutineUnit;
  isDefault: boolean;
  displayOrder: number;
};

export type LogEntry = {
  id: string;
  categoryId: string;
  logDate: string;
  value: number | null;
  note: string | null;
  xpEarned: number;
  statDelta: number;
  createdAt: string;
};

export type UserState = {
  totalXp: number;
  level: number;
  xpInLevel: number;
  xpToNext: number;
  vitality: number;
  intelligence: number;
  focus: number;
  social: number;
  currentStreakDays: number;
  longestStreakDays: number;
  lastLogDate: string | null;
};

export type TodaySummary = {
  totalXp: number;
  byCategory: Record<string, { count: number; xp: number }>;
};

export type CreateLogInput = {
  categoryId: string;
  logDate: string;
  value?: number | null;
  note?: string | null;
};

export type CreateLogResponse = {
  log: LogEntry;
  xpEarned: number;
  statDelta: number;
  state: UserState;
  summary: TodaySummary;
  levelUp?: {
    from: number;
    to: number;
  };
};

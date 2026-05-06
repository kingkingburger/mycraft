import { DEFAULT_CATEGORIES } from "@/lib/default-data";
import type { Category, CreateLogInput, CreateLogResponse, LogEntry, TodaySummary, UserState } from "@/lib/domain";
import { applyXpToState, computeXp, levelFromTotalXp, statDeltaFromXp } from "@/lib/xp";

type Store = {
  categories: Category[];
  logs: LogEntry[];
  state: UserState;
};

const globalStore = globalThis as typeof globalThis & { __mycraftStore?: Store };

export function getStore(): Store {
  if (!globalStore.__mycraftStore) {
    globalStore.__mycraftStore = {
      categories: [...DEFAULT_CATEGORIES],
      logs: [],
      state: initialState(),
    };
  }

  return globalStore.__mycraftStore;
}

export function listCategories(): Category[] {
  return [...getStore().categories].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function addCategory(input: Pick<Category, "name" | "emoji" | "mappedStat" | "unit">): Category {
  const store = getStore();
  const normalizedName = input.name.trim();

  if (!normalizedName) {
    throw new StoreError("카테고리 이름이 필요합니다.", 400);
  }

  if (store.categories.some((category) => category.name === normalizedName)) {
    throw new StoreError("이미 있는 카테고리입니다.", 409);
  }

  const category: Category = {
    id: crypto.randomUUID(),
    name: normalizedName,
    emoji: input.emoji.trim() || "✨",
    mappedStat: input.mappedStat,
    unit: input.unit,
    isDefault: false,
    displayOrder: store.categories.length * 10 + 10,
  };

  store.categories.push(category);
  return category;
}

export function listLogs(date: string): { logs: LogEntry[]; summary: TodaySummary } {
  const logs = getStore()
    .logs.filter((log) => log.logDate === date)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    logs,
    summary: summarize(logs),
  };
}

export function getState(date: string): { userState: UserState; today: TodaySummary } {
  return {
    userState: getStore().state,
    today: listLogs(date).summary,
  };
}

export function createLog(input: CreateLogInput): CreateLogResponse {
  const store = getStore();
  const category = store.categories.find((candidate) => candidate.id === input.categoryId);

  if (!category) {
    throw new StoreError("카테고리를 찾을 수 없습니다.", 404);
  }

  const value = normalizeValue(input.value);
  const existing = summarize(store.logs.filter((log) => log.logDate === input.logDate && log.categoryId === category.id));
  const { xp: xpEarned } = computeXp(category.unit, value, existing.byCategory[category.id] ?? { count: 0, xp: 0 });
  const statDelta = statDeltaFromXp(xpEarned);

  const log: LogEntry = {
    id: crypto.randomUUID(),
    categoryId: category.id,
    logDate: input.logDate,
    value,
    note: input.note?.trim() || null,
    xpEarned,
    statDelta,
    createdAt: new Date().toISOString(),
  };

  const stateResult = applyXpToState(store.state, category.mappedStat, xpEarned, statDelta, input.logDate);
  store.logs.push(log);
  store.state = stateResult.state;

  return {
    log,
    xpEarned,
    statDelta,
    state: store.state,
    summary: listLogs(input.logDate).summary,
    levelUp: stateResult.levelUp,
  };
}

export function deleteLog(id: string): { deleted: true; state: UserState } {
  const store = getStore();
  const target = store.logs.find((log) => log.id === id);

  if (!target) {
    throw new StoreError("기록을 찾을 수 없습니다.", 404);
  }

  store.logs = store.logs.filter((log) => log.id !== id);
  store.state = recalculateState(store.logs);

  return {
    deleted: true,
    state: store.state,
  };
}

export function summarize(logs: LogEntry[]): TodaySummary {
  return logs.reduce<TodaySummary>(
    (summary, log) => {
      summary.totalXp += log.xpEarned;
      summary.byCategory[log.categoryId] ??= { count: 0, xp: 0 };
      summary.byCategory[log.categoryId].count += 1;
      summary.byCategory[log.categoryId].xp += log.xpEarned;
      return summary;
    },
    { totalXp: 0, byCategory: {} },
  );
}

export class StoreError extends Error {
  constructor(
    message: string,
    public readonly status = 500,
  ) {
    super(message);
  }
}

function initialState(): UserState {
  return {
    totalXp: 0,
    ...levelFromTotalXp(0),
    vitality: 0,
    intelligence: 0,
    focus: 0,
    social: 0,
    currentStreakDays: 0,
    longestStreakDays: 0,
    lastLogDate: null,
  };
}

function normalizeValue(value: number | null | undefined): number | null {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return Math.max(Math.floor(value), 0);
}

function recalculateState(logs: LogEntry[]): UserState {
  const nextState = initialState();
  const categories = getStore().categories;

  return [...logs]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .reduce((state, log) => {
      const category = categories.find((candidate) => candidate.id === log.categoryId);
      if (!category) return state;
      return applyXpToState(state, category.mappedStat, log.xpEarned, log.statDelta, log.logDate).state;
    }, nextState);
}

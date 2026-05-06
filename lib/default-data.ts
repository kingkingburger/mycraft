import type { Category } from "@/lib/domain";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "movement",
    name: "운동",
    emoji: "🏃",
    mappedStat: "vitality",
    unit: "minutes",
    isDefault: true,
    displayOrder: 10,
  },
  {
    id: "reading",
    name: "독서",
    emoji: "📚",
    mappedStat: "intelligence",
    unit: "minutes",
    isDefault: true,
    displayOrder: 20,
  },
  {
    id: "meditation",
    name: "명상",
    emoji: "🧘",
    mappedStat: "focus",
    unit: "minutes",
    isDefault: true,
    displayOrder: 30,
  },
  {
    id: "deep-work",
    name: "딥워크",
    emoji: "⚒️",
    mappedStat: "focus",
    unit: "minutes",
    isDefault: true,
    displayOrder: 40,
  },
  {
    id: "social",
    name: "사교",
    emoji: "🤝",
    mappedStat: "social",
    unit: "count",
    isDefault: true,
    displayOrder: 50,
  },
];

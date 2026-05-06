import { bigint, boolean, date, integer, numeric, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  displayName: text("display_name"),
  timezone: text("timezone").notNull().default("Asia/Seoul"),
  theme: text("theme").notNull().default("dark"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    emoji: text("emoji"),
    mappedStat: text("mapped_stat").notNull(),
    unit: text("unit").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userCategoryName: unique("categories_user_id_name_unique").on(table.userId, table.name),
  }),
);

export const logEntries = pgTable("log_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  logDate: date("log_date").notNull(),
  value: numeric("value", { precision: 10, scale: 2 }),
  note: text("note"),
  xpEarned: integer("xp_earned").notNull(),
  statDelta: integer("stat_delta").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userState = pgTable("user_state", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => profiles.id, { onDelete: "cascade" }),
  totalXp: bigint("total_xp", { mode: "number" }).notNull().default(0),
  level: integer("level").notNull().default(1),
  xpInLevel: integer("xp_in_level").notNull().default(0),
  vitality: bigint("vitality", { mode: "number" }).notNull().default(0),
  intelligence: bigint("intelligence", { mode: "number" }).notNull().default(0),
  focus: bigint("focus", { mode: "number" }).notNull().default(0),
  social: bigint("social", { mode: "number" }).notNull().default(0),
  currentStreakDays: integer("current_streak_days").notNull().default(0),
  longestStreakDays: integer("longest_streak_days").notNull().default(0),
  lastLogDate: date("last_log_date"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

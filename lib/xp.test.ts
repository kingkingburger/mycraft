import { describe, expect, it } from "vitest";
import { computeXp, levelFromTotalXp, statDeltaFromXp } from "@/lib/xp";

describe("xp rules", () => {
  it("adds base xp and time bonus for minute logs", () => {
    expect(computeXp("minutes", 25, { count: 0, xp: 0 })).toEqual({ xp: 20, capped: false });
  });

  it("caps count bonus at 20 xp", () => {
    expect(computeXp("count", 8, { count: 0, xp: 0 })).toEqual({ xp: 30, capped: false });
  });

  it("respects daily category xp cap", () => {
    expect(computeXp("minutes", 60, { count: 2, xp: 90 })).toEqual({ xp: 10, capped: true });
  });

  it("maps xp to stat delta by tens", () => {
    expect(statDeltaFromXp(29)).toBe(2);
  });

  it("computes level thresholds from total xp", () => {
    expect(levelFromTotalXp(0)).toEqual({ level: 1, xpInLevel: 0, xpToNext: 50 });
    expect(levelFromTotalXp(50)).toEqual({ level: 2, xpInLevel: 0, xpToNext: 200 });
    expect(levelFromTotalXp(275)).toEqual({ level: 3, xpInLevel: 25, xpToNext: 450 });
  });
});

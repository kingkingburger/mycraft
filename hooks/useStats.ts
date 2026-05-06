"use client";

import { useQuery } from "@tanstack/react-query";
import type { TodaySummary, UserState } from "@/lib/domain";

export function useStats(date: string) {
  return useQuery({
    queryKey: ["stats", date],
    queryFn: async (): Promise<{ userState: UserState; today: TodaySummary }> => {
      const response = await fetch(`/api/stats?date=${date}`);
      if (!response.ok) throw new Error("stats fetch failed");
      return response.json();
    },
  });
}

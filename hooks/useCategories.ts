"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, RoutineUnit, StatName } from "@/lib/domain";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("categories fetch failed");
      const data = await response.json();
      return data.categories;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { name: string; emoji: string; mappedStat: StatName; unit: RoutineUnit }) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "category create failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

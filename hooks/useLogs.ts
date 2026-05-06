"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateLogInput, CreateLogResponse, LogEntry, TodaySummary } from "@/lib/domain";

export function useLogs(date: string) {
  return useQuery({
    queryKey: ["logs", date],
    queryFn: async (): Promise<{ logs: LogEntry[]; summary: TodaySummary }> => {
      const response = await fetch(`/api/logs?date=${date}`);
      if (!response.ok) throw new Error("logs fetch failed");
      return response.json();
    },
  });
}

export function useCreateLog(date: string, onCreated: (response: CreateLogResponse) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateLogInput): Promise<CreateLogResponse> => {
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "log create failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["logs", date], { logs: [data.log], summary: data.summary });
      queryClient.invalidateQueries({ queryKey: ["logs", date] });
      queryClient.invalidateQueries({ queryKey: ["stats", date] });
      onCreated(data);
    },
  });
}

export function useDeleteLog(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/logs/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("log delete failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs", date] });
      queryClient.invalidateQueries({ queryKey: ["stats", date] });
    },
  });
}

"use client";

import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useCreateCategory } from "@/hooks/useCategories";
import type { RoutineUnit, StatName } from "@/lib/domain";

export function AddCategorySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createCategory = useCreateCategory();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [mappedStat, setMappedStat] = useState<StatName>("focus");
  const [unit, setUnit] = useState<RoutineUnit>("minutes");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createCategory.mutate(
      { name, emoji, mappedStat, unit },
      {
        onSuccess: () => {
          setName("");
          setEmoji("✨");
          setMappedStat("focus");
          setUnit("minutes");
          onClose();
        },
      },
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}>
      <aside
        className="ml-auto flex h-full w-full max-w-md flex-col border-l border-surface-line bg-surface-raised p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-text-primary">카테고리 추가</h2>
          <button
            className="grid h-10 w-10 place-items-center rounded-md border border-surface-line text-text-primary hover:bg-surface-muted"
            onClick={onClose}
            aria-label="닫기"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <label className="grid gap-2 text-sm text-text-secondary">
            이름
            <input
              className="h-11 rounded-md border border-surface-line bg-surface-base px-3 text-text-primary outline-none focus:border-accent-success"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm text-text-secondary">
            아이콘
            <input
              className="h-11 rounded-md border border-surface-line bg-surface-base px-3 text-text-primary outline-none focus:border-accent-success"
              value={emoji}
              onChange={(event) => setEmoji(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm text-text-secondary">
            스탯
            <select
              className="h-11 rounded-md border border-surface-line bg-surface-base px-3 text-text-primary outline-none focus:border-accent-success"
              value={mappedStat}
              onChange={(event) => setMappedStat(event.target.value as StatName)}
            >
              <option value="vitality">Vitality</option>
              <option value="intelligence">Intelligence</option>
              <option value="focus">Focus</option>
              <option value="social">Social</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm text-text-secondary">
            단위
            <select
              className="h-11 rounded-md border border-surface-line bg-surface-base px-3 text-text-primary outline-none focus:border-accent-success"
              value={unit}
              onChange={(event) => setUnit(event.target.value as RoutineUnit)}
            >
              <option value="minutes">분</option>
              <option value="count">회</option>
            </select>
          </label>
          {createCategory.error ? <p className="text-sm text-stat-vitality">{createCategory.error.message}</p> : null}
          <button
            className="mt-2 h-11 rounded-md bg-text-primary px-4 text-sm font-semibold text-surface-base disabled:opacity-60"
            disabled={createCategory.isPending}
            type="submit"
          >
            저장
          </button>
        </form>
      </aside>
    </div>
  );
}

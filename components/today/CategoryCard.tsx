"use client";

import { Check, Loader2, Plus, X } from "lucide-react";
import { FormEvent, useState } from "react";
import type { Category } from "@/lib/domain";

const STAT_LABEL = {
  vitality: "Vitality",
  intelligence: "Intelligence",
  focus: "Focus",
  social: "Social",
};

export function CategoryCard({
  category,
  today,
  isSaving,
  onSave,
}: {
  category: Category;
  today?: { count: number; xp: number };
  isSaving: boolean;
  onSave: (value: number | null, note: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const recorded = Boolean(today?.count);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(value ? Number(value) : null, note || null);
    setValue("");
    setNote("");
    setExpanded(false);
  }

  return (
    <article className="rounded-lg border border-surface-line bg-surface-raised p-4 transition hover:border-text-secondary">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-surface-muted text-3xl" aria-hidden>
          {category.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-text-primary">{category.name}</h3>
            {recorded ? (
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-success text-surface-base">
                <Check className="h-3.5 w-3.5" aria-hidden />
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            {STAT_LABEL[category.mappedStat]} · {category.unit === "minutes" ? "분" : "회"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div className="font-mono text-lg text-accent-success">+{today?.xp ?? 0}</div>
          <div className="text-xs text-text-secondary">{today?.count ?? 0} logs</div>
        </div>

        <button
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-surface-line text-text-primary hover:bg-surface-muted"
          onClick={() => setExpanded((current) => !current)}
          aria-label={`${category.name} 기록`}
        >
          {expanded ? <X className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
        </button>
      </div>

      {expanded ? (
        <form className="mt-4 grid gap-3 border-t border-surface-line pt-4 sm:grid-cols-[140px_minmax(0,1fr)_auto]" onSubmit={submit}>
          <label className="sr-only" htmlFor={`${category.id}-value`}>
            값
          </label>
          <input
            id={`${category.id}-value`}
            className="h-11 min-w-0 rounded-md border border-surface-line bg-surface-base px-3 text-text-primary outline-none focus:border-accent-success"
            min="0"
            placeholder={category.unit === "minutes" ? "분" : "회"}
            type="number"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <label className="sr-only" htmlFor={`${category.id}-note`}>
            메모
          </label>
          <input
            id={`${category.id}-note`}
            className="h-11 min-w-0 rounded-md border border-surface-line bg-surface-base px-3 text-text-primary outline-none focus:border-accent-success"
            placeholder="메모"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-text-primary px-4 text-sm font-semibold text-surface-base disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
            저장
          </button>
        </form>
      ) : null}
    </article>
  );
}

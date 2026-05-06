import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarClock,
  ChevronRight,
  Flame,
  Gauge,
  Map,
  Replace,
  ShieldAlert,
  Sparkles,
  Swords,
  Timer,
} from "lucide-react";

const missions = [
  {
    id: "vitality-hold",
    index: "01",
    title: "Vitality 확보",
    objective: "운동 30분",
    state: "완료 대기",
    reward: "+35 XP",
    tone: "border-stat-vitality/60 bg-stat-vitality/10",
    action: "완료",
  },
  {
    id: "focus-zone",
    index: "02",
    title: "Focus 점령",
    objective: "딥워크 60분",
    state: "시작 전",
    reward: "+50 XP",
    tone: "border-stat-focus/60 bg-stat-focus/10",
    action: "시작",
  },
  {
    id: "recovery-lock",
    index: "03",
    title: "Recovery 조건",
    objective: "23:30 이전 하루 마감",
    state: "시간 제한",
    reward: "위험 -1",
    tone: "border-stat-intelligence/60 bg-stat-intelligence/10",
    action: "예약",
  },
];

const mapWeeks = [
  { id: "w1", label: "W1", title: "정찰", state: "clear", progress: "완료" },
  { id: "w2", label: "W2", title: "압축", state: "active", progress: "3/5" },
  { id: "w3", label: "W3", title: "돌파", state: "locked", progress: "잠김" },
  { id: "w4", label: "W4", title: "정복", state: "locked", progress: "잠김" },
];

export function SeasonCommand() {
  return (
    <main className="min-h-screen bg-surface-base text-text-primary">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-5 md:px-6 md:py-8 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="grid content-start gap-5">
          <section className="border border-surface-line bg-surface-raised p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">Season 01</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-normal text-text-primary">체력 회복 시즌</h1>
              </div>
              <div className="grid h-12 w-12 shrink-0 place-items-center border border-stat-vitality/50 bg-stat-vitality/15 text-stat-vitality">
                <Flame className="h-6 w-6" aria-hidden />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Metric label="D-day" value="D-18" />
              <Metric label="주도권" value="Vitality" />
              <Metric label="난이도" value="Hard" />
            </div>

            <div className="mt-6 border-t border-surface-line pt-5">
              <p className="text-sm font-medium text-text-secondary">승리 조건</p>
              <p className="mt-2 text-base leading-7 text-text-primary">4주 중 3주 이상, 운동 미션을 주 4회 확보한다.</p>
            </div>
          </section>

          <section className="border border-surface-line bg-surface-raised p-5">
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-accent-level" aria-hidden />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-text-secondary">Season Map</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {mapWeeks.map((week) => (
                <div
                  className="grid grid-cols-[48px_minmax(0,1fr)_64px] items-center gap-3 border border-surface-line bg-surface-base px-3 py-3"
                  key={week.id}
                >
                  <span
                    className={
                      week.state === "active"
                        ? "grid h-10 w-10 place-items-center bg-accent-success text-sm font-bold text-surface-base"
                        : week.state === "clear"
                          ? "grid h-10 w-10 place-items-center bg-stat-vitality/20 text-sm font-bold text-stat-vitality"
                          : "grid h-10 w-10 place-items-center bg-surface-muted text-sm font-bold text-text-tertiary"
                    }
                  >
                    {week.label}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">{week.title} 작전</p>
                    <p className="text-xs text-text-secondary">{week.state}</p>
                  </div>
                  <span className="text-right font-mono text-xs text-text-secondary">{week.progress}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="grid content-start gap-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <section className="border border-surface-line bg-surface-raised p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">Week 2</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-normal text-text-primary">압축 작전</h2>
                </div>
                <div className="inline-flex items-center gap-2 border border-accent-warning/50 bg-accent-warning/10 px-3 py-2 text-sm text-accent-warning">
                  <ShieldAlert className="h-4 w-4" aria-hidden />
                  수면 마감 2회 실패
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <Metric icon={<Swords className="h-4 w-4" aria-hidden />} label="핵심" value="운동 4회" />
                <Metric icon={<Gauge className="h-4 w-4" aria-hidden />} label="판도" value="3/5 구역" />
                <Metric icon={<CalendarClock className="h-4 w-4" aria-hidden />} label="리뷰" value="일요일" />
              </div>
            </section>

            <Link
              className="group flex min-h-40 flex-col justify-between border border-surface-line bg-surface-muted p-5 text-text-primary hover:border-accent-success"
              href="/today"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-text-secondary">Quick Log</span>
                <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden />
              </div>
              <p className="text-base leading-7 text-text-primary">기존 카테고리 기록은 여기로 내렸다. 오늘의 중심은 미션이다.</p>
            </Link>
          </div>

          <section className="border border-surface-line bg-surface-raised p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">Today</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-normal text-text-primary">오늘의 작전</h2>
              </div>
              <div className="inline-flex items-center gap-2 bg-accent-success px-3 py-2 text-sm font-semibold text-surface-base">
                <Sparkles className="h-4 w-4" aria-hidden />
                3탭 안에 마감
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {missions.map((mission) => (
                <article
                  className={`grid gap-4 border p-4 md:grid-cols-[56px_minmax(0,1fr)_auto] md:items-center ${mission.tone}`}
                  key={mission.id}
                >
                  <div className="grid h-14 w-14 place-items-center bg-surface-base font-mono text-lg font-semibold text-text-primary">
                    {mission.index}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-text-primary">{mission.title}</h3>
                      <span className="border border-surface-line bg-surface-base px-2 py-1 text-xs text-text-secondary">
                        {mission.state}
                      </span>
                    </div>
                    <p className="mt-1 text-base text-text-secondary">{mission.objective}</p>
                    <p className="mt-2 font-mono text-sm text-accent-success">{mission.reward}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:w-[232px]">
                    <button className="grid h-11 place-items-center bg-text-primary text-sm font-semibold text-surface-base">
                      {mission.action}
                    </button>
                    <button className="grid h-11 place-items-center border border-surface-line bg-surface-base text-text-primary" aria-label="수치 추가">
                      <Timer className="h-4 w-4" aria-hidden />
                    </button>
                    <button className="grid h-11 place-items-center border border-surface-line bg-surface-base text-text-primary" aria-label="대체 수행">
                      <Replace className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StatusBand title="이번 주 판도" value="3/5" detail="금요일 부하 낮춤" />
            <StatusBand title="시즌 압력" value="중간" detail="수면 조건이 흔들림" />
            <StatusBand title="다음 선택" value="보정" detail="일요일에 강화/유지/완화" />
          </section>
        </section>
      </section>
    </main>
  );
}

function Metric({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 border border-surface-line bg-surface-base px-3 py-3">
      <div className="flex items-center gap-2 text-xs text-text-tertiary">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 truncate font-mono text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}

function StatusBand({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <section className="border border-surface-line bg-surface-raised p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-tertiary">{title}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <strong className="font-mono text-3xl text-text-primary">{value}</strong>
        <ArrowRight className="mb-1 h-5 w-5 text-text-secondary" aria-hidden />
      </div>
      <p className="mt-2 text-sm text-text-secondary">{detail}</p>
    </section>
  );
}

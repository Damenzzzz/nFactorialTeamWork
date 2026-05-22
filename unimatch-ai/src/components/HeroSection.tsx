import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Database,
  GraduationCap,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/Badge";
import type { HealthStatus } from "@/lib/frontend/api-client";

interface HeroSectionProps {
  health?: HealthStatus;
  onCatalogClick: () => void;
  onFormClick: () => void;
  programCount: number;
}

const indicators = [
  { icon: Brain, label: "AI tool-calling ready" },
  { icon: Database, label: "Supabase-ready backend" },
  { icon: ShieldCheck, label: "Local data fallback" },
  { icon: CheckCircle2, label: "Playwright QA planned" },
];

export function HeroSection({
  health,
  onCatalogClick,
  onFormClick,
  programCount,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="mx-auto grid min-h-[720px] w-full max-w-7xl gap-12 px-5 pb-20 pt-28 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pt-36">
        <div className="flex flex-col justify-center">
          <Badge tone="cyan" className="w-fit">
            UniMatch AI
          </Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Admissions intelligence for high-stakes university decisions.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Build a student profile, scan verified seed-backed program data,
            and receive ranked admission recommendations with fit reasons,
            risks, missing requirements, and next steps.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-cyan-200 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              onClick={onFormClick}
              type="button"
            >
              Build my shortlist
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition group-hover:translate-x-0.5"
              />
            </button>
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-slate-950"
              onClick={onCatalogClick}
              type="button"
            >
              <PlayCircle aria-hidden="true" className="size-4 text-emerald-200" />
              Explore catalog
            </button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {indicators.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-slate-200 backdrop-blur-xl"
                  key={item.label}
                >
                  <Icon aria-hidden="true" className="size-4 text-cyan-200" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-lg border border-white/10 bg-slate-950/60 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-sm text-slate-400">Decision command center</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Live recommendation brief
                </h2>
              </div>
              <span className="flex size-12 items-center justify-center rounded-lg bg-emerald-300/10 text-emerald-100 ring-1 ring-emerald-300/20">
                <GraduationCap aria-hidden="true" className="size-6" />
              </span>
            </div>

            <div className="grid gap-4 py-5 sm:grid-cols-3">
              <HeroStat label="Programs" value={String(programCount || 12)} />
              <HeroStat
                label="API"
                value={health?.status === "ok" ? "Online" : "Check"}
              />
              <HeroStat
                label="Data mode"
                value={health?.dataSource ? health.dataSource : "seed"}
              />
            </div>

            <div className="space-y-3 border-t border-white/10 pt-5">
              <DecisionRow
                label="Profile vector"
                value="Field, level, budget, tests"
                tone="cyan"
              />
              <DecisionRow
                label="Ranking model"
                value="Score, reasons, risks"
                tone="emerald"
              />
              <DecisionRow
                label="Fallback posture"
                value="Local seed data active"
                tone="amber"
              />
            </div>

            <div className="mt-5 rounded-lg border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-300">
                  Current engine status
                </p>
                <Badge tone={health?.status === "ok" ? "emerald" : "amber"}>
                  {health?.status === "ok" ? "Ready" : "Checking"}
                </Badge>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-cyan-200 via-emerald-200 to-amber-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold capitalize text-white">{value}</p>
    </div>
  );
}

function DecisionRow({
  label,
  tone,
  value,
}: {
  label: string;
  tone: "amber" | "cyan" | "emerald";
  value: string;
}) {
  const toneClass =
    tone === "cyan"
      ? "bg-cyan-200"
      : tone === "emerald"
        ? "bg-emerald-200"
        : "bg-amber-200";

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-white/[0.045] px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`size-2 shrink-0 rounded-full ${toneClass}`} />
        <span className="truncate text-sm font-medium text-white">{label}</span>
      </div>
      <span className="text-right text-sm text-slate-400">{value}</span>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  DollarSign,
  ExternalLink,
  GraduationCap,
  Loader2,
  MapPin,
  Plus,
  Scale,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { fetchProgramInsight } from "@/lib/frontend/api-client";
import type {
  ProgramInsightPayload,
  ProgramWithAdmissions,
  StudentProfile,
} from "@/lib/domain";
import { formatCurrency, formatDeadline } from "@/lib/frontend/format";
import { cn } from "@/lib/utils";

interface ProgramCardProps {
  compareDisabled?: boolean;
  isCompared?: boolean;
  onToggleCompare: () => void;
  record: ProgramWithAdmissions;
  studentProfile?: StudentProfile;
}

export function ProgramCard({
  compareDisabled = false,
  isCompared = false,
  onToggleCompare,
  record,
  studentProfile,
}: ProgramCardProps) {
  const { program, requirement, university } = record;
  const [insight, setInsight] = useState<ProgramInsightPayload>();
  const [insightOpen, setInsightOpen] = useState(false);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string>();

  async function handleInsight() {
    if (insightOpen) {
      setInsightOpen(false);
      return;
    }

    setInsightOpen(true);
    setInsightError(undefined);

    if (!studentProfile) {
      setInsight({
        fitSummary: "Calculate your admission fit first for a personalized explanation.",
        missingRequirements: [],
        nextSteps: [
          "Fill in your admission profile.",
          "Click Calculate fit, then return to this program.",
        ],
        risks: [],
        strengths: [
          `${program.name} is a ${program.degreeLevel} program in ${program.field}.`,
          `Annual tuition is ${formatCurrency(program.tuitionUsdPerYear)}.`,
        ],
      });
      return;
    }

    setInsightLoading(true);

    try {
      const payload = await fetchProgramInsight({
        programId: program.id,
        studentProfile,
      });
      setInsight(payload);
    } catch {
      setInsightError(
        "We could not prepare a fit explanation right now. Please try again in a moment.",
      );
    } finally {
      setInsightLoading(false);
    }
  }

  return (
    <article className="group flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/30 hover:bg-white/[0.08]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge tone="cyan">{program.degreeLevel}</Badge>
            <Badge tone={program.scholarshipsAvailable ? "emerald" : "slate"}>
              {program.scholarshipsAvailable ? "Scholarship friendly" : "Limited funding"}
            </Badge>
          </div>
          <h3 className="mt-4 text-xl font-semibold leading-7 text-white">
            {university.name}
          </h3>
          <p className="mt-2 text-sm font-medium text-cyan-100">
            {program.name}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-cyan-100 ring-1 ring-white/10">
          <GraduationCap aria-hidden="true" className="size-5" />
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        {program.description}
      </p>

      <div className="mt-5 grid gap-3 text-sm text-slate-300">
        <FactRow icon={MapPin} label={`${university.country}, ${university.city}`} />
        <FactRow icon={BookOpen} label={`${program.field} - ${program.language}`} />
        <FactRow
          icon={DollarSign}
          label={`${formatCurrency(program.tuitionUsdPerYear)} annual tuition`}
        />
        <FactRow
          icon={Calendar}
          label={`${formatDeadline(program.applicationDeadline)} deadline`}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-y border-white/10 py-4">
        <Requirement label="GPA" value={requirement.minGpa.toFixed(1)} />
        <Requirement label="IELTS" value={requirement.minIelts.toFixed(1)} />
        <Requirement
          label="SAT"
          value={requirement.minSat ? String(requirement.minSat) : "Optional"}
        />
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-lg bg-black/20 p-4">
        <Award aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-100" />
        <p className="text-sm leading-6 text-slate-400">
          {program.scholarshipsAvailable
            ? university.scholarships[0]?.name ?? "Scholarship option listed"
            : "Scholarship availability may be limited for this program."}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {program.tags.map((tag) => (
          <Badge key={tag} tone="slate">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
              isCompared
                ? "bg-emerald-200 text-slate-950 hover:bg-white"
                : "border border-white/10 bg-white/[0.065] text-white hover:border-cyan-200/30 hover:bg-white/[0.1]",
            )}
            disabled={compareDisabled}
            onClick={onToggleCompare}
            type="button"
          >
            {isCompared ? (
              <Scale aria-hidden="true" className="size-4" />
            ) : (
              <Plus aria-hidden="true" className="size-4" />
            )}
            {isCompared ? "Added" : compareDisabled ? "Limit reached" : "Add to compare"}
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-4 text-sm font-semibold text-cyan-50 transition hover:border-cyan-200/40 hover:bg-cyan-300/15 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={insightLoading}
            onClick={handleInsight}
            type="button"
          >
            {insightLoading ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Sparkles aria-hidden="true" className="size-4" />
            )}
            AI explain fit
          </button>
        </div>
        <a
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
          href={university.website}
          rel="noreferrer"
          target="_blank"
        >
          Official site
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      </div>

      {insightOpen ? (
        <ProgramInsight
          error={insightError}
          insight={insight}
          loading={insightLoading}
        />
      ) : null}
    </article>
  );
}

function FactRow({
  icon: Icon,
  label,
}: {
  icon: typeof MapPin;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon aria-hidden="true" className="size-4 shrink-0 text-slate-500" />
      <span>{label}</span>
    </div>
  );
}

function Requirement({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function ProgramInsight({
  error,
  insight,
  loading,
}: {
  error?: string;
  insight?: ProgramInsightPayload;
  loading: boolean;
}) {
  return (
    <div className="mt-5 border-t border-white/10 pt-5">
      <div className="flex items-center gap-2">
        <Sparkles aria-hidden="true" className="size-4 text-cyan-100" />
        <h4 className="text-sm font-semibold uppercase text-slate-300">
          Fit explanation
        </h4>
      </div>
      {loading ? (
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Preparing a personalized explanation...
        </p>
      ) : error ? (
        <p className="mt-3 text-sm leading-6 text-rose-100">{error}</p>
      ) : insight ? (
        <div className="mt-3 space-y-4">
          <p className="text-sm leading-6 text-slate-300">{insight.fitSummary}</p>
          <InsightList title="Strengths" items={insight.strengths} />
          <InsightList title="Risks" items={insight.risks} />
          <InsightList
            title="Missing requirements"
            items={insight.missingRequirements}
          />
          <InsightList title="Next steps" items={insight.nextSteps} />
        </div>
      ) : null}
    </div>
  );
}

function InsightList({ items, title }: { items: string[]; title: string }) {
  if (!items.length) {
    return null;
  }

  return (
    <section>
      <h5 className="text-xs font-semibold uppercase text-slate-500">{title}</h5>
      <ul className="mt-2 space-y-1.5">
        {items.slice(0, 4).map((item) => (
          <li className="flex gap-2 text-sm leading-6 text-slate-400" key={item}>
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-200/70" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

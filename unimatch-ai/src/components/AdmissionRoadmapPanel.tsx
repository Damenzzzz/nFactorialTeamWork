"use client";

import { useState } from "react";
import { CalendarCheck, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/Badge";
import { fetchAdmissionRoadmap } from "@/lib/frontend/api-client";
import type {
  AdmissionRoadmapPayload,
  Recommendation,
  StudentProfile,
} from "@/lib/domain";

interface AdmissionRoadmapPanelProps {
  recommendations: Recommendation[];
  studentProfile?: StudentProfile;
}

export function AdmissionRoadmapPanel({
  recommendations,
  studentProfile,
}: AdmissionRoadmapPanelProps) {
  const [roadmap, setRoadmap] = useState<AdmissionRoadmapPayload>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  if (!recommendations.length) {
    return null;
  }

  async function handleGenerate() {
    if (!studentProfile) {
      setError("Calculate your admission fit first to create a roadmap.");
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const payload = await fetchAdmissionRoadmap({
        studentProfile,
        topProgramIds: recommendations
          .slice(0, 3)
          .map((recommendation) => recommendation.program.id),
      });
      setRoadmap(payload);
    } catch {
      setError(
        "We could not create your roadmap right now. Please try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone="cyan">Admission roadmap</Badge>
          <h3 className="mt-3 text-xl font-semibold text-white">
            Turn your shortlist into next steps
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Generate a practical timeline for documents, scores, deadlines, and
            application preparation.
          </p>
        </div>
        <button
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          onClick={handleGenerate}
          type="button"
        >
          {loading ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Sparkles aria-hidden="true" className="size-4" />
          )}
          Generate admission roadmap
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-rose-300/20 bg-rose-300/10 p-4 text-sm leading-6 text-rose-100">
          {error}
        </p>
      ) : null}

      {roadmap ? (
        <div className="mt-6 space-y-6">
          <div className="flex gap-3 rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-4">
            <CalendarCheck
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-cyan-100"
            />
            <p className="text-sm leading-6 text-cyan-50">{roadmap.overview}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {roadmap.timeline.map((phase) => (
              <section
                className="rounded-lg border border-white/10 bg-black/20 p-4"
                key={phase.label}
              >
                <h4 className="text-base font-semibold text-white">{phase.label}</h4>
                <ul className="mt-3 space-y-2">
                  {phase.tasks.map((task) => (
                    <li className="flex gap-2 text-sm leading-6 text-slate-300" key={task}>
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-200/70" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <RoadmapList title="Documents" items={roadmap.documents} />
            <RoadmapList
              title="Score improvements"
              items={roadmap.scoreImprovements}
            />
            <RoadmapList title="Deadline advice" items={roadmap.deadlineAdvice} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function RoadmapList({ items, title }: { items: string[]; title: string }) {
  return (
    <section className="rounded-lg border border-white/10 bg-black/20 p-4">
      <h4 className="text-sm font-semibold uppercase text-slate-300">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li className="flex gap-2 text-sm leading-6 text-slate-400" key={item}>
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

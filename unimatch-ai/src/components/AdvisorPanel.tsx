"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Bot,
  ChevronDown,
  Lightbulb,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { fetchAdvisorResponse } from "@/lib/frontend/api-client";
import { formatCurrency, formatDeadline } from "@/lib/frontend/format";
import type {
  AdvisorResponsePayload,
  AdvisorToolName,
  Recommendation,
  StudentProfile,
} from "@/lib/domain";

interface AdvisorPanelProps {
  shortlistedProgramIds: string[];
  studentProfile?: StudentProfile;
}

const defaultQuestion =
  "Which programs should I consider first, and what should I prepare next?";

const toolLabels: Record<AdvisorToolName, string> = {
  calculateAdmissionChance: "Admission fit reviewed",
  comparePrograms: "Shortlist compared",
  getProgramRequirements: "Requirements checked",
  saveStudentPreferences: "Profile preferences applied",
  searchPrograms: "Program catalog searched",
};

export function AdvisorPanel({
  shortlistedProgramIds,
  studentProfile,
}: AdvisorPanelProps) {
  const [message, setMessage] = useState(defaultQuestion);
  const [response, setResponse] = useState<AdvisorResponsePayload>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const contextLabel = useMemo(() => {
    if (studentProfile && shortlistedProgramIds.length) {
      return `${studentProfile.degreeLevel} profile and ${shortlistedProgramIds.length} shortlisted option(s)`;
    }

    if (studentProfile) {
      return `${studentProfile.degreeLevel} profile ready`;
    }

    if (shortlistedProgramIds.length) {
      return `${shortlistedProgramIds.length} shortlisted option(s)`;
    }

    return "Profile not calculated yet";
  }, [shortlistedProgramIds.length, studentProfile]);

  const needsProfile = !studentProfile;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const payload = await fetchAdvisorResponse({
        message: message.trim(),
        shortlistedProgramIds,
        studentProfile,
      });
      setResponse(payload);
    } catch {
      setError(
        "The advisor could not prepare an answer right now. Please try again with a shorter question.",
      );
    } finally {
      setLoading(false);
    }
  }

  function useSuggestedQuestion(question: string) {
    setMessage(question);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <form
        className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center justify-between gap-3">
            <Badge tone="cyan">AI Advisor</Badge>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-medium text-slate-300">
              <Sparkles aria-hidden="true" className="size-3.5 text-cyan-100" />
              {contextLabel}
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white">
              Ask about your shortlist
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Get grounded guidance on fit, requirements, risks, scholarships,
              and next steps from the program catalog.
            </p>
          </div>
        </div>

        {needsProfile ? (
          <div className="mt-5 flex gap-3 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
            <Lightbulb
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-cyan-100"
            />
            <span>
              For a more precise answer, calculate your admission fit first.
            </span>
          </div>
        ) : null}

        <label className="mt-6 block">
          <span className="text-sm font-medium text-slate-200">
            Your question
          </span>
          <textarea
            className="mt-2 min-h-36 w-full resize-none rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask about program fit, missing requirements, scholarship strategy, or which option to choose."
            value={message}
          />
        </label>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Answers use available program data and your saved fit profile when available.
          </p>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading || !message.trim()}
            type="submit"
          >
            {loading ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Send aria-hidden="true" className="size-4" />
            )}
            Ask advisor
          </button>
        </div>
      </form>

      <section className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
        {loading ? (
          <div className="flex min-h-80 flex-col items-center justify-center text-center">
            <Loader2
              aria-hidden="true"
              className="size-8 animate-spin text-cyan-100"
            />
            <h3 className="mt-5 text-xl font-semibold text-white">
              Preparing grounded guidance
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              The advisor is checking catalog matches, requirements, and fit
              signals before answering.
            </p>
          </div>
        ) : error ? (
          <div
            className="flex gap-3 rounded-lg border border-rose-300/20 bg-rose-300/10 p-5 text-sm text-rose-100"
            role="alert"
          >
            <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : response ? (
          <AdvisorResponse
            onSuggestedQuestion={useSuggestedQuestion}
            response={response}
          />
        ) : (
          <AdvisorEmptyState hasProfile={Boolean(studentProfile)} />
        )}
      </section>
    </div>
  );
}

function AdvisorResponse({
  onSuggestedQuestion,
  response,
}: {
  onSuggestedQuestion: (question: string) => void;
  response: AdvisorResponsePayload;
}) {
  return (
    <div className="space-y-7">
      <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-5">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-100 ring-1 ring-cyan-300/20">
            <Bot aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-white">Advisor answer</h3>
              <Badge tone={response.aiAvailable === false ? "amber" : "emerald"}>
                Catalog-based answer
              </Badge>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
              {response.answer}
            </p>
            <p className="mt-4 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-slate-400">
              This guidance is based on available program data. Always verify
              final requirements on official university pages.
            </p>
          </div>
        </div>
      </div>

      {response.recommendations?.length ? (
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb aria-hidden="true" className="size-4 text-amber-100" />
            <h4 className="text-sm font-semibold uppercase text-slate-300">
              Recommended programs
            </h4>
          </div>
          <div className="mt-4 divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10">
            {response.recommendations.slice(0, 3).map((recommendation) => (
              <RecommendationRow
                key={recommendation.program.id}
                recommendation={recommendation}
              />
            ))}
          </div>
        </div>
      ) : null}

      {response.suggestedQuestions?.length ? (
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <h4 className="text-sm font-semibold uppercase text-slate-300">
            Suggested next questions
          </h4>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {response.suggestedQuestions.map((question) => (
              <button
                className="min-h-16 rounded-lg border border-white/10 bg-white/[0.055] px-3 py-3 text-left text-sm leading-5 text-slate-200 transition hover:border-cyan-200/30 hover:bg-white/[0.09] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                key={question}
                onClick={() => onSuggestedQuestion(question)}
                type="button"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <details className="group rounded-lg border border-white/10 bg-black/20 p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-300">
          <span>Data used for this answer</span>
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition group-open:rotate-180"
          />
        </summary>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          I used the UniMatch program catalog to prepare this answer.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {response.toolsUsed.length ? (
            response.toolsUsed.map((tool) => (
              <Badge key={tool} tone="slate">
                {toolLabels[tool]}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-slate-400">
              This answer used the information available in your question.
            </span>
          )}
        </div>
      </details>
    </div>
  );
}

function AdvisorEmptyState({ hasProfile }: { hasProfile: boolean }) {
  return (
    <div className="flex min-h-80 flex-col justify-center rounded-lg border border-dashed border-white/15 bg-black/20 p-6 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-100 ring-1 ring-cyan-300/20">
        <MessageSquareText aria-hidden="true" className="size-6" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">
        Ask for admissions guidance
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
        {hasProfile
          ? "Ask about your best-fit programs, missing requirements, scholarships, or which option to compare next."
          : "For a more precise answer, calculate your admission fit first. You can still ask a general planning question now."}
      </p>
    </div>
  );
}

function RecommendationRow({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  return (
    <article className="bg-black/20 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-100">
            {recommendation.university.name}
          </p>
          <h5 className="mt-1 text-base font-semibold text-white">
            {recommendation.program.name}
          </h5>
          <p className="mt-1 text-sm text-slate-400">
            {recommendation.university.country} -{" "}
            {formatCurrency(recommendation.program.tuitionUsdPerYear)} / year -
            deadline {formatDeadline(recommendation.program.applicationDeadline)}
          </p>
        </div>
        <Badge tone={recommendation.matchScore >= 75 ? "emerald" : "amber"}>
          {recommendation.matchScore}/100 fit
        </Badge>
      </div>
      {recommendation.risks.length ? (
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Watch: {recommendation.risks[0]}
        </p>
      ) : null}
    </article>
  );
}

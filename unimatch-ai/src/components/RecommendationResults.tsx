import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  ListChecks,
  ShieldAlert,
  Target,
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import type { Recommendation } from "@/lib/domain";
import { formatCurrency, formatDeadline } from "@/lib/frontend/format";
import { cn } from "@/lib/utils";

interface RecommendationResultsProps {
  error?: string;
  loading?: boolean;
  recommendations: Recommendation[];
}

export function RecommendationResults({
  error,
  loading = false,
  recommendations,
}: RecommendationResultsProps) {
  if (loading) {
    return <LoadingState label="Ranking admission matches" />;
  }

  if (error) {
    return (
      <div
        className="flex gap-3 rounded-lg border border-rose-300/20 bg-rose-300/10 p-5 text-sm text-rose-100"
        role="alert"
      >
        <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <EmptyState
        description="Submit your profile to see ranked recommendations, risks, missing requirements, and next steps."
        icon={Target}
        title="No admission report yet"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">Premium admission report</p>
          <h3 className="mt-1 text-2xl font-semibold text-white">
            {recommendations.length} ranked matches
          </h3>
        </div>
        <Badge tone="emerald">Personalized shortlist</Badge>
      </div>

      {recommendations.slice(0, 6).map((recommendation, index) => (
        <article
          className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
          key={recommendation.program.id}
        >
          <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
            <div className="flex flex-col items-start gap-4 border-b border-white/10 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
              <Badge tone={index === 0 ? "cyan" : "slate"}>Rank #{index + 1}</Badge>
              <ScoreGauge score={recommendation.matchScore} />
              <div>
                <p className="text-sm text-slate-400">Annual tuition</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatCurrency(recommendation.program.tuitionUsdPerYear)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Deadline</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {formatDeadline(recommendation.program.applicationDeadline)}
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="text-2xl font-semibold text-white">
                    {recommendation.program.name}
                  </h4>
                  <p className="mt-2 text-sm text-slate-300">
                    {recommendation.university.name}, {recommendation.university.city},{" "}
                    {recommendation.university.country}
                  </p>
                </div>
                <Badge
                  tone={
                    recommendation.program.scholarshipsAvailable ? "emerald" : "amber"
                  }
                >
                  {recommendation.program.scholarshipsAvailable
                    ? "Scholarship available"
                    : "Funding gap possible"}
                </Badge>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                <InsightPanel
                  icon={CheckCircle2}
                  items={recommendation.fitReasons}
                  title="Fit reasons"
                  tone="emerald"
                />
                <InsightPanel
                  icon={ShieldAlert}
                  items={recommendation.risks}
                  title="Risks"
                  tone="amber"
                />
                <InsightPanel
                  icon={AlertCircle}
                  items={recommendation.missingRequirements}
                  title="Missing requirements"
                  tone="rose"
                />
                <InsightPanel
                  icon={ClipboardCheck}
                  items={recommendation.nextSteps}
                  title="Next steps"
                  tone="cyan"
                />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const tone = score >= 75 ? "#67e8f9" : score >= 55 ? "#fde68a" : "#fda4af";

  return (
    <div className="relative size-32">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${tone} ${score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
        }}
      />
      <div className="absolute inset-2 flex flex-col items-center justify-center rounded-full bg-slate-950 text-center ring-1 ring-white/10">
        <span className="text-3xl font-semibold text-white">{score}</span>
        <span className="text-xs text-slate-400">match score</span>
      </div>
    </div>
  );
}

function InsightPanel({
  icon: Icon,
  items,
  title,
  tone,
}: {
  icon: typeof ListChecks;
  items: string[];
  title: string;
  tone: "amber" | "cyan" | "emerald" | "rose";
}) {
  const iconClass = {
    amber: "text-amber-100 bg-amber-300/10 ring-amber-300/20",
    cyan: "text-cyan-100 bg-cyan-300/10 ring-cyan-300/20",
    emerald: "text-emerald-100 bg-emerald-300/10 ring-emerald-300/20",
    rose: "text-rose-100 bg-rose-300/10 ring-rose-300/20",
  }[tone];

  return (
    <section className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-3">
        <span className={cn("flex size-9 items-center justify-center rounded-lg ring-1", iconClass)}>
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <h5 className="text-sm font-semibold text-white">{title}</h5>
      </div>
      {items.length ? (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li className="flex gap-2 text-sm leading-6 text-slate-300" key={item}>
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-6 text-slate-400">
          No issue flagged by the current ranking data.
        </p>
      )}
    </section>
  );
}

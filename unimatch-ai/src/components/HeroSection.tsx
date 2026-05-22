import {
  ArrowRight,
  Award,
  Globe2,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Target,
} from "lucide-react";
import { Badge } from "@/components/Badge";

interface HeroSectionProps {
  countryCount: number;
  onCatalogClick: () => void;
  onFormClick: () => void;
  programCount: number;
  scholarshipCount: number;
  universityCount: number;
}

export function HeroSection({
  countryCount,
  onCatalogClick,
  onFormClick,
  programCount,
  scholarshipCount,
  universityCount,
}: HeroSectionProps) {
  const metrics = [
    {
      icon: GraduationCap,
      label: "Programs",
      value: `${Math.max(programCount, 50)}+`,
    },
    {
      icon: Globe2,
      label: "Universities",
      value: `${Math.max(universityCount, 20)}+`,
    },
    {
      icon: Target,
      label: "Countries",
      value: `${Math.max(countryCount, 15)}+`,
    },
    {
      icon: Award,
      label: "Scholarship filters",
      value: scholarshipCount > 0 ? "Included" : "Available",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="mx-auto grid min-h-[720px] w-full max-w-7xl gap-12 px-5 pb-20 pt-28 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pt-36">
        <div className="flex flex-col justify-center">
          <Badge tone="cyan" className="w-fit">
            AI-powered admissions matching
          </Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Find universities that actually match your profile
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Compare programs by country, tuition, IELTS, GPA, scholarships, and
            admission fit - then get a ranked shortlist with clear next steps.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-cyan-200 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              onClick={onFormClick}
              type="button"
            >
              Find my match
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
              Explore universities
            </button>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article
                  className="rounded-lg border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl"
                  key={metric.label}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-white/[0.07] text-cyan-100 ring-1 ring-white/10">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <div>
                      <p className="text-2xl font-semibold text-white">
                        {metric.value}
                      </p>
                      <p className="text-sm text-slate-400">{metric.label}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-lg border border-white/10 bg-slate-950/60 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-sm text-slate-400">Personal shortlist preview</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Admission fit report
                </h2>
              </div>
              <span className="flex size-12 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-100 ring-1 ring-cyan-300/20">
                <Sparkles aria-hidden="true" className="size-6" />
              </span>
            </div>

            <div className="grid gap-4 py-5 sm:grid-cols-3">
              <HeroStat label="Top match" value="86" suffix="/100" />
              <HeroStat label="Tuition fit" value="$18k" suffix="/yr" />
              <HeroStat label="Deadline" value="Apr" suffix="2027" />
            </div>

            <div className="space-y-3 border-t border-white/10 pt-5">
              <DecisionRow
                label="University of Amsterdam"
                value="Business Analytics"
                tone="cyan"
              />
              <DecisionRow
                label="Technical University of Munich"
                value="Data Engineering"
                tone="emerald"
              />
              <DecisionRow
                label="University of Helsinki"
                value="Software Engineering"
                tone="amber"
              />
            </div>

            <div className="mt-5 rounded-lg border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-300">
                  Fit strength
                </p>
                <Badge tone="emerald">Strong shortlist</Badge>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-cyan-200 via-emerald-200 to-amber-200" />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Your report highlights why each option fits, what could weaken
                the application, and what to prepare next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  label,
  suffix,
  value,
}: {
  label: string;
  suffix: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">
        {value}
        <span className="ml-1 text-sm font-medium text-slate-500">{suffix}</span>
      </p>
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

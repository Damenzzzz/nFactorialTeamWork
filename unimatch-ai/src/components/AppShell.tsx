"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Award,
  Database,
  Gauge,
  Globe2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { HeroSection } from "@/components/HeroSection";
import { LoadingState } from "@/components/LoadingState";
import { MetricCard } from "@/components/MetricCard";
import { ProfileForm } from "@/components/ProfileForm";
import { ProgramCard } from "@/components/ProgramCard";
import { ProgramFilters } from "@/components/ProgramFilters";
import { RecommendationResults } from "@/components/RecommendationResults";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusCard } from "@/components/StatusCard";
import { WorkflowEvidence } from "@/components/WorkflowEvidence";
import {
  fetchHealthStatus,
  fetchPrograms,
  fetchRecommendations,
  type HealthStatus,
  type ProgramsPayload,
  type RecommendationsPayload,
} from "@/lib/frontend/api-client";
import type { ProgramFilters as ProgramFiltersType, ProgramWithAdmissions, StudentProfile } from "@/lib/domain";

const sectionMotion = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function AppShell() {
  const [health, setHealth] = useState<HealthStatus>();
  const [healthError, setHealthError] = useState<string>();
  const [healthLoading, setHealthLoading] = useState(true);
  const [filters, setFilters] = useState<ProgramFiltersType>({});
  const [programPayload, setProgramPayload] = useState<ProgramsPayload>();
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsError, setProgramsError] = useState<string>();
  const [allPrograms, setAllPrograms] = useState<ProgramWithAdmissions[]>([]);
  const [recommendationPayload, setRecommendationPayload] =
    useState<RecommendationsPayload>();
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();

    async function loadHealth() {
      setHealthLoading(true);
      setHealthError(undefined);

      try {
        const nextHealth = await fetchHealthStatus(controller.signal);
        setHealth(nextHealth);
      } catch (error) {
        if (!controller.signal.aborted) {
          setHealthError(error instanceof Error ? error.message : "Health check failed.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setHealthLoading(false);
        }
      }
    }

    loadHealth();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPrograms() {
      setProgramsLoading(true);
      setProgramsError(undefined);

      try {
        const payload = await fetchPrograms(filters, controller.signal);
        setProgramPayload(payload);

        if (!hasActiveFilters(filters)) {
          setAllPrograms(payload.programs);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setProgramsError(
            error instanceof Error ? error.message : "Program catalog failed.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setProgramsLoading(false);
        }
      }
    }

    loadPrograms();
    return () => controller.abort();
  }, [filters]);

  const programs = programPayload?.programs ?? [];
  const optionPrograms = allPrograms.length ? allPrograms : programs;
  const countries = useMemo(() => unique(optionPrograms.map((item) => item.university.country)), [optionPrograms]);
  const fields = useMemo(() => unique(optionPrograms.map((item) => item.program.field)), [optionPrograms]);
  const scholarshipCount = optionPrograms.filter(
    (item) => item.program.scholarshipsAvailable,
  ).length;

  const metrics = [
    {
      detail: programPayload?.dataSource
        ? `Loaded through the ${programPayload.dataSource} repository path.`
        : "Waiting for the catalog route.",
      icon: GraduationCap,
      label: "Programs",
      tone: "cyan" as const,
      value: String(optionPrograms.length || programs.length || 0),
    },
    {
      detail: countries.length
        ? "Countries represented in the active admissions dataset."
        : "Country coverage appears after catalog load.",
      icon: Globe2,
      label: "Countries",
      tone: "emerald" as const,
      value: String(countries.length),
    },
    {
      detail: "Program records marked with scholarship availability.",
      icon: Award,
      label: "Scholarship options",
      tone: "amber" as const,
      value: String(scholarshipCount),
    },
    {
      detail: healthError
        ? "The health route returned an error state."
        : health?.status === "ok"
          ? "Health route is responding."
          : "Health route is being checked.",
      icon: Activity,
      label: "API health",
      tone: healthError ? ("rose" as const) : ("emerald" as const),
      value: healthError ? "Error" : health?.status === "ok" ? "Online" : "Checking",
    },
    {
      detail: recommendationsError
        ? "Last recommendation request needs attention."
        : "POST /api/recommendations is wired to the profile form.",
      icon: Gauge,
      label: "Recommendation engine",
      tone: recommendationsError ? ("rose" as const) : ("cyan" as const),
      value: recommendationsError ? "Error" : "Ready",
    },
  ];

  async function handleProfileSubmit(profile: StudentProfile) {
    setRecommendationsLoading(true);
    setRecommendationsError(undefined);

    try {
      const payload = await fetchRecommendations(profile);
      setRecommendationPayload(payload);
      window.setTimeout(() => scrollToSection("results"), 80);
    } catch (error) {
      setRecommendationsError(
        error instanceof Error ? error.message : "Recommendation request failed.",
      );
    } finally {
      setRecommendationsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,#04060d_0%,#09111c_42%,#11130c_100%)]" />
      <div className="pointer-events-none fixed inset-0 premium-grid opacity-45" />
      <div className="pointer-events-none fixed inset-0 premium-sheen opacity-80" />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl">
          <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
            <button
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              onClick={() => scrollToSection("top")}
              type="button"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-cyan-200 text-slate-950">
                <Sparkles aria-hidden="true" className="size-5" />
              </span>
              <span className="text-base font-semibold">UniMatch AI</span>
            </button>
            <div className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/[0.045] p-1 md:flex">
              <NavButton label="Dashboard" target="dashboard" />
              <NavButton label="Advisor" target="advisor" />
              <NavButton label="Catalog" target="catalog" />
              <NavButton label="Workflow" target="workflow" />
            </div>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950"
              onClick={() => scrollToSection("recommendation-form")}
              type="button"
            >
              Start scan
            </button>
          </nav>
        </header>

        <main id="top">
          <HeroSection
            health={health}
            onCatalogClick={() => scrollToSection("catalog")}
            onFormClick={() => scrollToSection("recommendation-form")}
            programCount={optionPrograms.length || programs.length}
          />

          <motion.section
            className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8"
            id="dashboard"
            initial="hidden"
            transition={{ duration: 0.55, ease: "easeOut" }}
            variants={sectionMotion}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="show"
          >
            <SectionHeader
              description="A live operational view of the local advisor stack, data mode, and recommendation readiness."
              eyebrow="Overview"
              title="Admission command center"
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {metrics.map((metric) => (
                <MetricCard
                  detail={metric.detail}
                  icon={metric.icon}
                  key={metric.label}
                  label={metric.label}
                  tone={metric.tone}
                  value={metric.value}
                />
              ))}
            </div>
            <div className="mt-6">
              <StatusCard
                error={healthError}
                health={health}
                loading={healthLoading}
              />
            </div>
          </motion.section>

          <motion.section
            className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8"
            id="advisor"
            initial="hidden"
            transition={{ duration: 0.55, ease: "easeOut" }}
            variants={sectionMotion}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="show"
          >
            <div>
              <SectionHeader
                description="A profile-first workflow that sends a typed payload to the existing recommendation API."
                eyebrow="Recommendation flow"
                title="Generate a ranked shortlist"
              />
              <div className="mt-8">
                <ProfileForm
                  apiError={recommendationsError}
                  countries={countries}
                  fields={fields}
                  loading={recommendationsLoading}
                  onSubmit={handleProfileSubmit}
                />
              </div>
            </div>
            <div id="results">
              <SectionHeader
                description="The report turns ranking output into clear fit reasons, risks, missing requirements, and next actions."
                eyebrow="Decision report"
                title="AI-style admissions brief"
              />
              <div className="mt-8">
                <RecommendationResults
                  dataSource={recommendationPayload?.dataSource}
                  error={recommendationsError}
                  loading={recommendationsLoading}
                  recommendations={recommendationPayload?.recommendations ?? []}
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8"
            id="catalog"
            initial="hidden"
            transition={{ duration: 0.55, ease: "easeOut" }}
            variants={sectionMotion}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="show"
          >
            <SectionHeader
              action={
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-slate-300 backdrop-blur-xl">
                  <Database aria-hidden="true" className="size-4 text-cyan-200" />
                  {programPayload?.dataSource ?? "seed"} repository
                </div>
              }
              description="Filter the backend catalog without hardcoded UI facts; cards render the program, university, and admission requirement contract."
              eyebrow="Program catalog"
              title="Searchable university portfolio"
            />
            <div className="mt-8">
              <ProgramFilters
                countries={countries}
                fields={fields}
                filters={filters}
                loading={programsLoading}
                onChange={setFilters}
                resultCount={programPayload?.count ?? 0}
              />
            </div>
            <div className="mt-8">
              {programsLoading ? (
                <div className="grid gap-4 lg:grid-cols-3">
                  <LoadingState label="Loading program catalog" />
                  <LoadingState label="Joining admission requirements" />
                  <LoadingState label="Preparing scholarship tags" />
                </div>
              ) : programsError ? (
                <EmptyState
                  description={programsError}
                  icon={ShieldCheck}
                  title="Catalog route returned an error"
                />
              ) : programs.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {programs.map((record) => (
                    <ProgramCard key={record.program.id} record={record} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  description="The current filters did not match the seed-backed catalog. Adjust country, field, tuition, IELTS, or scholarship controls."
                  title="No programs matched"
                />
              )}
            </div>
          </motion.section>

          <WorkflowEvidence />
        </main>
      </div>
    </div>
  );
}

function NavButton({ label, target }: { label: string; target: string }) {
  return (
    <button
      className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
      onClick={() => scrollToSection(target)}
      type="button"
    >
      {label}
    </button>
  );
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function hasActiveFilters(filters: ProgramFiltersType): boolean {
  return Object.values(filters).some(
    (value) => value !== undefined && value !== "" && value !== false,
  );
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  ChevronDown,
  CircleHelp,
  Compass,
  HeartHandshake,
  Menu,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { AdvisorPanel } from "@/components/AdvisorPanel";
import { EmptyState } from "@/components/EmptyState";
import { HeroSection } from "@/components/HeroSection";
import { LoadingState } from "@/components/LoadingState";
import { ProfileForm } from "@/components/ProfileForm";
import { ProgramCard } from "@/components/ProgramCard";
import { ProgramFilters } from "@/components/ProgramFilters";
import { RecommendationResults } from "@/components/RecommendationResults";
import { SectionHeader } from "@/components/SectionHeader";
import {
  fetchPrograms,
  fetchRecommendations,
  type ProgramsPayload,
  type RecommendationsPayload,
} from "@/lib/frontend/api-client";
import { formatCurrency, formatDeadline } from "@/lib/frontend/format";
import type {
  ProgramFilters as ProgramFiltersType,
  ProgramWithAdmissions,
  StudentProfile,
} from "@/lib/domain";

const sectionMotion = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const navItems = [
  { label: "Overview", target: "top" },
  { label: "Universities", target: "universities" },
  { label: "Match Score", target: "match-score" },
  { label: "AI Advisor", target: "ai-advisor" },
  { label: "Compare", target: "compare" },
  { label: "Admission Guide", target: "admission-guide" },
  { label: "FAQ", target: "faq" },
];

const guideItems = [
  {
    description:
      "Start with field fit, teaching language, location, cost, and admission difficulty before you look at prestige.",
    icon: Compass,
    title: "How to choose a university",
  },
  {
    description:
      "Minimum scores are not guarantees. Stronger GPA, IELTS, and test evidence can help offset competitive programs.",
    icon: Target,
    title: "IELTS and GPA explained",
  },
  {
    description:
      "Prioritize programs with listed funding, then prepare a separate scholarship calendar and stronger essays.",
    icon: Award,
    title: "Scholarship strategy",
  },
  {
    description:
      "Close score gaps, show relevant projects, confirm prerequisites, and apply before priority deadlines.",
    icon: TrendingUp,
    title: "Improve your chances",
  },
  {
    description:
      "Prepare transcripts, English proof, personal statement, CV, references, portfolio, and test records early.",
    icon: BookOpenCheck,
    title: "Documents checklist",
  },
];

const faqs = [
  {
    answer:
      "It compares your field, degree level, GPA, IELTS, SAT if provided, budget, country preferences, and scholarship need against the program requirements in the catalog.",
    question: "How is match score calculated?",
  },
  {
    answer:
      "Yes. SAT is optional in the form. Programs that list SAT expectations may flag it as a missing item, but you can still review the fit report.",
    question: "Can I use it without SAT?",
  },
  {
    answer:
      "The report will mark the IELTS gap and suggest retaking the test or checking whether the university accepts alternatives.",
    question: "What if my IELTS is lower than required?",
  },
  {
    answer:
      "Yes. Add up to three programs to compare tuition, country, IELTS, GPA, scholarship availability, and deadlines side by side.",
    question: "Can I compare universities?",
  },
  {
    answer:
      "No. Scholarship labels show opportunities to investigate. Funding decisions depend on the university, deadline, applicant strength, and annual budget.",
    question: "Are scholarships guaranteed?",
  },
  {
    answer:
      "No. UniMatch AI is an admissions planning tool. Always verify requirements and decisions directly with official university admissions offices.",
    question: "Is this official admission advice?",
  },
];

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filters, setFilters] = useState<ProgramFiltersType>({});
  const [programPayload, setProgramPayload] = useState<ProgramsPayload>();
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsError, setProgramsError] = useState<string>();
  const [allPrograms, setAllPrograms] = useState<ProgramWithAdmissions[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [recommendationPayload, setRecommendationPayload] =
    useState<RecommendationsPayload>();
  const [studentProfile, setStudentProfile] = useState<StudentProfile>();
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string>();

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
      } catch {
        if (!controller.signal.aborted) {
          setProgramsError(
            "We could not load the program catalog right now. Please try again in a moment.",
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
  const countries = useMemo(
    () => unique(optionPrograms.map((item) => item.university.country)),
    [optionPrograms],
  );
  const fields = useMemo(
    () => unique(optionPrograms.map((item) => item.program.field)),
    [optionPrograms],
  );
  const universities = useMemo(
    () => unique(optionPrograms.map((item) => item.university.name)),
    [optionPrograms],
  );
  const scholarshipCount = optionPrograms.filter(
    (item) => item.program.scholarshipsAvailable,
  ).length;
  const comparedPrograms = compareIds
    .map((id) => optionPrograms.find((item) => item.program.id === id))
    .filter((item): item is ProgramWithAdmissions => Boolean(item));

  async function handleProfileSubmit(profile: StudentProfile) {
    setRecommendationsLoading(true);
    setRecommendationsError(undefined);
    setStudentProfile(profile);

    try {
      const payload = await fetchRecommendations(profile);
      setRecommendationPayload(payload);
      window.setTimeout(() => scrollToSection("results"), 80);
    } catch {
      setRecommendationsError(
        "We could not calculate your admission fit right now. Please check your profile and try again.",
      );
    } finally {
      setRecommendationsLoading(false);
    }
  }

  function toggleCompare(record: ProgramWithAdmissions) {
    setCompareIds((current) => {
      if (current.includes(record.program.id)) {
        return current.filter((id) => id !== record.program.id);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, record.program.id];
    });
  }

  function removeCompare(programId: string) {
    setCompareIds((current) => current.filter((id) => id !== programId));
  }

  function handleNav(target: string) {
    setMobileOpen(false);
    scrollToSection(target);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,#050711_0%,#081322_46%,#11130b_100%)]" />
      <div className="pointer-events-none fixed inset-0 premium-grid opacity-35" />
      <div className="pointer-events-none fixed inset-0 premium-sheen opacity-70" />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
          <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
            <button
              className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              onClick={() => handleNav("top")}
              type="button"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-cyan-200 text-slate-950 shadow-lg shadow-cyan-950/30">
                <Sparkles aria-hidden="true" className="size-5" />
              </span>
              <span className="text-base font-semibold tracking-tight">
                UniMatch AI
              </span>
            </button>

            <div className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/[0.045] p-1 lg:flex">
              {navItems.map((item) => (
                <NavButton
                  key={item.target}
                  label={item.label}
                  onClick={() => handleNav(item.target)}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="hidden h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950 sm:inline-flex"
                onClick={() => handleNav("match-score")}
                type="button"
              >
                Find my match
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
              <button
                aria-expanded={mobileOpen}
                aria-label="Toggle navigation"
                className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white transition hover:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 lg:hidden"
                onClick={() => setMobileOpen((current) => !current)}
                type="button"
              >
                {mobileOpen ? (
                  <X aria-hidden="true" className="size-5" />
                ) : (
                  <Menu aria-hidden="true" className="size-5" />
                )}
              </button>
            </div>
          </nav>

          {mobileOpen ? (
            <div className="border-t border-white/10 bg-slate-950/95 px-5 py-4 backdrop-blur-2xl lg:hidden">
              <div className="mx-auto grid max-w-7xl gap-2">
                {navItems.map((item) => (
                  <button
                    className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
                    key={item.target}
                    onClick={() => handleNav(item.target)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
                  onClick={() => handleNav("match-score")}
                  type="button"
                >
                  Find my match
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              </div>
            </div>
          ) : null}
        </header>

        <main id="top">
          <HeroSection
            countryCount={countries.length}
            onCatalogClick={() => scrollToSection("universities")}
            onFormClick={() => scrollToSection("match-score")}
            programCount={optionPrograms.length || programs.length}
            scholarshipCount={scholarshipCount}
            universityCount={universities.length}
          />

          <motion.section
            className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8"
            id="universities"
            initial="hidden"
            transition={{ duration: 0.55, ease: "easeOut" }}
            variants={sectionMotion}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="show"
          >
            <SectionHeader
              action={
                <div className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-slate-300 backdrop-blur-xl">
                  {programPayload?.count ?? 0} matching programs
                </div>
              }
              description="Search international programs by destination, field, degree level, tuition, language score, and scholarship availability."
              eyebrow="University Catalog"
              title="Explore universities and programs"
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
                  <LoadingState label="Loading university matches" />
                  <LoadingState label="Preparing program requirements" />
                  <LoadingState label="Checking scholarship options" />
                </div>
              ) : programsError ? (
                <EmptyState
                  description={programsError}
                  icon={ShieldCheck}
                  title="Catalog is temporarily unavailable"
                />
              ) : programs.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {programs.map((record) => (
                    <ProgramCard
                      compareDisabled={
                        compareIds.length >= 3 &&
                        !compareIds.includes(record.program.id)
                      }
                      isCompared={compareIds.includes(record.program.id)}
                      key={record.program.id}
                      onToggleCompare={() => toggleCompare(record)}
                      record={record}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  description="Try widening your destination, field, tuition, IELTS, or scholarship filters."
                  title="No programs matched your filters"
                />
              )}
            </div>
          </motion.section>

          <motion.section
            className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-20 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8"
            id="match-score"
            initial="hidden"
            transition={{ duration: 0.55, ease: "easeOut" }}
            variants={sectionMotion}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="show"
          >
            <div>
              <SectionHeader
                description="Share your academic profile, budget, destination preferences, and scholarship needs to generate a ranked shortlist."
                eyebrow="Match Score"
                title="Calculate your admission fit"
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
                description="Review fit strength, risks, missing requirements, and next actions before you decide where to apply."
                eyebrow="Admission Report"
                title="Your ranked shortlist"
              />
              <div className="mt-8">
                <RecommendationResults
                  error={recommendationsError}
                  loading={recommendationsLoading}
                  recommendations={recommendationPayload?.recommendations ?? []}
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8"
            id="ai-advisor"
            initial="hidden"
            transition={{ duration: 0.55, ease: "easeOut" }}
            variants={sectionMotion}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="show"
          >
            <SectionHeader
              description="Ask a focused admissions question and receive guidance grounded in your profile, shortlist, and the known program catalog."
              eyebrow="AI Advisor"
              title="Get a personalized admissions answer"
            />
            <div className="mt-8">
              <AdvisorPanel
                shortlistedProgramIds={compareIds}
                studentProfile={studentProfile}
              />
            </div>
          </motion.section>

          <CompareSection
            comparedPrograms={comparedPrograms}
            onRemove={removeCompare}
          />

          <AdmissionGuideSection />

          <FaqSection />
        </main>
      </div>
    </div>
  );
}

function NavButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function CompareSection({
  comparedPrograms,
  onRemove,
}: {
  comparedPrograms: ProgramWithAdmissions[];
  onRemove: (programId: string) => void;
}) {
  return (
    <motion.section
      className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8"
      id="compare"
      initial="hidden"
      transition={{ duration: 0.55, ease: "easeOut" }}
      variants={sectionMotion}
      viewport={{ once: true, margin: "-80px" }}
      whileInView="show"
    >
      <SectionHeader
        description="Shortlist up to three programs and compare cost, requirements, scholarship availability, and deadlines side by side."
        eyebrow="Compare"
        title="Compare your top options"
      />

      <div className="mt-8">
        {comparedPrograms.length ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {comparedPrograms.map((record) => (
              <article
                className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
                key={record.program.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-cyan-100">{record.university.name}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {record.program.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {record.university.city}, {record.university.country}
                    </p>
                  </div>
                  <button
                    aria-label={`Remove ${record.program.name} from compare`}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055] text-slate-300 transition hover:bg-white/[0.1] hover:text-white"
                    onClick={() => onRemove(record.program.id)}
                    type="button"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                </div>

                <div className="mt-5 grid gap-3">
                  <CompareRow
                    label="Tuition"
                    value={`${formatCurrency(record.program.tuitionUsdPerYear)} / year`}
                  />
                  <CompareRow
                    label="Degree"
                    value={record.program.degreeLevel}
                  />
                  <CompareRow
                    label="IELTS"
                    value={record.requirement.minIelts.toFixed(1)}
                  />
                  <CompareRow
                    label="GPA"
                    value={record.requirement.minGpa.toFixed(1)}
                  />
                  <CompareRow
                    label="SAT"
                    value={
                      record.requirement.minSat
                        ? String(record.requirement.minSat)
                        : "Not listed"
                    }
                  />
                  <CompareRow
                    label="Scholarship"
                    value={record.program.scholarshipsAvailable ? "Available" : "Limited"}
                  />
                  <CompareRow
                    label="Deadline"
                    value={formatDeadline(record.program.applicationDeadline)}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            description="Use the Add to compare button on program cards to build a shortlist."
            icon={Scale}
            title="Your compare list is empty"
          />
        )}
      </div>
    </motion.section>
  );
}

function CompareRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-black/20 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-right text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function AdmissionGuideSection() {
  return (
    <motion.section
      className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8"
      id="admission-guide"
      initial="hidden"
      transition={{ duration: 0.55, ease: "easeOut" }}
      variants={sectionMotion}
      viewport={{ once: true, margin: "-80px" }}
      whileInView="show"
    >
      <SectionHeader
        description="Use these planning principles to build a stronger, more realistic application strategy."
        eyebrow="Admission Guide"
        title="Plan smarter before you apply"
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {guideItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-200/25 hover:bg-white/[0.08]"
              key={item.title}
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-100 ring-1 ring-cyan-300/20">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </motion.section>
  );
}

function FaqSection() {
  return (
    <motion.section
      className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-6 lg:px-8"
      id="faq"
      initial="hidden"
      transition={{ duration: 0.55, ease: "easeOut" }}
      variants={sectionMotion}
      viewport={{ once: true, margin: "-80px" }}
      whileInView="show"
    >
      <SectionHeader
        className="md:block"
        description="Clear answers to the questions students usually ask before creating a shortlist."
        eyebrow="FAQ"
        title="Admissions questions, answered"
      />

      <div className="mt-10 space-y-3">
        {faqs.map((item) => (
          <details
            className="group rounded-lg border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl open:bg-white/[0.075]"
            key={item.question}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-white">
              <span className="flex items-center gap-3">
                <CircleHelp aria-hidden="true" className="size-5 text-cyan-100" />
                {item.question}
              </span>
              <ChevronDown
                aria-hidden="true"
                className="size-4 shrink-0 text-slate-400 transition group-open:rotate-180"
              />
            </summary>
            <p className="mt-4 text-sm leading-6 text-slate-400">{item.answer}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-5 text-sm leading-6 text-cyan-50">
        <div className="flex items-start gap-3">
          <HeartHandshake aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>
            UniMatch AI helps you prepare a stronger shortlist. Final eligibility,
            admissions decisions, and scholarship outcomes always come from the
            university.
          </p>
        </div>
      </div>
    </motion.section>
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
  return Array.from(new Set(values)).sort((left, right) =>
    left.localeCompare(right),
  );
}

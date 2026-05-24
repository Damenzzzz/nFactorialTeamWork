import {
  calculateAdmissionChance,
  comparePrograms,
  getProgramRequirements,
  parseDegreeLevel,
  toCompleteStudentProfile,
} from "@/lib/ai/tools";
import { generateJsonWithOpenAI, getOpenAIModel, isOpenAIConfigured } from "@/lib/ai/openai-runtime";
import { getAdmissionsRepository } from "@/lib/data/repository";
import { rankPrograms } from "@/lib/data/recommendations";
import type {
  AdmissionRoadmapPayload,
  AdvisorStatusPayload,
  AdvisorStudentProfile,
  AdvisorToolName,
  CompareSummaryPayload,
  DegreeLevel,
  ProgramFilters,
  ProgramInsightPayload,
  ProgramWithAdmissions,
  ProfileParserPayload,
  Recommendation,
  SmartSearchPayload,
  StudentProfile,
} from "@/lib/domain";

export const ADVISOR_TOOL_NAMES: AdvisorToolName[] = [
  "searchPrograms",
  "comparePrograms",
  "getProgramRequirements",
  "calculateAdmissionChance",
  "saveStudentPreferences",
];

const knownFields = [
  "Artificial Intelligence",
  "Computer Science",
  "Data Science",
  "Cybersecurity",
  "Engineering",
  "Business",
  "Economics",
  "Law",
  "Design",
  "Medicine/Health Sciences",
];

const europeCountries = [
  "Germany",
  "UK",
  "Netherlands",
  "Finland",
  "Hungary",
  "Poland",
  "Italy",
];

export function getAdvisorStatus(): AdvisorStatusPayload {
  return {
    advisorTools: ADVISOR_TOOL_NAMES,
    model: getOpenAIModel(),
    openaiConfigured: isOpenAIConfigured(),
  };
}

export async function parseProfileText(text: string): Promise<ProfileParserPayload> {
  const catalog = await getCatalogOptions();
  const fallback = parseProfileTextLocally(text, catalog);
  const ai = await generateJsonWithOpenAI<ProfileParserPayload>({
    system:
      "Extract a student admissions profile from the user's study goal. Return JSON only with studentProfile, confidence, and notes. Use only these degree levels: Bachelor, Master, PhD. Use country and field names only when clearly present or strongly implied.",
    user: JSON.stringify({ availableCountries: catalog.countries, availableFields: catalog.fields, text }),
  });

  if (!ai?.studentProfile) {
    return fallback;
  }

  const merged = normalizeProfileParserPayload(ai, fallback, catalog);

  if (!fallback.studentProfile.degreeLevel) {
    delete merged.studentProfile.degreeLevel;
  }

  return merged;
}

export async function createSmartSearch(query: string): Promise<SmartSearchPayload> {
  const catalog = await getCatalogOptions();
  const fallback = smartSearchLocally(query, catalog);
  const ai = await generateJsonWithOpenAI<SmartSearchPayload>({
    system:
      "Convert the user's natural language university search into catalog filters. Return JSON only with filters and explanation. Use only the provided country, field, and degree options. Keep explanation student-facing.",
    user: JSON.stringify({
      availableCountries: catalog.countries,
      availableFields: catalog.fields,
      query,
    }),
  });

  if (!ai?.filters) {
    return fallback;
  }

  return normalizeSmartSearchPayload(ai, fallback, catalog);
}

export async function createProgramInsight({
  programId,
  studentProfile,
}: {
  programId: string;
  studentProfile?: AdvisorStudentProfile;
}): Promise<ProgramInsightPayload> {
  const repository = getAdmissionsRepository();
  const record = await repository.getProgramById(programId);

  if (!record) {
    return {
      fitSummary: "This program is not available in the current UniMatch catalog.",
      missingRequirements: [],
      nextSteps: ["Choose another program from the catalog and try again."],
      risks: [],
      strengths: [],
    };
  }

  if (!toCompleteStudentProfile(studentProfile)) {
    return {
      fitSummary: "Calculate your admission fit first for a personalized explanation.",
      missingRequirements: [],
      nextSteps: [
        "Fill in intended field, degree level, GPA, budget, and country preferences.",
        "Click Calculate fit, then return to this program for a personalized explanation.",
      ],
      risks: [],
      strengths: [
        `${record.program.name} is a ${record.program.degreeLevel} program in ${record.program.field}.`,
        `Annual tuition is ${formatUsd(record.program.tuitionUsdPerYear)}.`,
      ],
    };
  }

  const requirements = await getProgramRequirements({ programId });
  const chance = await calculateAdmissionChance({
    limit: 1,
    programIds: [programId],
    studentProfile,
  });
  const recommendation = chance.recommendations[0];
  const deterministic = insightFromRecommendation(record, recommendation);
  const ai = await generateJsonWithOpenAI<ProgramInsightPayload>({
    system:
      "Write a concise student-facing program fit explanation from the supplied catalog facts. Do not invent facts. Return JSON only with fitSummary, strengths, risks, missingRequirements, and nextSteps.",
    user: JSON.stringify({ recommendation, requirements, record }),
  });

  return normalizeProgramInsight(ai, deterministic);
}

export async function createCompareSummary({
  programIds,
  studentProfile,
}: {
  programIds: string[];
  studentProfile?: AdvisorStudentProfile;
}): Promise<CompareSummaryPayload> {
  const comparison = await comparePrograms({ programIds, studentProfile });
  const deterministic = buildCompareSummary(comparison.comparedPrograms);
  const ai = await generateJsonWithOpenAI<CompareSummaryPayload>({
    system:
      "Create a premium student-facing decision brief comparing the supplied programs. Use only supplied facts. Return JSON only with bestOverall, safestOption, bestValue, scholarshipFriendlyOption, tradeoffs, and finalAdvice.",
    user: JSON.stringify({ comparedPrograms: comparison.comparedPrograms }),
  });

  return normalizeCompareSummary(ai, deterministic);
}

export async function createAdmissionRoadmap({
  studentProfile,
  topProgramIds,
}: {
  studentProfile: StudentProfile;
  topProgramIds?: string[];
}): Promise<AdmissionRoadmapPayload> {
  const repository = getAdmissionsRepository();
  const programs = topProgramIds?.length
    ? (
        await Promise.all(
          topProgramIds.map((programId) => repository.getProgramById(programId)),
        )
      ).filter((record): record is ProgramWithAdmissions => record !== null)
    : await repository.listPrograms({ degreeLevel: studentProfile.degreeLevel });
  const recommendations = rankPrograms(studentProfile, programs).slice(0, 3);
  const deterministic = buildRoadmap(studentProfile, recommendations);
  const ai = await generateJsonWithOpenAI<AdmissionRoadmapPayload>({
    system:
      "Create a practical student-facing admissions roadmap from the supplied profile and recommendations. Do not invent program facts. Return JSON only with overview, timeline, documents, scoreImprovements, and deadlineAdvice.",
    user: JSON.stringify({ recommendations, studentProfile }),
  });

  return normalizeRoadmap(ai, deterministic);
}

function parseProfileTextLocally(
  text: string,
  catalog: CatalogOptions,
): ProfileParserPayload {
  const normalized = normalize(text);
  const studentProfile: AdvisorStudentProfile = {};
  const notes: string[] = [];
  const field = findField(text, catalog.fields);
  const countries = findCountries(text, catalog.countries);
  const degreeLevel = findDegreeLevel(normalized);
  const gpa = findNumber(normalized, /\bgpa\s*(?:is|of|:)?\s*(\d(?:\.\d)?)/);
  const ielts = findNumber(normalized, /\bielts\s*(?:is|of|:)?\s*(\d(?:\.\d)?)/);
  const sat = findNumber(normalized, /\bsat\s*(?:is|of|:)?\s*(\d{3,4})/);
  const maxTuition = findTuition(normalized);

  if (field) studentProfile.intendedField = field;
  if (countries.length) studentProfile.preferredCountries = countries;
  if (degreeLevel) studentProfile.degreeLevel = degreeLevel;
  if (typeof gpa === "number") studentProfile.gpa = gpa;
  if (typeof ielts === "number") studentProfile.ielts = ielts;
  if (typeof sat === "number") studentProfile.sat = sat;
  if (typeof maxTuition === "number") studentProfile.maxTuition = maxTuition;
  if (mentionsScholarship(normalized)) studentProfile.scholarshipRequired = true;

  if (!studentProfile.degreeLevel) {
    notes.push("Choose a degree level before calculating fit.");
  }

  if (typeof studentProfile.gpa !== "number") {
    notes.push("Add GPA for a stronger admission fit estimate.");
  }

  if (!studentProfile.intendedField) {
    notes.push("Add your intended field if it was not captured.");
  }

  const extractedCount = Object.values(studentProfile).filter(
    (value) => value !== undefined,
  ).length;

  return {
    confidence: Math.min(0.95, Math.max(0.25, Number((extractedCount / 7).toFixed(2)))),
    notes,
    studentProfile,
  };
}

function smartSearchLocally(
  query: string,
  catalog: CatalogOptions,
): SmartSearchPayload {
  const normalized = normalize(query);
  const countries = normalized.includes("europe")
    ? catalog.countries.filter((country) => europeCountries.includes(country))
    : findCountries(query, catalog.countries);
  const field = findField(query, catalog.fields);
  const degreeLevel = findDegreeLevel(normalized);
  const maxTuition = findTuition(normalized);
  const minIelts = findNumber(normalized, /\bielts\s*(?:is|of|:)?\s*(\d(?:\.\d)?)/);
  const scholarshipOnly = mentionsScholarship(normalized) || undefined;
  const filters: ProgramFilters = {
    country: countries.length === 1 ? countries[0] : undefined,
    countries: countries.length > 1 ? countries : undefined,
    degreeLevel,
    field,
    maxTuition,
    minIelts,
    scholarshipOnly,
  };

  return {
    explanation: "I translated your search into catalog filters. You can still adjust them manually.",
    filters,
  };
}

function insightFromRecommendation(
  record: ProgramWithAdmissions,
  recommendation?: Recommendation,
): ProgramInsightPayload {
  if (!recommendation) {
    return {
      fitSummary: `${record.program.name} is available in the catalog, but your profile was not enough to score it.`,
      missingRequirements: [],
      nextSteps: ["Calculate your admission fit, then review this program again."],
      risks: [],
      strengths: [`The program is in ${record.program.field}.`],
    };
  }

  return {
    fitSummary: `${record.program.name} at ${record.university.name} is a ${recommendation.matchScore}/100 fit based on your current profile.`,
    missingRequirements: recommendation.missingRequirements,
    nextSteps: recommendation.nextSteps,
    risks: recommendation.risks,
    strengths: recommendation.fitReasons,
  };
}

function buildCompareSummary(
  programs: Awaited<ReturnType<typeof comparePrograms>>["comparedPrograms"],
): CompareSummaryPayload {
  if (programs.length === 0) {
    return emptyCompareSummary();
  }

  const byFit = [...programs].sort(
    (left, right) => (right.fitScore ?? 0) - (left.fitScore ?? 0),
  );
  const byTuition = [...programs].sort(
    (left, right) => left.tuitionUsdPerYear - right.tuitionUsdPerYear,
  );
  const scholarship = programs.find((program) => program.scholarshipAvailable);
  const safest = [...programs].sort(
    (left, right) => left.risks.length - right.risks.length,
  )[0];

  return {
    bestOverall: describeProgramChoice(byFit[0]),
    bestValue: describeProgramChoice(byTuition[0]),
    finalAdvice:
      "Choose the strongest fit if your requirements are ready; choose the best value if cost risk is your main constraint.",
    safestOption: describeProgramChoice(safest),
    scholarshipFriendlyOption: scholarship
      ? describeProgramChoice(scholarship)
      : "No shortlisted option is clearly marked scholarship-friendly in the catalog.",
    tradeoffs: programs.map(
      (program) =>
        `${program.programName}: ${formatUsd(program.tuitionUsdPerYear)} tuition, ${program.minGpa.toFixed(1)} GPA, ${program.minIelts.toFixed(1)} IELTS, ${program.scholarshipAvailable ? "scholarship listed" : "limited scholarship signal"}.`,
    ),
  };
}

function buildRoadmap(
  profile: StudentProfile,
  recommendations: Recommendation[],
): AdmissionRoadmapPayload {
  const documents = unique(
    recommendations.flatMap((recommendation) =>
      recommendation.requirement.requiredDocuments,
    ),
  );
  const missingRequirements = unique(
    recommendations.flatMap((recommendation) => recommendation.missingRequirements),
  );
  const deadlines = recommendations.map(
    (recommendation) =>
      `${recommendation.program.name}: confirm the ${recommendation.program.applicationDeadline} catalog deadline on ${recommendation.university.name}'s official admissions page.`,
  );

  return {
    deadlineAdvice: deadlines.length
      ? deadlines
      : ["Shortlist programs first, then build a deadline calendar."],
    documents: documents.length
      ? documents
      : ["Transcript", "English proficiency evidence", "Statement of purpose"],
    overview: `Your roadmap focuses on ${profile.degreeLevel} programs in ${profile.intendedField}. Start by strengthening requirements, preparing documents, and confirming each deadline.`,
    scoreImprovements: missingRequirements.length
      ? missingRequirements
      : ["Keep GPA, IELTS, and test evidence ready in official format."],
    timeline: [
      {
        label: "This week",
        tasks: [
          "Finalize your target field, degree level, budget, and countries.",
          "Review the top matches and remove programs that do not fit your constraints.",
          "Create a document checklist for each shortlisted program.",
        ],
      },
      {
        label: "This month",
        tasks: [
          "Prepare transcripts, English proof, statement drafts, and CV if required.",
          "Check whether scholarship applications have separate forms or earlier deadlines.",
          "Plan IELTS, SAT, or GPA improvement steps if any gaps were flagged.",
        ],
      },
      {
        label: "Before application deadline",
        tasks: [
          "Verify final requirements on official university pages.",
          "Request references early if your programs require them.",
          "Submit before priority deadlines and keep confirmation receipts.",
        ],
      },
    ],
  };
}

function normalizeProfileParserPayload(
  input: Partial<ProfileParserPayload>,
  fallback: ProfileParserPayload,
  catalog: CatalogOptions,
): ProfileParserPayload {
  const profile = input.studentProfile ?? {};

  return {
    confidence: clampConfidence(input.confidence ?? fallback.confidence),
    notes: stringArray(input.notes, fallback.notes).slice(0, 4),
    studentProfile: {
      degreeLevel:
        normalizeDegree(profile.degreeLevel) ?? fallback.studentProfile.degreeLevel,
      gpa: boundedNumber(profile.gpa, 0, 4) ?? fallback.studentProfile.gpa,
      ielts:
        boundedNumber(profile.ielts, 0, 9) ?? fallback.studentProfile.ielts,
      intendedField:
        includeKnown(profile.intendedField, catalog.fields) ??
        fallback.studentProfile.intendedField,
      maxTuition:
        boundedNumber(profile.maxTuition, 0, 200000) ??
        fallback.studentProfile.maxTuition,
      preferredCountries:
        knownItems(profile.preferredCountries, catalog.countries) ??
        fallback.studentProfile.preferredCountries,
      sat: boundedNumber(profile.sat, 400, 1600) ?? fallback.studentProfile.sat,
      scholarshipRequired:
        typeof profile.scholarshipRequired === "boolean"
          ? profile.scholarshipRequired
          : fallback.studentProfile.scholarshipRequired,
    },
  };
}

function normalizeSmartSearchPayload(
  input: Partial<SmartSearchPayload>,
  fallback: SmartSearchPayload,
  catalog: CatalogOptions,
): SmartSearchPayload {
  const filters = input.filters ?? {};
  const countries = knownItems(filters.countries, catalog.countries) ?? [];
  const country = includeKnown(filters.country, catalog.countries);

  return {
    explanation:
      typeof input.explanation === "string" && input.explanation.trim()
        ? input.explanation.trim()
        : fallback.explanation,
    filters: {
      country: country ?? (countries.length === 1 ? countries[0] : undefined),
      countries: countries.length > 1 ? countries : fallback.filters.countries,
      degreeLevel:
        normalizeDegree(filters.degreeLevel) ?? fallback.filters.degreeLevel,
      field: includeKnown(filters.field, catalog.fields) ?? fallback.filters.field,
      maxTuition:
        boundedNumber(filters.maxTuition, 0, 200000) ??
        fallback.filters.maxTuition,
      minIelts:
        boundedNumber(filters.minIelts, 0, 9) ?? fallback.filters.minIelts,
      scholarshipOnly:
        typeof filters.scholarshipOnly === "boolean"
          ? filters.scholarshipOnly
          : fallback.filters.scholarshipOnly,
    },
  };
}

function normalizeProgramInsight(
  input: Partial<ProgramInsightPayload> | undefined,
  fallback: ProgramInsightPayload,
): ProgramInsightPayload {
  return {
    fitSummary: cleanText(input?.fitSummary, fallback.fitSummary),
    missingRequirements: stringArray(
      input?.missingRequirements,
      fallback.missingRequirements,
    ).slice(0, 5),
    nextSteps: stringArray(input?.nextSteps, fallback.nextSteps).slice(0, 5),
    risks: stringArray(input?.risks, fallback.risks).slice(0, 5),
    strengths: stringArray(input?.strengths, fallback.strengths).slice(0, 5),
  };
}

function normalizeCompareSummary(
  input: Partial<CompareSummaryPayload> | undefined,
  fallback: CompareSummaryPayload,
): CompareSummaryPayload {
  return {
    bestOverall: cleanText(input?.bestOverall, fallback.bestOverall),
    bestValue: cleanText(input?.bestValue, fallback.bestValue),
    finalAdvice: cleanText(input?.finalAdvice, fallback.finalAdvice),
    safestOption: cleanText(input?.safestOption, fallback.safestOption),
    scholarshipFriendlyOption: cleanText(
      input?.scholarshipFriendlyOption,
      fallback.scholarshipFriendlyOption,
    ),
    tradeoffs: stringArray(input?.tradeoffs, fallback.tradeoffs).slice(0, 5),
  };
}

function normalizeRoadmap(
  input: Partial<AdmissionRoadmapPayload> | undefined,
  fallback: AdmissionRoadmapPayload,
): AdmissionRoadmapPayload {
  const timeline = Array.isArray(input?.timeline)
    ? input.timeline
        .filter(
          (item): item is { label: string; tasks: string[] } =>
            typeof item?.label === "string" && Array.isArray(item.tasks),
        )
        .map((item) => ({
          label: item.label,
          tasks: stringArray(item.tasks, []).slice(0, 5),
        }))
        .filter((item) => item.tasks.length)
    : fallback.timeline;

  return {
    deadlineAdvice: stringArray(
      input?.deadlineAdvice,
      fallback.deadlineAdvice,
    ).slice(0, 5),
    documents: stringArray(input?.documents, fallback.documents).slice(0, 8),
    overview: cleanText(input?.overview, fallback.overview),
    scoreImprovements: stringArray(
      input?.scoreImprovements,
      fallback.scoreImprovements,
    ).slice(0, 6),
    timeline: timeline.length ? timeline : fallback.timeline,
  };
}

async function getCatalogOptions(): Promise<CatalogOptions> {
  const programs = await getAdmissionsRepository().listPrograms();
  return {
    countries: unique(programs.map((record) => record.university.country)),
    fields: unique([...knownFields, ...programs.map((record) => record.program.field)]),
  };
}

interface CatalogOptions {
  countries: string[];
  fields: string[];
}

function findField(text: string, fields: string[]): string | undefined {
  const normalized = normalize(text);
  const artificialIntelligence = fields.find(
    (field) => normalize(field) === "artificial intelligence",
  );

  if (artificialIntelligence && /\b(ai|artificial intelligence)\b/.test(normalized)) {
    return artificialIntelligence;
  }

  return fields
    .sort((left, right) => right.length - left.length)
    .find((field) => normalized.includes(normalize(field)));
}

function findCountries(text: string, countries: string[]): string[] {
  const normalized = normalize(text);
  return countries.filter((country) => normalized.includes(normalize(country)));
}

function findDegreeLevel(value: string): DegreeLevel | undefined {
  if (/\b(master|masters|msc|ma|mba|llm)\b/.test(value)) return "Master";
  if (/\b(phd|doctor|doctoral)\b/.test(value)) return "PhD";
  if (/\b(bachelor|bachelors|bsc|ba|bs|undergraduate)\b/.test(value)) return "Bachelor";
  return undefined;
}

function findTuition(value: string): number | undefined {
  return findNumber(
    value.replace(/,/g, ""),
    /\b(?:under|below|less than|max|maximum|budget|around)\s*\$?\s*(\d{4,6})/,
  );
}

function findNumber(value: string, pattern: RegExp): number | undefined {
  const match = value.match(pattern);
  if (!match?.[1]) return undefined;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function mentionsScholarship(value: string): boolean {
  return /\b(scholarships?|funding|financial aid|grants?|tuition support)\b/.test(value);
}

function normalizeDegree(value: unknown): DegreeLevel | undefined {
  return typeof value === "string" ? parseDegreeLevel(value) : undefined;
}

function includeKnown(value: unknown, known: string[]): string | undefined {
  if (typeof value !== "string") return undefined;
  return known.find((item) => normalize(item) === normalize(value));
}

function knownItems(value: unknown, known: string[]): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => includeKnown(item, known))
    .filter((item): item is string => Boolean(item));
  return unique(items);
}

function boundedNumber(
  value: unknown,
  min: number,
  max: number,
): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return value >= min && value <= max ? value : undefined;
}

function clampConfidence(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0.5;
  return Math.max(0, Math.min(1, Number(value.toFixed(2))));
}

function cleanText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : fallback;
}

function describeProgramChoice(
  program: Awaited<ReturnType<typeof comparePrograms>>["comparedPrograms"][number] | undefined,
): string {
  if (!program) return "Select programs to compare.";
  return `${program.programName} at ${program.universityName}`;
}

function emptyCompareSummary(): CompareSummaryPayload {
  return {
    bestOverall: "Select at least two programs to compare.",
    bestValue: "Select at least two programs to compare.",
    finalAdvice: "Add programs to your compare list to generate a decision brief.",
    safestOption: "Select at least two programs to compare.",
    scholarshipFriendlyOption: "Select at least two programs to compare.",
    tradeoffs: [],
  };
}

function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((left, right) =>
    left.localeCompare(right),
  );
}

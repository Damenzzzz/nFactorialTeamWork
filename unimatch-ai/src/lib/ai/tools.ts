import type {
  AdvisorStudentProfile,
  ComparedProgram,
  DataSourceMode,
  DegreeLevel,
  ProgramWithAdmissions,
  Recommendation,
  SavedStudentPreferences,
  StudentProfile,
} from "@/lib/domain";
import { getAdmissionsRepository } from "@/lib/data/repository";
import { rankPrograms } from "@/lib/data/recommendations";

const degreeLevels: DegreeLevel[] = ["Bachelor", "Master", "PhD"];

export interface AdvisorToolContext {
  message: string;
  studentProfile?: AdvisorStudentProfile;
  shortlistedProgramIds: string[];
}

export interface SearchProgramsInput {
  query?: string;
  field?: string;
  degreeLevel?: DegreeLevel;
  countries?: string[];
  maxTuition?: number;
  scholarshipRequired?: boolean;
  limit?: number;
}

export interface SearchProgramsOutput {
  dataSource: DataSourceMode;
  count: number;
  programs: ProgramWithAdmissions[];
  note: string;
}

export interface CompareProgramsInput {
  programIds?: string[];
  studentProfile?: AdvisorStudentProfile;
}

export interface CompareProgramsOutput {
  comparedPrograms: ComparedProgram[];
  notFoundProgramIds: string[];
  note: string;
}

export interface GetProgramRequirementsInput {
  programIds?: string[];
  programId?: string;
}

export interface ProgramRequirementsOutput {
  requirements: Array<{
    programId: string;
    universityName: string;
    programName: string;
    degreeLevel: DegreeLevel;
    field: string;
    minGpa: number;
    minIelts: number;
    minSat?: number;
    requiredDocuments: string[];
    applicationDeadline: string;
    notes: string;
  }>;
  notFoundProgramIds: string[];
  note: string;
}

export interface CalculateAdmissionChanceInput {
  studentProfile?: AdvisorStudentProfile;
  programIds?: string[];
  limit?: number;
}

export interface CalculateAdmissionChanceOutput {
  canCalculate: boolean;
  missingProfileFields: string[];
  recommendations: Recommendation[];
  chances: Array<{
    programId: string;
    universityName: string;
    programName: string;
    matchScore: number;
    chanceBand: "Strong" | "Possible" | "Reach";
    caveat: string;
  }>;
  note: string;
}

export interface SaveStudentPreferencesInput {
  studentProfile?: AdvisorStudentProfile;
  shortlistedProgramIds?: string[];
}

export interface AdvisorToolHandlers {
  searchPrograms(input: SearchProgramsInput): Promise<SearchProgramsOutput>;
  comparePrograms(input: CompareProgramsInput): Promise<CompareProgramsOutput>;
  getProgramRequirements(
    input: GetProgramRequirementsInput,
  ): Promise<ProgramRequirementsOutput>;
  calculateAdmissionChance(
    input: CalculateAdmissionChanceInput,
  ): Promise<CalculateAdmissionChanceOutput>;
  saveStudentPreferences(
    input: SaveStudentPreferencesInput,
  ): Promise<SavedStudentPreferences>;
}

export function createAdvisorToolHandlers(
  context: AdvisorToolContext,
): AdvisorToolHandlers {
  return {
    calculateAdmissionChance: (input) =>
      calculateAdmissionChance({
        limit: input.limit,
        programIds: input.programIds ?? context.shortlistedProgramIds,
        studentProfile: input.studentProfile ?? context.studentProfile,
      }),
    comparePrograms: (input) =>
      comparePrograms({
        programIds: input.programIds ?? context.shortlistedProgramIds,
        studentProfile: input.studentProfile ?? context.studentProfile,
      }),
    getProgramRequirements: (input) =>
      getProgramRequirements({
        programId: input.programId,
        programIds: input.programIds ?? context.shortlistedProgramIds,
      }),
    saveStudentPreferences: (input) =>
      saveStudentPreferences({
        shortlistedProgramIds:
          input.shortlistedProgramIds ?? context.shortlistedProgramIds,
        studentProfile: input.studentProfile ?? context.studentProfile,
      }),
    searchPrograms: (input) =>
      searchPrograms({
        countries:
          input.countries ??
          context.studentProfile?.preferredCountries ??
          inferCountries(context.message),
        degreeLevel: input.degreeLevel ?? context.studentProfile?.degreeLevel,
        field:
          input.field ??
          context.studentProfile?.intendedField ??
          inferField(context.message),
        limit: input.limit,
        maxTuition: input.maxTuition ?? context.studentProfile?.maxTuition,
        query: input.query ?? context.message,
        scholarshipRequired:
          input.scholarshipRequired ?? context.studentProfile?.scholarshipRequired,
      }),
  };
}

export async function searchPrograms(
  input: SearchProgramsInput,
): Promise<SearchProgramsOutput> {
  const repository = getAdmissionsRepository();
  const records = await repository.listPrograms({
    degreeLevel: input.degreeLevel,
    field: input.field,
    maxTuition: input.maxTuition,
    scholarshipOnly: input.scholarshipRequired,
  });

  const countries = input.countries?.map(normalizeText).filter(Boolean) ?? [];
  const query = input.query ? normalizeText(input.query) : "";
  const queryTerms = query
    .split(/\s+/)
    .filter((term) => term.length >= 4 && !ignoredSearchTerms.has(term));

  const filtered = records
    .filter((record) => {
      if (
        countries.length > 0 &&
        !countries.includes(normalizeText(record.university.country))
      ) {
        return false;
      }

      if (queryTerms.length === 0) {
        return true;
      }

      const searchable = normalizeText(
        [
          record.university.name,
          record.university.country,
          record.university.city,
          record.program.name,
          record.program.field,
          record.program.description,
          ...record.program.tags,
        ].join(" "),
      );

      return queryTerms.some((term) => searchable.includes(term));
    })
    .slice(0, clampLimit(input.limit, 8));

  return {
    count: filtered.length,
    dataSource: repository.getStatus().activeDataSource,
    note: "Results are limited to programs currently available in the UniMatch program catalog.",
    programs: filtered,
  };
}

export async function comparePrograms(
  input: CompareProgramsInput,
): Promise<CompareProgramsOutput> {
  const programIds = uniqueIds(input.programIds);
  const repository = getAdmissionsRepository();
  const records = await Promise.all(
    programIds.map((programId) => repository.getProgramById(programId)),
  );
  const found = records.filter(
    (record): record is ProgramWithAdmissions => record !== null,
  );
  const notFoundProgramIds = programIds.filter(
    (programId) => !found.some((record) => record.program.id === programId),
  );
  const profile = toCompleteStudentProfile(input.studentProfile);
  const ranked = profile ? rankPrograms(profile, found) : [];
  const scoresByProgramId = new Map(
    ranked.map((recommendation) => [
      recommendation.program.id,
      recommendation,
    ]),
  );

  return {
    comparedPrograms: found.map((record) =>
      toComparedProgram(record, scoresByProgramId.get(record.program.id)),
    ),
    notFoundProgramIds,
    note:
      "Comparison uses tuition, country, IELTS, GPA, scholarship, deadline, and available profile fit from the UniMatch catalog.",
  };
}

export async function getProgramRequirements(
  input: GetProgramRequirementsInput,
): Promise<ProgramRequirementsOutput> {
  const programIds = uniqueIds(
    input.programIds ?? (input.programId ? [input.programId] : []),
  );
  const repository = getAdmissionsRepository();
  const records = await Promise.all(
    programIds.map((programId) => repository.getProgramById(programId)),
  );
  const found = records.filter(
    (record): record is ProgramWithAdmissions => record !== null,
  );
  const notFoundProgramIds = programIds.filter(
    (programId) => !found.some((record) => record.program.id === programId),
  );

  return {
    notFoundProgramIds,
    note:
      "Requirements are catalog values for planning and should be verified on official admissions pages.",
    requirements: found.map(({ program, requirement, university }) => ({
      applicationDeadline: program.applicationDeadline,
      degreeLevel: program.degreeLevel,
      field: program.field,
      minGpa: requirement.minGpa,
      minIelts: requirement.minIelts,
      minSat: requirement.minSat,
      notes: requirement.notes,
      programId: program.id,
      programName: program.name,
      requiredDocuments: requirement.requiredDocuments,
      universityName: university.name,
    })),
  };
}

export async function calculateAdmissionChance(
  input: CalculateAdmissionChanceInput,
): Promise<CalculateAdmissionChanceOutput> {
  const profile = toCompleteStudentProfile(input.studentProfile);
  const missingProfileFields = getMissingProfileFields(input.studentProfile);

  if (!profile) {
    return {
      canCalculate: false,
      chances: [],
      missingProfileFields,
      note:
        "Admission fit needs intended field, degree level, and GPA before it can be estimated.",
      recommendations: [],
    };
  }

  const repository = getAdmissionsRepository();
  const candidatePrograms = input.programIds?.length
    ? (
        await Promise.all(
          uniqueIds(input.programIds).map((programId) =>
            repository.getProgramById(programId),
          ),
        )
      ).filter((record): record is ProgramWithAdmissions => record !== null)
    : await repository.listPrograms({ degreeLevel: profile.degreeLevel });

  const recommendations = rankPrograms(profile, candidatePrograms).slice(
    0,
    clampLimit(input.limit, 6),
  );

  return {
    canCalculate: true,
    chances: recommendations.map((recommendation) => ({
      caveat:
        "This is a planning estimate from catalog requirements, not an admission guarantee.",
      chanceBand: toChanceBand(recommendation.matchScore),
      matchScore: recommendation.matchScore,
      programId: recommendation.program.id,
      programName: recommendation.program.name,
      universityName: recommendation.university.name,
    })),
    missingProfileFields: [],
    note:
      "Admission fit estimates are based on available UniMatch program requirements.",
    recommendations,
  };
}

export async function saveStudentPreferences(
  input: SaveStudentPreferencesInput,
): Promise<SavedStudentPreferences> {
  const profile = input.studentProfile ?? {};

  return {
    degreeLevel: profile.degreeLevel,
    gpa: profile.gpa,
    ielts: profile.ielts,
    intendedField: normalizeOptionalText(profile.intendedField),
    maxTuition: profile.maxTuition,
    note:
      "Preferences were applied to this advisor answer.",
    preferredCountries: profile.preferredCountries?.map((country) => country.trim()),
    sat: profile.sat,
    scholarshipRequired: profile.scholarshipRequired,
    shortlistedProgramIds: uniqueIds(input.shortlistedProgramIds),
  };
}

export function toCompleteStudentProfile(
  profile?: AdvisorStudentProfile,
): StudentProfile | undefined {
  if (
    !profile?.intendedField ||
    !profile.degreeLevel ||
    typeof profile.gpa !== "number"
  ) {
    return undefined;
  }

  return {
    degreeLevel: profile.degreeLevel,
    gpa: profile.gpa,
    ielts: profile.ielts,
    intendedField: profile.intendedField,
    maxTuition: profile.maxTuition,
    preferredCountries: profile.preferredCountries,
    sat: profile.sat,
    scholarshipRequired: profile.scholarshipRequired,
  };
}

export function parseDegreeLevel(value: string): DegreeLevel | undefined {
  return degreeLevels.find(
    (degreeLevel) => normalizeText(degreeLevel) === normalizeText(value),
  );
}

function toComparedProgram(
  record: ProgramWithAdmissions,
  recommendation?: Recommendation,
): ComparedProgram {
  const risks = recommendation?.risks ?? [];

  return {
    applicationDeadline: record.program.applicationDeadline,
    city: record.university.city,
    country: record.university.country,
    fitScore: recommendation?.matchScore,
    fitSummary: recommendation
      ? `${toChanceBand(recommendation.matchScore)} fit at ${recommendation.matchScore}/100 based on the current profile.`
      : "Add intended field, degree level, and GPA to calculate fit.",
    minGpa: record.requirement.minGpa,
    minIelts: record.requirement.minIelts,
    minSat: record.requirement.minSat,
    programId: record.program.id,
    programName: record.program.name,
    risks,
    scholarshipAvailable: record.program.scholarshipsAvailable,
    tuitionUsdPerYear: record.program.tuitionUsdPerYear,
    universityName: record.university.name,
  };
}

function getMissingProfileFields(profile?: AdvisorStudentProfile): string[] {
  const missing: string[] = [];

  if (!profile?.intendedField) {
    missing.push("intendedField");
  }

  if (!profile?.degreeLevel) {
    missing.push("degreeLevel");
  }

  if (typeof profile?.gpa !== "number") {
    missing.push("gpa");
  }

  return missing;
}

function toChanceBand(score: number): "Strong" | "Possible" | "Reach" {
  if (score >= 75) {
    return "Strong";
  }

  if (score >= 55) {
    return "Possible";
  }

  return "Reach";
}

function inferField(message: string): string | undefined {
  const normalized = normalizeText(message);
  const fields = [
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

  return fields.find((field) => normalized.includes(normalizeText(field)));
}

function inferCountries(message: string): string[] | undefined {
  const normalized = normalizeText(message);
  const countries = [
    "Canada",
    "Germany",
    "USA",
    "UK",
    "Kazakhstan",
    "Netherlands",
    "Finland",
    "Turkey",
    "South Korea",
    "Malaysia",
    "UAE",
    "Hungary",
    "Poland",
    "Italy",
    "Singapore",
  ];
  const matches = countries.filter((country) =>
    normalized.includes(normalizeText(country)),
  );

  return matches.length ? matches : undefined;
}

function clampLimit(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.min(12, Math.round(value)));
}

function uniqueIds(values: string[] | undefined): string[] {
  if (!values) {
    return [];
  }

  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  ).slice(0, 8);
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

const ignoredSearchTerms = new Set([
  "about",
  "admission",
  "admissions",
  "advise",
  "advisor",
  "best",
  "catalog",
  "chance",
  "compare",
  "could",
  "give",
  "help",
  "ielts",
  "program",
  "programs",
  "recommend",
  "requirements",
  "scholarship",
  "student",
  "tuition",
  "university",
  "universities",
]);

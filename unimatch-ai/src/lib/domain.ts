export type DegreeLevel = "Bachelor" | "Master" | "PhD";

export type DataSourceMode = "seed" | "supabase";

export interface TuitionRange {
  min: number;
  max: number;
  currency: "USD";
}

export interface Scholarship {
  name: string;
  coverage: string;
  eligibilitySummary: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  website: string;
  rankingNotes: string;
  tuitionRange: TuitionRange;
  scholarships: Scholarship[];
  sourceNote: string;
}

export interface Program {
  id: string;
  universityId: string;
  name: string;
  description: string;
  degreeLevel: DegreeLevel;
  field: string;
  language: string;
  durationMonths: number;
  tuitionUsdPerYear: number;
  applicationDeadline: string;
  scholarshipsAvailable: boolean;
  tags: string[];
}

export interface AdmissionRequirement {
  id: string;
  programId: string;
  minGpa: number;
  minIelts: number;
  minSat?: number;
  requiredDocuments: string[];
  notes: string;
}

export interface StudentProfile {
  intendedField: string;
  degreeLevel: DegreeLevel;
  gpa: number;
  ielts?: number;
  sat?: number;
  maxTuition?: number;
  preferredCountries?: string[];
  scholarshipRequired?: boolean;
  language?: string;
}

export interface AdvisorStudentProfile {
  intendedField?: string;
  degreeLevel?: DegreeLevel;
  gpa?: number;
  ielts?: number;
  sat?: number;
  maxTuition?: number;
  preferredCountries?: string[];
  scholarshipRequired?: boolean;
}

export interface ProgramWithAdmissions {
  university: University;
  program: Program;
  requirement: AdmissionRequirement;
}

export interface Recommendation {
  university: University;
  program: Program;
  requirement: AdmissionRequirement;
  matchScore: number;
  fitReasons: string[];
  risks: string[];
  missingRequirements: string[];
  nextSteps: string[];
}

export interface ProgramFilters {
  country?: string;
  field?: string;
  degreeLevel?: DegreeLevel;
  maxTuition?: number;
  minIelts?: number;
  scholarshipOnly?: boolean;
}

export interface DataRepositoryStatus {
  activeDataSource: DataSourceMode;
  supabaseConfigured: boolean;
  supabaseMissingVariables: string[];
  note: string;
}

export type AdvisorToolName =
  | "searchPrograms"
  | "comparePrograms"
  | "getProgramRequirements"
  | "calculateAdmissionChance"
  | "saveStudentPreferences";

export interface ComparedProgram {
  programId: string;
  universityName: string;
  programName: string;
  country: string;
  city: string;
  tuitionUsdPerYear: number;
  applicationDeadline: string;
  minIelts: number;
  minGpa: number;
  minSat?: number;
  scholarshipAvailable: boolean;
  fitScore?: number;
  fitSummary: string;
  risks: string[];
}

export interface SavedStudentPreferences {
  intendedField?: string;
  degreeLevel?: DegreeLevel;
  gpa?: number;
  ielts?: number;
  sat?: number;
  maxTuition?: number;
  preferredCountries?: string[];
  scholarshipRequired?: boolean;
  shortlistedProgramIds: string[];
  note: string;
}

export interface AdvisorRequest {
  message: string;
  studentProfile?: AdvisorStudentProfile;
  shortlistedProgramIds?: string[];
}

export interface AdvisorResponsePayload {
  answer: string;
  toolsUsed: AdvisorToolName[];
  recommendations?: Recommendation[];
  comparedPrograms?: ComparedProgram[];
  suggestedQuestions?: string[];
  savedPreferences?: SavedStudentPreferences;
  aiAvailable?: boolean;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

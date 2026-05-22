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

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

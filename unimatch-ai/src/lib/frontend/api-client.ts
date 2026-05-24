import type {
  AdmissionRoadmapPayload,
  AdvisorRequest,
  AdvisorResponsePayload,
  AdvisorStatusPayload,
  ApiResponse,
  CompareSummaryPayload,
  ProgramInsightPayload,
  ProgramFilters,
  ProgramWithAdmissions,
  ProfileParserPayload,
  Recommendation,
  SmartSearchPayload,
  StudentProfile,
} from "@/lib/domain";

export interface HealthStatus {
  service: string;
  status: "ok" | string;
  dataSource: "seed" | "supabase";
  supabaseConfigured: boolean;
  supabaseMissingVariables: string[];
  aiAvailable: boolean;
  note: string;
  timestamp: string;
}

export interface ProgramsPayload {
  dataSource: "seed" | "supabase";
  filters: ProgramFilters;
  count: number;
  programs: ProgramWithAdmissions[];
}

export interface RecommendationsPayload {
  dataSource: "seed" | "supabase";
  profile: StudentProfile;
  count: number;
  recommendations: Recommendation[];
}

export async function fetchHealthStatus(
  signal?: AbortSignal,
): Promise<HealthStatus> {
  return readApi<HealthStatus>("/api/health", { signal });
}

export async function fetchPrograms(
  filters: ProgramFilters,
  signal?: AbortSignal,
): Promise<ProgramsPayload> {
  const query = toProgramQuery(filters);
  const url = query ? `/api/programs?${query}` : "/api/programs";

  return readApi<ProgramsPayload>(url, { signal });
}

export async function fetchRecommendations(
  profile: StudentProfile,
): Promise<RecommendationsPayload> {
  return readApi<RecommendationsPayload>("/api/recommendations", {
    body: JSON.stringify(profile),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function fetchAdvisorResponse(
  request: AdvisorRequest,
): Promise<AdvisorResponsePayload> {
  return readApi<AdvisorResponsePayload>("/api/advisor", {
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function fetchProfileParser(
  text: string,
): Promise<ProfileParserPayload> {
  return readApi<ProfileParserPayload>("/api/ai/profile-parser", {
    body: JSON.stringify({ text }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function fetchSmartSearch(
  query: string,
): Promise<SmartSearchPayload> {
  return readApi<SmartSearchPayload>("/api/ai/smart-search", {
    body: JSON.stringify({ query }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function fetchProgramInsight({
  programId,
  studentProfile,
}: {
  programId: string;
  studentProfile?: StudentProfile;
}): Promise<ProgramInsightPayload> {
  return readApi<ProgramInsightPayload>("/api/ai/program-insight", {
    body: JSON.stringify({ programId, studentProfile }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function fetchCompareSummary({
  programIds,
  studentProfile,
}: {
  programIds: string[];
  studentProfile?: StudentProfile;
}): Promise<CompareSummaryPayload> {
  return readApi<CompareSummaryPayload>("/api/ai/compare-summary", {
    body: JSON.stringify({ programIds, studentProfile }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function fetchAdmissionRoadmap({
  studentProfile,
  topProgramIds,
}: {
  studentProfile: StudentProfile;
  topProgramIds?: string[];
}): Promise<AdmissionRoadmapPayload> {
  return readApi<AdmissionRoadmapPayload>("/api/ai/admission-roadmap", {
    body: JSON.stringify({ studentProfile, topProgramIds }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function fetchAdvisorStatus(): Promise<AdvisorStatusPayload> {
  return readApi<AdvisorStatusPayload>("/api/advisor/status");
}

async function readApi<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.ok || payload.data === undefined) {
    throw new Error(payload.error ?? `Request failed with ${response.status}.`);
  }

  return payload.data;
}

function toProgramQuery(filters: ProgramFilters): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === false) {
      return;
    }

    params.set(key, String(value));
  });

  return params.toString();
}

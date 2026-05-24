import type {
  AdvisorRequest,
  AdvisorResponsePayload,
  ApiResponse,
  ProgramFilters,
  ProgramWithAdmissions,
  Recommendation,
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

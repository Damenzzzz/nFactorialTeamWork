import { jsonError, jsonOk } from "@/lib/api/responses";
import { createCompareSummary } from "@/lib/ai/native-features";
import { normalizeAdvisorProfile } from "@/lib/ai/request-normalizers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);

  if (!body.ok) {
    return jsonError(body.error, 400);
  }

  const programIds = stringArray(body.data.programIds);

  if (programIds.length < 2) {
    return jsonError("Add at least two programs to compare.", 400);
  }

  const data = await createCompareSummary({
    programIds,
    studentProfile: normalizeAdvisorProfile(body.data.studentProfile),
  });

  return jsonOk(data);
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

async function readJson(
  request: Request,
): Promise<{ data: Record<string, unknown>; ok: true } | { error: string; ok: false }> {
  try {
    const parsed = (await request.json()) as unknown;
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return { data: parsed as Record<string, unknown>, ok: true };
    }
  } catch {
    return { error: "Request body must be valid JSON.", ok: false };
  }

  return { error: "Request body must be a JSON object.", ok: false };
}

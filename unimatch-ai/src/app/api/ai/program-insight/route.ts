import { jsonError, jsonOk } from "@/lib/api/responses";
import { createProgramInsight } from "@/lib/ai/native-features";
import { normalizeAdvisorProfile } from "@/lib/ai/request-normalizers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);

  if (!body.ok) {
    return jsonError(body.error, 400);
  }

  const programId = body.data.programId;

  if (typeof programId !== "string" || !programId.trim()) {
    return jsonError("Choose a program to explain.", 400);
  }

  const data = await createProgramInsight({
    programId: programId.trim(),
    studentProfile: normalizeAdvisorProfile(body.data.studentProfile),
  });

  return jsonOk(data);
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

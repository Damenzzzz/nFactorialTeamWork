import { jsonError, jsonOk } from "@/lib/api/responses";
import { createAdmissionRoadmap } from "@/lib/ai/native-features";
import { validateStudentProfile } from "@/lib/validation/student-profile";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);

  if (!body.ok) {
    return jsonError(body.error, 400);
  }

  const profile = validateStudentProfile(body.data.studentProfile);

  if (!profile.ok) {
    return jsonError(profile.error, 400);
  }

  const data = await createAdmissionRoadmap({
    studentProfile: profile.data,
    topProgramIds: stringArray(body.data.topProgramIds),
  });

  return jsonOk(data);
}

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const values = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);

  return values.length ? values : undefined;
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

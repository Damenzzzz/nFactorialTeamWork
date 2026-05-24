import { jsonError, jsonOk } from "@/lib/api/responses";
import { createSmartSearch } from "@/lib/ai/native-features";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);

  if (!body.ok) {
    return jsonError(body.error, 400);
  }

  const query = body.data.query;

  if (typeof query !== "string" || !query.trim()) {
    return jsonError("Describe what you are looking for first.", 400);
  }

  if (query.length > 800) {
    return jsonError("Search description must be 800 characters or fewer.", 400);
  }

  const data = await createSmartSearch(query.trim());

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

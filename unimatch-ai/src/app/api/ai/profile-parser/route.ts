import { jsonError, jsonOk } from "@/lib/api/responses";
import { parseProfileText } from "@/lib/ai/native-features";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);

  if (!body.ok) {
    return jsonError(body.error, 400);
  }

  const text = body.data.text;

  if (typeof text !== "string" || !text.trim()) {
    return jsonError("Add a study goal before using AI profile fill.", 400);
  }

  if (text.length > 1200) {
    return jsonError("Study goal must be 1200 characters or fewer.", 400);
  }

  const data = await parseProfileText(text.trim());

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

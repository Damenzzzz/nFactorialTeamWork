import { jsonOk } from "@/lib/api/responses";
import { getAdmissionsRepository } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export function GET() {
  const repository = getAdmissionsRepository();
  const status = repository.getStatus();

  return jsonOk({
    service: "unimatch-ai",
    status: "ok",
    dataSource: status.activeDataSource,
    supabaseConfigured: status.supabaseConfigured,
    supabaseMissingVariables: status.supabaseMissingVariables,
    aiAvailable: Boolean(process.env.OPENAI_API_KEY),
    note: status.note,
    timestamp: new Date().toISOString(),
  });
}

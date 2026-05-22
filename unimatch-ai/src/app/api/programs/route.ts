import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/responses";
import { getAdmissionsRepository } from "@/lib/data/repository";
import { parseProgramFilters } from "@/lib/validation/student-profile";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const filters = parseProgramFilters(request.nextUrl.searchParams);

  if (!filters.ok) {
    return jsonError(filters.error, 400);
  }

  const repository = getAdmissionsRepository();
  const programs = await repository.listPrograms(filters.data);
  const status = repository.getStatus();

  return jsonOk({
    dataSource: status.activeDataSource,
    filters: filters.data,
    count: programs.length,
    programs,
  });
}

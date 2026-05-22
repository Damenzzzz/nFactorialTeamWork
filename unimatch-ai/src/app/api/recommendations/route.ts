import { jsonError, jsonOk } from "@/lib/api/responses";
import { getAdmissionsRepository } from "@/lib/data/repository";
import { rankPrograms } from "@/lib/data/recommendations";
import { validateStudentProfile } from "@/lib/validation/student-profile";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON.", 400);
  }

  const profile = validateStudentProfile(body);

  if (!profile.ok) {
    return jsonError(profile.error, 400);
  }

  const repository = getAdmissionsRepository();
  const programs = await repository.listPrograms({
    degreeLevel: profile.data.degreeLevel,
  });
  const recommendations = rankPrograms(profile.data, programs);
  const status = repository.getStatus();

  return jsonOk({
    dataSource: status.activeDataSource,
    profile: profile.data,
    count: recommendations.length,
    recommendations,
  });
}

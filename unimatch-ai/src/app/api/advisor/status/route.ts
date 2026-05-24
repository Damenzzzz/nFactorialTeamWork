import { jsonOk } from "@/lib/api/responses";
import { getAdvisorStatus } from "@/lib/ai/native-features";

export const dynamic = "force-dynamic";

export function GET() {
  return jsonOk(getAdvisorStatus());
}

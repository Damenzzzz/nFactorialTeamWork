import { parseDegreeLevel } from "@/lib/ai/tools";
import type { AdvisorStudentProfile } from "@/lib/domain";

export function normalizeAdvisorProfile(
  value: unknown,
): AdvisorStudentProfile | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return {
    degreeLevel:
      typeof value.degreeLevel === "string"
        ? parseDegreeLevel(value.degreeLevel)
        : undefined,
    gpa: optionalNumber(value.gpa),
    ielts: optionalNumber(value.ielts),
    intendedField: optionalString(value.intendedField),
    maxTuition: optionalNumber(value.maxTuition),
    preferredCountries: optionalStringArray(value.preferredCountries),
    sat: optionalNumber(value.sat),
    scholarshipRequired: optionalBoolean(value.scholarshipRequired),
  };
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function optionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return normalized.length ? normalized : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

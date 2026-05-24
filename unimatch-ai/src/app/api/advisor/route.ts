import { jsonError, jsonOk } from "@/lib/api/responses";
import { getAdvisorResponse } from "@/lib/ai/advisor-service";
import { parseDegreeLevel } from "@/lib/ai/tools";
import type { AdvisorRequest, AdvisorStudentProfile } from "@/lib/domain";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON.", 400);
  }

  const advisorRequest = validateAdvisorRequest(body);

  if (!advisorRequest.ok) {
    return jsonError(advisorRequest.error, 400);
  }

  const response = await getAdvisorResponse(advisorRequest.data);

  return jsonOk(response);
}

type ValidationResult<T> =
  | { data: T; ok: true }
  | { error: string; ok: false };

function validateAdvisorRequest(value: unknown): ValidationResult<AdvisorRequest> {
  if (!isRecord(value)) {
    return { error: "Request body must be a JSON object.", ok: false };
  }

  if (typeof value.message !== "string" || !value.message.trim()) {
    return { error: "message is required.", ok: false };
  }

  if (value.message.length > 2000) {
    return { error: "message must be 2000 characters or fewer.", ok: false };
  }

  const profile = validateAdvisorProfile(value.studentProfile);

  if (!profile.ok) {
    return profile;
  }

  const shortlistedProgramIds = validateStringArray(
    value.shortlistedProgramIds,
    "shortlistedProgramIds",
  );

  if (!shortlistedProgramIds.ok) {
    return shortlistedProgramIds;
  }

  return {
    data: {
      message: value.message.trim(),
      shortlistedProgramIds: shortlistedProgramIds.data,
      studentProfile: profile.data,
    },
    ok: true,
  };
}

function validateAdvisorProfile(
  value: unknown,
): ValidationResult<AdvisorStudentProfile | undefined> {
  if (value === undefined || value === null) {
    return { data: undefined, ok: true };
  }

  if (!isRecord(value)) {
    return { error: "studentProfile must be a JSON object.", ok: false };
  }

  const degreeLevel =
    typeof value.degreeLevel === "string"
      ? parseDegreeLevel(value.degreeLevel)
      : undefined;

  if (value.degreeLevel !== undefined && !degreeLevel) {
    return {
      error: "studentProfile.degreeLevel must be Bachelor, Master, or PhD.",
      ok: false,
    };
  }

  const intendedField = optionalText(value.intendedField, "intendedField");

  if (!intendedField.ok) {
    return intendedField;
  }

  const gpa = optionalNumber(value.gpa, "gpa", 0, 4);

  if (!gpa.ok) {
    return gpa;
  }

  const ielts = optionalNumber(value.ielts, "ielts", 0, 9);

  if (!ielts.ok) {
    return ielts;
  }

  const sat = optionalNumber(value.sat, "sat", 400, 1600);

  if (!sat.ok) {
    return sat;
  }

  const maxTuition = optionalNumber(value.maxTuition, "maxTuition", 0, 200000);

  if (!maxTuition.ok) {
    return maxTuition;
  }

  const preferredCountries = validateStringArray(
    value.preferredCountries,
    "preferredCountries",
  );

  if (!preferredCountries.ok) {
    return preferredCountries;
  }

  const scholarshipRequired = optionalBoolean(
    value.scholarshipRequired,
    "scholarshipRequired",
  );

  if (!scholarshipRequired.ok) {
    return scholarshipRequired;
  }

  return {
    data: {
      degreeLevel,
      gpa: gpa.data,
      ielts: ielts.data,
      intendedField: intendedField.data,
      maxTuition: maxTuition.data,
      preferredCountries: preferredCountries.data,
      sat: sat.data,
      scholarshipRequired: scholarshipRequired.data,
    },
    ok: true,
  };
}

function optionalText(
  value: unknown,
  fieldName: string,
): ValidationResult<string | undefined> {
  if (value === undefined || value === null || value === "") {
    return { data: undefined, ok: true };
  }

  if (typeof value !== "string") {
    return { error: `studentProfile.${fieldName} must be a string.`, ok: false };
  }

  return { data: value.trim() || undefined, ok: true };
}

function optionalNumber(
  value: unknown,
  fieldName: string,
  min: number,
  max: number,
): ValidationResult<number | undefined> {
  if (value === undefined || value === null || value === "") {
    return { data: undefined, ok: true };
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return { error: `studentProfile.${fieldName} must be a number.`, ok: false };
  }

  if (value < min || value > max) {
    return {
      error: `studentProfile.${fieldName} must be between ${min} and ${max}.`,
      ok: false,
    };
  }

  return { data: value, ok: true };
}

function optionalBoolean(
  value: unknown,
  fieldName: string,
): ValidationResult<boolean | undefined> {
  if (value === undefined || value === null || value === "") {
    return { data: undefined, ok: true };
  }

  if (typeof value !== "boolean") {
    return { error: `studentProfile.${fieldName} must be a boolean.`, ok: false };
  }

  return { data: value, ok: true };
}

function validateStringArray(
  value: unknown,
  fieldName: string,
): ValidationResult<string[] | undefined> {
  if (value === undefined || value === null) {
    return { data: undefined, ok: true };
  }

  if (!Array.isArray(value)) {
    return { error: `${fieldName} must be an array of strings.`, ok: false };
  }

  if (value.length > 8) {
    return { error: `${fieldName} can contain at most 8 items.`, ok: false };
  }

  const normalized = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  if (normalized.length !== value.length) {
    return { error: `${fieldName} must contain only strings.`, ok: false };
  }

  return { data: normalized.length ? normalized : undefined, ok: true };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

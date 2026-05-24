import type { DegreeLevel, ProgramFilters, StudentProfile } from "@/lib/domain";

const degreeLevels: DegreeLevel[] = ["Bachelor", "Master", "PhD"];

export interface ValidationSuccess<T> {
  ok: true;
  data: T;
}

export interface ValidationFailure {
  ok: false;
  error: string;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export function parseProgramFilters(
  searchParams: URLSearchParams,
): ValidationResult<ProgramFilters> {
  const country = optionalText(searchParams.get("country"));
  const countries = optionalText(searchParams.get("countries"))
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const field = optionalText(searchParams.get("field"));
  const degreeLevelRaw = optionalText(searchParams.get("degreeLevel"));
  const maxTuitionRaw = optionalText(searchParams.get("maxTuition"));
  const minIeltsRaw = optionalText(searchParams.get("minIelts"));
  const scholarshipOnlyRaw = optionalText(searchParams.get("scholarshipOnly"));

  const degreeLevel = degreeLevelRaw
    ? parseDegreeLevel(degreeLevelRaw)
    : undefined;

  if (degreeLevelRaw && !degreeLevel) {
    return {
      ok: false,
      error: "degreeLevel must be one of: Bachelor, Master, PhD.",
    };
  }

  const maxTuition = maxTuitionRaw
    ? parseBoundedNumber(maxTuitionRaw, "maxTuition", 0, 200000)
    : undefined;

  if (maxTuition && !maxTuition.ok) {
    return maxTuition;
  }

  const minIelts = minIeltsRaw
    ? parseBoundedNumber(minIeltsRaw, "minIelts", 0, 9)
    : undefined;

  if (minIelts && !minIelts.ok) {
    return minIelts;
  }

  const scholarshipOnly = scholarshipOnlyRaw
    ? parseBoolean(scholarshipOnlyRaw, "scholarshipOnly")
    : undefined;

  if (scholarshipOnly && !scholarshipOnly.ok) {
    return scholarshipOnly;
  }

  return {
    ok: true,
    data: {
      country,
      countries: countries?.length ? countries : undefined,
      field,
      degreeLevel,
      maxTuition: maxTuition?.data,
      minIelts: minIelts?.data,
      scholarshipOnly: scholarshipOnly?.data,
    },
  };
}

export function validateStudentProfile(
  value: unknown,
): ValidationResult<StudentProfile> {
  if (!isRecord(value)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const intendedField = requiredText(value.intendedField, "intendedField");

  if (!intendedField.ok) {
    return intendedField;
  }

  const degreeLevel = requiredDegreeLevel(value.degreeLevel);

  if (!degreeLevel.ok) {
    return degreeLevel;
  }

  const gpa = requiredNumber(value.gpa, "gpa", 0, 4);

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

  const preferredCountries = optionalStringArray(
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

  const language = optionalUnknownText(value.language, "language");

  if (!language.ok) {
    return language;
  }

  return {
    ok: true,
    data: {
      intendedField: intendedField.data,
      degreeLevel: degreeLevel.data,
      gpa: gpa.data,
      ielts: ielts.data,
      sat: sat.data,
      maxTuition: maxTuition.data,
      preferredCountries: preferredCountries.data,
      scholarshipRequired: scholarshipRequired.data,
      language: language.data,
    },
  };
}

function parseDegreeLevel(value: string): DegreeLevel | undefined {
  return degreeLevels.find(
    (degreeLevel) => degreeLevel.toLowerCase() === value.trim().toLowerCase(),
  );
}

function requiredDegreeLevel(value: unknown): ValidationResult<DegreeLevel> {
  if (typeof value !== "string") {
    return {
      ok: false,
      error: "degreeLevel is required and must be Bachelor, Master, or PhD.",
    };
  }

  const degreeLevel = parseDegreeLevel(value);

  if (!degreeLevel) {
    return {
      ok: false,
      error: "degreeLevel must be one of: Bachelor, Master, PhD.",
    };
  }

  return { ok: true, data: degreeLevel };
}

function requiredText(
  value: unknown,
  fieldName: string,
): ValidationResult<string> {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { ok: false, error: `${fieldName} is required.` };
  }

  return { ok: true, data: value.trim() };
}

function optionalUnknownText(
  value: unknown,
  fieldName: string,
): ValidationResult<string | undefined> {
  if (value === undefined || value === null || value === "") {
    return { ok: true, data: undefined };
  }

  if (typeof value !== "string") {
    return { ok: false, error: `${fieldName} must be a string.` };
  }

  return { ok: true, data: value.trim() || undefined };
}

function optionalText(value: string | null): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function requiredNumber(
  value: unknown,
  fieldName: string,
  min: number,
  max: number,
): ValidationResult<number> {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return { ok: false, error: `${fieldName} is required and must be a number.` };
  }

  if (value < min || value > max) {
    return {
      ok: false,
      error: `${fieldName} must be between ${min} and ${max}.`,
    };
  }

  return { ok: true, data: value };
}

function optionalNumber(
  value: unknown,
  fieldName: string,
  min: number,
  max: number,
): ValidationResult<number | undefined> {
  if (value === undefined || value === null || value === "") {
    return { ok: true, data: undefined };
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return { ok: false, error: `${fieldName} must be a number.` };
  }

  if (value < min || value > max) {
    return {
      ok: false,
      error: `${fieldName} must be between ${min} and ${max}.`,
    };
  }

  return { ok: true, data: value };
}

function parseBoundedNumber(
  value: string,
  fieldName: string,
  min: number,
  max: number,
): ValidationResult<number> {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return { ok: false, error: `${fieldName} must be a number.` };
  }

  if (parsed < min || parsed > max) {
    return {
      ok: false,
      error: `${fieldName} must be between ${min} and ${max}.`,
    };
  }

  return { ok: true, data: parsed };
}

function optionalStringArray(
  value: unknown,
  fieldName: string,
): ValidationResult<string[] | undefined> {
  if (value === undefined || value === null) {
    return { ok: true, data: undefined };
  }

  if (!Array.isArray(value)) {
    return { ok: false, error: `${fieldName} must be an array of strings.` };
  }

  const normalized = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  if (normalized.length !== value.length) {
    return { ok: false, error: `${fieldName} must contain only strings.` };
  }

  return { ok: true, data: normalized.length ? normalized : undefined };
}

function optionalBoolean(
  value: unknown,
  fieldName: string,
): ValidationResult<boolean | undefined> {
  if (value === undefined || value === null || value === "") {
    return { ok: true, data: undefined };
  }

  if (typeof value !== "boolean") {
    return { ok: false, error: `${fieldName} must be a boolean.` };
  }

  return { ok: true, data: value };
}

function parseBoolean(
  value: string,
  fieldName: string,
): ValidationResult<boolean> {
  const normalized = value.trim().toLowerCase();

  if (["true", "1", "yes"].includes(normalized)) {
    return { ok: true, data: true };
  }

  if (["false", "0", "no"].includes(normalized)) {
    return { ok: true, data: false };
  }

  return {
    ok: false,
    error: `${fieldName} must be true or false.`,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

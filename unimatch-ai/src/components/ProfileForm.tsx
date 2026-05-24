"use client";

import { useMemo, useState } from "react";
import { ArrowRight, AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/Badge";
import { fetchProfileParser } from "@/lib/frontend/api-client";
import type { DegreeLevel, StudentProfile } from "@/lib/domain";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  countries: string[];
  fields: string[];
  loading?: boolean;
  apiError?: string;
  onSubmit: (profile: StudentProfile) => void;
}

interface FormValues {
  intendedField: string;
  degreeLevel: DegreeLevel;
  gpa: string;
  ielts: string;
  sat: string;
  maxTuition: string;
  preferredCountries: string[];
  scholarshipRequired: boolean;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const defaultValues: FormValues = {
  degreeLevel: "Bachelor",
  gpa: "3.4",
  ielts: "6.5",
  intendedField: "Computer Science",
  maxTuition: "35000",
  preferredCountries: ["Canada", "Germany"],
  sat: "",
  scholarshipRequired: true,
};

const degreeLevels: DegreeLevel[] = ["Bachelor", "Master", "PhD"];

export function ProfileForm({
  apiError,
  countries,
  fields,
  loading = false,
  onSubmit,
}: ProfileFormProps) {
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [studyGoal, setStudyGoal] = useState(
    "I want Computer Science in Germany or Finland under $10000, IELTS 6.5, GPA 3.4, scholarship preferred.",
  );
  const [parserLoading, setParserLoading] = useState(false);
  const [parserError, setParserError] = useState<string>();
  const [parserNotes, setParserNotes] = useState<string[]>([]);

  const countryOptions = useMemo(() => {
    const merged = new Set([...defaultValues.preferredCountries, ...countries]);
    return Array.from(merged);
  }, [countries]);

  const fieldOptions = useMemo(() => {
    const merged = new Set([defaultValues.intendedField, ...fields]);
    return Array.from(merged);
  }, [fields]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit(toProfile(values));
  }

  function updateValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function toggleCountry(country: string) {
    const active = values.preferredCountries.includes(country);
    updateValue(
      "preferredCountries",
      active
        ? values.preferredCountries.filter((item) => item !== country)
        : [...values.preferredCountries, country],
    );
  }

  async function handleProfileParser() {
    if (!studyGoal.trim()) {
      setParserError("Paste a short study goal first.");
      return;
    }

    setParserLoading(true);
    setParserError(undefined);
    setParserNotes([]);

    try {
      const parsed = await fetchProfileParser(studyGoal.trim());
      setValues((current) => mergeParsedProfile(current, parsed.studentProfile));
      setParserNotes(parsed.notes);
      setErrors({});
    } catch {
      setParserError(
        "We could not fill the profile from that text. Try a shorter goal with field, country, budget, GPA, and IELTS.",
      );
    } finally {
      setParserLoading(false);
    }
  }

  return (
    <form
      className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6"
      id="recommendation-form"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone="emerald">Student profile</Badge>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            Admission fit profile
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Tell UniMatch AI what you want to study, where you want to go, and
            which requirements you already meet.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">
          <CheckCircle2 aria-hidden="true" className="size-4" />
          Ready to rank
        </div>
      </div>

      {apiError ? (
        <div
          className="mt-5 flex gap-3 rounded-lg border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-100"
          role="alert"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{apiError}</span>
        </div>
      ) : null}

      <section className="mt-6 rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Sparkles aria-hidden="true" className="size-4 text-cyan-100" />
              <h4 className="text-base font-semibold text-white">
                Paste your study goal
              </h4>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Write your goal in one sentence and UniMatch AI can pre-fill the
              profile fields for you.
            </p>
          </div>
          <button
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-cyan-200 px-4 text-sm font-semibold text-slate-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading || parserLoading}
            onClick={handleProfileParser}
            type="button"
          >
            {parserLoading ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Sparkles aria-hidden="true" className="size-4" />
            )}
            Fill profile with AI
          </button>
        </div>

        <textarea
          aria-label="Paste your study goal"
          className="mt-4 min-h-24 w-full resize-none rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading || parserLoading}
          onChange={(event) => {
            setStudyGoal(event.target.value);
            setParserError(undefined);
          }}
          placeholder="I want Computer Science in Germany or Finland under $10000, IELTS 6.5, GPA 3.4, scholarship preferred."
          value={studyGoal}
        />

        {parserError ? (
          <p className="mt-3 text-sm leading-6 text-rose-100">{parserError}</p>
        ) : parserNotes.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {parserNotes.map((note) => (
              <span
                className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs leading-5 text-slate-300"
                key={note}
              >
                {note}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <FieldShell
          error={errors.intendedField}
          hint="Examples: Computer Science, Data Science, Business, Engineering."
          label="Intended field"
        >
          <input
            aria-label="Intended field"
            className={inputClass(Boolean(errors.intendedField))}
            disabled={loading}
            list="unimatch-fields"
            onChange={(event) => updateValue("intendedField", event.target.value)}
            value={values.intendedField}
          />
          <datalist id="unimatch-fields">
            {fieldOptions.map((field) => (
              <option key={field} value={field} />
            ))}
          </datalist>
        </FieldShell>

        <FieldShell label="Degree level">
          <div
            aria-label="Degree level"
            className="grid min-h-12 grid-cols-3 overflow-hidden rounded-lg border border-white/10 bg-black/25 p-1"
            role="group"
          >
            {degreeLevels.map((level) => (
              <button
                className={cn(
                  "min-h-10 min-w-0 rounded-md px-2 text-center text-sm font-semibold leading-none whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950",
                  values.degreeLevel === level
                    ? "bg-cyan-200 text-slate-950 shadow-lg shadow-cyan-950/20"
                    : "text-slate-300 hover:bg-white/[0.075] hover:text-white",
                )}
                disabled={loading}
                key={level}
                onClick={() => updateValue("degreeLevel", level)}
                type="button"
              >
                {level}
              </button>
            ))}
          </div>
        </FieldShell>

        <FieldShell
          error={errors.gpa}
          hint="4.0 scale."
          label="GPA"
        >
          <input
            aria-label="GPA"
            className={inputClass(Boolean(errors.gpa))}
            disabled={loading}
            inputMode="decimal"
            max="4"
            min="0"
            onChange={(event) => updateValue("gpa", event.target.value)}
            step="0.01"
            type="number"
            value={values.gpa}
          />
        </FieldShell>

        <FieldShell
          error={errors.ielts}
          hint="Leave blank if evidence is not ready yet."
          label="IELTS"
        >
          <input
            aria-label="IELTS"
            className={inputClass(Boolean(errors.ielts))}
            disabled={loading}
            inputMode="decimal"
            max="9"
            min="0"
            onChange={(event) => updateValue("ielts", event.target.value)}
            step="0.5"
            type="number"
            value={values.ielts}
          />
        </FieldShell>

        <FieldShell
          error={errors.sat}
          hint="Optional for programs that accept SAT or equivalents."
          label="SAT"
        >
          <input
            aria-label="SAT"
            className={inputClass(Boolean(errors.sat))}
            disabled={loading}
            inputMode="numeric"
            max="1600"
            min="400"
            onChange={(event) => updateValue("sat", event.target.value)}
            step="10"
            type="number"
            value={values.sat}
          />
        </FieldShell>

        <FieldShell
          error={errors.maxTuition}
          hint="Annual tuition ceiling in USD."
          label="Max annual tuition budget"
        >
          <input
            aria-label="Max annual tuition budget"
            className={inputClass(Boolean(errors.maxTuition))}
            disabled={loading}
            inputMode="numeric"
            min="0"
            onChange={(event) => updateValue("maxTuition", event.target.value)}
            step="500"
            type="number"
            value={values.maxTuition}
          />
        </FieldShell>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <FieldShell
          error={errors.preferredCountries}
          hint="No selection keeps the catalog global."
          label="Preferred countries"
        >
          <div
            aria-label="Preferred countries"
            className="flex flex-wrap gap-2"
            role="group"
          >
            {countryOptions.map((country) => {
              const active = values.preferredCountries.includes(country);

              return (
                <button
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950",
                    active
                      ? "border-emerald-200 bg-emerald-200 text-slate-950"
                      : "border-white/10 bg-white/[0.055] text-slate-200 hover:bg-white/[0.09]",
                  )}
                  disabled={loading}
                  key={country}
                  onClick={() => toggleCountry(country)}
                  type="button"
                >
                  {country}
                </button>
              );
            })}
          </div>
        </FieldShell>

        <FieldShell label="Scholarship preference">
          <div
            aria-label="Scholarship preference"
            className="grid grid-cols-2 gap-2"
            role="group"
          >
            <button
              className={scholarshipClass(values.scholarshipRequired)}
              disabled={loading}
              onClick={() => updateValue("scholarshipRequired", true)}
              type="button"
            >
              Required
            </button>
            <button
              className={scholarshipClass(!values.scholarshipRequired)}
              disabled={loading}
              onClick={() => updateValue("scholarshipRequired", false)}
              type="button"
            >
              Flexible
            </button>
          </div>
        </FieldShell>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          Results are planning guidance. Always verify details with each university.
        </p>
        <button
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <ArrowRight aria-hidden="true" className="size-4" />
          )}
          Calculate fit
        </button>
      </div>
    </form>
  );
}

function FieldShell({
  children,
  error,
  hint,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  label: string;
}) {
  return (
    <div className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error ? (
        <span className="mt-2 block text-sm text-rose-200">{error}</span>
      ) : hint ? (
        <span className="mt-2 block text-xs leading-5 text-slate-500">{hint}</span>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return cn(
    "h-11 w-full rounded-lg border bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
    hasError
      ? "border-rose-300/50"
      : "border-white/10 hover:border-white/20 focus:border-cyan-200",
  );
}

function scholarshipClass(active: boolean): string {
  return cn(
    "h-11 rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950",
    active
      ? "border-amber-200 bg-amber-200 text-slate-950"
      : "border-white/10 bg-white/[0.055] text-slate-200 hover:bg-white/[0.09]",
  );
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.intendedField.trim()) {
    errors.intendedField = "Choose an intended field.";
  }

  validateNumber(values.gpa, "gpa", 0, 4, "GPA must be between 0 and 4.", errors);
  validateOptionalNumber(
    values.ielts,
    "ielts",
    0,
    9,
    "IELTS must be between 0 and 9.",
    errors,
  );
  validateOptionalNumber(
    values.sat,
    "sat",
    400,
    1600,
    "SAT must be between 400 and 1600.",
    errors,
  );
  validateOptionalNumber(
    values.maxTuition,
    "maxTuition",
    0,
    200000,
    "Budget must be between 0 and 200000.",
    errors,
  );

  return errors;
}

function validateNumber(
  value: string,
  field: keyof FormValues,
  min: number,
  max: number,
  message: string,
  errors: FormErrors,
) {
  const parsed = Number(value);

  if (!value || !Number.isFinite(parsed) || parsed < min || parsed > max) {
    errors[field] = message;
  }
}

function validateOptionalNumber(
  value: string,
  field: keyof FormValues,
  min: number,
  max: number,
  message: string,
  errors: FormErrors,
) {
  if (!value) {
    return;
  }

  validateNumber(value, field, min, max, message, errors);
}

function toProfile(values: FormValues): StudentProfile {
  return {
    degreeLevel: values.degreeLevel,
    gpa: Number(values.gpa),
    ielts: optionalNumber(values.ielts),
    intendedField: values.intendedField.trim(),
    maxTuition: optionalNumber(values.maxTuition),
    preferredCountries: values.preferredCountries.length
      ? values.preferredCountries
      : undefined,
    sat: optionalNumber(values.sat),
    scholarshipRequired: values.scholarshipRequired,
  };
}

function mergeParsedProfile(
  current: FormValues,
  parsed: Partial<StudentProfile>,
): FormValues {
  return {
    degreeLevel: parsed.degreeLevel ?? current.degreeLevel,
    gpa:
      typeof parsed.gpa === "number"
        ? String(parsed.gpa)
        : current.gpa,
    ielts:
      typeof parsed.ielts === "number"
        ? String(parsed.ielts)
        : current.ielts,
    intendedField: parsed.intendedField ?? current.intendedField,
    maxTuition:
      typeof parsed.maxTuition === "number"
        ? String(parsed.maxTuition)
        : current.maxTuition,
    preferredCountries: parsed.preferredCountries?.length
      ? parsed.preferredCountries
      : current.preferredCountries,
    sat:
      typeof parsed.sat === "number"
        ? String(parsed.sat)
        : current.sat,
    scholarshipRequired:
      typeof parsed.scholarshipRequired === "boolean"
        ? parsed.scholarshipRequired
        : current.scholarshipRequired,
  };
}

function optionalNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  return Number(value);
}

"use client";

import { Filter, RotateCcw, Search } from "lucide-react";
import type { DegreeLevel, ProgramFilters as ProgramFiltersType } from "@/lib/domain";
import { cn } from "@/lib/utils";

interface ProgramFiltersProps {
  countries: string[];
  fields: string[];
  filters: ProgramFiltersType;
  loading?: boolean;
  resultCount: number;
  onChange: (filters: ProgramFiltersType) => void;
}

const degreeLevels: DegreeLevel[] = ["Bachelor", "Master", "PhD"];

export function ProgramFilters({
  countries,
  fields,
  filters,
  loading = false,
  onChange,
  resultCount,
}: ProgramFiltersProps) {
  function update(next: Partial<ProgramFiltersType>) {
    onChange({ ...filters, ...next });
  }

  function reset() {
    onChange({});
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-100 ring-1 ring-cyan-300/20">
            <Filter aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h3 className="text-xl font-semibold text-white">Find programs faster</h3>
            <p className="mt-1 text-sm text-slate-400">
              {loading ? "Searching programs" : `${resultCount} matching programs`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
            disabled={loading}
            onClick={reset}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <FilterField label="Country">
          <select
            aria-label="Filter by country"
            className={controlClass}
            disabled={loading}
            onChange={(event) =>
              update({
                countries: undefined,
                country: valueOrUndefined(event.target.value),
              })
            }
            value={filters.country ?? ""}
          >
            <option value="">All countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Field">
          <select
            aria-label="Filter by field"
            className={controlClass}
            disabled={loading}
            onChange={(event) => update({ field: valueOrUndefined(event.target.value) })}
            value={filters.field ?? ""}
          >
            <option value="">All fields</option>
            {fields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Degree level">
          <select
            aria-label="Filter by degree level"
            className={controlClass}
            disabled={loading}
            onChange={(event) =>
              update({ degreeLevel: valueOrUndefined(event.target.value) as DegreeLevel | undefined })
            }
            value={filters.degreeLevel ?? ""}
          >
            <option value="">All levels</option>
            {degreeLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Max tuition">
          <input
            aria-label="Filter by maximum tuition"
            className={controlClass}
            disabled={loading}
            min="0"
            onChange={(event) => update({ maxTuition: numberOrUndefined(event.target.value) })}
            placeholder="Annual USD"
            step="500"
            type="number"
            value={filters.maxTuition ?? ""}
          />
        </FilterField>

        <FilterField label="IELTS score">
          <input
            aria-label="Filter by IELTS score"
            className={controlClass}
            disabled={loading}
            max="9"
            min="0"
            onChange={(event) => update({ minIelts: numberOrUndefined(event.target.value) })}
            placeholder="My score"
            step="0.5"
            type="number"
            value={filters.minIelts ?? ""}
          />
        </FilterField>

        <FilterField label="Scholarships">
          <button
            aria-pressed={Boolean(filters.scholarshipOnly)}
            className={cn(
              "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950",
              filters.scholarshipOnly
                ? "border-emerald-200 bg-emerald-200 text-slate-950"
                : "border-white/10 bg-black/25 text-slate-200 hover:border-white/20 hover:bg-white/[0.08]",
            )}
            disabled={loading}
            onClick={() => update({ scholarshipOnly: !filters.scholarshipOnly })}
            type="button"
          >
            <Search aria-hidden="true" className="size-4" />
            Scholarship only
          </button>
        </FilterField>
      </div>
      {filters.countries?.length ? (
        <p className="mt-4 rounded-lg border border-cyan-300/15 bg-cyan-300/10 px-4 py-3 text-sm leading-6 text-cyan-50">
          Searching across {filters.countries.join(", ")}. Choose a country above
          to narrow the results.
        </p>
      ) : null}
    </div>
  );
}

function FilterField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="block">
      <span className="mb-2 block text-xs font-medium text-slate-400">{label}</span>
      {children}
    </div>
  );
}

const controlClass =
  "h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60";

function valueOrUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function numberOrUndefined(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

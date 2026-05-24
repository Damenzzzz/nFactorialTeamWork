"use client";

import { useState } from "react";
import { Loader2, Search, Sparkles } from "lucide-react";
import { fetchSmartSearch } from "@/lib/frontend/api-client";
import type { ProgramFilters, SmartSearchPayload } from "@/lib/domain";

interface SmartSearchBarProps {
  loading?: boolean;
  onApply: (filters: ProgramFilters, explanation: string) => void;
}

export function SmartSearchBar({
  loading = false,
  onApply,
}: SmartSearchBarProps) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<SmartSearchPayload>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) {
      setError("Describe what you are looking for first.");
      return;
    }

    setSearching(true);
    setError(undefined);

    try {
      const payload = await fetchSmartSearch(query.trim());
      setResult(payload);
      onApply(payload.filters, payload.explanation);
    } catch {
      setError(
        "We could not translate that search yet. Try mentioning field, degree, country, budget, or scholarships.",
      );
    } finally {
      setSearching(false);
    }
  }

  return (
    <form
      className="rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-white/10 bg-black/25 px-4">
          <Sparkles aria-hidden="true" className="size-4 shrink-0 text-cyan-100" />
          <input
            aria-label="Smart program search"
            className="h-12 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            disabled={loading || searching}
            onChange={(event) => {
              setQuery(event.target.value);
              setError(undefined);
            }}
            placeholder="Describe what you are looking for, e.g. affordable AI master's programs in Europe with scholarships"
            value={query}
          />
        </div>
        <button
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading || searching || !query.trim()}
          type="submit"
        >
          {searching ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Search aria-hidden="true" className="size-4" />
          )}
          Smart search
        </button>
      </div>
      {error ? (
        <p className="mt-3 text-sm leading-6 text-rose-100">{error}</p>
      ) : result ? (
        <p className="mt-3 text-sm leading-6 text-cyan-50">
          {result.explanation}
        </p>
      ) : null}
    </form>
  );
}

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Database,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { HealthStatus } from "@/lib/frontend/api-client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/Badge";

interface StatusCardProps {
  health?: HealthStatus;
  error?: string;
  loading?: boolean;
}

export function StatusCard({ error, health, loading }: StatusCardProps) {
  const state = getPlatformState(health, error, loading);
  const stateLabel =
    state === "healthy" ? "Healthy" : state === "degraded" ? "Degraded" : state === "loading" ? "Checking" : "Error";

  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">Platform status</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{stateLabel}</h3>
        </div>
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-lg ring-1",
            state === "healthy" && "bg-emerald-300/10 text-emerald-100 ring-emerald-300/20",
            state === "degraded" && "bg-amber-300/10 text-amber-100 ring-amber-300/20",
            state === "error" && "bg-rose-300/10 text-rose-100 ring-rose-300/20",
            state === "loading" && "bg-cyan-300/10 text-cyan-100 ring-cyan-300/20",
          )}
        >
          {state === "healthy" ? (
            <CheckCircle2 aria-hidden="true" className="size-5" />
          ) : state === "error" ? (
            <AlertCircle aria-hidden="true" className="size-5" />
          ) : (
            <Activity aria-hidden="true" className="size-5" />
          )}
        </span>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-300">
        {error ??
          health?.note ??
          "Checking API health, data source mode, and runtime readiness."}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatusMetric
          icon={Database}
          label="Data source"
          value={health?.dataSource ?? "pending"}
        />
        <StatusMetric
          icon={Sparkles}
          label="AI key"
          value={health ? (health.aiAvailable ? "available" : "fallback") : "pending"}
        />
        <StatusMetric
          icon={ShieldCheck}
          label="Supabase"
          value={health ? (health.supabaseConfigured ? "configured" : "seed mode") : "pending"}
        />
      </div>

      {health?.supabaseMissingVariables.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {health.supabaseMissingVariables.map((item) => (
            <Badge key={item} tone="amber">
              Missing {item}
            </Badge>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function StatusMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon aria-hidden="true" className="size-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-sm font-semibold capitalize text-white">{value}</p>
    </div>
  );
}

function getPlatformState(
  health?: HealthStatus,
  error?: string,
  loading?: boolean,
): "healthy" | "degraded" | "error" | "loading" {
  if (error) {
    return "error";
  }

  if (loading || !health) {
    return "loading";
  }

  if (health.status !== "ok") {
    return "error";
  }

  if (health.dataSource === "seed" || !health.aiAvailable) {
    return "degraded";
  }

  return "healthy";
}

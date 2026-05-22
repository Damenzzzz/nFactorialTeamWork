import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone?: "cyan" | "emerald" | "amber" | "rose";
}

const toneClasses = {
  amber: "bg-amber-300/10 text-amber-100 ring-amber-300/20",
  cyan: "bg-cyan-300/10 text-cyan-100 ring-cyan-300/20",
  emerald: "bg-emerald-300/10 text-emerald-100 ring-emerald-300/20",
  rose: "bg-rose-300/10 text-rose-100 ring-rose-300/20",
};

export function MetricCard({
  detail,
  icon: Icon,
  label,
  tone = "cyan",
  value,
}: MetricCardProps) {
  return (
    <article className="group rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-lg ring-1",
            toneClasses[tone],
          )}
        >
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{detail}</p>
    </article>
  );
}

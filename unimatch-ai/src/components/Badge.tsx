import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "cyan" | "emerald" | "amber" | "rose" | "slate";

const toneClasses: Record<BadgeTone, string> = {
  amber: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
  emerald: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  rose: "border-rose-300/25 bg-rose-300/10 text-rose-100",
  slate: "border-white/10 bg-white/[0.06] text-slate-200",
};

interface BadgeProps {
  children: ReactNode;
  className?: string;
  tone?: BadgeTone;
}

export function Badge({ children, className, tone = "slate" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-xs font-medium leading-none",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

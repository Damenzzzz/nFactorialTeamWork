import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
}

export function EmptyState({
  className,
  description,
  icon: Icon = Search,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-white/[0.07] text-cyan-100 ring-1 ring-white/10">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

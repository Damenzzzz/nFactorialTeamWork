import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  action,
  className,
  description,
  eyebrow,
  title,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase text-cyan-200/80">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-300">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

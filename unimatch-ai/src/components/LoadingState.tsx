import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({
  className,
  label = "Loading current data",
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-white/[0.055] p-6 text-slate-300 backdrop-blur-xl",
        className,
      )}
      role="status"
    >
      <div className="flex items-center gap-3">
        <Loader2 aria-hidden="true" className="size-5 animate-spin text-cyan-200" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="mt-5 grid gap-3">
        <div className="h-3 w-3/4 rounded-full bg-white/10" />
        <div className="h-3 w-1/2 rounded-full bg-white/10" />
        <div className="h-3 w-2/3 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

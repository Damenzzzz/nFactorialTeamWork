import {
  Award,
  BookOpen,
  Calendar,
  DollarSign,
  ExternalLink,
  GraduationCap,
  MapPin,
  Plus,
  Scale,
} from "lucide-react";
import { Badge } from "@/components/Badge";
import type { ProgramWithAdmissions } from "@/lib/domain";
import { formatCurrency, formatDeadline } from "@/lib/frontend/format";
import { cn } from "@/lib/utils";

interface ProgramCardProps {
  compareDisabled?: boolean;
  isCompared?: boolean;
  onToggleCompare: () => void;
  record: ProgramWithAdmissions;
}

export function ProgramCard({
  compareDisabled = false,
  isCompared = false,
  onToggleCompare,
  record,
}: ProgramCardProps) {
  const { program, requirement, university } = record;

  return (
    <article className="group flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/30 hover:bg-white/[0.08]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge tone="cyan">{program.degreeLevel}</Badge>
            <Badge tone={program.scholarshipsAvailable ? "emerald" : "slate"}>
              {program.scholarshipsAvailable ? "Scholarship friendly" : "Limited funding"}
            </Badge>
          </div>
          <h3 className="mt-4 text-xl font-semibold leading-7 text-white">
            {university.name}
          </h3>
          <p className="mt-2 text-sm font-medium text-cyan-100">
            {program.name}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-cyan-100 ring-1 ring-white/10">
          <GraduationCap aria-hidden="true" className="size-5" />
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        {program.description}
      </p>

      <div className="mt-5 grid gap-3 text-sm text-slate-300">
        <FactRow icon={MapPin} label={`${university.country}, ${university.city}`} />
        <FactRow icon={BookOpen} label={`${program.field} - ${program.language}`} />
        <FactRow
          icon={DollarSign}
          label={`${formatCurrency(program.tuitionUsdPerYear)} annual tuition`}
        />
        <FactRow
          icon={Calendar}
          label={`${formatDeadline(program.applicationDeadline)} deadline`}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-y border-white/10 py-4">
        <Requirement label="GPA" value={requirement.minGpa.toFixed(1)} />
        <Requirement label="IELTS" value={requirement.minIelts.toFixed(1)} />
        <Requirement
          label="SAT"
          value={requirement.minSat ? String(requirement.minSat) : "Optional"}
        />
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-lg bg-black/20 p-4">
        <Award aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-100" />
        <p className="text-sm leading-6 text-slate-400">
          {program.scholarshipsAvailable
            ? university.scholarships[0]?.name ?? "Scholarship option listed"
            : "Scholarship availability may be limited for this program."}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {program.tags.map((tag) => (
          <Badge key={tag} tone="slate">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
            isCompared
              ? "bg-emerald-200 text-slate-950 hover:bg-white"
              : "border border-white/10 bg-white/[0.065] text-white hover:border-cyan-200/30 hover:bg-white/[0.1]",
          )}
          disabled={compareDisabled}
          onClick={onToggleCompare}
          type="button"
        >
          {isCompared ? (
            <Scale aria-hidden="true" className="size-4" />
          ) : (
            <Plus aria-hidden="true" className="size-4" />
          )}
          {isCompared ? "Added" : compareDisabled ? "Limit reached" : "Add to compare"}
        </button>
        <a
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
          href={university.website}
          rel="noreferrer"
          target="_blank"
        >
          Official site
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      </div>
    </article>
  );
}

function FactRow({
  icon: Icon,
  label,
}: {
  icon: typeof MapPin;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon aria-hidden="true" className="size-4 shrink-0 text-slate-500" />
      <span>{label}</span>
    </div>
  );
}

function Requirement({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

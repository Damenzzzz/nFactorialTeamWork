import {
  BookOpen,
  Calendar,
  DollarSign,
  ExternalLink,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/Badge";
import type { ProgramWithAdmissions } from "@/lib/domain";
import { formatCurrency, formatDeadline } from "@/lib/frontend/format";

interface ProgramCardProps {
  record: ProgramWithAdmissions;
}

export function ProgramCard({ record }: ProgramCardProps) {
  const { program, requirement, university } = record;

  return (
    <article className="group flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/30 hover:bg-white/[0.08]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge tone="cyan">{program.degreeLevel}</Badge>
            <Badge tone={program.scholarshipsAvailable ? "emerald" : "slate"}>
              {program.scholarshipsAvailable ? "Scholarship" : "No scholarship tag"}
            </Badge>
          </div>
          <h3 className="mt-4 text-xl font-semibold leading-7 text-white">
            {program.name}
          </h3>
          <p className="mt-2 text-sm font-medium text-slate-300">
            {university.name}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-cyan-100 ring-1 ring-white/10">
          <GraduationCap aria-hidden="true" className="size-5" />
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-300">
        <FactRow icon={MapPin} label={`${university.country}, ${university.city}`} />
        <FactRow
          icon={DollarSign}
          label={`${formatCurrency(program.tuitionUsdPerYear)} annual tuition`}
        />
        <FactRow
          icon={Calendar}
          label={`${formatDeadline(program.applicationDeadline)} deadline`}
        />
        <FactRow
          icon={BookOpen}
          label={`${program.language}, ${program.durationMonths} months`}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-y border-white/10 py-4">
        <Requirement label="GPA" value={requirement.minGpa.toFixed(1)} />
        <Requirement label="IELTS" value={requirement.minIelts.toFixed(1)} />
        <Requirement label="SAT" value={requirement.minSat ? String(requirement.minSat) : "N/A"} />
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">{requirement.notes}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {program.tags.map((tag) => (
          <Badge key={tag} tone="slate">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-auto pt-5">
        <a
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
          href={university.website}
          rel="noreferrer"
          target="_blank"
        >
          Official university site
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

import {
  Bot,
  Database,
  GitBranch,
  MonitorCheck,
  Network,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { SectionHeader } from "@/components/SectionHeader";

const evidenceItems = [
  {
    description:
      "Current Next.js and Tailwind guidance is checked before framework-specific UI work.",
    icon: Network,
    title: "Context7 MCP",
    tone: "cyan" as const,
  },
  {
    description:
      "Backend and data planning stays Supabase-ready while local seed data remains the default path.",
    icon: Database,
    title: "Supabase MCP",
    tone: "emerald" as const,
  },
  {
    description:
      "Browser and end-to-end checks are reserved for QA evidence once Playwright coverage is added.",
    icon: MonitorCheck,
    title: "Playwright MCP",
    tone: "amber" as const,
  },
  {
    description:
      "Repository and workflow review can use GitHub tooling without inventing collaborators.",
    icon: GitBranch,
    title: "GitHub MCP",
    tone: "slate" as const,
  },
  {
    description:
      "Frontend, backend, AI, and QA are solo role phases with scoped implementation rules.",
    icon: Bot,
    title: "Codex subagents",
    tone: "rose" as const,
  },
];

export function WorkflowEvidence() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8" id="workflow">
      <SectionHeader
        description="The interface exposes the same solo AI-native workflow expected by the project artifacts, without creating fake team activity."
        eyebrow="Workflow evidence"
        title="AI-native delivery signals"
      />
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {evidenceItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]"
              key={item.title}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-lg bg-white/[0.07] text-cyan-100 ring-1 ring-white/10">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <Badge tone={item.tone}>{item.title.split(" ")[0]}</Badge>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-5 text-sm leading-6 text-cyan-50">
        <div className="flex items-start gap-3">
          <Sparkles aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>
            This frontend phase is limited to the product interface, catalog,
            filters, platform status, and recommendation report. The advisor
            chat route remains outside this slice.
          </p>
        </div>
      </div>
    </section>
  );
}

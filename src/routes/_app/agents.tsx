import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mark } from "@/components/mark";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filedMemory } from "@/lib/brain";
import { BUSINESS_BY_ID, BUSINESSES } from "@/lib/businesses";
import { matchesFilter, useSelected } from "@/lib/filter";
import { generateCopy } from "@/lib/generate";
import { useGrowthStore } from "@/lib/store";
import type { AgentJob } from "@/lib/types";

export const Route = createFileRoute("/_app/agents")({ component: AgentsPage });

function AgentsPage() {
  const selected = useSelected();
  const agents = useGrowthStore((s) => s.agents).filter((a) => matchesFilter(a.businessId, selected));
  const addMemory = useGrowthStore((s) => s.addAgentMemory);
  const setResult = useGrowthStore((s) => s.setAgentResult);
  const reset = useGrowthStore((s) => s.reset);
  const filed = useGrowthStore((s) => s.brainNotes);
  const [openId, setOpenId] = useState<string | null>(agents[0]?.id ?? null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const open = agents.find((a) => a.id === openId) ?? agents[0];

  async function run(agent: AgentJob) {
    const house = {
      name: "the house",
      voice: BUSINESSES.map((b) => b.voice).join(" "),
      banned: BUSINESSES.flatMap((b) => b.banned),
    };
    const biz = agent.businessId === "all" ? house : BUSINESS_BY_ID[agent.businessId];
    setBusy(true);
    const res = await generateCopy({
      data: {
        task: "agent",
        business: biz.name,
        voice: biz.voice,
        banned: biz.banned,
        businessId: agent.businessId,
        memory: filedMemory(filed, agent.businessId),
        context: `Job: ${agent.name}\nRole: ${agent.role}\nMetric: ${agent.metric}\nMemory:\n${agent.memory.join("\n")}\nLast result: ${agent.lastResult}`,
      },
    });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setResult(agent.id, String(res.data.result ?? "Ran with no notes."));
    toast.success(`${agent.name} wrote a result.`);
  }

  function saveNote(e: React.FormEvent) {
    e.preventDefault();
    if (!open || !note.trim()) return;
    addMemory(open.id, note.trim());
    setNote("");
    toast.success("Correction stored. The next run will see it.");
  }

  return (
    <div>
      <PageHeader
        kicker="Eval loop · Agents"
        title="Write the job like you are hiring a person."
        lede="Data source, schedule, filters, output, approval, metric. Start small. Correct the work. Put the correction in memory so the system compounds."
      />

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="space-y-1">
          {agents.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setOpenId(a.id)}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-3 text-left text-sm ${
                open?.id === a.id ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60"
              }`}
            >
              <Mark id={a.businessId} className="size-6 text-[9px]" />
              <span className="leading-tight">{a.name}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              reset();
              toast.success("Demo data restored.");
            }}
            className="mt-4 px-3 text-xs text-subtle hover:text-foreground"
          >
            Reset demo data
          </button>
        </aside>

        {open && (
          <article className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-wider text-subtle uppercase">{open.schedule}</p>
                <h2 className="font-display mt-1 text-2xl">{open.name}</h2>
              </div>
              <Button onClick={() => void run(open)} disabled={busy}>
                {busy ? "Running…" : "Run now"}
              </Button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{open.role}</p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Spec label="Data source" value={open.dataSource} />
              <Spec label="Output" value={open.output} />
              <Spec label="Approval" value={open.approval} />
              <Spec label="Metric that matters" value={open.metric} />
            </dl>

            <div className="mt-5">
              <p className="text-[11px] tracking-wider text-subtle uppercase">Filters</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                {open.filters.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-lg bg-muted px-4 py-4">
              <p className="text-[11px] tracking-wider text-subtle uppercase">
                Last run · {open.lastRun}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{open.lastResult}</p>
            </div>

            <div className="mt-5">
              <p className="text-[11px] tracking-wider text-subtle uppercase">Memory</p>
              <ul className="mt-2 space-y-2">
                {open.memory.map((m) => (
                  <li key={m} className="text-sm text-muted-foreground">
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={saveNote} className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Correction — e.g. first line sounded fake, require the trigger"
              />
              <Button type="submit" variant="secondary" className="sm:w-40">
                Add to memory
              </Button>
            </form>
          </article>
        )}
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-wider text-subtle uppercase">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed">{value}</dd>
    </div>
  );
}

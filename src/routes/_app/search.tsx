import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Empty } from "@/components/empty";
import { Mark } from "@/components/mark";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { filedMemory } from "@/lib/brain";
import { BUSINESS_BY_ID, BUSINESSES } from "@/lib/businesses";
import { matchesFilter, useSelected } from "@/lib/filter";
import { generateCopy } from "@/lib/generate";
import { useGrowthStore } from "@/lib/store";

export const Route = createFileRoute("/_app/search")({ component: SearchPage });

function SearchPage() {
  const selected = useSelected();
  const rows = useGrowthStore((s) => s.search).filter((r) => matchesFilter(r.businessId, selected));
  const setStatus = useGrowthStore((s) => s.setSearchStatus);
  const filed = useGrowthStore((s) => s.brainNotes);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function draft(id: string) {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const biz = BUSINESS_BY_ID[row.businessId] ?? BUSINESSES[0];
    setBusyId(id);
    const res = await generateCopy({
      data: {
        task: "search",
        business: biz.name,
        voice: biz.voice,
        banned: biz.banned,
        businessId: biz.id,
        memory: filedMemory(filed, biz.id),
        context: `Query: ${row.query}\nIntent: ${row.intent}\nCurrent answer sketch: ${row.answer}`,
      },
    });
    setBusyId(null);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    const answer = String(res.data.answer ?? row.answer);
    setStatus(id, "drafted", answer);
    toast.success("Citation draft written.");
  }

  return (
    <div>
      <PageHeader
        kicker="System 5 · AI search visibility"
        title="Be the answer a buyer gets when they ask the machine."
        lede="ChatGPT, Google AI, and the rest will cite someone. The job is to write the page they can cite — first two sentences are the answer."
      />

      {rows.length === 0 ? (
        <Empty title="No queries in this view" body="Switch company to see citation gaps." />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <article key={r.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap items-center gap-2">
                <Mark id={r.businessId} />
                <Badge
                  variant={r.status === "cited" ? "up" : r.status === "gap" ? "warn" : "solid"}
                >
                  {r.status}
                </Badge>
              </div>
              <h2 className="mt-3 text-base font-medium">“{r.query}”</h2>
              <p className="mt-1 text-xs text-subtle">{r.intent}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.answer}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.status === "gap" && (
                  <Button size="sm" onClick={() => void draft(r.id)} disabled={busyId === r.id}>
                    {busyId === r.id ? "Writing…" : "Draft the answer"}
                  </Button>
                )}
                {r.status === "drafted" && (
                  <Button size="sm" variant="secondary" onClick={() => setStatus(r.id, "cited")}>
                    Mark cited
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

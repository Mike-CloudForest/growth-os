import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Empty } from "@/components/empty";
import { Mark } from "@/components/mark";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { filedMemory } from "@/lib/brain";
import { BUSINESS_BY_ID, BUSINESSES } from "@/lib/businesses";
import { matchesFilter, useSelected } from "@/lib/filter";
import { generateCopy } from "@/lib/generate";
import { OBJECTIONS } from "@/lib/seed";
import { useGrowthStore } from "@/lib/store";
import type { BusinessId } from "@/lib/types";

export const Route = createFileRoute("/_app/truth")({ component: TruthPage });

function TruthPage() {
  const selected = useSelected();
  const insights = useGrowthStore((s) => s.insights).filter((i) =>
    matchesFilter(i.businessId, selected),
  );
  const addInsight = useGrowthStore((s) => s.addInsight);
  const filed = useGrowthStore((s) => s.brainNotes);
  const objections = OBJECTIONS.filter((o) => matchesFilter(o.businessId, selected));
  const [busy, setBusy] = useState(false);
  const [quote, setQuote] = useState("");
  const [source, setSource] = useState("");

  async function compile() {
    const biz = selected === "all" ? BUSINESSES[0] : BUSINESS_BY_ID[selected];
    const context = insights
      .filter((i) => i.businessId === biz.id)
      .map((i) => `${i.claim} — ${i.evidence.map((e) => e.quote).join(" / ")}`)
      .join("\n");
    setBusy(true);
    const res = await generateCopy({
      data: {
        task: "brief",
        business: biz.name,
        voice: biz.voice,
        banned: biz.banned,
        businessId: biz.id,
        memory: filedMemory(filed, biz.id),
        context: context || biz.sharpAngle,
      },
    });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    addInsight({
      id: `i-gen-${Date.now()}`,
      businessId: biz.id,
      claim: String(res.data.headline ?? "New reading"),
      implication: String(res.data.body ?? "").slice(0, 280),
      count: 1,
      trend: "new",
      evidence: [
        {
          quote: "Compiled from this week’s notes by the truth agent.",
          source: "Customer Truth compiler",
          date: "Today",
        },
      ],
    });
    toast.success("Brief compiled into the truth file.");
  }

  function addReceipt(e: React.FormEvent) {
    e.preventDefault();
    if (!quote.trim() || !source.trim()) return;
    const bizId: BusinessId = selected === "all" ? "cloudforest" : selected;
    addInsight({
      id: `i-note-${Date.now()}`,
      businessId: bizId,
      claim: quote.trim(),
      implication: "Filed by hand. Waiting for the compiler to fold it into the brief.",
      count: 1,
      trend: "new",
      evidence: [{ quote: quote.trim(), source: source.trim(), date: "Today" }],
    });
    setQuote("");
    setSource("");
    toast.success("Receipt filed.");
  }

  return (
    <div>
      <PageHeader
        kicker="System 1 · Customer truth"
        title="What the market is telling us."
        lede="Sales hears one market. Support hears another. The founder remembers one call. This file is the single version, and every claim has a receipt."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={() => void compile()} disabled={busy}>
          {busy ? "Compiling…" : "Compile this week"}
        </Button>
        <p className="self-center text-xs text-subtle">
          Runs the truth agent. Every new claim still needs a quote.
        </p>
      </div>

      {insights.length === 0 ? (
        <Empty
          title="No receipts in this view"
          body="Switch company, or file a quote from a call."
        />
      ) : (
        <div className="space-y-4">
          {insights.map((i) => (
            <article key={i.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap items-center gap-2">
                <Mark id={i.businessId} />
                <Badge variant={i.trend === "down" ? "down" : i.trend === "up" ? "up" : "solid"}>
                  {i.trend} · {i.count}
                </Badge>
              </div>
              <h2 className="font-display mt-3 text-xl leading-snug">{i.claim}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{i.implication}</p>
              <ul className="mt-4 space-y-3 border-t border-border pt-4">
                {i.evidence.map((e, idx) => (
                  <li key={idx}>
                    <blockquote className="text-sm leading-relaxed text-foreground">
                      “{e.quote}”
                    </blockquote>
                    <p className="mt-1 text-xs text-subtle">
                      {e.source} · {e.date}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}

      {objections.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg">Objections, with a counter</h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            The words that stall a deal. Counted. Answered once, reused.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {objections.map((o) => (
              <article key={o.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Mark id={o.businessId} className="size-6 text-[9px]" />
                  <Badge>{o.count}× this cycle</Badge>
                </div>
                <p className="mt-3 text-sm font-medium">“{o.line}”</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.counter}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <form
        onSubmit={addReceipt}
        className="mt-8 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]"
      >
        <h2 className="font-display text-lg">File a receipt</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          A quote from a call, a ticket, a review. No claim without evidence.
        </p>
        <div className="space-y-3">
          <Textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="What they said, in their words."
            required
          />
          <Input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Source — call, ticket, review, desk log"
            required
          />
          <Button type="submit" variant="secondary">
            File
          </Button>
        </div>
      </form>
    </div>
  );
}

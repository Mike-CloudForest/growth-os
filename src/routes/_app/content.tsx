import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Calculators } from "@/components/calculators";
import { Empty } from "@/components/empty";
import { Mark } from "@/components/mark";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { filedMemory } from "@/lib/brain";
import { BUSINESS_BY_ID, BUSINESSES } from "@/lib/businesses";
import { matchesFilter, useSelected } from "@/lib/filter";
import { generateCopy } from "@/lib/generate";
import { HOOKS } from "@/lib/seed";
import { useGrowthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/content")({ component: ContentPage });

const TABS = ["pieces", "voice", "surfaces"] as const;

function ContentPage() {
  const selected = useSelected();
  const content = useGrowthStore((s) => s.content).filter((c) =>
    matchesFilter(c.businessId, selected),
  );
  const addContent = useGrowthStore((s) => s.addContent);
  const setStatus = useGrowthStore((s) => s.setContentStatus);
  const filed = useGrowthStore((s) => s.brainNotes);
  const [tab, setTab] = useState<(typeof TABS)[number]>("pieces");
  const [busy, setBusy] = useState(false);

  const companies = selected === "all" ? BUSINESSES : [BUSINESS_BY_ID[selected]];

  async function writePost() {
    const biz = companies[0];
    setBusy(true);
    const res = await generateCopy({
      data: {
        task: "post",
        business: biz.name,
        voice: biz.voice,
        banned: biz.banned,
        businessId: biz.id,
        memory: filedMemory(filed, biz.id),
        context: `${biz.sharpAngle}\nWinning hooks:\n${HOOKS[biz.id].join("\n")}\nOffer: ${biz.offer}`,
      },
    });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    addContent({
      id: `c-gen-${Date.now()}`,
      businessId: biz.id,
      kind: "post",
      title: String(res.data.title ?? "Untitled"),
      hook: String(res.data.hook ?? ""),
      body: String(res.data.body ?? ""),
      status: "draft",
    });
    toast.success("Draft dropped into the engine.");
  }

  return (
    <div>
      <PageHeader
        kicker="System 2 · Founder content"
        title="Turn customer language into something you can ship."
        lede="The repo remembers the voice, the winning hooks, and the objections. Random chats forget all three by next week."
      />

      <div className="mb-6 flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "h-11 rounded-md px-4 text-sm font-medium capitalize",
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "pieces" && (
        <>
          <div className="mb-5">
            <Button onClick={() => void writePost()} disabled={busy}>
              {busy ? "Writing…" : "Write a founder post"}
            </Button>
          </div>
          {content.length === 0 ? (
            <Empty title="Nothing in the engine" body="Generate a post, or switch company." />
          ) : (
            <div className="space-y-3">
              {content.map((c) => (
                <article key={c.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
                  <div className="flex flex-wrap items-center gap-2">
                    <Mark id={c.businessId} />
                    <Badge>{c.kind}</Badge>
                    <Badge variant={c.status === "winner" ? "up" : c.status === "killed" ? "down" : "solid"}>
                      {c.status}
                    </Badge>
                  </div>
                  <h2 className="font-display mt-3 text-xl">{c.title}</h2>
                  <p className="mt-1 text-sm font-medium text-foreground">{c.hook}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                  {c.metricLabel && (
                    <p className="mt-3 text-xs tabular-nums text-subtle">
                      {c.metricLabel}: {c.metricValue}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.status !== "shipped" && c.status !== "winner" && (
                      <Button size="sm" variant="secondary" onClick={() => setStatus(c.id, "shipped")}>
                        Mark shipped
                      </Button>
                    )}
                    {c.status === "shipped" && (
                      <Button size="sm" onClick={() => setStatus(c.id, "winner")}>
                        Mark winner
                      </Button>
                    )}
                    {c.status !== "killed" && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(c.id, "killed")}>
                        Kill
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "voice" && (
        <div className="space-y-3">
          {companies.map((b) => (
            <article key={b.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <div className="flex items-center gap-2">
                <Mark id={b.id} />
                <h2 className="font-display text-xl">{b.name}</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.voice}</p>
              <p className="mt-3 text-sm">
                <span className="text-subtle">Sharp angle. </span>
                {b.sharpAngle}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="text-subtle">ICP. </span>
                {b.icp}
              </p>
              <div className="mt-4">
                <p className="text-[11px] tracking-wider text-subtle uppercase">Winning hooks</p>
                <ul className="mt-2 space-y-1">
                  {HOOKS[b.id].map((h) => (
                    <li key={h} className="text-sm">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <p className="text-[11px] tracking-wider text-subtle uppercase">Banned</p>
                <p className="mt-1 text-sm text-muted-foreground">{b.banned.join(" · ")}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "surfaces" && (
        <div>
          <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
            Marketing engineers ship little calculators and pages, not just posts. These are live
            lead magnets — the HVAC lost-revenue move, written for this house.
          </p>
          <Calculators />
        </div>
      )}
    </div>
  );
}

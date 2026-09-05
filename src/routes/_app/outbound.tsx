import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, X } from "lucide-react";
import { useMemo, useState } from "react";
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
import type { Signal } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/outbound")({ component: OutboundPage });

const FILTERS = ["queued", "approved", "sent", "replied", "rejected"] as const;

async function copyDraft(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Draft copied.");
  } catch {
    toast.error("Could not copy.");
  }
}

function OutboundPage() {
  const selected = useSelected();
  const signals = useGrowthStore((s) => s.signals).filter((row) =>
    matchesFilter(row.businessId, selected),
  );
  const setStatus = useGrowthStore((s) => s.setSignalStatus);
  const addSignals = useGrowthStore((s) => s.addSignals);
  const filed = useGrowthStore((s) => s.brainNotes);
  const [status, setFilter] = useState<(typeof FILTERS)[number]>("queued");
  const [busy, setBusy] = useState(false);

  const rows = useMemo(
    () => signals.filter((s) => s.status === status),
    [signals, status],
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const f of FILTERS) c[f] = signals.filter((s) => s.status === f).length;
    return c;
  }, [signals]);

  async function draftMore() {
    const biz = selected === "all" ? BUSINESSES[1] : BUSINESS_BY_ID[selected];
    setBusy(true);
    const res = await generateCopy({
      data: {
        task: "outbound",
        business: biz.name,
        voice: biz.voice,
        banned: biz.banned,
        businessId: biz.id,
        memory: filedMemory(filed, biz.id),
        context: `ICP: ${biz.icp}\nAngle: ${biz.sharpAngle}\nWrite a first-touch to someone who just showed a buying trigger this week.`,
      },
    });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    const next: Signal = {
      id: `s-gen-${Date.now()}`,
      businessId: biz.id,
      account: String(res.data.account ?? "New account"),
      role: "Queued by the signal agent",
      trigger: "Generated from this week’s watch list",
      whyNow: "Agent draft. Read it before it leaves the building.",
      draft: String(res.data.draft ?? ""),
      status: "queued",
      fit: "high",
    };
    addSignals([next]);
    setFilter("queued");
    toast.success("Draft queued for approval.");
  }

  return (
    <div>
      <PageHeader
        kicker="System 3 · Outbound signal"
        title="Who has a reason to care this week."
        lede="Timing first. Hiring, public pain, an outage, a stuffed visor. The metric is qualified replies — not messages sent. Nothing leaves without you."
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Button onClick={() => void draftMore()} disabled={busy}>
          {busy ? "Watching…" : "Draft from a live signal"}
        </Button>
        <p className="text-xs text-subtle">The agent drafts. You approve.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium capitalize",
              status === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
            )}
          >
            {f}
            <span className="ml-2 tabular-nums text-xs opacity-70">{counts[f] ?? 0}</span>
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <Empty title={`No ${status} drafts`} body="Approve from Queued, or generate a new one." />
      ) : (
        <div className="space-y-3">
          {rows.map((s) => (
            <article key={s.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap items-center gap-2">
                <Mark id={s.businessId} />
                <Badge variant="up">{s.fit} fit</Badge>
              </div>
              <h2 className="mt-3 text-base font-medium">{s.account}</h2>
              <p className="text-xs text-subtle">{s.role}</p>
              <p className="mt-3 text-sm">
                <span className="text-subtle">Trigger. </span>
                {s.trigger}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="text-subtle">Why now. </span>
                {s.whyNow}
              </p>
              <blockquote className="mt-4 rounded-lg bg-muted px-4 py-3 text-sm leading-relaxed">
                {s.draft}
              </blockquote>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => void copyDraft(s.draft)}>
                  <Copy className="size-4" />
                  Copy
                </Button>
                {s.status === "queued" && (
                  <>
                    <Button size="sm" onClick={() => setStatus(s.id, "approved")}>
                      <Check className="size-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setStatus(s.id, "sent")}>
                      Mark sent
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setStatus(s.id, "rejected")}>
                      <X className="size-4" />
                      Reject
                    </Button>
                  </>
                )}
                {s.status === "approved" && (
                  <Button size="sm" onClick={() => setStatus(s.id, "sent")}>
                    Mark sent
                  </Button>
                )}
                {s.status === "sent" && (
                  <Button size="sm" variant="secondary" onClick={() => setStatus(s.id, "replied")}>
                    Log a qualified reply
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

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Empty } from "@/components/empty";
import { Mark } from "@/components/mark";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filedMemory } from "@/lib/brain";
import { BUSINESS_BY_ID, BUSINESSES } from "@/lib/businesses";
import { matchesFilter, useSelected } from "@/lib/filter";
import { generateCopy } from "@/lib/generate";
import { HOOKS } from "@/lib/seed";
import { useGrowthStore } from "@/lib/store";
import type { CreativeTest } from "@/lib/types";

export const Route = createFileRoute("/_app/creative")({ component: CreativePage });

function pct(n: number, d: number) {
  if (!d) return "—";
  return `${((n / d) * 100).toFixed(1)}%`;
}

function CreativePage() {
  const selected = useSelected();
  const tests = useGrowthStore((s) => s.tests).filter((t) => matchesFilter(t.businessId, selected));
  const addHooks = useGrowthStore((s) => s.addHooks);
  const setTestStatus = useGrowthStore((s) => s.setTestStatus);
  const filed = useGrowthStore((s) => s.brainNotes);
  const [angle, setAngle] = useState("");
  const [busy, setBusy] = useState(false);

  const won = tests.filter((t) => t.status === "won").length;
  const done = tests.filter((t) => t.status !== "running").length;

  async function spin() {
    const biz = selected === "all" ? BUSINESSES[4] : BUSINESS_BY_ID[selected];
    const a = angle.trim() || biz.sharpAngle;
    setBusy(true);
    const res = await generateCopy({
      data: {
        task: "hooks",
        business: biz.name,
        voice: biz.voice,
        banned: biz.banned,
        businessId: biz.id,
        memory: filedMemory(filed, biz.id),
        context: `Angle to spin: ${a}\nKnown winners:\n${HOOKS[biz.id].join("\n")}`,
      },
    });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    const hooks = Array.isArray(res.data.hooks)
      ? (res.data.hooks as unknown[]).map(String).filter(Boolean)
      : [];
    if (!hooks.length) {
      toast.error("No hooks returned.");
      return;
    }
    addHooks(biz.id, hooks, a);
    toast.success(`${hooks.length} hooks queued as tests.`);
    setAngle("");
  }

  function mark(id: string, status: CreativeTest["status"]) {
    setTestStatus(id, status);
    toast.success(status === "won" ? "Marked a winner." : status === "lost" ? "Killed." : "Back to running.");
  }

  return (
    <div>
      <PageHeader
        kicker="System 4 · Creative testing"
        title="One offer. Twenty hooks. Keep the ones that create conversations."
        lede="Clicks from the wrong ICP are a cost. This board scores conversations and closes, then kills the rest."
      />

      <div className="mb-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span className="tabular-nums">
          Win rate {done ? Math.round((won / done) * 100) : 0}% · {won} won / {done} decided
        </span>
      </div>

      <form
        className="mb-8 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void spin();
        }}
      >
        <Input
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          placeholder="Angle to spin — e.g. declined work, visor envelope, known by name"
        />
        <Button type="submit" disabled={busy} className="sm:w-44">
          {busy ? "Spinning…" : "Spin 8 hooks"}
        </Button>
      </form>

      {tests.length === 0 ? (
        <Empty title="No tests in this view" body="Spin an angle, or switch company." />
      ) : (
        <div className="overflow-x-auto rounded-xl bg-card shadow-[var(--shadow-border)]">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="text-xs tracking-wider text-subtle uppercase">
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-medium">Hook</th>
                <th className="px-3 py-3 font-medium">CTR</th>
                <th className="px-3 py-3 font-medium">Conv.</th>
                <th className="px-3 py-3 font-medium">Closes</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Eval</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <Mark id={t.businessId} className="mt-0.5 size-6 text-[9px]" />
                      <div>
                        <p className="font-medium">{t.hook}</p>
                        <p className="text-xs text-subtle">
                          {t.angle} · {t.surface}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 tabular-nums text-muted-foreground">
                    {pct(t.clicks, t.impressions)}
                  </td>
                  <td className="px-3 py-3 tabular-nums">{t.conversations}</td>
                  <td className="px-3 py-3 tabular-nums">{t.conversions}</td>
                  <td className="px-3 py-3">
                    <Badge
                      variant={t.status === "won" ? "up" : t.status === "lost" ? "down" : "solid"}
                    >
                      {t.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {t.status !== "won" && (
                        <Button size="sm" variant="ghost" onClick={() => mark(t.id, "won")}>
                          Win
                        </Button>
                      )}
                      {t.status !== "lost" && (
                        <Button size="sm" variant="ghost" onClick={() => mark(t.id, "lost")}>
                          Kill
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Mark } from "@/components/mark";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { BUSINESSES } from "@/lib/businesses";
import { matchesFilter, useSelected } from "@/lib/filter";
import { COMPETITORS, deskFor, EVALS, OBJECTIONS, WEEK_OF } from "@/lib/seed";
import { useGrowthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/")({ component: Cockpit });

function Cockpit() {
  const selected = useSelected();
  const desk = deskFor(selected);
  const tests = useGrowthStore((s) => s.tests).filter((t) => matchesFilter(t.businessId, selected));
  const signals = useGrowthStore((s) => s.signals).filter((t) =>
    matchesFilter(t.businessId, selected),
  );
  const insights = useGrowthStore((s) => s.insights).filter((t) =>
    matchesFilter(t.businessId, selected),
  );
  const queued = signals.filter((s) => s.status === "queued").length;
  const won = tests.filter((t) => t.status === "won").length;
  const evals = EVALS.filter((e) => matchesFilter(e.businessId, selected));
  const competitors = COMPETITORS.filter((c) => matchesFilter(c.businessId, selected));
  const objections = OBJECTIONS.filter((o) => matchesFilter(o.businessId, selected));

  const chart = BUSINESSES.filter((b) => selected === "all" || b.id === selected).map((b) => {
    const rows = tests.filter((t) => t.businessId === b.id);
    return {
      name: b.mark,
      conversations: rows.reduce((n, t) => n + t.conversations, 0),
      conversions: rows.reduce((n, t) => n + t.conversions, 0),
    };
  });

  return (
    <div>
      <a href="/sprint/" className="mb-6 block rounded-xl border border-border bg-card p-5">
        <strong>This week's campaigns: September 5 to 11</strong>
        <p className="mt-2 text-sm text-muted-foreground">Open the campaign drafts, tagged links, daily actions, and evidence log. The ad budget is $100 total. The legacy briefing below contains seeded figures, not connected live analytics.</p>
      </a>
      <PageHeader
        kicker="System 6 · Growth cockpit"
        title="What changed this week, and what to do about it."
        lede="Content, conversations, objections, test win rates, competitor moves, pain signals. The Monday meeting — except the meeting already happened."
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {desk.kpis.map((k) => (
          <article
            key={k.label}
            className="rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)]"
          >
            <p className="text-xs font-medium tracking-wider text-subtle uppercase">{k.label}</p>
            <p className="mt-2 font-display text-3xl tabular-nums tracking-tight">{k.value}</p>
            <p
              className={cn(
                "mt-1 text-xs",
                k.tone === "up" && "text-success",
                k.tone === "down" && "text-destructive",
                k.tone === "flat" && "text-muted-foreground",
              )}
            >
              {k.delta}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-xl bg-card px-5 py-6 shadow-[var(--shadow-border)] sm:px-7 sm:py-8">
          <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">
            Weekly brief · {desk.brief.weekOf}
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-2xl leading-snug sm:text-[1.7rem]">
            {desk.brief.headline}
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {desk.brief.body}
          </div>
        </article>

        <div className="flex flex-col gap-4">
          <article className="rounded-xl bg-card px-5 py-5 shadow-[var(--shadow-border)]">
            <p className="text-xs font-medium tracking-wider text-subtle uppercase">Do next</p>
            <ul className="mt-3 space-y-2">
              {desk.brief.doNext.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    to={item.href}
                    className="flex min-h-11 items-start justify-between gap-3 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-subtle" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 px-2 text-xs text-muted-foreground">
              {queued} outbound drafts waiting. {won} tests already won.
            </p>
          </article>

          <article className="rounded-xl bg-card px-5 py-5 shadow-[var(--shadow-border)]">
            <p className="text-xs font-medium tracking-wider text-subtle uppercase">
              Conversations vs closes
            </p>
            <div className="mt-3 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart} barGap={4}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: "color-mix(in oklab, var(--color-foreground) 4%, transparent)" }}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Bar dataKey="conversations" fill="var(--color-border)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="conversions" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-subtle">Grey is conversations. White is conversions.</p>
          </article>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="font-display text-xl">Eval loop · {WEEK_OF}</h2>
          <Link to="/agents" className="text-xs text-subtle hover:text-foreground">
            Agent jobs
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {(["double", "kill", "watch"] as const).map((verdict) => {
            const rows = evals.filter((e) => e.verdict === verdict);
            return (
              <article
                key={verdict}
                className="rounded-xl bg-card px-5 py-5 shadow-[var(--shadow-border)]"
              >
                <p className="text-xs font-medium tracking-wider text-subtle uppercase">
                  {verdict === "double" ? "Double down" : verdict === "kill" ? "Kill" : "Watch"}
                </p>
                <ul className="mt-3 space-y-3">
                  {rows.length === 0 ? (
                    <li className="text-sm text-muted-foreground">Nothing in this column.</li>
                  ) : (
                    rows.map((e) => (
                      <li key={e.id}>
                        <div className="flex items-start gap-2">
                          <Mark id={e.businessId} className="mt-0.5 size-6 text-[9px]" />
                          <div>
                            <p className="text-sm font-medium">{e.title}</p>
                            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                              {e.detail}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl bg-card px-5 py-5 shadow-[var(--shadow-border)]">
          <p className="text-xs font-medium tracking-wider text-subtle uppercase">
            Competitor moves
          </p>
          <ul className="mt-4 space-y-4">
            {competitors.map((c) => (
              <li key={c.id} className="border-t border-border pt-4 first:border-0 first:pt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Mark id={c.businessId} className="size-6 text-[9px]" />
                  <p className="text-sm font-medium">{c.competitor}</p>
                  <span className="text-xs text-subtle">{c.date}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{c.move}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.implication}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl bg-card px-5 py-5 shadow-[var(--shadow-border)]">
          <p className="text-xs font-medium tracking-wider text-subtle uppercase">
            Objections this week
          </p>
          <ul className="mt-4 space-y-4">
            {objections.map((o) => (
              <li key={o.id} className="border-t border-border pt-4 first:border-0 first:pt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Mark id={o.businessId} className="size-6 text-[9px]" />
                  <Badge>{o.count}×</Badge>
                </div>
                <p className="mt-2 text-sm font-medium">“{o.line}”</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{o.counter}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl">Pain signals</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {insights.slice(0, 4).map((i) => (
            <article key={i.id} className="rounded-xl bg-card px-5 py-4 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap items-center gap-2">
                <Mark id={i.businessId} className="size-6 text-[9px]" />
                <Badge variant={i.trend === "down" ? "down" : i.trend === "up" ? "up" : "solid"}>
                  {i.trend} · {i.count}
                </Badge>
              </div>
              <p className="mt-3 text-sm font-medium leading-snug">{i.claim}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{i.implication}</p>
            </article>
          ))}
        </div>
        <p className="mt-3">
          <Link to="/truth" className="text-xs text-subtle hover:text-foreground">
            Full truth file with receipts
          </Link>
        </p>
      </section>

      {selected === "all" && (
        <section className="mt-8">
          <h2 className="font-display text-xl">The house</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {BUSINESSES.map((b) => {
              const rows = tests.filter((t) => t.businessId === b.id);
              const conv = rows.reduce((n, t) => n + t.conversions, 0);
              return (
                <article
                  key={b.id}
                  className="rounded-xl bg-card px-5 py-4 shadow-[var(--shadow-border)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{b.name}</p>
                      <p className="text-xs text-subtle">{b.url}</p>
                    </div>
                    <Badge>{b.short}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.sharpAngle}</p>
                  <p className="mt-3 text-xs tabular-nums text-subtle">
                    {conv} conversions from running tests this cycle
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

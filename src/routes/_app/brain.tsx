import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Empty } from "@/components/empty";
import { Mark } from "@/components/mark";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import {
  BRAIN_INGESTED,
  BUSINESSES_FOR_BRAIN,
  KIND_LABEL,
  PROJECT_FOR,
  mergeBrain,
  searchBrain,
} from "@/lib/brain";
import { useSelected } from "@/lib/filter";
import { useGrowthStore } from "@/lib/store";
import type { BrainKind, BrainNote, FilterId } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/brain")({ component: BrainPage });

const KINDS: (BrainKind | "all")[] = [
  "all",
  "fact",
  "decision",
  "voice",
  "ban",
  "eval",
  "competitor",
];

function kindVariant(kind: BrainKind): "default" | "solid" | "up" | "down" | "warn" {
  if (kind === "eval") return "up";
  if (kind === "ban") return "down";
  if (kind === "competitor") return "warn";
  if (kind === "decision") return "solid";
  return "default";
}

function BrainPage() {
  const selected = useSelected();
  const filed = useGrowthStore((s) => s.brainNotes);
  const addBrainNote = useGrowthStore((s) => s.addBrainNote);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<BrainKind | "all">("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fileKind, setFileKind] = useState<BrainKind>("fact");

  const notes = useMemo(
    () => searchBrain(mergeBrain(filed), query, selected, kind),
    [filed, query, selected, kind],
  );
  const filedCount = notes.filter((n) => n.source === "filed").length;
  const corpusCount = notes.filter((n) => n.source === "superbrain").length;

  function fileNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const businessId: FilterId = selected;
    const note: BrainNote = {
      id: `bn-${Date.now()}`,
      businessId,
      project: PROJECT_FOR[businessId],
      title: title.trim(),
      body: body.trim(),
      kind: fileKind,
      tags: ["filed"],
      date: new Date().toISOString().slice(0, 10),
      source: "filed",
    };
    addBrainNote(note);
    setTitle("");
    setBody("");
    toast.success("Filed on this desk. SuperBrain writes happen from a Grok session.");
  }

  return (
    <div>
      <PageHeader
        kicker="System 7 · SuperBrain"
        title="The house memory the other rooms write from."
        lede="SuperBrain is Mike’s cross-project brain. This desk holds the marketing extract — voice, bans, prices, evals, competitors. Copy, outbound, and agents read it. Notes you file here stay on this desk."
      />

      <section className="mb-6 rounded-xl bg-card px-5 py-4 shadow-[var(--shadow-border)] sm:px-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Ingested from SuperBrain · {BRAIN_INGESTED}. Credentials never land here. Cloud Forest and
          DojoZeus map to <span className="text-foreground">dojo</span>
          {selected === "dojozeus" ? " (DojoZeus also lives on lyceum)" : ""}. Lyceum, RigBoss, and
          Mech Correct map to lyceum, rigboss, and shopboss.
        </p>
        <p className="mt-2 font-mono text-xs text-subtle">
          {corpusCount} SuperBrain · {filedCount} filed on this desk · {notes.length} showing
        </p>
      </section>

      <div className="mb-5 flex flex-col gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search voice, bans, prices, competitors…"
          aria-label="Search SuperBrain"
        />
        <div className="flex flex-wrap gap-1">
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={cn(
                "h-11 rounded-md px-3 text-xs font-medium capitalize",
                kind === k
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {k === "all" ? "All kinds" : KIND_LABEL[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-3">
          {notes.length === 0 ? (
            <Empty
              title="Nothing in this cut."
              body="Try another company, clear the search, or file a note on the right."
            />
          ) : (
            notes.map((n) => (
              <article
                key={n.id}
                className="rounded-xl bg-card px-5 py-5 shadow-[var(--shadow-border)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Mark id={n.businessId} />
                    <div className="min-w-0">
                      <p className="font-display text-lg leading-snug text-foreground">{n.title}</p>
                      <p className="mt-0.5 font-mono text-[11px] tracking-wide text-subtle uppercase">
                        {n.project} · {n.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge variant={kindVariant(n.kind)}>{KIND_LABEL[n.kind]}</Badge>
                    <Badge variant={n.source === "filed" ? "solid" : "default"}>
                      {n.source === "filed" ? "Filed" : "SuperBrain"}
                    </Badge>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{n.body}</p>
                {n.tags.length > 0 && (
                  <p className="mt-3 font-mono text-[11px] text-subtle">{n.tags.join(" · ")}</p>
                )}
              </article>
            ))
          )}
        </div>

        <form
          onSubmit={fileNote}
          className="h-fit rounded-xl bg-card px-5 py-5 shadow-[var(--shadow-border)] lg:sticky lg:top-6"
        >
          <p className="text-xs font-medium tracking-wider text-subtle uppercase">File a note</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Lands on this desk for{" "}
            {BUSINESSES_FOR_BRAIN.find((b) => b.id === selected)?.label ?? "the house"}. Other
            sessions read SuperBrain, not this browser.
          </p>
          <Input
            className="mt-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short title"
            aria-label="Note title"
          />
          <Textarea
            className="mt-2"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="The fact, decision, ban, or eval. No keys."
            aria-label="Note body"
          />
          <div className="mt-3 flex flex-wrap gap-1">
            {(Object.keys(KIND_LABEL) as BrainKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setFileKind(k)}
                className={cn(
                  "h-11 rounded-md px-3 text-xs font-medium",
                  fileKind === k
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {KIND_LABEL[k]}
              </button>
            ))}
          </div>
          <Button type="submit" className="mt-4 w-full" disabled={!title.trim() || !body.trim()}>
            File on this desk
          </Button>
        </form>
      </div>
    </div>
  );
}

import type { BrainKind, BrainNote, BrainProject, BusinessId, FilterId } from "./types";

export const BRAIN_INGESTED = "September 5, 2026";

export const PROJECT_FOR: Record<FilterId, BrainProject> = {
  all: "general",
  cloudforest: "dojo",
  dojozeus: "lyceum",
  lyceum: "lyceum",
  rigboss: "rigboss",
  mechcorrect: "shopboss",
};

export const KIND_LABEL: Record<BrainKind, string> = {
  fact: "Fact",
  decision: "Decision",
  voice: "Voice",
  ban: "Ban",
  eval: "Eval",
  competitor: "Competitor",
};

function note(
  partial: Omit<BrainNote, "source"> & { source?: BrainNote["source"] },
): BrainNote {
  return { source: "superbrain", ...partial };
}

/** Marketing extract from SuperBrain. No keys, passwords, or account IDs. */
export const BRAIN_CORPUS: BrainNote[] = [
  note({
    id: "sb-house-1",
    businessId: "all",
    project: "general",
    title: "Growth OS is the marketing engineer desk",
    body: "One operating system for Cloud Forest, DojoZeus, Lyceum, RigBoss, and Mech Correct. Six systems: customer truth, founder content, outbound with approval, creative scored on conversations and closes, AI-search citations, cockpit plus eval loop. Taste is the moat. SuperBrain is the house memory; this desk holds a marketing extract.",
    kind: "fact",
    tags: ["growth-os", "house"],
    date: "2026-09-05",
  }),
  note({
    id: "sb-house-2",
    businessId: "all",
    project: "general",
    title: "Score conversations and closes, never likes",
    body: "A winning test produced a conversation or a close. Clicks without a buyer are a kill. Agents draft. A human approves anything that leaves the building. Do not invent traffic, revenue, or seats.",
    kind: "decision",
    tags: ["eval", "agents"],
    date: "2026-09-05",
  }),

  note({
    id: "sb-cf-1",
    businessId: "cloudforest",
    project: "dojo",
    title: "Legal name and door",
    body: "Greensboro Martial Arts Academy LLC dba Cloud Forest Martial Institute. 719 W Gate City Blvd, Greensboro, NC 27403. Public site traincloudforest.com. Sifu Michael Johnson / Wei Lei Ma. Private club, not a gym.",
    kind: "fact",
    tags: ["legal", "location"],
    date: "2026-09-05",
  }),
  note({
    id: "sb-cf-2",
    businessId: "cloudforest",
    project: "dojo",
    title: "What the school replaced",
    body: "DojoZeus at Cloud Forest replaced Wix, PushPress, DojoChamp, EzyCourse, Shopify, SendFox, and Circle/Skool. One system runs the school. The public shop is the MyStudio Century Direct storefront under the Cloud Forest name.",
    kind: "fact",
    tags: ["stack", "ops"],
    date: "2026-07-16",
  }),
  note({
    id: "sb-cf-3",
    businessId: "cloudforest",
    project: "dojo",
    title: "Parents buy a known name",
    body: "Converting parents say some version of “I need him to focus,” never “I want him to fight.” The offer is first month $49, unlimited Wei Family classes, month to month. The leak is the 72 hours after the waiver, not the front door.",
    kind: "eval",
    tags: ["parents", "offer"],
    date: "2026-09-05",
  }),
  note({
    id: "sb-cf-4",
    businessId: "cloudforest",
    project: "dojo",
    title: "The Door commercial is in hand",
    body: "72-second Cloud Forest film delivered 2026-09-03. Quiet, lineage-true, the door not the fight. Use it. Do not recut it into a ninja ad.",
    kind: "fact",
    tags: ["commercial", "content"],
    date: "2026-09-03",
  }),
  note({
    id: "sb-cf-5",
    businessId: "cloudforest",
    project: "dojo",
    title: "Cloud Forest voice and bans",
    body: "Quiet, specific, lineage-true. The instructor knows your name by the second class. Never hype. Never franchise language. Banned in public copy: McDojo-bashing, guarantee black belt, get fit fast, ninja, bootcamp energy.",
    kind: "voice",
    tags: ["voice", "bans"],
    date: "2026-09-05",
  }),

  note({
    id: "sb-dz-1",
    businessId: "dojozeus",
    project: "lyceum",
    title: "Peer brand of Lyceum, not a fork",
    body: "DojoZeus rides the Lyceum engine as a peer brand. Public surfaces on dojozeus.com carry zero Lyceum traces. Shared legal entity is ownership, not chrome. Cloud Forest remains the original single-tenant school at traincloudforest.com — port code out of it, never add tenancy into it.",
    kind: "decision",
    tags: ["brand", "architecture"],
    date: "2026-07-23",
  }),
  note({
    id: "sb-dz-2",
    businessId: "dojozeus",
    project: "lyceum",
    title: "Founding 20 at $99, then $169",
    body: "Founding: $99/mo or $990/yr, first 20 schools, rate locked while continuously subscribed. Standard: $169/mo or $1,690/yr. No setup fee. The 14-day trial requires a card. Pricing verified against live Stripe on September 5, 2026; owner decision July 25 supersedes July 20. Zeus runs the office. Ares tutors. DojoZeus schools are all-inclusive and rank as Academy for plan gates. Talk to owners, not instructors who cannot buy.",
    kind: "decision",
    tags: ["pricing", "offer"],
    date: "2026-07-20",
  }),
  note({
    id: "sb-dz-3",
    businessId: "dojozeus",
    project: "lyceum",
    title: "You teach. It runs.",
    body: "Stack-replacement produced owner conversations. “AI for your dojo” produced instructor clicks and zero buyers. Open demos on the at-risk list, not the belt editor. Two schools posting a front-desk hiring ad is the trigger this week.",
    kind: "eval",
    tags: ["angle", "headline"],
    date: "2026-09-05",
  }),
  note({
    id: "sb-dz-4",
    businessId: "dojozeus",
    project: "lyceum",
    title: "DojoZeus bans",
    body: "Banned: AI for your dojo as the headline, disrupt, ninja software, replace your ELD, sensei bot. Built for the mat, not the desk. Every belt. Every dollar. Every student. One brain.",
    kind: "ban",
    tags: ["bans", "voice"],
    date: "2026-09-05",
  }),
  note({
    id: "sb-dz-5",
    businessId: "dojozeus",
    project: "lyceum",
    title: "Combat Factory is the concierge school",
    body: "Combat Factory (thecombatfactory.com) is the real DojoZeus beta school, not a paying case study to quote in ads. Concierge work in September 2026: dojo template lighting, visitor assistant, video hero, Send-to-the-team in Zeus. Do not name it as a logo-wall customer.",
    kind: "fact",
    tags: ["concierge", "beta"],
    date: "2026-09-04",
  }),
  note({
    id: "sb-dz-6",
    businessId: "dojozeus",
    project: "lyceum",
    title: "Mindbody year-lock is the objection",
    body: "Owners do not object to the fee. They object to “we just signed for a year.” Sit beside them until the contract ends. Founding eligibility depends on availability. The $99 monthly rate stays locked while continuously subscribed. Zen Planner public outages are a moment to engage commenters, not dunk.",
    kind: "competitor",
    tags: ["mindbody", "zen-planner"],
    date: "2026-09-04",
  }),

  note({
    id: "sb-ly-1",
    businessId: "lyceum",
    project: "lyceum",
    title: "How we talk about the plans",
    body: "Starter $49/mo + 5%. Pro $99 + 2% (most founders choose). Academy $249 + 0% forever. Never call Starter capped, limited, trapped, or a dead end. Pro costs more because live rooms, video, email, and staff seats cost more to host. Upgrading is one click with everything kept.",
    kind: "decision",
    tags: ["pricing", "packaging"],
    date: "2026-09-04",
  }),
  note({
    id: "sb-ly-2",
    businessId: "lyceum",
    project: "lyceum",
    title: "Why Lyceum exists",
    body: "Own Stripe, own member list, own domain, export any time, no contact caps. No premium pricing because there are no investors or board to pay. A small team of educators who watched course platforms make money off teachers. Make the case with facts. Never sneer at Kajabi or Teachable.",
    kind: "voice",
    tags: ["manifesto", "voice"],
    date: "2026-09-04",
  }),
  note({
    id: "sb-ly-3",
    businessId: "lyceum",
    project: "lyceum",
    title: "Kajabi compare is live",
    body: "joinlyceum.com ships a Kajabi comparison. It is Lyceum-only — /vs/kajabi redirects home on non-Lyceum hosts. Academy at $249 with 0% share is the answer. Ownership is the buy. The tutor is the story they tell a friend.",
    kind: "fact",
    tags: ["kajabi", "seo"],
    date: "2026-09-04",
  }),
  note({
    id: "sb-ly-4",
    businessId: "lyceum",
    project: "lyceum",
    title: "Real vs Ours on every count",
    body: "Every Lyceum number shows Real vs Ours. Our own traffic is tagged, never dropped. Digest headline names real visitors and real Lyra questions, with ours in a second column. Do not quote a total that mixes the two.",
    kind: "decision",
    tags: ["analytics", "owner-rule"],
    date: "2026-09-05",
  }),
  note({
    id: "sb-ly-5",
    businessId: "lyceum",
    project: "lyceum",
    title: "Week to 2026-09-05: visits, no questions",
    body: "85 real visitors, 108 sessions, 149 page views, 1 CTA click, 0 code requests, 0 real Lyra questions in 7 days. Launch email on Sep 4 produced visits. Nobody asked Lyra a real question. The leak is the page, not awareness.",
    kind: "eval",
    tags: ["traffic", "lyra"],
    date: "2026-09-05",
  }),
  note({
    id: "sb-ly-6",
    businessId: "lyceum",
    project: "lyceum",
    title: "Empty is a week, not a verdict",
    body: "Teachers stall after they build and before they open the doors. “I’m scared it will look empty.” Open night is the product. Demo school on the homepage is Northlight Ceramics — do not delete it. Lyra answers from the teacher’s material.",
    kind: "voice",
    tags: ["objection", "onboarding"],
    date: "2026-09-05",
  }),

  note({
    id: "sb-rb-1",
    businessId: "rigboss",
    project: "rigboss",
    title: "Public site vs the app",
    body: "Public catalog is rigboss.app and rigboss.io. Headline: “The operating system for every tractor.” Product app is app.rigboss.app. Do not overwrite the app with marketing. Apex rigboss.app is canonical. Sign-in points at the app.",
    kind: "decision",
    tags: ["urls", "marketing"],
    date: "2026-08-28",
  }),
  note({
    id: "sb-rb-2",
    businessId: "rigboss",
    project: "rigboss",
    title: "Trucker is $79. Hours stay on the ELD.",
    body: "Trucker is the existing Professional seat at $79. Current subscribers keep it. New Trucker checkouts are a 7-day trial, card required. Never say we replace the ELD. Hours stay on Motive, Samsara, or the Qualcomm they already run.",
    kind: "ban",
    tags: ["pricing", "eld"],
    date: "2026-07-20",
  }),
  note({
    id: "sb-rb-3",
    businessId: "rigboss",
    project: "rigboss",
    title: "Two buyers, two pages",
    body: "Owner-ops convert when Radar drafts the IFTA packet — the visor envelope is the $79 moment. Fleets convert on CSA live watch, not a quarterly PDF. Never mix the two on one page. “The last ELD you’ll ever need” killed a conversation in one line.",
    kind: "eval",
    tags: ["icp", "angle"],
    date: "2026-09-05",
  }),
  note({
    id: "sb-rb-4",
    businessId: "rigboss",
    project: "rigboss",
    title: "RigBoss voice",
    body: "Dock-language, not SaaS-language. Hands off the glass. Guards fire before the tractor leaves. Priced in public. Short sentences. No motivational posters. Banned: replace your ELD, TMS killer, Uber for trucks, disrupt freight, hustle harder.",
    kind: "voice",
    tags: ["voice", "bans"],
    date: "2026-09-05",
  }),
  note({
    id: "sb-rb-5",
    businessId: "rigboss",
    project: "rigboss",
    title: "Motive and Samsara are the ELD, not the enemy",
    body: "Both still sold as the ELD. Ops managers hear “replace” and walk. Every line must say hours stay on the ELD you already run. Sit beside it.",
    kind: "competitor",
    tags: ["motive", "samsara"],
    date: "2026-09-02",
  }),

  note({
    id: "sb-mc-1",
    businessId: "mechcorrect",
    project: "shopboss",
    title: "The wedge",
    body: "Tekmetric-class UX + FullBay-style leak-hunting + AI advisor. FullBay owns heavy-duty, Tekmetric owns advisor UX, Shopmonkey owns simple small shops. Demo on a photo of a leak, not a settings tour. Live at mechcorrect.app and mechcorrect.com.",
    kind: "decision",
    tags: ["positioning", "wedge"],
    date: "2026-07-27",
  }),
  note({
    id: "sb-mc-2",
    businessId: "mechcorrect",
    project: "shopboss",
    title: "Revenue leaks are the report",
    body: "Four tiles shops already have data for: unbilled tech time, findings never quoted, declined-work bank, close ratio. Declined work that never got a text is the leak. That photo is the demo.",
    kind: "fact",
    tags: ["reports", "angle"],
    date: "2026-07-27",
  }),
  note({
    id: "sb-mc-3",
    businessId: "mechcorrect",
    project: "shopboss",
    title: "Lost-follow-up beats AI headline",
    body: "“The work you found and never texted” drove fewer ad clicks than “the first shop platform with a brain,” and twice the demo requests from shops with more than three bays. Kill AI-as-headline if it has not closed. Starter is $199/mo with the advisor included.",
    kind: "eval",
    tags: ["creative", "headline"],
    date: "2026-09-05",
  }),
  note({
    id: "sb-mc-4",
    businessId: "mechcorrect",
    project: "shopboss",
    title: "CarSignal launched Aug 17 at $200/mo",
    body: "CarSignal is an all-in AI shop OS: booking, intake, diagnostics, estimates, parts, scheduling, messaging, invoicing, payments. Claims unlimited users, free migration, 30-day refund, 40+ shops. Undercuts if the all-in claim holds. Answer with leak-hunting and a real photo demo, not a feature list.",
    kind: "competitor",
    tags: ["carsignal", "scout"],
    date: "2026-08-19",
  }),
  note({
    id: "sb-mc-5",
    businessId: "mechcorrect",
    project: "shopboss",
    title: "Techs see no money",
    body: "Will’s Tekmetric walkthrough, Aug 16 2026: everything is there, but there has to be a divider between admin and tech. Techs see the job and tech time, never part cost or reports. Differentiator is My Hours — the technician got paid, not just the customer got charged.",
    kind: "decision",
    tags: ["tech-view", "will"],
    date: "2026-08-16",
  }),
  note({
    id: "sb-mc-6",
    businessId: "mechcorrect",
    project: "shopboss",
    title: "Mech Correct voice and bans",
    body: "Shop floor, not Silicon Valley. The pizza tracker for repairs. One price, no modules, no sales call. Banned as headlines: all-in-one, next-gen, AI-powered, synergy, rip and replace with no migration.",
    kind: "voice",
    tags: ["voice", "bans"],
    date: "2026-09-05",
  }),
];

export function searchBrain(
  notes: BrainNote[],
  query: string,
  selected: FilterId,
  kind: BrainKind | "all" = "all",
): BrainNote[] {
  const q = query.trim().toLowerCase();
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
  return notes.filter((n) => {
    if (selected !== "all" && n.businessId !== selected && n.businessId !== "all") return false;
    if (kind !== "all" && n.kind !== kind) return false;
    if (!tokens.length) return true;
    const hay = `${n.title} ${n.body} ${n.tags.join(" ")} ${n.kind} ${n.project}`.toLowerCase();
    return tokens.every((tok) => hay.includes(tok));
  });
}

export function mergeBrain(filed: BrainNote[] | undefined): BrainNote[] {
  const extra = Array.isArray(filed) ? filed : [];
  const seen = new Set(BRAIN_CORPUS.map((n) => n.id));
  return [...extra.filter((n) => !seen.has(n.id)), ...BRAIN_CORPUS];
}

export function brainContextFor(filter: FilterId, filed?: BrainNote[]): string {
  const all = searchBrain(mergeBrain(filed), "", filter);
  let rows: BrainNote[];
  if (filter === "all") {
    const cap = new Map<string, number>();
    rows = [];
    for (const n of all) {
      const used = cap.get(n.businessId) ?? 0;
      if (used >= 2) continue;
      cap.set(n.businessId, used + 1);
      rows.push(n);
    }
  } else {
    rows = all.slice(0, 10);
  }
  if (!rows.length) return "";
  return rows.map((n) => `- ${n.title}: ${n.body.slice(0, 220)}`).join("\n");
}

export function filedMemory(notes: BrainNote[] | undefined, filter: FilterId): string {
  const rows = searchBrain(Array.isArray(notes) ? notes : [], "", filter).slice(0, 6);
  if (!rows.length) return "";
  return rows.map((n) => `- ${n.title}: ${n.body.slice(0, 220)}`).join("\n");
}

export const BUSINESSES_FOR_BRAIN: { id: FilterId; label: string }[] = [
  { id: "all", label: "House" },
  { id: "cloudforest", label: "Cloud Forest" },
  { id: "dojozeus", label: "DojoZeus" },
  { id: "lyceum", label: "Lyceum" },
  { id: "rigboss", label: "RigBoss" },
  { id: "mechcorrect", label: "Mech Correct" },
];

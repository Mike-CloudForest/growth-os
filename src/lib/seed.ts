import type {
  AgentJob,
  CompanyDesk,
  CompetitorMove,
  ContentPiece,
  CreativeTest,
  EvalNote,
  FilterId,
  Insight,
  Kpi,
  Objection,
  SearchAsset,
  Signal,
  WeeklyBrief,
} from "./types";

export const WEEK_OF = "September 1–5, 2026";

export const PORTFOLIO_KPIS: Kpi[] = [
  { label: "Qualified replies", value: "19", delta: "+6 vs last week", tone: "up" },
  { label: "Conversations", value: "11", delta: "3 booked this week", tone: "up" },
  { label: "Tests won", value: "4 / 11", delta: "36% win rate", tone: "flat" },
  { label: "Citation gaps", value: "7", delta: "2 drafted, not shipped", tone: "down" },
];

export const WEEKLY_BRIEF: WeeklyBrief = {
  weekOf: WEEK_OF,
  headline: "The converting language is specific. The click language is generic. Kill the generic.",
  body: `Five businesses. One pattern.

Cloud Forest: three $49 enrollments this week. Every converting parent used some version of “I need him to focus,” never “I want him to fight.” Eight visitor-pass signers still have not picked a class. The leak is the 72 hours after the waiver, not the front door.

DojoZeus: the stack-replacement angle produced four owner conversations. “AI for your dojo” produced instructor clicks and zero buyers. Two schools posted a front-desk hiring ad — that is the trigger. Ban the AI headline.

Lyceum: teachers stall after they build and before they open the doors. Kajabi compare is live. 85 real visitors this week, 0 real Lyra questions. Ownership is the buy.

RigBoss: owner-ops convert on Radar drafting the IFTA packet. Fleets convert on CSA live watch. Anyone who hears “replace your ELD” walks. That line is now a hard ban in every agent.

Mech Correct: the lost-follow-up angle drove fewer ad clicks than “AI diagnostics,” and twice as many demo requests from shops with more than three bays. Same pattern as the HVAC example. Ship the declined-work calculator. Kill the AI-as-headline tests.`,
  doNext: [
    { label: "Approve 8 high-fit outbound drafts", href: "/outbound" },
    { label: "Ship the Mech Correct declined-work calculator", href: "/content" },
    { label: "Rewrite DojoZeus ads off the AI headline", href: "/creative" },
    { label: "Read this week’s SuperBrain extract", href: "/brain" },
  ],
};

export const COMPANY_DESKS: Record<Exclude<FilterId, "all">, CompanyDesk> = {
  cloudforest: {
    kpis: [
      { label: "$49 enrollments", value: "3", delta: "+1 vs last week", tone: "up" },
      { label: "Passes not trained", value: "8", delta: "72-hour leak", tone: "down" },
      { label: "Show rate", value: "43%", delta: "6 of 14 trained", tone: "flat" },
      { label: "Citation gaps", value: "1", delta: "Tai Chi after a fall", tone: "down" },
    ],
    brief: {
      weekOf: WEEK_OF,
      headline: "Parents buy a known name. The leak is the waiver, not the ad.",
      body: `Three converting parents this week all said some version of “I need him to focus.” None said “I want him to fight.” The combat ad got more clicks and one enrollment.

Eight visitor-pass signers never picked a class. Same-day class pick plus a 24-hour text is the system, not a prettier landing page.

Adults 40+ are converting on Tai Chi after a fall in the family. That page is still a draft.`,
      doNext: [
        { label: "Reply in the Greensboro parents thread", href: "/outbound" },
        { label: "Ship ‘After a parent falls’", href: "/content" },
        { label: "Draft the Tai Chi citation page", href: "/search" },
      ],
    },
  },
  dojozeus: {
    kpis: [
      { label: "Owner conversations", value: "4", delta: "stack-replacement angle", tone: "up" },
      { label: "AI-headline closes", value: "0", delta: "340 instructor clicks", tone: "down" },
      { label: "Founding seats", value: "Unverified", delta: "20-school cap", tone: "flat" },
      { label: "High-fit queued", value: "3", delta: "front-desk hiring trigger", tone: "up" },
    ],
    brief: {
      weekOf: WEEK_OF,
      headline: "Owners buy the Sunday report. Instructors click on Zeus.",
      body: `“You teach. It runs.” produced four owner conversations. “Meet Zeus, the AI that runs your school” produced 340 clicks, three conversations, zero buyers. Kill the AI headline.

Two schools posted a front-desk job this week. That listing is the symptom of the stack. Drafts are sitting in queued.

The demo that books opens on the at-risk list, not the belt editor. Red Palm said it out loud on the screen share.`,
      doNext: [
        { label: "Approve Iron Gate and Southside", href: "/outbound" },
        { label: "Kill the AI-headline tests", href: "/creative" },
        { label: "Ship the Mindbody comparison page", href: "/search" },
      ],
    },
  },
  lyceum: {
    kpis: [
      { label: "Schools built, unopened", value: "9", delta: "stall after pretty", tone: "down" },
      { label: "Ownership-angle convos", value: "18", delta: "5 closes", tone: "up" },
      { label: "Real visitors, 7d", value: "85", delta: "0 real Lyra questions", tone: "flat" },
      { label: "Kajabi page", value: "Live", delta: "/vs/kajabi shipped", tone: "up" },
    ],
    brief: {
      weekOf: WEEK_OF,
      headline: "They stall after they build. Ownership is the buy. The tutor is the story they tell a friend.",
      body: `Nine directors have a school that looks finished and have told nobody it exists. “I’m scared it will look empty.” Empty is a week, not a verdict. The productized push is open night, not another template.

Kajabi compare is live. Academy at $249 with 0% share is the answer. 85 real visitors this week, 0 real Lyra questions — the leak is the page, not awareness.

Do not dunk on Teachable in outbound. Talk about the cut, then the list leaving with them.`,
      doNext: [
        { label: "Sit with Mara while she picks a name", href: "/outbound" },
        { label: "Cite the Kajabi page, then ask for a Lyra question", href: "/search" },
        { label: "Keep the ownership hook, pause the tutor wow", href: "/creative" },
      ],
    },
  },
  rigboss: {
    kpis: [
      { label: "Trucker trials", value: "6", delta: "visor / IFTA angle", tone: "up" },
      { label: "Fleet conversations", value: "2", delta: "CSA live, not PDF", tone: "up" },
      { label: "ELD-rip closes", value: "0", delta: "hard ban now", tone: "down" },
      { label: "IFTA citation", value: "Gap", delta: "visor-week intent", tone: "down" },
    ],
    brief: {
      weekOf: WEEK_OF,
      headline: "Two buyers. Two pages. Never mix them. Never say ELD.",
      body: `Owner-ops convert when Radar drafts the quarter. D. Padilla posted the visor. That is the $79 moment. Send a clip, not a demo call.

Fleets convert on CSA live. Kline is hiring a safety clerk to sit on last quarter’s dump. Show the board. Hours stay on the ELD they already run.

“The last ELD you’ll ever need” killed a conversation in one line. It is a hard ban in every agent.`,
      doNext: [
        { label: "Send Padilla the four-minute clip", href: "/outbound" },
        { label: "Draft the IFTA citation answer", href: "/search" },
        { label: "Keep the visor tests running", href: "/creative" },
      ],
    },
  },
  mechcorrect: {
    kpis: [
      { label: "Demo requests, 3+ bays", value: "2×", delta: "lost-follow-up vs AI", tone: "up" },
      { label: "Declined-work convos", value: "16", delta: "5 closes", tone: "up" },
      { label: "AI-headline CTR", value: "2.6%", delta: "wrong ICP", tone: "flat" },
      { label: "Follow-up citation", value: "Gap", delta: "highest intent", tone: "down" },
    ],
    brief: {
      weekOf: WEEK_OF,
      headline: "Fewer clicks. Twice the demos. Same pattern as the HVAC example.",
      body: `“The work you found and never texted” drove fewer ad clicks than “the first shop platform with a brain,” and twice as many demo requests from shops with more than three bays.

Harbor & Pine replied to a Google review three weeks late: “we’ll follow up on the estimate.” West End is hiring a BDC. Both are the leak. Do not quote the review at them.

Open every live demo on a photo of a leak, not a settings tour. Ship the calculator.`,
      doNext: [
        { label: "Approve Harbor & Pine and West End", href: "/outbound" },
        { label: "Ship the declined-work calculator", href: "/content" },
        { label: "Kill AI-as-headline if it has not closed by Friday", href: "/creative" },
      ],
    },
  },
};

export const COMPETITORS: CompetitorMove[] = [
  {
    id: "cm-dz-1",
    businessId: "dojozeus",
    competitor: "Zen Planner",
    move: "Public outage thread, Thursday. Owners in comments doing the Sunday report by hand.",
    implication: "Engage the commenters, do not dunk. Red Palm is already queued.",
    date: "Sep 4",
  },
  {
    id: "cm-dz-2",
    businessId: "dojozeus",
    competitor: "Mindbody",
    move: "Price bump circulating in owner groups. ‘We just signed for a year’ is the objection, not the fee.",
    implication: "Migration-in-place and month-to-month out beat $99 vs $169.",
    date: "Sep 3",
  },
  {
    id: "cm-ly-1",
    businessId: "lyceum",
    competitor: "Kajabi",
    move: "Still no public 0% revenue-share tier. Entry is $149 before you have members.",
    implication: "The comparison page is live. Cite it. Do not sneer.",
    date: "Sep 5",
  },
  {
    id: "cm-rb-1",
    businessId: "rigboss",
    competitor: "Motive / Samsara",
    move: "Both still sold as the ELD. Ops managers hear ‘replace’ and walk.",
    implication: "Every line must say hours stay on the ELD you already run.",
    date: "Sep 2",
  },
  {
    id: "cm-mc-1",
    businessId: "mechcorrect",
    competitor: "Tekmetric + shop-AI add-on",
    move: "AI diagnostics sold as a ~$179/mo extra. Photo analysis lives in a second app.",
    implication: "Price in public. Advisor is in the $199. Demo on a photo.",
    date: "Sep 4",
  },
  {
    id: "cm-mc-2",
    businessId: "mechcorrect",
    competitor: "CarSignal",
    move: "Launched Aug 17 as a $200/mo all-in AI shop OS. Claims unlimited users, free migration, 40+ shops.",
    implication: "Undercuts if the all-in claim holds. Answer with leak-hunting and a photo demo, not a feature list.",
    date: "Aug 19",
  },
  {
    id: "cm-cf-1",
    businessId: "cloudforest",
    competitor: "Local chain school",
    move: "Fall sports push: ‘ninja’ and ‘confidence’ on Facebook. High clicks, known churn.",
    implication: "Do not compete on combat. Compete on a known name and small classes.",
    date: "Sep 1",
  },
];

export const OBJECTIONS: Objection[] = [
  {
    id: "ob-dz-1",
    businessId: "dojozeus",
    line: "We just signed Mindbody for a year.",
    count: 5,
    counter: "Sit beside them until March. Founding eligibility depends on availability. The $99 monthly rate stays locked while continuously subscribed.",
  },
  {
    id: "ob-dz-2",
    businessId: "dojozeus",
    line: "Can my assistant run it? I don’t have time.",
    count: 4,
    counter: "You are talking to an instructor. Find the owner. Open the demo on at-risk students.",
  },
  {
    id: "ob-ly-1",
    businessId: "lyceum",
    line: "I’m scared it will look empty.",
    count: 9,
    counter: "Open night is the product. Empty is a week. The hall is theirs either way.",
  },
  {
    id: "ob-ly-2",
    businessId: "lyceum",
    line: "Does Kajabi take a cut of my members?",
    count: 6,
    counter: "That is the only question. Academy is $249, 0% forever, Stripe is yours.",
  },
  {
    id: "ob-rb-1",
    businessId: "rigboss",
    line: "I’m not ripping the ELD out of the fleet.",
    count: 4,
    counter: "We never ask. Hours stay on Motive / Samsara / the Qualcomm.",
  },
  {
    id: "ob-mc-1",
    businessId: "mechcorrect",
    line: "We already have Shopmonkey / Tekmetric.",
    count: 7,
    counter: "Declined work still dies in those stacks. Show one ticket, same-afternoon text.",
  },
  {
    id: "ob-cf-1",
    businessId: "cloudforest",
    line: "I meant to come. Life got loud.",
    count: 8,
    counter: "Pick the class on the waiver. Text at 24 hours. Do not wait for them to remember.",
  },
];

export const EVALS: EvalNote[] = [
  {
    id: "ev-1",
    businessId: "mechcorrect",
    verdict: "double",
    title: "Lost-follow-up angle",
    detail: "Fewer clicks. Twice the demo requests from 3+ bay shops. Ship the calculator.",
  },
  {
    id: "ev-2",
    businessId: "dojozeus",
    verdict: "kill",
    title: "‘AI for your dojo’ headline",
    detail: "340 clicks, 0 conversions. Instructors, not owners. Ban it in the agent.",
  },
  {
    id: "ev-3",
    businessId: "cloudforest",
    verdict: "double",
    title: "Known-by-name",
    detail: "22 conversations, 6 conversions. Combat ad had more clicks and one enrollment.",
  },
  {
    id: "ev-4",
    businessId: "rigboss",
    verdict: "kill",
    title: "Replace-your-ELD line",
    detail: "One conversation, zero closes. Hard ban. Hours stay on the ELD they run.",
  },
  {
    id: "ev-5",
    businessId: "lyceum",
    verdict: "double",
    title: "Ownership hook",
    detail: "18 conversations, 5 closes. Tutor-wow is the story after they buy.",
  },
  {
    id: "ev-6",
    businessId: "lyceum",
    verdict: "watch",
    title: "Tutor-wow ads",
    detail: "High CTR, one close. Keep a small spend. Do not let it eat the ownership tests.",
  },
  {
    id: "ev-7",
    businessId: "cloudforest",
    verdict: "kill",
    title: "Combat / confidence ad",
    detail: "Wrong language. Parents said focus. The chain already owns ninja.",
  },
  {
    id: "ev-8",
    businessId: "mechcorrect",
    verdict: "watch",
    title: "AI diagnostics headline",
    detail: "Pretty CTR, weaker closes. Kill Friday if it has not produced a 3+ bay demo.",
  },
  {
    id: "ev-9",
    businessId: "dojozeus",
    verdict: "double",
    title: "Stack replacement",
    detail: "You teach. It runs. Four owner conversations. Open demos on the at-risk list.",
  },
  {
    id: "ev-10",
    businessId: "rigboss",
    verdict: "double",
    title: "Visor envelope",
    detail: "You drive. Radar keeps the books. Three trucker trials from the FB groups.",
  },
];

export function deskFor(selected: FilterId): { kpis: Kpi[]; brief: WeeklyBrief } {
  if (selected === "all") return { kpis: PORTFOLIO_KPIS, brief: WEEKLY_BRIEF };
  return COMPANY_DESKS[selected];
}

export const INSIGHTS: Insight[] = [
  {
    id: "i-cf-1",
    businessId: "cloudforest",
    claim: "Converting parents buy focus and a known name, not combat.",
    implication: "Lead with the second-class name promise. Put ‘kung fu’ second.",
    count: 7,
    trend: "up",
    evidence: [
      {
        quote: "I just need him to focus. I don’t care if he ever competes.",
        source: "Trial call · Maya R., parent of 8-year-old",
        date: "Sep 3",
      },
      {
        quote: "The instructor knew her name the second week. That’s why we stayed.",
        source: "Google review · Derek H.",
        date: "Aug 28",
      },
      {
        quote: "We tried a chain. They didn’t know who he was.",
        source: "Front desk note after visitor pass",
        date: "Sep 2",
      },
    ],
  },
  {
    id: "i-cf-2",
    businessId: "cloudforest",
    claim: "The leak is 72 hours after the waiver, not the first visit.",
    implication: "A same-day class pick and a 24-hour text beat a prettier landing page.",
    count: 8,
    trend: "down",
    evidence: [
      {
        quote: "Signed the visitor pass Tuesday. Never picked a class.",
        source: "Waiver log · 8 records this week",
        date: "Sep 1–5",
      },
      {
        quote: "I meant to come. Life got loud.",
        source: "Win-back text reply · unsigned",
        date: "Sep 4",
      },
    ],
  },
  {
    id: "i-cf-3",
    businessId: "cloudforest",
    claim: "Adults 40+ convert on Tai Chi for balance after a fall in the family.",
    implication: "A page that says ‘after a parent falls’ will out-convert ‘learn Tai Chi.’",
    count: 4,
    trend: "new",
    evidence: [
      {
        quote: "My mother fell in July. I am not waiting until that’s me.",
        source: "Tai Chi for Health intro · Linda K.",
        date: "Sep 2",
      },
    ],
  },
  {
    id: "i-dz-1",
    businessId: "dojozeus",
    claim: "Owners buy stack replacement. Instructors click on AI.",
    implication: "Every public line must be speakable by a tired owner at 9:40pm after teaching.",
    count: 11,
    trend: "up",
    evidence: [
      {
        quote: "I’m on Mindbody, a website guy, Mailchimp, and a Google Sheet. It’s $600 a month and still broken.",
        source: "Founding-offer call · Iron Gate BJJ, 180 students",
        date: "Sep 3",
      },
      {
        quote: "The AI thing is cool. Can my assistant run it? I don’t have time.",
        source: "Chat on dojozeus.com · instructor, not owner",
        date: "Sep 4",
      },
    ],
  },
  {
    id: "i-dz-2",
    businessId: "dojozeus",
    claim: "The demo that books is Zeus flagging a student who quietly quit.",
    implication: "Open the demo on the at-risk list, not the belt ladder.",
    count: 3,
    trend: "new",
    evidence: [
      {
        quote: "Wait — it already knows who stopped showing up? That’s the job I do on Sundays.",
        source: "Screen share · Red Palm Karate",
        date: "Sep 2",
      },
    ],
  },
  {
    id: "i-dz-3",
    businessId: "dojozeus",
    claim: "‘We just signed Mindbody for a year’ is the real objection, not price.",
    implication: "A migration-in-place story and a month-to-month out matter more than $99 vs $169.",
    count: 5,
    trend: "steady",
    evidence: [
      {
        quote: "Contract through March. I hate it. I’m not paying double until then.",
        source: "Outbound reply · Southside Taekwondo",
        date: "Sep 1",
      },
    ],
  },
  {
    id: "i-ly-1",
    businessId: "lyceum",
    claim: "They stall after they build and before they open the doors.",
    implication: "The productized push is ‘open night,’ not another template.",
    count: 9,
    trend: "up",
    evidence: [
      {
        quote: "The school is pretty. I have not told anyone it exists.",
        source: "Director log · ceramicist, 0 members",
        date: "Sep 4",
      },
      {
        quote: "I’m scared it will look empty.",
        source: "Support thread · jazz piano school",
        date: "Sep 2",
      },
    ],
  },
  {
    id: "i-ly-2",
    businessId: "lyceum",
    claim: "Ownership is the buy. The AI tutor is the wow they tell a friend.",
    implication: "Kajabi-comparison page first. Tutor clips second.",
    count: 6,
    trend: "up",
    evidence: [
      {
        quote: "Does Kajabi take a cut of my members? That’s the only question.",
        source: "Sales note · woodworker, 40-person list",
        date: "Sep 3",
      },
    ],
  },
  {
    id: "i-rb-1",
    businessId: "rigboss",
    claim: "Owner-ops convert on Radar drafting IFTA. Fleets convert on CSA live.",
    implication: "Two pages, two angles. Do not mix them.",
    count: 8,
    trend: "up",
    evidence: [
      {
        quote: "If it drafts the quarter and I just confirm, that’s the visor envelope retired.",
        source: "Trucker trial · 2 trucks, I-40",
        date: "Sep 3",
      },
      {
        quote: "I don’t need another ELD. I need to see BASIC before the CSA dump.",
        source: "Fleet Yard call · 18 seats",
        date: "Sep 4",
      },
    ],
  },
  {
    id: "i-rb-2",
    businessId: "rigboss",
    claim: "‘Replace your ELD’ kills the conversation in one line.",
    implication: "Hard ban. The line is ‘hours stay on the ELD you already run.’",
    count: 4,
    trend: "down",
    evidence: [
      {
        quote: "I’m not ripping Motive out of 40 trucks. You people always want a rip.",
        source: "Cold outbound · rejected",
        date: "Sep 1",
      },
    ],
  },
  {
    id: "i-mc-1",
    businessId: "mechcorrect",
    claim: "Declined work that never got a text is the revenue leak.",
    implication: "Calculator + follow-up angle. AI-as-headline is a click trap.",
    count: 12,
    trend: "up",
    evidence: [
      {
        quote: "We find the work. We print the estimate. They say later. Later never comes.",
        source: "Demo · 4-bay independent, service writer",
        date: "Sep 2",
      },
      {
        quote: "If the text went out in my voice the same afternoon, half of those would come back.",
        source: "Same call, owner chiming in",
        date: "Sep 2",
      },
    ],
  },
  {
    id: "i-mc-2",
    businessId: "mechcorrect",
    claim: "The photo of the leak is the 40-second demo. Forums are the old job.",
    implication: "Open every live demo on a photo, not a settings tour.",
    count: 5,
    trend: "new",
    evidence: [
      {
        quote: "My tech left the bay to Google that this morning. That’s the waste.",
        source: "Founding-shop call · 2 bays",
        date: "Sep 5",
      },
    ],
  },
];

export const CONTENT: ContentPiece[] = [
  {
    id: "c-cf-1",
    businessId: "cloudforest",
    kind: "post",
    title: "The instructor knows your name by the second class",
    hook: "We do not run a chain. We run a private club in Greensboro since 1969.",
    body: "If you have been to a school where your child was a number on a belt chart, this is the other room. Small classes. Eighteen instructors. The first visit is free. Pick a class. Come train. Decide after.",
    status: "winner",
    metricLabel: "Visitor passes from this line",
    metricValue: "11 in 14 days",
  },
  {
    id: "c-cf-2",
    businessId: "cloudforest",
    kind: "landing",
    title: "After a parent falls",
    hook: "Tai Chi for people who watched someone they love go down.",
    body: "Balance, walking, chair. Martial roots intact. Beginners in every adult class. First visit free.",
    status: "ready",
    metricLabel: "Not shipped",
    metricValue: "Draft from Sep 2 call",
  },
  {
    id: "c-dz-1",
    businessId: "dojozeus",
    kind: "post",
    title: "You teach. It runs.",
    hook: "Tuition collects itself. The kiosk takes the line. Zeus tells you who quietly quit.",
    body: "Schools assemble billing, a website, email, courses, and a community app for $300 to $1,000 a month. DojoZeus replaces the stack. Founding twenty lock $99. You stay on the floor.",
    status: "winner",
    metricLabel: "Owner replies",
    metricValue: "9",
  },
  {
    id: "c-dz-2",
    businessId: "dojozeus",
    kind: "email",
    title: "Sunday report, without Sunday",
    hook: "Two students have missed three straight weeks. Draft the parent email?",
    body: "This is the Zeus moment. Open the demo here, not on the belt editor.",
    status: "shipped",
    metricLabel: "Demo booked from email",
    metricValue: "2",
  },
  {
    id: "c-ly-1",
    businessId: "lyceum",
    kind: "post",
    title: "Your name on the door",
    hook: "Kajabi starts at $149. You do not own the hall. Lyceum lets you build free and keep the list.",
    body: "An AI tutor on every lesson, answering only from your material. Academy is $249 with 0% share forever. Open the doors. Empty is a week, not a verdict.",
    status: "ready",
  },
  {
    id: "c-ly-2",
    businessId: "lyceum",
    kind: "email",
    title: "Open night",
    hook: "The school is pretty. Tell twelve people it exists.",
    body: "A one-week calendar. A first lesson that does not require a funnel. The tutor can wait until someone is actually in the room.",
    status: "draft",
  },
  {
    id: "c-rb-1",
    businessId: "rigboss",
    kind: "script",
    title: "Hours stay on the ELD you already run",
    hook: "We do not replace Motive, Samsara, or the Qualcomm. Radar keeps the books in the cab.",
    body: "Fuel, IFTA, 2290, the visor envelope. You confirm. The quarter files. $79 a truck, no setup, one to four trucks.",
    status: "winner",
    metricLabel: "Trucker trials",
    metricValue: "6",
  },
  {
    id: "c-mc-1",
    businessId: "mechcorrect",
    kind: "landing",
    title: "The work you found and never texted",
    hook: "Declined work is not a maybe. It is a follow-up you did not send.",
    body: "Same afternoon, in the shop’s voice, with the photo attached. Founding shops lock launch pricing. No modules.",
    status: "ready",
    metricLabel: "Demo requests vs AI headline",
    metricValue: "2× from 3+ bay shops",
  },
  {
    id: "c-mc-2",
    businessId: "mechcorrect",
    kind: "video",
    title: "Snap the leak",
    hook: "Forty seconds. A photo. A plan. The tech stays in the bay.",
    body: "P0171 decoded, 17 recalls checked, diagnostic plan in nine seconds. Grounded in this shop’s past fixes, not a forum.",
    status: "shipped",
  },
];

export const SIGNALS: Signal[] = [
  {
    id: "s-dz-1",
    businessId: "dojozeus",
    account: "Iron Gate BJJ · Austin",
    role: "Owner-instructor, 180 students",
    trigger: "Posted a front-desk job. ‘Need someone who can run billing too.’",
    whyNow: "The desk person is the stack. They are hiring the symptom.",
    draft:
      "Saw the front-desk listing. Most of that job is tuition, waivers, and who quietly quit — which is the Sunday work Zeus already does. Happy to show the at-risk list on your roster, no pitch deck. —",
    status: "queued",
    fit: "high",
  },
  {
    id: "s-dz-2",
    businessId: "dojozeus",
    account: "Southside Taekwondo · Atlanta",
    role: "Owner, Mindbody through March",
    trigger: "Google review: ‘front desk always has a line.’",
    whyNow: "Pain is public. Contract is the objection. Offer a March migration, not a rip.",
    draft:
      "The line at the desk is what the kiosk is for. You are on Mindbody through March. We can sit beside you until then, then cut the stack. Founding pricing is $99 per month for the first 20 schools, locked while continuously subscribed. Check availability before starting.",
    status: "queued",
    fit: "high",
  },
  {
    id: "s-dz-3",
    businessId: "dojozeus",
    account: "Red Palm Karate · Raleigh",
    role: "Owner, 90 students",
    trigger: "Commented on a Zen Planner outage thread.",
    whyNow: "Outage is a timing gift. Do not gloat.",
    draft:
      "Saw the outage thread. When the office tool blinks, the floor still has to run. If you want a 12-minute look at check-in that lives on a tablet at the door, I’ll make time this week. —",
    status: "approved",
    fit: "high",
  },
  {
    id: "s-ly-1",
    businessId: "lyceum",
    account: "Mara Chen · ceramics",
    role: "Teaches from a garage kiln, 1.2k IG",
    trigger: "Posted ‘I should just put this on Kajabi and be done.’",
    whyNow: "She is about to pay $149 for a hall she will not own.",
    draft:
      "You can build your school free with your name on the door. Review the paid plan and its trial terms before subscribing. I can walk you through setting up your first lesson.",
    status: "queued",
    fit: "high",
  },
  {
    id: "s-ly-2",
    businessId: "lyceum",
    account: "Hollow Grain Woodcraft",
    role: "Owner, Teachable + Gumroad",
    trigger: "Tweet: ‘Teachable took another cut of a $40 lesson. Exhausted.’",
    whyNow: "The 0% Academy plan is the exact reply. Do not dunk on Teachable.",
    draft:
      "The cut is the product. Academy is $249 with 0% of member revenue, forever, and the list leaves with you. Happy to walk the move without a migration horror story. —",
    status: "sent",
    fit: "high",
  },
  {
    id: "s-ly-3",
    businessId: "lyceum",
    account: "North Room Jazz",
    role: "Piano teacher, 0 members, school built",
    trigger: "Support: ‘I’m scared it will look empty.’",
    whyNow: "The stall. Open night, not another template.",
    draft:
      "Empty is a week. Twelve people who already like your playing is a room. I can sit with you for the first open night and we do not touch the tutor until someone is actually in there. —",
    status: "replied",
    fit: "high",
  },
  {
    id: "s-rb-1",
    businessId: "rigboss",
    account: "Kline Freight · 18 trucks",
    role: "Ops manager",
    trigger: "Hiring a ‘CSA / safety clerk’ on Indeed.",
    whyNow: "They are staffing a quarterly PDF. CSA live is the product.",
    draft:
      "A safety clerk for BASIC is a person sitting on last quarter’s dump. Fleet watches the seven BASICs as they move. Hours stay on the ELD you already run. I can show the board on your roster size, no rip. —",
    status: "queued",
    fit: "high",
  },
  {
    id: "s-rb-2",
    businessId: "rigboss",
    account: "D. Padilla · 2 trucks",
    role: "Owner-operator",
    trigger: "Posted a photo of a visor stuffed with fuel tickets. ‘IFTA week.’",
    whyNow: "This is the $79 moment. Radar drafts the quarter.",
    draft:
      "That visor is the product. Radar already knows the fuel, the miles, the states. You confirm the quarter. $79 a truck, no setup. I can send a 4-minute clip of the draft, not a demo call. —",
    status: "replied",
    fit: "high",
  },
  {
    id: "s-rb-3",
    businessId: "rigboss",
    account: "Piedmont Haul · 6 trucks",
    role: "Owner, just hit Fleet size",
    trigger: "Asked in a group: ‘when does IFTA stop being a visor and start being a person.’",
    whyNow: "The 5-truck line. Fleet Yard, not Trucker.",
    draft:
      "Five trucks is the line. Trucker is $79 until four. Fleet Yard is the board plus a person who already knows IFTA. Hours still stay on the ELD. I can show Yard on six seats without a rip. —",
    status: "approved",
    fit: "medium",
  },
  {
    id: "s-mc-1",
    businessId: "mechcorrect",
    account: "Harbor & Pine Auto · 4 bays",
    role: "Owner + service writer",
    trigger: "Google review replied: ‘we’ll follow up on the estimate.’ Three weeks old.",
    whyNow: "Public proof of the leak. Do not quote the review at them.",
    draft:
      "Follow-up that depends on a person remembering is the leak. Same-afternoon texts, in your voice, on declined work — that’s the founding-shop pitch. I can show it on a ticket, not a tour. —",
    status: "queued",
    fit: "high",
  },
  {
    id: "s-mc-2",
    businessId: "mechcorrect",
    account: "West End Automotive · 6 bays",
    role: "Service manager, Shopmonkey",
    trigger: "Job post for a ‘BDC / follow-up specialist.’",
    whyNow: "Hiring the symptom. Show declined-work automation.",
    draft:
      "A BDC hire is often declined work plus ‘is it done yet’ calls. Status tracker and same-day declined texts are in the $199 plan, no module. If you want, I’ll run one of last month’s declined tickets through it. —",
    status: "queued",
    fit: "high",
  },
  {
    id: "s-mc-3",
    businessId: "mechcorrect",
    account: "Elm Street Repair · 3 bays",
    role: "Owner, Tekmetric + a $179 AI app",
    trigger: "Commented ‘another login’ on a shop-AI thread.",
    whyNow: "The add-on tax. Advisor is in the plan.",
    draft:
      "The second login is the tell. Advisor reads the photo inside the RO, grounded in this shop’s past fixes. $199, no module, founding price locks. I can run one of this morning’s codes live. —",
    status: "sent",
    fit: "high",
  },
  {
    id: "s-cf-1",
    businessId: "cloudforest",
    account: "Greensboro Parents FB · 12k members",
    role: "Local parent group",
    trigger: "Thread: ‘need something for my 7-year-old besides screens and soccer.’",
    whyNow: "Focus language, not combat language. Reply as the school, not an ad.",
    draft:
      "If you want a room where the instructor knows his name by the second class, first visit is free. Pick any class on the schedule. We are on Gate City Blvd, private club since 1969. No hard sell after. —",
    status: "queued",
    fit: "high",
  },
  {
    id: "s-cf-2",
    businessId: "cloudforest",
    account: "Linda K. · adult intro",
    role: "Daughter of a parent who fell",
    trigger: "Stayed after Tai Chi for Health. Has not enrolled.",
    whyNow: "The ‘after a parent falls’ page is still a draft. She is the reader.",
    draft:
      "You said you are not waiting until that’s you. First month is $49. Same class, same instructors. I can hold a spot Tuesday or Thursday. —",
    status: "replied",
    fit: "high",
  },
];

export const TESTS: CreativeTest[] = [
  {
    id: "t-cf-1",
    businessId: "cloudforest",
    angle: "Known by name",
    hook: "The instructor knows your name by the second class.",
    surface: "Meta · Greensboro parents 28–45",
    impressions: 18420,
    clicks: 312,
    conversations: 22,
    conversions: 6,
    status: "won",
  },
  {
    id: "t-cf-2",
    businessId: "cloudforest",
    angle: "Combat / confidence",
    hook: "Real kung fu. Real discipline. Start this week.",
    surface: "Meta · same audience",
    impressions: 17650,
    clicks: 401,
    conversations: 9,
    conversions: 1,
    status: "lost",
  },
  {
    id: "t-dz-1",
    businessId: "dojozeus",
    angle: "Replace the stack",
    hook: "You teach. It runs. One brain for belts, tuition, and the door.",
    surface: "LinkedIn · school owners",
    impressions: 9400,
    clicks: 188,
    conversations: 14,
    conversions: 4,
    status: "won",
  },
  {
    id: "t-dz-2",
    businessId: "dojozeus",
    angle: "AI for your dojo",
    hook: "Meet Zeus, the AI that runs your martial arts school.",
    surface: "LinkedIn · school owners + instructors",
    impressions: 12100,
    clicks: 340,
    conversations: 3,
    conversions: 0,
    status: "lost",
  },
  {
    id: "t-ly-1",
    businessId: "lyceum",
    angle: "Ownership",
    hook: "Your name on the door. Your list leaves with you.",
    surface: "X + IG · craft teachers",
    impressions: 22000,
    clicks: 510,
    conversations: 18,
    conversions: 5,
    status: "won",
  },
  {
    id: "t-ly-2",
    businessId: "lyceum",
    angle: "AI tutor wow",
    hook: "An AI tutor on every lesson, only from your material.",
    surface: "X + IG · same",
    impressions: 24100,
    clicks: 890,
    conversations: 7,
    conversions: 1,
    status: "running",
  },
  {
    id: "t-rb-1",
    businessId: "rigboss",
    angle: "Visor envelope",
    hook: "You drive. Radar keeps the books.",
    surface: "FB groups · owner-ops",
    impressions: 8600,
    clicks: 204,
    conversations: 11,
    conversions: 3,
    status: "won",
  },
  {
    id: "t-rb-2",
    businessId: "rigboss",
    angle: "Replace the ELD",
    hook: "The last ELD you’ll ever need.",
    surface: "FB groups · owner-ops",
    impressions: 8100,
    clicks: 96,
    conversations: 1,
    conversions: 0,
    status: "lost",
  },
  {
    id: "t-mc-1",
    businessId: "mechcorrect",
    angle: "Lost follow-up",
    hook: "The work you found and never texted.",
    surface: "Meta · shop owners 3+ bays",
    impressions: 11200,
    clicks: 147,
    conversations: 16,
    conversions: 5,
    status: "won",
  },
  {
    id: "t-mc-2",
    businessId: "mechcorrect",
    angle: "AI diagnostics headline",
    hook: "The first shop platform with a brain.",
    surface: "Meta · shop owners",
    impressions: 15800,
    clicks: 412,
    conversations: 8,
    conversions: 2,
    status: "running",
  },
  {
    id: "t-mc-3",
    businessId: "mechcorrect",
    angle: "No sales call",
    hook: "Set up in ten minutes. No demo-gated pricing.",
    surface: "Search · shop management software",
    impressions: 4300,
    clicks: 190,
    conversations: 9,
    conversions: 2,
    status: "running",
  },
];

export const SEARCH_ASSETS: SearchAsset[] = [
  {
    id: "a-cf-1",
    businessId: "cloudforest",
    query: "kung fu classes Greensboro NC",
    intent: "Local parent, this week.",
    answer:
      "Cloud Forest Martial Arts Institute, 719 W Gate City Blvd. Private club since 1969. First visit free. $49 first month.",
    status: "cited",
  },
  {
    id: "a-cf-2",
    businessId: "cloudforest",
    query: "Tai Chi for seniors after a fall",
    intent: "Adult child of a parent who fell.",
    answer:
      "Tai Chi for Health at Cloud Forest — walking, chair, combat roots intact. Beginners in every adult class.",
    status: "gap",
  },
  {
    id: "a-dz-1",
    businessId: "dojozeus",
    query: "Mindbody alternative for martial arts school",
    intent: "Owner shopping a stack replacement.",
    answer:
      "DojoZeus replaces billing, website, email, courses, and community. Founding $99/mo, then $169. Zeus flags students who quietly quit.",
    status: "drafted",
  },
  {
    id: "a-dz-2",
    businessId: "dojozeus",
    query: "best martial arts school management software 2026",
    intent: "Comparison query. AI overviews.",
    answer: "Needs a cited comparison: Mindbody, Zen Planner, Spark, DojoZeus. Price in public.",
    status: "gap",
  },
  {
    id: "a-ly-1",
    businessId: "lyceum",
    query: "Kajabi vs cheaper alternative no revenue share",
    intent: "Teacher about to subscribe.",
    answer:
      "Lyceum Academy is $249/mo with 0% of member revenue forever. Build free until you open the doors. The Kajabi compare page is live.",
    status: "drafted",
  },
  {
    id: "a-ly-2",
    businessId: "lyceum",
    query: "online school platform with AI tutor from my lessons",
    intent: "Differentiator query.",
    answer: "Tutor answers only from the teacher’s material and cites the timestamp.",
    status: "drafted",
  },
  {
    id: "a-rb-1",
    businessId: "rigboss",
    query: "IFTA app for owner operator that drafts the quarter",
    intent: "Owner-op, visor week.",
    answer: "RigBoss Trucker $79/truck. Radar drafts IFTA. Hours stay on the ELD you already run.",
    status: "gap",
  },
  {
    id: "a-rb-2",
    businessId: "rigboss",
    query: "CSA BASIC live monitoring for small fleet",
    intent: "Ops manager hiring a safety clerk.",
    answer: "Fleet watches seven BASICs as they move, not a quarterly PDF.",
    status: "drafted",
  },
  {
    id: "a-mc-1",
    businessId: "mechcorrect",
    query: "shop management software with AI diagnostics included",
    intent: "Owner comparing Tekmetric + a $179 AI add-on.",
    answer:
      "Mech Correct includes the advisor in every plan from $199. Photo of the leak, plan in ~9 seconds.",
    status: "cited",
  },
  {
    id: "a-mc-2",
    businessId: "mechcorrect",
    query: "how to follow up declined auto repair work automatically",
    intent: "The leak. High intent.",
    answer: "Same-afternoon texts in the shop’s voice, on declined lines, with the photo.",
    status: "gap",
  },
];

export const AGENTS: AgentJob[] = [
  {
    id: "ag-truth",
    name: "Customer Truth compiler",
    businessId: "all",
    role: "Read the week’s calls, tickets, reviews, and Stripe movement. Write what the market is telling us. Every claim needs a quote.",
    schedule: "Monday 7:00am",
    dataSource: "Call notes, desk log, Google reviews, Stripe, CRM",
    filters: ["No claim without a quote, link, or count", "No vibe summaries"],
    output: "Updated insights with evidence. One headline for the cockpit.",
    approval: "Founder skims the brief. Edits become memory.",
    metric: "Insights used in a shipped asset within 7 days",
    lastRun: "Mon Sep 1",
    lastResult:
      "Wrote the Sep 1 brief. Flagged the generic-vs-specific split across all five companies.",
    memory: [
      "Every insight needs a quote, a source, and a date.",
      "Do not average five businesses into one mushy lesson. Name the company.",
    ],
  },
  {
    id: "ag-outbound",
    name: "Outbound signal watcher",
    businessId: "all",
    role: "Watch hiring posts, public pain, outages, and reviews. Draft a specific first line. Drop bad fits.",
    schedule: "Weekdays 8:00am",
    dataSource: "Indeed, X, Facebook groups, Google reviews, LinkedIn",
    filters: [
      "Instructors who cannot buy — drop",
      "Anyone who just wants ‘AI’ — drop",
      "Must have a reason to care this week",
    ],
    output: "Queued drafts for approval. Max 10 a morning.",
    approval: "Nothing sends without a human.",
    metric: "Qualified replies, not messages sent",
    lastRun: "Fri Sep 5",
    lastResult: "Queued 10 high-fit drafts. Two ELD-rip lines were killed by the ban list before queue.",
    memory: [
      "Never say replace your ELD.",
      "Never headline AI for your dojo.",
      "First line must mention the trigger, not the product.",
    ],
  },
  {
    id: "ag-content",
    name: "Founder content cutter",
    businessId: "all",
    role: "Turn customer language into a post, a script, or a landing line in the founder’s voice.",
    schedule: "After any tagged call, and Friday 3:00pm",
    dataSource: "Customer truth, winning hooks, voice guides",
    filters: ["Banned language", "No generic intros", "No ‘in today’s world’"],
    output: "One ready piece per company per week.",
    approval: "Founder edits the hook. Body can ship if the hook holds.",
    metric: "Conversations from shipped pieces, not likes",
    lastRun: "Fri Sep 5",
    lastResult: "Cut ‘After a parent falls’ and ‘The work you found and never texted.’ Both sitting in Ready.",
    memory: [
      "If the first sentence could fit any SaaS, rewrite it.",
      "Prefer the customer’s nouns over ours.",
    ],
  },
  {
    id: "ag-creative",
    name: "Creative scorekeeper",
    businessId: "all",
    role: "Score running tests on conversations and conversions, not CTR. Kill losers. Name the winner in the brief.",
    schedule: "Friday 4:00pm",
    dataSource: "Ad accounts, landing analytics, CRM",
    filters: ["Ignore vanity CTR if conversations are worse"],
    output: "Won / lost / keep running. Next test suggestion.",
    approval: "Founder confirms kills.",
    metric: "Win rate of tests, and pipeline from winners",
    lastRun: "Fri Sep 5",
    lastResult:
      "Mech Correct lost-follow-up: fewer clicks, 2× demos from 3+ bay shops. DojoZeus AI headline: 340 clicks, 0 conversions. Kill it.",
    memory: [
      "Clicks from the wrong ICP are a cost, not a win.",
    ],
  },
  {
    id: "ag-search",
    name: "AI search gap finder",
    businessId: "all",
    role: "List questions a buyer would ask ChatGPT / Google AI this week. Mark what we can be cited for. Draft the missing page.",
    schedule: "Tue and Fri 9:00am",
    dataSource: "Search Console, Ahrefs-style gaps, sales questions",
    filters: ["Must be a question a buyer actually asks"],
    output: "Gap / drafted / cited list. One draft outline per gap.",
    approval: "Ship is human.",
    metric: "Cited answers and inbound from those pages",
    lastRun: "Fri Sep 5",
    lastResult: "Seven gaps. Highest intent: Kajabi no-cut alternative, IFTA draft app, declined-work follow-up.",
    memory: [
      "Write the answer in the first two sentences. Story after.",
    ],
  },
  {
    id: "ag-engage",
    name: "Competitor engager",
    businessId: "dojozeus",
    role: "Weekday morning: check 20 school-owner accounts. People who commented on a competitor post get a specific draft.",
    schedule: "Weekdays 8:30am",
    dataSource: "LinkedIn comments on Mindbody, Zen Planner, Spark",
    filters: ["Drop vendors, consultants, and instructors"],
    output: "Up to 10 drafts tied to the exact post they touched.",
    approval: "Human sends.",
    metric: "Positive replies from qualified owners",
    lastRun: "Fri Sep 5",
    lastResult: "6 drafts from a Zen Planner outage thread. 1 already in queued (Red Palm).",
    memory: [
      "Do not dunk on the competitor. Talk about the floor.",
    ],
  },
];

export const HOOKS: Record<string, string[]> = {
  cloudforest: [
    "The instructor knows your name by the second class.",
    "A private club. Not a chain. Greensboro since 1969.",
    "Pick a class. Come train. Decide after.",
    "Parents are not buying kung fu. They are buying focus.",
  ],
  dojozeus: [
    "You teach. It runs.",
    "Every belt. Every dollar. Every student. One brain.",
    "The Sunday report, without Sunday.",
    "Replace the stack. Keep the floor.",
  ],
  lyceum: [
    "A school with your name on the door.",
    "Build free. Open when you are ready.",
    "Academy: $249, 0% of your members, forever.",
    "The tutor answers from your lesson. Not the internet.",
  ],
  rigboss: [
    "You drive. Radar keeps the books.",
    "Hours stay on the ELD you already run.",
    "The visor envelope, retired.",
    "CSA live. Not a quarterly PDF.",
  ],
  mechcorrect: [
    "The work you found and never texted.",
    "Snap the leak. Stay in the bay.",
    "Same-afternoon follow-up, in your voice.",
    "One price. No modules. No sales call.",
  ],
};

export type BusinessId =
  | "cloudforest"
  | "dojozeus"
  | "lyceum"
  | "rigboss"
  | "mechcorrect";

export type FilterId = BusinessId | "all";

export type BrainProject = "dojo" | "lyceum" | "rigboss" | "shopboss" | "general";

export type BrainKind = "fact" | "decision" | "voice" | "ban" | "eval" | "competitor";

export type Business = {
  id: BusinessId;
  name: string;
  short: string;
  mark: string;
  url: string;
  category: string;
  offer: string;
  sharpAngle: string;
  icp: string;
  banned: string[];
  voice: string;
};

export type Evidence = {
  quote: string;
  source: string;
  date: string;
};

export type Insight = {
  id: string;
  businessId: BusinessId;
  claim: string;
  implication: string;
  evidence: Evidence[];
  count: number;
  trend: "up" | "down" | "new" | "steady";
};

export type ContentPiece = {
  id: string;
  businessId: BusinessId;
  kind: "post" | "video" | "email" | "landing" | "script";
  title: string;
  hook: string;
  body: string;
  status: "draft" | "ready" | "shipped" | "winner" | "killed";
  metricLabel?: string;
  metricValue?: string;
};

export type Signal = {
  id: string;
  businessId: BusinessId;
  account: string;
  role: string;
  trigger: string;
  whyNow: string;
  draft: string;
  status: "queued" | "approved" | "sent" | "replied" | "rejected";
  fit: "high" | "medium";
};

export type CreativeTest = {
  id: string;
  businessId: BusinessId;
  angle: string;
  hook: string;
  surface: string;
  impressions: number;
  clicks: number;
  conversations: number;
  conversions: number;
  status: "running" | "won" | "lost";
};

export type SearchAsset = {
  id: string;
  businessId: BusinessId;
  query: string;
  intent: string;
  answer: string;
  status: "gap" | "drafted" | "cited";
};

export type AgentJob = {
  id: string;
  name: string;
  businessId: FilterId;
  role: string;
  schedule: string;
  dataSource: string;
  filters: string[];
  output: string;
  approval: string;
  metric: string;
  lastRun: string;
  lastResult: string;
  memory: string[];
};

export type WeeklyBrief = {
  weekOf: string;
  headline: string;
  body: string;
  doNext: { label: string; href: string }[];
};

export type Kpi = {
  label: string;
  value: string;
  delta: string;
  tone: "up" | "down" | "flat";
};

export type CompetitorMove = {
  id: string;
  businessId: BusinessId;
  competitor: string;
  move: string;
  implication: string;
  date: string;
};

export type Objection = {
  id: string;
  businessId: BusinessId;
  line: string;
  count: number;
  counter: string;
};

export type EvalNote = {
  id: string;
  businessId: BusinessId;
  verdict: "double" | "kill" | "watch";
  title: string;
  detail: string;
};

export type CompanyDesk = {
  kpis: Kpi[];
  brief: WeeklyBrief;
};

export type BrainNote = {
  id: string;
  businessId: FilterId;
  project: BrainProject;
  title: string;
  body: string;
  kind: BrainKind;
  tags: string[];
  date: string;
  source: "superbrain" | "filed";
};

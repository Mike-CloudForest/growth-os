import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AgentJob,
  BrainNote,
  ContentPiece,
  CreativeTest,
  FilterId,
  Insight,
  SearchAsset,
  Signal,
} from "./types";
import { AGENTS, CONTENT, INSIGHTS, SEARCH_ASSETS, SIGNALS, TESTS } from "./seed";
import { reconcileOffers } from "./offer-migration";

type GrowthState = {
  selected: FilterId;
  insights: Insight[];
  content: ContentPiece[];
  signals: Signal[];
  tests: CreativeTest[];
  search: SearchAsset[];
  agents: AgentJob[];
  brainNotes: BrainNote[];
  setSelected: (id: FilterId) => void;
  setSignalStatus: (id: string, status: Signal["status"]) => void;
  addContent: (piece: ContentPiece) => void;
  setContentStatus: (id: string, status: ContentPiece["status"]) => void;
  addInsight: (insight: Insight) => void;
  addHooks: (businessId: ContentPiece["businessId"], hooks: string[], angle: string) => void;
  setSearchStatus: (id: string, status: SearchAsset["status"], answer?: string) => void;
  addAgentMemory: (id: string, note: string) => void;
  setAgentResult: (id: string, result: string) => void;
  addSignals: (rows: Signal[]) => void;
  setTestStatus: (id: string, status: CreativeTest["status"]) => void;
  addBrainNote: (note: BrainNote) => void;
  reset: () => void;
};

const initial = {
  selected: "all" as FilterId,
  insights: INSIGHTS,
  content: CONTENT,
  signals: SIGNALS,
  tests: TESTS,
  search: SEARCH_ASSETS,
  agents: AGENTS,
  brainNotes: [] as BrainNote[],
};

export const useGrowthStore = create<GrowthState>()(
  persist(
    (set) => ({
      ...initial,
      setSelected: (id) => set({ selected: id }),
      setSignalStatus: (id, status) =>
        set((s) => ({
          signals: s.signals.map((row) => (row.id === id ? { ...row, status } : row)),
        })),
      addContent: (piece) => set((s) => ({ content: [piece, ...s.content] })),
      setContentStatus: (id, status) =>
        set((s) => ({
          content: s.content.map((row) => (row.id === id ? { ...row, status } : row)),
        })),
      addInsight: (insight) => set((s) => ({ insights: [insight, ...s.insights] })),
      addHooks: (businessId, hooks, angle) =>
        set((s) => ({
          tests: [
            ...hooks.map((hook, i) => ({
              id: `t-gen-${Date.now()}-${i}`,
              businessId,
              angle,
              hook,
              surface: "Queued · not launched",
              impressions: 0,
              clicks: 0,
              conversations: 0,
              conversions: 0,
              status: "running" as const,
            })),
            ...s.tests,
          ],
        })),
      setSearchStatus: (id, status, answer) =>
        set((s) => ({
          search: s.search.map((row) =>
            row.id === id ? { ...row, status, answer: answer ?? row.answer } : row,
          ),
        })),
      addAgentMemory: (id, note) =>
        set((s) => ({
          agents: s.agents.map((row) =>
            row.id === id ? { ...row, memory: [note, ...row.memory] } : row,
          ),
        })),
      setAgentResult: (id, result) =>
        set((s) => ({
          agents: s.agents.map((row) =>
            row.id === id
              ? { ...row, lastRun: "Just now", lastResult: result }
              : row,
          ),
        })),
      addSignals: (rows) => set((s) => ({ signals: [...rows, ...s.signals] })),
      setTestStatus: (id, status) =>
        set((s) => ({
          tests: s.tests.map((row) => (row.id === id ? { ...row, status } : row)),
        })),
      addBrainNote: (note) => set((s) => ({ brainNotes: [note, ...s.brainNotes] })),
      reset: () => set(initial),
    }),
    {
      name: "growth-os-v2",
      skipHydration: true,
      merge: (persisted, current) => {
        const p = reconcileOffers((persisted ?? {}) as Partial<GrowthState>);
        return {
          ...current,
          ...p,
          brainNotes: Array.isArray(p.brainNotes) ? p.brainNotes : [],
        };
      },
    },
  ),
);

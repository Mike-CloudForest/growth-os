import { createServerFn } from "@tanstack/react-start";
import { brainContextFor } from "./brain";
import { BUSINESSES } from "./businesses";
import type { FilterId } from "./types";

export type GenerateTask = "post" | "outbound" | "hooks" | "brief" | "search" | "agent";

export type GenerateInput = {
  task: GenerateTask;
  business: string;
  voice: string;
  context: string;
  banned: string[];
  businessId?: FilterId;
  memory?: string;
};

export type Generated = {
  title: string;
  hook: string;
  body: string;
  headline: string;
  account: string;
  draft: string;
  hooks: string[];
  answer: string;
  result: string;
};

function emptyGenerated(): Generated {
  return {
    title: "",
    hook: "",
    body: "",
    headline: "",
    account: "",
    draft: "",
    hooks: [],
    answer: "",
    result: "",
  };
}

const TASK_LINE: Record<GenerateTask, string> = {
  post: "Write one founder post. Return JSON {title, hook, body}. Body under 120 words. No hashtags.",
  outbound:
    "Write one outbound first-touch. Return JSON {account, draft}. Draft under 80 words. Mention the trigger in sentence one. No meeting link.",
  hooks:
    "Write 8 hooks. Return JSON {hooks: string[]}. Each hook one sentence. Specific. No questions that sound like ads.",
  brief:
    "Write this week's growth brief. Return JSON {headline, body}. Body 3 short paragraphs. Name the company. No fluff.",
  search:
    "Write a citation-ready answer. Return JSON {title, answer}. First two sentences are the answer. Then proof.",
  agent:
    "You are running this agent job on the provided context. Return JSON {result}. Result is 80-140 words, specific, with a recommended next action.",
};

function resolveFilter(data: GenerateInput): FilterId {
  if (data.businessId) return data.businessId;
  if (data.business === "the house") return "all";
  return BUSINESSES.find((b) => b.name === data.business)?.id ?? "all";
}

export const generateCopy = createServerFn({ method: "POST" })
  .validator((input: GenerateInput) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI is not available in this environment." };

    const filter = resolveFilter(data);
    const brain = brainContextFor(filter);
    const memory = data.memory?.trim();

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 700,
        temperature: 0.6,
        messages: [
          {
            role: "system",
            content: `You are the marketing engineer for a house of five companies. Write like a precise operator, not an agency. No emoji. No 'delve', 'landscape', 'unlock', 'empower', 'game-changer'. Banned for this company: ${data.banned.join("; ")}. Voice: ${data.voice}. SuperBrain facts below are verified — do not contradict them, and do not invent traffic, revenue, or seats past them. Always return strict JSON only.`,
          },
          {
            role: "user",
            content: `Company: ${data.business}\nTask: ${TASK_LINE[data.task]}\n\nSuperBrain (verified marketing facts):\n${brain}${memory ? `\n\nOperator-filed notes:\n${memory}` : ""}\n\nContext:\n${data.context}`,
          },
        ],
      }),
    });

    if (!res.ok) return { ok: false as const, error: `Model error ${res.status}` };

    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    const raw = body.choices[0]?.message.content ?? "";
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    if (jsonStart < 0 || jsonEnd < 0) {
      return { ok: false as const, error: "The model did not return JSON." };
    }

    try {
      const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as Partial<Generated>;
      const dataOut: Generated = {
        ...emptyGenerated(),
        ...parsed,
        hooks: Array.isArray(parsed.hooks) ? parsed.hooks.map(String) : [],
      };
      return { ok: true as const, data: dataOut };
    } catch {
      return { ok: false as const, error: "Could not parse the model output." };
    }
  });

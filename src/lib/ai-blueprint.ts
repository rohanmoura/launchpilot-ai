import type {
  Blueprint,
  BlueprintGenerationSource,
  BlueprintInput,
} from "@/types/blueprint";
import { generateMockBlueprint } from "@/lib/blueprint-generator";

export type BlueprintGenerationResult = {
  blueprint: Blueprint;
  source: BlueprintGenerationSource;
};

function buildPrompt(input: BlueprintInput) {
  return `Create a practical MVP blueprint as JSON only.

You are a senior product strategist for early-stage founders.
Make the output specific to the user's idea, audience, budget, and timeline.
Avoid generic phrases like "build a dashboard" unless the dashboard has a clear purpose.
Keep the MVP focused on the smallest useful workflow that can validate demand.
Do not invent fake traction, testimonials, clients, revenue, or team details.

Input:
Product idea: ${input.productIdea}
Target audience: ${input.targetAudience}
Problem solved: ${input.problemSolved}
Main features wanted: ${input.mainFeatures}
Project type: ${input.projectType}
Budget range: ${input.budgetRange}
Timeline: ${input.timeline}

Return JSON matching this shape:
{
  "productName": string,
  "oneLinePitch": string,
  "problemStatement": string,
  "targetUsers": string[4],
  "mvpFeatures": string[5],
  "userJourney": string[5],
  "techStack": [{"layer": string, "recommendation": string, "why": string}],
  "roadmap": [
    {"label": "30 days", "title": string, "items": string[3]},
    {"label": "60 days", "title": string, "items": string[3]},
    {"label": "90 days", "title": string, "items": string[3]}
  ],
  "launchChecklist": string[5],
  "monetizationIdeas": string[4],
  "risksAndAssumptions": string[4],
  "nextSteps": string[4]
}

Rules:
- Return JSON only.
- Every array item must be a concrete action, risk, feature, or decision.
- Tech stack must include frontend/app surface, backend/data layer, and deployment/integration needs.
- Roadmap must respect the user's timeline and budget range.`;
}

function extractJson(text: string) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("AI response did not include JSON.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

function cleanText(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned.length >= 3 ? cleaned : fallback;
}

function cleanStringArray(value: unknown, fallback: string[], minItems: number) {
  const cleaned = Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().replace(/\s+/g, " "))
        .filter((item) => item.length >= 3)
    : [];

  const merged = [...cleaned, ...fallback];
  return Array.from(new Set(merged)).slice(0, Math.max(minItems, fallback.length));
}

function cleanTechStack(
  value: unknown,
  fallback: Blueprint["techStack"],
): Blueprint["techStack"] {
  const cleaned = Array.isArray(value)
    ? value
        .map((item) => ({
          layer: cleanText((item as Partial<Blueprint["techStack"][number]>)?.layer, ""),
          recommendation: cleanText(
            (item as Partial<Blueprint["techStack"][number]>)?.recommendation,
            "",
          ),
          why: cleanText((item as Partial<Blueprint["techStack"][number]>)?.why, ""),
        }))
        .filter(
          (item) =>
            item.layer.length > 0 &&
            item.recommendation.length > 0 &&
            item.why.length > 0,
        )
    : [];

  return [...cleaned, ...fallback].slice(0, Math.max(4, fallback.length));
}

function cleanRoadmap(
  value: unknown,
  fallback: Blueprint["roadmap"],
): Blueprint["roadmap"] {
  const labels = ["30 days", "60 days", "90 days"] as const;

  return labels.map((label, index) => {
    const fallbackPhase = fallback[index];
    const candidate = Array.isArray(value)
      ? value.find((item) => (item as { label?: unknown })?.label === label) ??
        value[index]
      : null;
    const phase = candidate as Partial<Blueprint["roadmap"][number]> | null;

    return {
      label,
      title: cleanText(phase?.title, fallbackPhase.title),
      items: cleanStringArray(phase?.items, fallbackPhase.items, 3).slice(0, 3),
    };
  });
}

function toBlueprint(
  input: BlueprintInput,
  payload: Partial<Blueprint>,
  source: BlueprintGenerationSource,
): Blueprint {
  const fallback = generateMockBlueprint(input);

  return {
    ...fallback,
    productName: cleanText(payload.productName, fallback.productName),
    oneLinePitch: cleanText(payload.oneLinePitch, fallback.oneLinePitch),
    problemStatement: cleanText(payload.problemStatement, fallback.problemStatement),
    targetUsers: cleanStringArray(payload.targetUsers, fallback.targetUsers, 4),
    mvpFeatures: cleanStringArray(payload.mvpFeatures, fallback.mvpFeatures, 5),
    userJourney: cleanStringArray(payload.userJourney, fallback.userJourney, 5),
    techStack: cleanTechStack(payload.techStack, fallback.techStack),
    roadmap: cleanRoadmap(payload.roadmap, fallback.roadmap),
    launchChecklist: cleanStringArray(
      payload.launchChecklist,
      fallback.launchChecklist,
      5,
    ),
    monetizationIdeas: cleanStringArray(
      payload.monetizationIdeas,
      fallback.monetizationIdeas,
      4,
    ),
    risksAndAssumptions: cleanStringArray(
      payload.risksAndAssumptions,
      fallback.risksAndAssumptions,
      4,
    ),
    nextSteps: cleanStringArray(payload.nextSteps, fallback.nextSteps, 4),
    id: fallback.id,
    status: "generated",
    createdAt: fallback.createdAt,
    updatedAt: fallback.updatedAt,
    input,
    generationSource: source,
  };
}

function generateFallbackBlueprint(input: BlueprintInput): BlueprintGenerationResult {
  return {
    blueprint: {
      ...generateMockBlueprint(input),
      generationSource: "fallback",
    },
    source: "fallback",
  };
}

async function generateWithGemini(input: BlueprintInput) {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(input) }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Gemini generation failed.");
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text ? toBlueprint(input, extractJson(text), "gemini") : null;
}

async function generateWithOpenRouter(input: BlueprintInput) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [{ role: "user", content: buildPrompt(input) }],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error("OpenRouter generation failed.");
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  return text ? toBlueprint(input, extractJson(text), "openrouter") : null;
}

export async function generateBlueprint(input: BlueprintInput) {
  return (await generateBlueprintResult(input)).blueprint;
}

export async function generateBlueprintResult(
  input: BlueprintInput,
): Promise<BlueprintGenerationResult> {
  try {
    const geminiBlueprint = await generateWithGemini(input);

    if (geminiBlueprint) {
      return { blueprint: geminiBlueprint, source: "gemini" };
    }
  } catch {
    // Try the next provider below before falling back to local generation.
  }

  try {
    const openRouterBlueprint = await generateWithOpenRouter(input);

    if (openRouterBlueprint) {
      return { blueprint: openRouterBlueprint, source: "openrouter" };
    }
  } catch {
    // Deterministic fallback keeps the product usable without API keys.
  }

  return generateFallbackBlueprint(input);
}

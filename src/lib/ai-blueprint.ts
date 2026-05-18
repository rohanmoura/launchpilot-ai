import type { Blueprint, BlueprintInput } from "@/types/blueprint";
import { generateMockBlueprint } from "@/lib/blueprint-generator";

function buildPrompt(input: BlueprintInput) {
  return `Create a practical MVP blueprint as JSON only.

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
  "targetUsers": string[],
  "mvpFeatures": string[],
  "userJourney": string[],
  "techStack": [{"layer": string, "recommendation": string, "why": string}],
  "roadmap": [{"label": "30 days" | "60 days" | "90 days", "title": string, "items": string[]}],
  "launchChecklist": string[],
  "monetizationIdeas": string[],
  "risksAndAssumptions": string[],
  "nextSteps": string[]
}`;
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

function toBlueprint(input: BlueprintInput, payload: Partial<Blueprint>): Blueprint {
  const fallback = generateMockBlueprint(input);

  return {
    ...fallback,
    ...payload,
    id: fallback.id,
    status: "generated",
    createdAt: fallback.createdAt,
    updatedAt: fallback.updatedAt,
    input,
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
  return text ? toBlueprint(input, extractJson(text)) : null;
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
  return text ? toBlueprint(input, extractJson(text)) : null;
}

export async function generateBlueprint(input: BlueprintInput) {
  try {
    return (await generateWithGemini(input)) ?? generateMockBlueprint(input);
  } catch {
    try {
      return (await generateWithOpenRouter(input)) ?? generateMockBlueprint(input);
    } catch {
      return generateMockBlueprint(input);
    }
  }
}

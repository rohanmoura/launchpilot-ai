"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { blueprintInputSchema } from "@/lib/blueprint-schema";
import { saveBlueprint } from "@/lib/blueprint-storage";
import type { Blueprint, BlueprintInput, ProjectType } from "@/types/blueprint";

const initialForm: BlueprintInput = {
  productIdea: "",
  targetAudience: "",
  problemSolved: "",
  mainFeatures: "",
  projectType: "saas",
  budgetRange: "",
  timeline: "",
};

const projectTypes: { label: string; value: ProjectType }[] = [
  { label: "SaaS", value: "saas" },
  { label: "AI Tool", value: "ai-tool" },
  { label: "Web App", value: "web-app" },
  { label: "Mobile App", value: "mobile-app" },
];

export default function CreateBlueprintPage() {
  const router = useRouter();
  const [form, setForm] = useState<BlueprintInput>(initialForm);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  function updateField<Key extends keyof BlueprintInput>(
    key: Key,
    value: BlueprintInput[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const result = blueprintInputSchema.safeParse(form);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        throw new Error("Blueprint generation failed.");
      }

      const payload = (await response.json()) as { blueprint: Blueprint };
      const blueprint = payload.blueprint;
      saveBlueprint(blueprint);
      router.push(`/blueprints/${blueprint.id}`);
    } catch {
      setError("Generation failed. Please try again in a moment.");
      setIsGenerating(false);
    }
  }

  return (
    <AppShell
      eyebrow="Create blueprint"
      title="Turn a raw idea into a practical MVP plan."
      description="Add the founder context. LaunchPilot will structure it into features, stack, roadmap, launch checklist, risks, and next steps."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card className="rounded-lg border-black/10 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl">Idea details</CardTitle>
            <p className="text-sm leading-6 text-[#625d54]">
              Strong input creates a sharper blueprint. Keep it clear, not perfect.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="productIdea">Product idea</Label>
                <Textarea
                  id="productIdea"
                  value={form.productIdea}
                  onChange={(event) =>
                    updateField("productIdea", event.target.value)
                  }
                  placeholder="Example: An AI fitness coach app for busy professionals..."
                  className="min-h-28 resize-none rounded-md"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target audience</Label>
                  <Input
                    id="targetAudience"
                    value={form.targetAudience}
                    onChange={(event) =>
                      updateField("targetAudience", event.target.value)
                    }
                    placeholder="Non-technical founders"
                    className="rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Project type</Label>
                  <Select
                    value={form.projectType}
                    onValueChange={(value) =>
                      updateField("projectType", value as ProjectType)
                    }
                  >
                    <SelectTrigger className="w-full rounded-md">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemSolved">Problem being solved</Label>
                <Textarea
                  id="problemSolved"
                  value={form.problemSolved}
                  onChange={(event) =>
                    updateField("problemSolved", event.target.value)
                  }
                  placeholder="What painful, expensive, or confusing problem does this solve?"
                  className="min-h-24 resize-none rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mainFeatures">Main features wanted</Label>
                <Textarea
                  id="mainFeatures"
                  value={form.mainFeatures}
                  onChange={(event) =>
                    updateField("mainFeatures", event.target.value)
                  }
                  placeholder="Onboarding, dashboard, AI generation, saved history, export..."
                  className="min-h-24 resize-none rounded-md"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budgetRange">Budget range</Label>
                  <Input
                    id="budgetRange"
                    value={form.budgetRange}
                    onChange={(event) =>
                      updateField("budgetRange", event.target.value)
                    }
                    placeholder="$5k - $15k"
                    className="rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input
                    id="timeline"
                    value={form.timeline}
                    onChange={(event) => updateField("timeline", event.target.value)}
                    placeholder="8-10 weeks"
                    className="rounded-md"
                  />
                </div>
              </div>

              {error ? (
                <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 size-4" />
                  <span>{error}</span>
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={isGenerating}
                className="h-12 w-full rounded-md bg-[#191816] text-white sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Generating blueprint
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Generate blueprint
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <aside className="space-y-5">
          <Card className="rounded-lg border-black/10 bg-[#11100f] text-white">
            <CardContent className="p-6">
              <Sparkles className="size-6 text-[#d6ff72]" />
              <h2 className="mt-5 text-xl font-semibold">What gets generated</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/62">
                <li>Product summary and one-line pitch</li>
                <li>MVP feature list and user journey</li>
                <li>Recommended stack and 30/60/90 roadmap</li>
                <li>Risks, launch checklist, and next steps</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-black/10 bg-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">Demo-safe AI behavior</h2>
              <p className="mt-3 text-sm leading-6 text-[#625d54]">
                This version uses a structured mock generator first. In Step 5,
                we add the API route so Gemini or OpenRouter can plug in without
                breaking the portfolio demo.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  LockKeyhole,
  Loader2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

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
import {
  DEFAULT_ACCOUNT_CREDITS,
  fetchAccountCredits,
  getCurrentAccessToken,
  type AccountCredits,
} from "@/lib/account-credits";
import { blueprintInputSchema } from "@/lib/blueprint-schema";
import { saveBlueprint } from "@/lib/blueprint-storage";
import { getCurrentSupabaseUser } from "@/lib/blueprint-cloud";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase-client";
import type {
  Blueprint,
  BlueprintGenerationSource,
  BlueprintInput,
  ProjectType,
} from "@/types/blueprint";

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

const DRAFT_KEY = "launchpilot.blueprintDraft";

const generationSourceLabels: Record<BlueprintGenerationSource, string> = {
  gemini: "Gemini AI",
  openrouter: "OpenRouter AI",
  fallback: "Local fallback",
};

function hasDraftContent(form: BlueprintInput) {
  return Object.entries(form).some(([key, value]) => {
    if (key === "projectType") {
      return value !== initialForm.projectType;
    }

    return String(value).trim().length > 0;
  });
}

function readSavedDraft() {
  if (typeof window === "undefined") {
    return initialForm;
  }

  const savedDraft = window.localStorage.getItem(DRAFT_KEY);

  if (!savedDraft) {
    return initialForm;
  }

  try {
    const parsed = JSON.parse(savedDraft) as BlueprintInput;
    const result = blueprintInputSchema.partial().safeParse(parsed);

    if (!result.success) {
      return initialForm;
    }

    return { ...initialForm, ...result.data };
  } catch {
    window.localStorage.removeItem(DRAFT_KEY);
    return initialForm;
  }
}

export default function CreateBlueprintPage() {
  const router = useRouter();
  const [form, setForm] = useState<BlueprintInput>(readSavedDraft);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<AccountCredits>(DEFAULT_ACCOUNT_CREDITS);
  const [isLoadingCredits, setIsLoadingCredits] = useState(() =>
    isSupabaseConfigured(),
  );
  const [draftRestored, setDraftRestored] = useState(() =>
    hasDraftContent(readSavedDraft()),
  );
  const isSignedIn = Boolean(user);
  const creditsRemaining = credits.remaining;

  const completedSections = useMemo(() => {
    const sections = [
      form.productIdea.trim().length >= 12 &&
        form.targetAudience.trim().length >= 4 &&
        form.problemSolved.trim().length >= 8,
      form.mainFeatures.trim().length >= 4,
      form.budgetRange.trim().length >= 2 && form.timeline.trim().length >= 2,
    ];

    return sections.filter(Boolean).length;
  }, [form]);

  useEffect(() => {
    if (hasDraftContent(form)) {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } else {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, [form]);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    async function loadAccount() {
      setIsLoadingCredits(true);
      const currentUser = await getCurrentSupabaseUser();
      setUser(currentUser);

      if (currentUser) {
        const accountCredits = await fetchAccountCredits();
        setCredits(accountCredits ?? DEFAULT_ACCOUNT_CREDITS);
      }

      setIsLoadingCredits(false);
    }

    void loadAccount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setCredits(DEFAULT_ACCOUNT_CREDITS);
        setIsLoadingCredits(false);
        return;
      }

      void fetchAccountCredits().then((accountCredits) => {
        setCredits(accountCredits ?? DEFAULT_ACCOUNT_CREDITS);
        setIsLoadingCredits(false);
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  function updateField<Key extends keyof BlueprintInput>(
    key: Key,
    value: BlueprintInput[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase must be configured before account-based AI generation can run.",
      );
      return;
    }

    if (!isSignedIn) {
      setError(
        "Sign in first to generate a blueprint. Credits are attached to your account.",
      );
      return;
    }

    if (creditsRemaining === 0) {
      setError(
        "You have used all free blueprint credits for this account. Your saved blueprints are still available.",
      );
      return;
    }

    const result = blueprintInputSchema.safeParse(form);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    setIsGenerating(true);

    try {
      const accessToken = await getCurrentAccessToken();

      if (!accessToken) {
        throw new Error("Your sign-in session expired. Please sign in again.");
      }

      const response = await fetch("/api/generate-blueprint", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Blueprint generation failed.");
      }

      const payload = (await response.json()) as {
        blueprint: Blueprint;
        source: BlueprintGenerationSource;
        credits: AccountCredits;
      };
      const blueprint = payload.blueprint;
      window.sessionStorage.setItem(
        "launchpilot.lastGenerationSource",
        generationSourceLabels[payload.source],
      );
      setCredits(payload.credits);
      saveBlueprint(blueprint);
      window.localStorage.removeItem(DRAFT_KEY);
      router.push(`/blueprints/${blueprint.id}`);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Generation failed. Your draft is still saved, so you can retry without losing the idea.",
      );
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
            <CardTitle className="flex items-center gap-3 text-2xl">
              <ClipboardList className="size-6 text-[#14756b]" />
              Founder intake
            </CardTitle>
            <p className="text-sm leading-6 text-[#625d54]">
              Strong input creates a sharper blueprint. The draft saves
              automatically as you work.
            </p>
            {draftRestored ? (
              <div className="mt-3 flex items-center gap-2 rounded-md border border-[#14756b]/20 bg-[#e3f0ec] px-3 py-2 text-sm text-[#11665d]">
                <CheckCircle2 className="size-4" />
                Draft restored from your last session.
              </div>
            ) : null}
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <section className="rounded-lg border border-black/10 bg-[#fbfaf7] p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#14756b]">
                      Step 1
                    </p>
                    <h2 className="text-lg font-semibold">Founder context</h2>
                  </div>
                  <span className="text-xs text-[#7a746b]">Problem first</span>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="productIdea">Product idea</Label>
                    <Textarea
                      id="productIdea"
                      value={form.productIdea}
                      onChange={(event) =>
                        updateField("productIdea", event.target.value)
                      }
                      placeholder="Example: An AI fitness coach app for busy professionals..."
                      className="min-h-28 resize-none rounded-md bg-white"
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
                        className="rounded-md bg-white"
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
                        <SelectTrigger className="w-full rounded-md bg-white">
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
                      className="min-h-24 resize-none rounded-md bg-white"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-black/10 bg-white p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#14756b]">
                      Step 2
                    </p>
                    <h2 className="text-lg font-semibold">MVP scope</h2>
                  </div>
                  <span className="text-xs text-[#7a746b]">Keep it lean</span>
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
                  <p className="text-xs leading-5 text-[#7a746b]">
                    Separate features with commas or new lines. LaunchPilot will
                    turn them into a focused first version.
                  </p>
                </div>
              </section>

              <section className="rounded-lg border border-black/10 bg-white p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#14756b]">
                      Step 3
                    </p>
                    <h2 className="text-lg font-semibold">Build constraints</h2>
                  </div>
                  <span className="text-xs text-[#7a746b]">Reality check</span>
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
                      onChange={(event) =>
                        updateField("timeline", event.target.value)
                      }
                      placeholder="8-10 weeks"
                      className="rounded-md"
                    />
                  </div>
                </div>
              </section>

              {error ? (
                <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 size-4" />
                  <span>{error}</span>
                </div>
              ) : null}

              {!isSignedIn ? (
                <div className="flex items-start gap-3 rounded-md border border-[#14756b]/20 bg-[#e3f0ec] p-4 text-sm text-[#11665d]">
                  <LockKeyhole className="mt-0.5 size-4" />
                  <div>
                    <p>
                      Sign in to unlock account credits, cloud saves, and
                      database-backed blueprint history.
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-3 rounded-md border-[#14756b]/20 bg-white"
                    >
                      <Link href="/#signin">Go to sign in</Link>
                    </Button>
                  </div>
                </div>
              ) : null}

              {creditsRemaining === 0 ? (
                <div className="flex items-start gap-3 rounded-md border border-[#14756b]/20 bg-[#e3f0ec] p-4 text-sm text-[#11665d]">
                  <AlertCircle className="mt-0.5 size-4" />
                  <span>
                    Free generation limit reached. You can still review, copy,
                    and export existing blueprints.
                  </span>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="submit"
                  disabled={
                    isGenerating ||
                    isLoadingCredits ||
                    !isSignedIn ||
                    creditsRemaining === 0
                  }
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
                <Button
                  type="button"
                  variant="outline"
                  disabled={isGenerating}
                  className="h-12 rounded-md"
                  onClick={() => {
                    setForm(initialForm);
                    setDraftRestored(false);
                    window.localStorage.removeItem(DRAFT_KEY);
                  }}
                >
                  <RefreshCcw className="size-4" />
                  Reset draft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <aside className="space-y-5">
          <Card className="rounded-lg border-black/10 bg-white">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-[#14756b]">
                Intake progress
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((step) => (
                  <div
                    key={step}
                    className={`h-2 rounded-full ${
                      step < completedSections ? "bg-[#14756b]" : "bg-black/10"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-[#625d54]">
                {completedSections}/3 sections ready. More context gives the
                generated roadmap better tradeoffs.
              </p>
              <div className="mt-5 rounded-md border border-black/10 bg-[#fbfaf7] p-4">
                <p className="text-xs font-semibold uppercase text-[#14756b]">
                  Free credits
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((credit) => (
                    <div
                      key={credit}
                      className={`h-2 rounded-full ${
                        credit < credits.used ? "bg-[#14756b]" : "bg-black/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-[#625d54]">
                  {isSignedIn
                    ? `${credits.remaining} of ${credits.limit} account credits remaining.`
                    : "Sign in to load your account credits."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-black/10 bg-[#11100f] text-white">
            <CardContent className="p-6">
              {isGenerating ? (
                <>
                  <Loader2 className="size-6 animate-spin text-[#d6ff72]" />
                  <h2 className="mt-5 text-xl font-semibold">
                    Structuring your MVP
                  </h2>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-white/62">
                    <li>Reading founder context</li>
                    <li>Prioritizing first-version features</li>
                    <li>Drafting roadmap, risks, and launch steps</li>
                  </ul>
                </>
              ) : (
                <>
                  <Sparkles className="size-6 text-[#d6ff72]" />
                  <h2 className="mt-5 text-xl font-semibold">
                    What gets generated
                  </h2>
                  <p className="mt-3 rounded-md bg-white/10 p-3 text-xs leading-5 text-white/55">
                    Uses Gemini or OpenRouter when an API key is configured.
                    Without an AI key, LaunchPilot uses its local structured
                    fallback generator.
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-white/62">
                    <li>Product summary and one-line pitch</li>
                    <li>MVP feature list and user journey</li>
                    <li>Recommended stack and 30/60/90 roadmap</li>
                    <li>Risks, launch checklist, and next steps</li>
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg border-black/10 bg-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">Built for clear decisions</h2>
              <p className="mt-3 text-sm leading-6 text-[#625d54]">
                The blueprint keeps scope, timeline, risks, and next actions in
                one place so a founder can decide what to build first.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

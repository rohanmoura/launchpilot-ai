"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Layers3,
  ListChecks,
  Map,
  Rocket,
  Route,
  Sparkles,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { BlueprintActions } from "@/components/blueprints/blueprint-actions";
import { BulletList, SectionCard } from "@/components/blueprints/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getBlueprintsSnapshot,
  getServerBlueprintsSnapshot,
  subscribeToBlueprintStorage,
} from "@/lib/blueprint-storage";
import { projectTypeLabels } from "@/lib/format";
import type { Blueprint, BlueprintGenerationSource } from "@/types/blueprint";

const generationSourceLabels: Record<BlueprintGenerationSource, string> = {
  gemini: "Generated with Gemini AI",
  openrouter: "Generated with OpenRouter AI",
  fallback: "Generated with local fallback",
};

function findBlueprint(snapshot: string, id: string) {
  try {
    const blueprints = JSON.parse(snapshot) as Blueprint[];
    return blueprints.find((blueprint) => blueprint.id === id) ?? null;
  } catch {
    return null;
  }
}

export default function BlueprintDetailPage() {
  const params = useParams<{ id: string }>();
  const snapshot = useSyncExternalStore(
    subscribeToBlueprintStorage,
    getBlueprintsSnapshot,
    getServerBlueprintsSnapshot,
  );
  const blueprint = useMemo(
    () => findBlueprint(snapshot, params.id),
    [params.id, snapshot],
  );

  if (!blueprint) {
    return (
      <AppShell
        eyebrow="Blueprint missing"
        title="This blueprint could not be found."
        description="It may have been deleted from local browser storage."
      >
        <Card className="rounded-lg border-black/10 bg-white">
          <CardContent className="p-8">
            <Button asChild className="rounded-md bg-[#191816] text-white">
              <Link href="/blueprints">Back to blueprints</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow="Generated blueprint"
      title={blueprint.productName}
      description={blueprint.oneLinePitch}
    >
      <div className="space-y-5">
        <Card className="rounded-lg border-black/10 bg-[#11100f] text-white">
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-md bg-[#d6ff72] text-[#1f2a0d] hover:bg-[#d6ff72]">
                  {projectTypeLabels[blueprint.input.projectType]}
                </Badge>
                <Badge variant="outline" className="rounded-md border-white/15 text-white">
                  {blueprint.input.timeline}
                </Badge>
                <Badge variant="outline" className="rounded-md border-white/15 text-white">
                  {blueprint.input.budgetRange}
                </Badge>
                <Badge variant="outline" className="rounded-md border-white/15 text-white">
                  {generationSourceLabels[
                    blueprint.generationSource ?? "fallback"
                  ]}
                </Badge>
              </div>
              <h2 className="mt-5 text-2xl font-semibold">Product brief</h2>
              <p className="mt-3 max-w-4xl leading-7 text-white/62">
                {blueprint.problemStatement}
              </p>
            </div>
            <BlueprintActions blueprint={blueprint} />
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard title="Target users" icon={Users}>
            <BulletList items={blueprint.targetUsers} />
          </SectionCard>
          <SectionCard title="MVP features" icon={Layers3}>
            <BulletList items={blueprint.mvpFeatures} />
          </SectionCard>
        </div>

        <SectionCard title="User journey" icon={Route}>
          <div className="grid gap-3 md:grid-cols-5">
            {blueprint.userJourney.map((step, index) => (
              <div key={step} className="rounded-md bg-[#f7f5ef] p-4">
                <p className="text-xs font-semibold text-[#14756b]">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#625d54]">{step}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recommended tech stack" icon={Sparkles}>
          <div className="grid gap-3 md:grid-cols-2">
            {blueprint.techStack.map((item, index) => (
              <div
                key={item.layer}
                className="rounded-md border border-black/10 bg-[#fbfaf7] p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#11100f] text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#14756b]">
                      {item.layer}
                    </p>
                    <h3 className="font-semibold">{item.recommendation}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#625d54]">{item.why}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="30/60/90 day roadmap" icon={Map}>
          <div className="grid gap-3 md:grid-cols-3">
            {blueprint.roadmap.map((phase, index) => (
              <div
                key={phase.label}
                className="relative rounded-md border border-black/10 bg-[#f7f5ef] p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#14756b] text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#a35c1d]">
                      {phase.label}
                    </p>
                    <h3 className="mt-1 font-semibold">{phase.title}</h3>
                  </div>
                </div>
                <div className="mt-4">
                  <BulletList items={phase.items} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard title="Risks and assumptions" icon={AlertTriangle}>
            <BulletList items={blueprint.risksAndAssumptions} />
          </SectionCard>
          <SectionCard title="Launch checklist" icon={ListChecks}>
            <BulletList items={blueprint.launchChecklist} />
          </SectionCard>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard title="Monetization ideas" icon={Rocket}>
            <BulletList items={blueprint.monetizationIdeas} />
          </SectionCard>
          <SectionCard title="Next steps" icon={CheckCircle2}>
            <BulletList items={blueprint.nextSteps} />
          </SectionCard>
        </div>

        <Card className="rounded-lg border-[#d6ff72]/50 bg-[#d6ff72] text-[#1f2a0d]">
          <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Turn this into an MVP sprint.</h2>
              <p className="mt-2 max-w-2xl leading-7 text-[#4b5d19]">
                Share this blueprint with KMAX Design to scope the first usable
                version, align the feature plan, and move from strategy into
                build mode.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="rounded-md bg-[#191816] text-white">
                <Link href="https://kmaxdesign.com/" target="_blank" rel="noreferrer">
                  Work with KMAX
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-md border-[#1f2a0d]/20 bg-transparent"
              >
                <Link href="/create">Plan another idea</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { ArrowRight, CheckCircle2, ClipboardList, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, projectTypeLabels } from "@/lib/format";
import {
  getBlueprintsSnapshot,
  subscribeToBlueprintStorage,
} from "@/lib/blueprint-storage";
import type { Blueprint, BlueprintSummary } from "@/types/blueprint";

function getSummariesFromSnapshot(snapshot: string): BlueprintSummary[] {
  try {
    const blueprints = JSON.parse(snapshot) as Blueprint[];

    return blueprints.map((blueprint) => ({
      id: blueprint.id,
      status: blueprint.status,
      createdAt: blueprint.createdAt,
      updatedAt: blueprint.updatedAt,
      productName: blueprint.productName,
      oneLinePitch: blueprint.oneLinePitch,
      projectType: blueprint.input.projectType,
    }));
  } catch {
    return [];
  }
}

export default function DashboardPage() {
  const blueprintSnapshot = useSyncExternalStore(
    subscribeToBlueprintStorage,
    getBlueprintsSnapshot,
    getBlueprintsSnapshot,
  );
  const blueprints = useMemo(
    () => getSummariesFromSnapshot(blueprintSnapshot),
    [blueprintSnapshot],
  );

  const creditsUsed = Math.min(blueprints.length, 3);
  const recentBlueprints = useMemo(() => blueprints.slice(0, 3), [blueprints]);

  return (
    <AppShell
      eyebrow="Founder dashboard"
      title="Plan, save, and review MVP blueprints."
      description="Track recent product ideas, credits, and the next blueprint you want to turn into a build-ready plan."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-lg border-black/10 bg-white lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Recent blueprints</CardTitle>
              <p className="mt-2 text-sm text-[#625d54]">
                Saved ideas from the current browser workspace.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-md">
              <Link href="/blueprints">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBlueprints.length > 0 ? (
              <div className="space-y-3">
                {recentBlueprints.map((blueprint) => (
                  <Link
                    key={blueprint.id}
                    href={`/blueprints/${blueprint.id}`}
                    className="flex flex-col gap-4 rounded-md border border-black/10 p-4 transition hover:border-[#14756b]/40 hover:bg-[#f7f5ef] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">{blueprint.productName}</h2>
                        <Badge
                          variant="outline"
                          className="rounded-md border-[#14756b]/25 text-[#14756b]"
                        >
                          {projectTypeLabels[blueprint.projectType]}
                        </Badge>
                      </div>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#625d54]">
                        {blueprint.oneLinePitch}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#625d54]">
                      {formatDate(blueprint.createdAt)}
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-black/15 bg-[#fbfaf7] p-8 text-center">
                <ClipboardList className="mx-auto size-8 text-[#14756b]" />
                <h2 className="mt-4 text-xl font-semibold">
                  No blueprints yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#625d54]">
                  Create your first MVP blueprint to see the dashboard populate
                  with saved product plans.
                </p>
                <Button asChild className="mt-5 rounded-md bg-[#191816] text-white">
                  <Link href="/create">Create blueprint</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-lg border-black/10 bg-[#11100f] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="size-5 text-[#d6ff72]" />
                Free credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-semibold">{3 - creditsUsed}</span>
                <span className="pb-2 text-sm text-white/50">remaining</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((credit) => (
                  <div
                    key={credit}
                    className={`h-2 rounded-full ${
                      credit < creditsUsed ? "bg-[#d6ff72]" : "bg-white/15"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-white/55">
                Free plan includes 3 blueprints. Pro unlocks unlimited planning
                for founders and agencies.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-black/10 bg-white">
            <CardContent className="p-6">
              <CheckCircle2 className="size-6 text-[#14756b]" />
              <h2 className="mt-5 text-xl font-semibold">KMAX build CTA</h2>
              <p className="mt-3 text-sm leading-6 text-[#625d54]">
                Every generated blueprint should lead naturally into a build
                conversation with KMAX Design.
              </p>
              <Button asChild variant="outline" className="mt-5 rounded-md">
                <Link href="/create">Plan next idea</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

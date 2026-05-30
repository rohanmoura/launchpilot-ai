"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Layers3,
  Rocket,
  Sparkles,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { AppShell } from "@/components/app/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, projectTypeLabels } from "@/lib/format";
import {
  getBlueprintsSnapshot,
  getServerBlueprintsSnapshot,
  subscribeToBlueprintStorage,
} from "@/lib/blueprint-storage";
import {
  DEFAULT_ACCOUNT_CREDITS,
  fetchAccountCredits,
  type AccountCredits,
} from "@/lib/account-credits";
import { getCurrentSupabaseUser } from "@/lib/blueprint-cloud";
import { getSupabaseClient } from "@/lib/supabase-client";
import type { Blueprint } from "@/types/blueprint";

function getBlueprintsFromSnapshot(snapshot: string): Blueprint[] {
  try {
    return JSON.parse(snapshot) as Blueprint[];
  } catch {
    return [];
  }
}

export default function DashboardPage() {
  const blueprintSnapshot = useSyncExternalStore(
    subscribeToBlueprintStorage,
    getBlueprintsSnapshot,
    getServerBlueprintsSnapshot,
  );
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<AccountCredits>(DEFAULT_ACCOUNT_CREDITS);
  const blueprints = useMemo(() => getBlueprintsFromSnapshot(blueprintSnapshot), [
    blueprintSnapshot,
  ]);

  const creditsUsed = Math.min(credits.used, credits.limit);
  const recentBlueprints = useMemo(() => blueprints.slice(0, 3), [blueprints]);
  const projectTypeCount = useMemo(
    () => new Set(blueprints.map((blueprint) => blueprint.input.projectType)).size,
    [blueprints],
  );
  const latestBlueprint = recentBlueprints[0];

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    async function loadAccountCredits() {
      const currentUser = await getCurrentSupabaseUser();
      setUser(currentUser);

      if (currentUser) {
        const nextCredits = await fetchAccountCredits();
        setCredits(nextCredits ?? DEFAULT_ACCOUNT_CREDITS);
      }
    }

    void loadAccountCredits();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setCredits(DEFAULT_ACCOUNT_CREDITS);
        return;
      }

      void fetchAccountCredits().then((nextCredits) => {
        setCredits(nextCredits ?? DEFAULT_ACCOUNT_CREDITS);
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppShell
      eyebrow="Founder dashboard"
      title="Plan, save, and review MVP blueprints."
      description="Track recent product ideas, credits, and the next blueprint you want to turn into a build-ready plan."
    >
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <Card className="rounded-lg border-black/10 bg-white">
          <CardContent className="p-5">
            <BarChart3 className="size-5 text-[#14756b]" />
            <p className="mt-4 text-sm text-[#625d54]">Ideas planned</p>
            <p className="mt-1 text-3xl font-semibold">{blueprints.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg border-black/10 bg-white">
          <CardContent className="p-5">
            <Layers3 className="size-5 text-[#14756b]" />
            <p className="mt-4 text-sm text-[#625d54]">Product types</p>
            <p className="mt-1 text-3xl font-semibold">{projectTypeCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg border-black/10 bg-white">
          <CardContent className="p-5">
            <Rocket className="size-5 text-[#14756b]" />
            <p className="mt-4 text-sm text-[#625d54]">Next action</p>
            <p className="mt-1 text-lg font-semibold">
              {latestBlueprint ? "Review latest scope" : "Create first blueprint"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-lg border-black/10 bg-white lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Recent blueprints</CardTitle>
              <p className="mt-2 text-sm text-[#625d54]">
                Your latest MVP plans, ordered by creation date.
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
                          {projectTypeLabels[blueprint.input.projectType]}
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
              <div className="rounded-lg border border-dashed border-black/15 bg-[#fbfaf7] p-8">
                <ClipboardList className="size-8 text-[#14756b]" />
                <h2 className="mt-4 text-xl font-semibold">No blueprints yet</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#625d54]">
                  Start with one founder idea. LaunchPilot will turn it into a
                  product brief, feature scope, roadmap, risks, and launch
                  checklist you can review from this dashboard.
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
                <span className="text-5xl font-semibold">
                  {user ? credits.remaining : credits.limit}
                </span>
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
                {user
                  ? "Credits are attached to your signed-in account."
                  : "Sign in to load account-based AI generation credits."}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-black/10 bg-white">
            <CardContent className="p-6">
              <CheckCircle2 className="size-6 text-[#14756b]" />
              <h2 className="mt-5 text-xl font-semibold">Ready for a build sprint?</h2>
              <p className="mt-3 text-sm leading-6 text-[#625d54]">
                Use the strongest blueprint to start a scoped MVP build
                conversation with KMAX Design.
              </p>
              <Button asChild variant="outline" className="mt-5 rounded-md">
                <Link href="https://kmaxdesign.com/" target="_blank" rel="noreferrer">
                  Work with KMAX
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

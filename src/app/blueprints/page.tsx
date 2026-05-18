"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deleteBlueprint,
  getBlueprintsSnapshot,
  subscribeToBlueprintStorage,
} from "@/lib/blueprint-storage";
import { formatDate, projectTypeLabels } from "@/lib/format";
import type { Blueprint } from "@/types/blueprint";

function parseBlueprints(snapshot: string) {
  try {
    return JSON.parse(snapshot) as Blueprint[];
  } catch {
    return [];
  }
}

export default function BlueprintsPage() {
  const snapshot = useSyncExternalStore(
    subscribeToBlueprintStorage,
    getBlueprintsSnapshot,
    getBlueprintsSnapshot,
  );
  const blueprints = useMemo(() => parseBlueprints(snapshot), [snapshot]);

  return (
    <AppShell
      eyebrow="Saved blueprints"
      title="Review every generated MVP plan."
      description="Open, copy, or remove saved blueprints from this browser workspace."
    >
      {blueprints.length > 0 ? (
        <div className="space-y-3">
          {blueprints.map((blueprint) => (
            <Card key={blueprint.id} className="rounded-lg border-black/10 bg-white">
              <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{blueprint.productName}</h2>
                    <Badge
                      variant="outline"
                      className="rounded-md border-[#14756b]/25 text-[#14756b]"
                    >
                      {projectTypeLabels[blueprint.input.projectType]}
                    </Badge>
                    <Badge variant="secondary" className="rounded-md">
                      {blueprint.status}
                    </Badge>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#625d54]">
                    {blueprint.oneLinePitch}
                  </p>
                  <p className="mt-3 text-xs text-[#7a746b]">
                    Created {formatDate(blueprint.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="rounded-md">
                    <Link href={`/blueprints/${blueprint.id}`}>
                      Open
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-md text-red-700 hover:text-red-800"
                    onClick={() => deleteBlueprint(blueprint.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-lg border-dashed border-black/15 bg-white">
          <CardContent className="p-10 text-center">
            <h2 className="text-2xl font-semibold">No saved blueprints</h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-[#625d54]">
              Generate the first plan and it will appear here for review,
              copying, and portfolio demos.
            </p>
            <Button asChild className="mt-6 rounded-md bg-[#191816] text-white">
              <Link href="/create">
                <Plus className="size-4" />
                Create blueprint
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}

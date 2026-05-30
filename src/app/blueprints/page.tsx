"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ArrowRight, ClipboardList, Plus, Trash2 } from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteBlueprint,
  getBlueprintsSnapshot,
  getServerBlueprintsSnapshot,
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
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const snapshot = useSyncExternalStore(
    subscribeToBlueprintStorage,
    getBlueprintsSnapshot,
    getServerBlueprintsSnapshot,
  );
  const blueprints = useMemo(() => parseBlueprints(snapshot), [snapshot]);

  return (
    <AppShell
      eyebrow="Saved blueprints"
      title="Review every generated MVP plan."
      description="Compare planned products by type, status, date, and next action."
    >
      {blueprints.length > 0 ? (
        <Card className="rounded-lg border-black/10 bg-white">
          <CardContent className="p-0">
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-5">Blueprint</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="px-5 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blueprints.map((blueprint) => (
                    <TableRow key={blueprint.id}>
                      <TableCell className="max-w-xl px-5 py-4 whitespace-normal">
                        <h2 className="font-semibold">{blueprint.productName}</h2>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#625d54]">
                          {blueprint.oneLinePitch}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-md border-[#14756b]/25 text-[#14756b]"
                        >
                          {projectTypeLabels[blueprint.input.projectType]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-md">
                          {blueprint.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#625d54]">
                        {formatDate(blueprint.createdAt)}
                      </TableCell>
                      <TableCell className="px-5">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" className="rounded-md">
                            <Link href={`/blueprints/${blueprint.id}`}>
                              Open
                              <ArrowRight className="size-4" />
                            </Link>
                          </Button>
                          {pendingDeleteId === blueprint.id ? (
                            <>
                              <Button
                                type="button"
                                variant="destructive"
                                className="rounded-md"
                                onClick={() => {
                                  deleteBlueprint(blueprint.id);
                                  setPendingDeleteId(null);
                                }}
                              >
                                Confirm
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-md"
                                onClick={() => setPendingDeleteId(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-md text-red-700 hover:text-red-800"
                              onClick={() => setPendingDeleteId(blueprint.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="divide-y divide-black/10 lg:hidden">
              {blueprints.map((blueprint) => (
                <div key={blueprint.id} className="p-5">
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
                  <p className="mt-2 text-sm leading-6 text-[#625d54]">
                    {blueprint.oneLinePitch}
                  </p>
                  <p className="mt-3 text-xs text-[#7a746b]">
                    Created {formatDate(blueprint.createdAt)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild variant="outline" className="rounded-md">
                      <Link href={`/blueprints/${blueprint.id}`}>
                        Open
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    {pendingDeleteId === blueprint.id ? (
                      <>
                        <Button
                          type="button"
                          variant="destructive"
                          className="rounded-md"
                          onClick={() => {
                            deleteBlueprint(blueprint.id);
                            setPendingDeleteId(null);
                          }}
                        >
                          Confirm delete
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-md"
                          onClick={() => setPendingDeleteId(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-md text-red-700 hover:text-red-800"
                        onClick={() => setPendingDeleteId(blueprint.id)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-lg border-dashed border-black/15 bg-white">
          <CardContent className="p-10">
            <ClipboardList className="size-8 text-[#14756b]" />
            <h2 className="text-2xl font-semibold">No saved blueprints</h2>
            <p className="mt-3 max-w-xl leading-7 text-[#625d54]">
              Generate your first MVP plan and it will appear here with type,
              status, date, and quick actions for review or export.
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

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Cloud,
  LockKeyhole,
  RefreshCcw,
  Sparkles,
  UserCircle,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DEFAULT_ACCOUNT_CREDITS,
  fetchAccountCredits,
  type AccountCredits,
} from "@/lib/account-credits";
import {
  fetchCloudBlueprints,
  getCurrentSupabaseUser,
  mergeBlueprints,
  syncLocalBlueprintsToCloud,
} from "@/lib/blueprint-cloud";
import {
  getBlueprints,
  getBlueprintsSnapshot,
  getServerBlueprintsSnapshot,
  replaceBlueprints,
  subscribeToBlueprintStorage,
} from "@/lib/blueprint-storage";
import { getSupabaseClient } from "@/lib/supabase-client";
import type { Blueprint } from "@/types/blueprint";

function parseBlueprints(snapshot: string) {
  try {
    return JSON.parse(snapshot) as Blueprint[];
  } catch {
    return [];
  }
}

export default function AccountPage() {
  const snapshot = useSyncExternalStore(
    subscribeToBlueprintStorage,
    getBlueprintsSnapshot,
    getServerBlueprintsSnapshot,
  );
  const blueprints = useMemo(() => parseBlueprints(snapshot), [snapshot]);
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<AccountCredits>(DEFAULT_ACCOUNT_CREDITS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    async function loadAccount() {
      const currentUser = await getCurrentSupabaseUser();
      setUser(currentUser);

      if (currentUser) {
        const accountCredits = await fetchAccountCredits();
        setCredits(accountCredits ?? DEFAULT_ACCOUNT_CREDITS);
      }
    }

    void loadAccount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setCredits(DEFAULT_ACCOUNT_CREDITS);
        return;
      }

      void fetchAccountCredits().then((accountCredits) => {
        setCredits(accountCredits ?? DEFAULT_ACCOUNT_CREDITS);
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  async function syncWorkspace() {
    if (!user) {
      return;
    }

    setIsSyncing(true);

    try {
      const localBlueprints = getBlueprints();
      await syncLocalBlueprintsToCloud(user, localBlueprints);
      const cloudBlueprints = await fetchCloudBlueprints();
      replaceBlueprints(mergeBlueprints(localBlueprints, cloudBlueprints));
      const accountCredits = await fetchAccountCredits();
      setCredits(accountCredits ?? DEFAULT_ACCOUNT_CREDITS);
      setLastSyncedAt(new Date());
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <AppShell
      eyebrow="Account"
      title="Manage your LaunchPilot workspace."
      description="Review your signed-in account, remaining AI credits, and saved blueprint workspace."
    >
      {!user ? (
        <Card className="rounded-lg border-black/10 bg-white">
          <CardContent className="p-8">
            <LockKeyhole className="size-8 text-[#14756b]" />
            <h2 className="mt-5 text-2xl font-semibold">Sign in required</h2>
            <p className="mt-3 max-w-xl leading-7 text-[#625d54]">
              Account details and credits are available after sign-in. Use the
              landing page account panel to continue.
            </p>
            <Button asChild className="mt-6 rounded-md bg-[#191816] text-white">
              <Link href="/#signin">Go to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="rounded-lg border-black/10 bg-white lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <UserCircle className="size-6 text-[#14756b]" />
                Account details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-black/10 bg-[#fbfaf7] p-5">
                <p className="text-sm font-semibold text-[#14756b]">Signed in as</p>
                <p className="mt-2 break-words text-xl font-semibold">{user.email}</p>
                <p className="mt-2 text-sm leading-6 text-[#625d54]">
                  Your generation credits and cloud-saved blueprints are attached
                  to this Supabase account.
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-black/10 p-4">
                  <Sparkles className="size-5 text-[#14756b]" />
                  <p className="mt-4 text-sm text-[#625d54]">Credits used</p>
                  <p className="mt-1 text-3xl font-semibold">{credits.used}</p>
                </div>
                <div className="rounded-lg border border-black/10 p-4">
                  <CheckCircle2 className="size-5 text-[#14756b]" />
                  <p className="mt-4 text-sm text-[#625d54]">Credits remaining</p>
                  <p className="mt-1 text-3xl font-semibold">{credits.remaining}</p>
                </div>
                <div className="rounded-lg border border-black/10 p-4">
                  <ClipboardList className="size-5 text-[#14756b]" />
                  <p className="mt-4 text-sm text-[#625d54]">Saved blueprints</p>
                  <p className="mt-1 text-3xl font-semibold">{blueprints.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="rounded-lg border-black/10 bg-[#11100f] text-white">
              <CardContent className="p-6">
                <Cloud className="size-6 text-[#d6ff72]" />
                <h2 className="mt-5 text-xl font-semibold">Cloud workspace</h2>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  Sync local and cloud blueprints, then refresh account credits.
                </p>
                <p className="mt-4 text-xs text-white/45">
                  {lastSyncedAt
                    ? `Last synced ${lastSyncedAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "Not synced in this session"}
                </p>
                <Button
                  type="button"
                  disabled={isSyncing}
                  className="mt-5 w-full rounded-md bg-[#d6ff72] text-[#1f2a0d]"
                  onClick={syncWorkspace}
                >
                  <RefreshCcw
                    className={isSyncing ? "size-4 animate-spin" : "size-4"}
                  />
                  {isSyncing ? "Syncing" : "Sync workspace"}
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-lg border-black/10 bg-white">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold">Next action</h2>
                <p className="mt-3 text-sm leading-6 text-[#625d54]">
                  Use your remaining credits to generate another MVP blueprint,
                  or review the plans you already saved.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <Button asChild className="rounded-md bg-[#191816] text-white">
                    <Link href="/create">Create blueprint</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-md">
                    <Link href="/blueprints">View blueprints</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AppShell>
  );
}

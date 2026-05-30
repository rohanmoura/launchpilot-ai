"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, UserCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { getCurrentSupabaseUser } from "@/lib/blueprint-cloud";
import { getSupabaseClient } from "@/lib/supabase-client";

export function AccountStatus() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    getCurrentSupabaseUser().then(setUser);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
        <UserCircle className="size-5 text-[#d6ff72]" />
        <p className="mt-4 text-sm font-semibold text-white">Account</p>
        <p className="mt-2 text-sm leading-6 text-white/50">
          Sign in to use account credits and cloud-saved blueprints.
        </p>
        <Button
          asChild
          className="mt-4 w-full rounded-md bg-[#d6ff72] text-[#1f2a0d]"
        >
          <Link href="/#signin">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#d6ff72]/25 bg-[#d6ff72]/10 p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#d6ff72] text-sm font-semibold text-[#1f2a0d]">
          {(user.email ?? "LP").slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Account</p>
          <p className="truncate text-xs text-white/50">{user.email}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Button
          asChild
          variant="outline"
          className="rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/account">View account</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-md border-white/15 bg-transparent text-white/75 hover:bg-white/10 hover:text-white"
          onClick={signOut}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

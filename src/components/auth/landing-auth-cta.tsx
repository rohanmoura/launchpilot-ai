"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, LayoutDashboard, Plus } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { getCurrentSupabaseUser } from "@/lib/blueprint-cloud";
import { getSupabaseClient } from "@/lib/supabase-client";

type LandingAuthCtaProps = {
  compact?: boolean;
};

export function LandingAuthCta({ compact = false }: LandingAuthCtaProps) {
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

  if (compact) {
    return (
      <Button
        asChild
        size="icon"
        className="size-10 rounded-md bg-[#191816] text-white sm:h-10 sm:w-auto sm:px-4"
      >
        {user ? (
          <Link href="/dashboard">
            <span className="sr-only sm:not-sr-only sm:inline">Dashboard</span>
            <LayoutDashboard className="size-4" />
          </Link>
        ) : (
          <a href="#signin">
            <span className="sr-only sm:not-sr-only sm:inline">Sign in</span>
            <ArrowRight className="size-4" />
          </a>
        )}
      </Button>
    );
  }

  if (user) {
    return (
      <Button
        asChild
        size="lg"
        className="h-12 w-full rounded-md bg-[#191816] px-5 text-white sm:w-auto sm:px-6"
      >
        <Link href="/create">
          Create Blueprint
          <Plus className="size-4" />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      asChild
      size="lg"
      className="h-12 w-full rounded-md bg-[#191816] px-5 text-white sm:w-auto sm:px-6"
    >
      <a href="#signin">
        Sign in to Generate
        <ArrowRight className="size-4" />
      </a>
    </Button>
  );
}

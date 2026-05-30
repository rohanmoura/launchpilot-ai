"use client";

import { useEffect, useState } from "react";
import { Cloud, HardDrive } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Badge } from "@/components/ui/badge";
import { getCurrentSupabaseUser } from "@/lib/blueprint-cloud";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase-client";

export function WorkspaceBadge() {
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

  if (isSupabaseConfigured() && user) {
    return (
      <Badge className="w-fit rounded-md bg-[#e3f0ec] px-3 py-1 text-[#11665d] hover:bg-[#e3f0ec]">
        <Cloud className="size-3.5" />
        Cloud synced
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="w-fit rounded-md border-black/15 bg-white px-3 py-1 text-[#625d54]"
    >
      <HardDrive className="size-3.5" />
      Local workspace
    </Badge>
  );
}

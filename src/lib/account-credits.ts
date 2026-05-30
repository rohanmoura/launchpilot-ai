"use client";

import { getSupabaseClient } from "@/lib/supabase-client";

export type AccountCredits = {
  used: number;
  limit: number;
  remaining: number;
};

export const DEFAULT_ACCOUNT_CREDITS: AccountCredits = {
  used: 0,
  limit: 3,
  remaining: 3,
};

export async function getCurrentAccessToken() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function fetchAccountCredits() {
  const accessToken = await getCurrentAccessToken();

  if (!accessToken) {
    return null;
  }

  const response = await fetch("/api/generate-blueprint", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { credits: AccountCredits };
  return payload.credits;
}

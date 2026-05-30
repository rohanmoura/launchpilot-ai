"use client";

import type { User } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/lib/supabase-client";
import type { Blueprint } from "@/types/blueprint";

type BlueprintRow = {
  id: string;
  payload: Blueprint;
  updated_at: string;
};

export async function getCurrentSupabaseUser() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function fetchCloudBlueprints() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("blueprints")
    .select("id,payload,updated_at")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as BlueprintRow[]).map((row) => row.payload);
}

export async function upsertCloudBlueprint(blueprint: Blueprint) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    return;
  }

  await supabase.from("blueprints").upsert({
    id: blueprint.id,
    user_id: user.id,
    payload: blueprint,
    created_at: blueprint.createdAt,
    updated_at: blueprint.updatedAt,
  });
}

export async function deleteCloudBlueprint(id: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  await supabase.from("blueprints").delete().eq("id", id);
}

export function mergeBlueprints(local: Blueprint[], cloud: Blueprint[]) {
  const byId = new Map<string, Blueprint>();

  [...cloud, ...local].forEach((blueprint) => {
    const existing = byId.get(blueprint.id);

    if (!existing) {
      byId.set(blueprint.id, blueprint);
      return;
    }

    if (new Date(blueprint.updatedAt) > new Date(existing.updatedAt)) {
      byId.set(blueprint.id, blueprint);
    }
  });

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function syncLocalBlueprintsToCloud(
  user: User,
  localBlueprints: Blueprint[],
) {
  const supabase = getSupabaseClient();

  if (!supabase || localBlueprints.length === 0) {
    return;
  }

  await supabase.from("blueprints").upsert(
    localBlueprints.map((blueprint) => ({
      id: blueprint.id,
      user_id: user.id,
      payload: blueprint,
      created_at: blueprint.createdAt,
      updated_at: blueprint.updatedAt,
    })),
  );
}

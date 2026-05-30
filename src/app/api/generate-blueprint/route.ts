import { NextRequest, NextResponse } from "next/server";

import { generateBlueprintResult } from "@/lib/ai-blueprint";
import { blueprintInputSchema } from "@/lib/blueprint-schema";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const FREE_BLUEPRINT_CREDIT_LIMIT = 3;

type UsageCreditsRow = {
  user_id: string;
  generations_used: number;
  free_generation_limit: number;
};

function getAccessToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

async function getAuthenticatedUser(request: NextRequest) {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return { error: "Sign in is required before generating a blueprint." };
  }

  const supabase = getSupabaseServerClient(accessToken);

  if (!supabase) {
    return { error: "Supabase is not configured for account credits." };
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return { error: "Your sign-in session expired. Please sign in again." };
  }

  return { supabase, user: data.user };
}

async function getUsageCredits(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("usage_credits")
    .select("user_id,generations_used,free_generation_limit")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(
      "Could not read account credits. Run the updated Supabase schema first.",
    );
  }

  if (data) {
    return data as UsageCreditsRow;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("usage_credits")
    .insert({
      user_id: userId,
      generations_used: 0,
      free_generation_limit: FREE_BLUEPRINT_CREDIT_LIMIT,
    })
    .select("user_id,generations_used,free_generation_limit")
    .single();

  if (insertError || !inserted) {
    throw new Error("Could not create account credits for this user.");
  }

  return inserted as UsageCreditsRow;
}

async function incrementUsageCredits(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  usage: UsageCreditsRow,
) {
  const nextUsed = usage.generations_used + 1;
  const { error } = await supabase
    .from("usage_credits")
    .update({
      generations_used: nextUsed,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", usage.user_id);

  if (error) {
    throw new Error("Could not update account credits.");
  }

  return {
    used: nextUsed,
    limit: usage.free_generation_limit,
    remaining: Math.max(usage.free_generation_limit - nextUsed, 0),
  };
}

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser(request);

  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const usage = await getUsageCredits(auth.supabase, auth.user.id);
    return NextResponse.json({
      credits: {
        used: usage.generations_used,
        limit: usage.free_generation_limit,
        remaining: Math.max(
          usage.free_generation_limit - usage.generations_used,
          0,
        ),
      },
    });
  } catch (usageError) {
    return NextResponse.json(
      {
        error:
          usageError instanceof Error
            ? usageError.message
            : "Could not load account credits.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser(request);

  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  let usage: UsageCreditsRow;

  try {
    usage = await getUsageCredits(auth.supabase, auth.user.id);
  } catch (usageError) {
    return NextResponse.json(
      {
        error:
          usageError instanceof Error
            ? usageError.message
            : "Could not load account credits.",
      },
      { status: 500 },
    );
  }

  if (usage.generations_used >= usage.free_generation_limit) {
    return NextResponse.json(
      {
        error:
          "Free generation limit reached for this account. You can still review and export saved blueprints.",
      },
      { status: 402 },
    );
  }

  const body = await request.json();
  const parsed = blueprintInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Invalid blueprint input.",
      },
      { status: 400 },
    );
  }

  const { blueprint, source } = await generateBlueprintResult(parsed.data);
  const credits = await incrementUsageCredits(auth.supabase, usage);

  return NextResponse.json({ blueprint, source, credits });
}

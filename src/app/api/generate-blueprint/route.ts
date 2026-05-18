import { NextResponse } from "next/server";

import { generateBlueprint } from "@/lib/ai-blueprint";
import { blueprintInputSchema } from "@/lib/blueprint-schema";

export async function POST(request: Request) {
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

  const blueprint = await generateBlueprint(parsed.data);

  return NextResponse.json({ blueprint });
}

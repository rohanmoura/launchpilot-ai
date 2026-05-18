"use client";

import { Clipboard, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Blueprint } from "@/types/blueprint";

function blueprintToText(blueprint: Blueprint) {
  return [
    `${blueprint.productName}`,
    blueprint.oneLinePitch,
    "",
    "MVP Features:",
    ...blueprint.mvpFeatures.map((feature) => `- ${feature}`),
    "",
    "Next Steps:",
    ...blueprint.nextSteps.map((step) => `- ${step}`),
  ].join("\n");
}

export function BlueprintActions({ blueprint }: { blueprint: Blueprint }) {
  async function copyBlueprint() {
    await navigator.clipboard.writeText(blueprintToText(blueprint));
    toast.success("Blueprint copied");
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        type="button"
        onClick={copyBlueprint}
        className="rounded-md bg-[#191816] text-white"
      >
        <Clipboard className="size-4" />
        Copy blueprint
      </Button>
      <Button type="button" variant="outline" className="rounded-md">
        <FileText className="size-4" />
        PDF export mock
      </Button>
    </div>
  );
}

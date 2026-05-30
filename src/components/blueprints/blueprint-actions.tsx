"use client";

import { Clipboard, Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Blueprint } from "@/types/blueprint";

function blueprintToText(blueprint: Blueprint) {
  return [
    `# ${blueprint.productName}`,
    "",
    blueprint.oneLinePitch,
    "",
    "## Problem Statement",
    blueprint.problemStatement,
    "",
    "## Target Users",
    ...blueprint.targetUsers.map((user) => `- ${user}`),
    "",
    "MVP Features:",
    ...blueprint.mvpFeatures.map((feature) => `- ${feature}`),
    "",
    "## User Journey",
    ...blueprint.userJourney.map((step, index) => `${index + 1}. ${step}`),
    "",
    "## Recommended Tech Stack",
    ...blueprint.techStack.map(
      (item) => `- ${item.layer}: ${item.recommendation} - ${item.why}`,
    ),
    "",
    "## 30/60/90 Day Roadmap",
    ...blueprint.roadmap.flatMap((phase) => [
      `### ${phase.label}: ${phase.title}`,
      ...phase.items.map((item) => `- ${item}`),
    ]),
    "",
    "## Risks And Assumptions",
    ...blueprint.risksAndAssumptions.map((risk) => `- ${risk}`),
    "",
    "## Launch Checklist",
    ...blueprint.launchChecklist.map((item) => `- ${item}`),
    "",
    "## Monetization Ideas",
    ...blueprint.monetizationIdeas.map((idea) => `- ${idea}`),
    "",
    "## Next Steps",
    ...blueprint.nextSteps.map((step) => `- ${step}`),
  ].join("\n");
}

function createFileName(productName: string) {
  return `${productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-blueprint.md`;
}

export function BlueprintActions({ blueprint }: { blueprint: Blueprint }) {
  async function copyBlueprint() {
    await navigator.clipboard.writeText(blueprintToText(blueprint));
    toast.success("Full blueprint copied");
  }

  function downloadBlueprint() {
    const blob = new Blob([blueprintToText(blueprint)], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = createFileName(blueprint.productName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Markdown blueprint downloaded");
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
      <Button
        type="button"
        variant="outline"
        className="rounded-md border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        onClick={downloadBlueprint}
      >
        <Download className="size-4" />
        Download markdown
      </Button>
    </div>
  );
}

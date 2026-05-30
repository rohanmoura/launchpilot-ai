import type { Blueprint, BlueprintInput, ProjectType } from "@/types/blueprint";

const projectTypeLabels: Record<ProjectType, string> = {
  "web-app": "Web App",
  "mobile-app": "Mobile App",
  "ai-tool": "AI Tool",
  saas: "SaaS",
};

const projectWorkflowLabels: Record<ProjectType, string> = {
  "web-app": "web app",
  "mobile-app": "mobile app",
  "ai-tool": "AI tool",
  saas: "SaaS",
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `blueprint-${Date.now()}`;
}

function suggestProductName(input: BlueprintInput) {
  const idea = input.productIdea.toLowerCase();

  if (idea.includes("fitness") || idea.includes("workout")) {
    return "FitFlow AI Coach";
  }

  if (idea.includes("finance") || idea.includes("invoice")) {
    return "LedgerPilot";
  }

  if (idea.includes("content") || idea.includes("creator")) {
    return "CreatorOps AI";
  }

  if (idea.includes("crm") || idea.includes("sales")) {
    return "DealPilot CRM";
  }

  const meaningfulWords = input.productIdea
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 2);

  if (meaningfulWords.length > 0) {
    return `${meaningfulWords
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join("")} Pilot`;
  }

  return "LaunchPilot Blueprint";
}

function splitFeatureInput(features: string) {
  const parsed = features
    .split(/[,.\n]/)
    .map((feature) => feature.trim())
    .filter(Boolean)
    .slice(0, 5);

  if (parsed.length > 0) {
    return parsed.map((feature) =>
      feature.length > 2 ? feature[0].toUpperCase() + feature.slice(1) : feature,
    );
  }

  return [
    "Guided onboarding",
    "Core workflow dashboard",
    "AI-generated recommendations",
    "Saved history",
    "Upgrade-ready pricing screen",
  ];
}

function summarizeIdea(input: BlueprintInput) {
  return input.productIdea.trim().replace(/\s+/g, " ");
}

function getPrimaryOutcome(input: BlueprintInput) {
  const problem = input.problemSolved.trim().replace(/\s+/g, " ");

  if (problem.length > 96) {
    const shortened = problem.slice(0, 93).replace(/\s+\S*$/, "").trim();
    return `${shortened}...`;
  }

  return problem;
}

function getStackForProjectType(projectType: ProjectType) {
  if (projectType === "mobile-app") {
    return [
      {
        layer: "Mobile app",
        recommendation: "React Native with Expo",
        why: "Fast cross-platform delivery while keeping the first app build realistic.",
      },
      {
        layer: "Backend",
        recommendation: "Supabase with server actions",
        why: "Covers auth, data storage, and lightweight business logic without overbuilding.",
      },
      {
        layer: "Analytics",
        recommendation: "PostHog or Firebase Analytics",
        why: "Tracks activation, retention, and the product behaviors that matter after launch.",
      },
    ];
  }

  if (projectType === "ai-tool") {
    return [
      {
        layer: "Frontend",
        recommendation: "Next.js with Tailwind CSS",
        why: "Strong for polished AI workflows, landing pages, and dashboard-style output.",
      },
      {
        layer: "AI orchestration",
        recommendation: "Server route with Gemini/OpenRouter fallback",
        why: "Keeps prompts private, normalizes responses, and prevents the UI from depending on one model.",
      },
      {
        layer: "Database",
        recommendation: "Supabase PostgreSQL",
        why: "Stores user inputs, generated results, and reusable history for future accounts.",
      },
    ];
  }

  return [
    {
      layer: "Frontend",
      recommendation: "Next.js with Tailwind CSS",
      why: "Fast to build, easy to deploy, and strong for SaaS dashboards.",
    },
    {
      layer: "Backend",
      recommendation: "Next.js API routes",
      why: "Keeps early product logic close to the app without extra infrastructure.",
    },
    {
      layer: "Database",
      recommendation: "Supabase PostgreSQL",
      why: "Adds auth, saved data, and scalable records when the MVP moves beyond demo mode.",
    },
  ];
}

export function generateMockBlueprint(input: BlueprintInput): Blueprint {
  const now = new Date().toISOString();
  const productName = suggestProductName(input);
  const mvpFeatures = splitFeatureInput(input.mainFeatures);
  const projectLabel = projectTypeLabels[input.projectType];
  const workflowLabel = projectWorkflowLabels[input.projectType];
  const ideaSummary = summarizeIdea(input);
  const primaryOutcome = getPrimaryOutcome(input);

  return {
    id: createId(),
    status: "generated",
    createdAt: now,
    updatedAt: now,
    input,
    productName,
    oneLinePitch: `${productName} gives ${input.targetAudience.toLowerCase()} one focused ${projectLabel} workflow to solve: ${primaryOutcome}`,
    problemStatement: `${input.problemSolved} The first version should prove whether ${input.targetAudience.toLowerCase()} will use a simple, repeatable workflow around: ${ideaSummary}. Avoid heavy secondary features until the core promise is validated.`,
    targetUsers: [
      input.targetAudience,
      `Early adopters who already feel the pain: ${primaryOutcome}`,
      "Users willing to test a focused first version before a full platform exists",
      "Decision-makers who care about speed, clarity, and measurable outcomes",
    ],
    mvpFeatures,
    userJourney: [
      "User lands on a clear promise and understands the outcome quickly.",
      "User enters their goal, context, and constraints in a guided intake.",
      `The product turns that input into the first useful ${workflowLabel} output.`,
      "User saves, reviews, or repeats the workflow.",
      "The product introduces a paid upgrade after value is demonstrated.",
    ],
    techStack: [
      ...getStackForProjectType(input.projectType),
      {
        layer: "AI",
        recommendation:
          input.projectType === "ai-tool"
            ? "Structured generation with schema validation"
            : "Optional AI assistant layer",
        why:
          input.projectType === "ai-tool"
            ? "Keeps generated outputs reliable, exportable, and easier to improve from feedback."
            : "Adds useful guidance without making the first version depend entirely on AI.",
      },
    ],
    roadmap: [
      {
        label: "30 days",
        title: "Validate the core use case",
        items: [
          `Interview ${input.targetAudience.toLowerCase()} and test the problem statement`,
          "Prototype the primary workflow before building secondary features",
          "Define activation and success metrics for the first MVP test",
        ],
      },
      {
        label: "60 days",
        title: "Build the MVP",
        items: [
          `Develop onboarding, dashboard, and the core ${workflowLabel} workflow`,
          "Add saved history and simple account-ready structure",
          "Run internal QA and collect early user feedback",
        ],
      },
      {
        label: "90 days",
        title: "Launch and learn",
        items: [
          "Release to a focused beta audience",
          "Track activation, retention, and conversion signals",
          "Prioritize the next sprint from real user behavior",
        ],
      },
    ],
    launchChecklist: [
      "Write a landing page with one clear promise",
      `Prepare realistic sample data for ${input.targetAudience.toLowerCase()}`,
      "Set up analytics for activation events",
      "Create a feedback form for beta users",
      "Add a build-with-KMAX call to action",
    ],
    monetizationIdeas: [
      "Free tier with limited usage",
      "Pro plan for unlimited generation or saved projects",
      "Done-for-you setup package",
      "Agency or team workspace plan",
    ],
    risksAndAssumptions: [
      `${input.targetAudience} may need clearer proof before they trust the workflow.`,
      "The first version must avoid too many features and focus on one sharp outcome.",
      "AI or automation features can create unreliable results without strong validation.",
      "The MVP needs real user feedback before adding complex integrations.",
    ],
    nextSteps: [
      "Narrow the first version to the one workflow that proves demand.",
      "Create a clickable prototype or working first version before adding billing.",
      "Use the first beta users to validate whether the output is useful enough to repeat.",
      "Turn the strongest blueprint into a scoped KMAX Design MVP sprint.",
    ],
  };
}

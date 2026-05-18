import type { Blueprint, BlueprintInput, ProjectType } from "@/types/blueprint";

const projectTypeLabels: Record<ProjectType, string> = {
  "web-app": "Web App",
  "mobile-app": "Mobile App",
  "ai-tool": "AI Tool",
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

export function generateMockBlueprint(input: BlueprintInput): Blueprint {
  const now = new Date().toISOString();
  const productName = suggestProductName(input);
  const mvpFeatures = splitFeatureInput(input.mainFeatures);
  const projectLabel = projectTypeLabels[input.projectType];

  return {
    id: createId(),
    status: "generated",
    createdAt: now,
    updatedAt: now,
    input,
    productName,
    oneLinePitch: `${productName} helps ${input.targetAudience.toLowerCase()} solve ${input.problemSolved.toLowerCase()} through a focused ${projectLabel.toLowerCase()} MVP.`,
    problemStatement: `${input.targetAudience} need a simpler way to move from intent to action. The MVP should focus on the smallest repeatable workflow that proves users want this solution before adding complex automation or heavy integrations.`,
    targetUsers: [
      input.targetAudience,
      "Early adopters actively looking for a better workflow",
      "Users willing to test a focused MVP before a full platform exists",
      "Decision-makers who care about speed, clarity, and measurable outcomes",
    ],
    mvpFeatures,
    userJourney: [
      "User lands on a clear promise and understands the outcome quickly.",
      "User completes onboarding with their core goal, context, and constraints.",
      "The product generates or organizes the first useful output.",
      "User saves, reviews, or repeats the workflow.",
      "The product introduces a paid upgrade after value is demonstrated.",
    ],
    techStack: [
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
      {
        layer: "AI",
        recommendation: "Gemini API with OpenRouter fallback",
        why: "Supports low-cost structured generation while protecting the demo with fallback logic.",
      },
    ],
    roadmap: [
      {
        label: "30 days",
        title: "Validate the core use case",
        items: [
          "Interview target users and refine the problem statement",
          "Create clickable product flow for the primary workflow",
          "Define success metrics for the first MVP test",
        ],
      },
      {
        label: "60 days",
        title: "Build the MVP",
        items: [
          "Develop onboarding, dashboard, and the core generation flow",
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
      "Prepare demo data for the target audience",
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
      "The target audience may need more education before they trust the workflow.",
      "The first version must avoid too many features and focus on one sharp outcome.",
      "Free AI APIs can hit quota limits, so fallback output is required.",
      "The MVP needs real user feedback before adding complex integrations.",
    ],
    nextSteps: [
      "Build the primary workflow before auth or billing.",
      "Use mock data until the user experience feels polished.",
      "Add real AI generation behind a stable server route.",
      "Turn the finished MVP into a KMAX Design portfolio case study.",
    ],
  };
}

export type ProjectType = "web-app" | "mobile-app" | "ai-tool" | "saas";

export type BlueprintStatus = "draft" | "generated" | "archived";

export type BlueprintInput = {
  productIdea: string;
  targetAudience: string;
  problemSolved: string;
  mainFeatures: string;
  projectType: ProjectType;
  budgetRange: string;
  timeline: string;
};

export type RoadmapPhase = {
  label: "30 days" | "60 days" | "90 days";
  title: string;
  items: string[];
};

export type TechStackSection = {
  layer: string;
  recommendation: string;
  why: string;
};

export type Blueprint = {
  id: string;
  status: BlueprintStatus;
  createdAt: string;
  updatedAt: string;
  input: BlueprintInput;
  productName: string;
  oneLinePitch: string;
  problemStatement: string;
  targetUsers: string[];
  mvpFeatures: string[];
  userJourney: string[];
  techStack: TechStackSection[];
  roadmap: RoadmapPhase[];
  launchChecklist: string[];
  monetizationIdeas: string[];
  risksAndAssumptions: string[];
  nextSteps: string[];
};

export type BlueprintSummary = Pick<
  Blueprint,
  "id" | "status" | "createdAt" | "updatedAt" | "productName" | "oneLinePitch"
> & {
  projectType: ProjectType;
};

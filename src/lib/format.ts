import type { ProjectType } from "@/types/blueprint";

export const projectTypeLabels: Record<ProjectType, string> = {
  "web-app": "Web App",
  "mobile-app": "Mobile App",
  "ai-tool": "AI Tool",
  saas: "SaaS",
};

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

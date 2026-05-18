import { z } from "zod";

export const blueprintInputSchema = z.object({
  productIdea: z.string().min(12, "Describe the product idea in a little more detail."),
  targetAudience: z.string().min(4, "Add the target audience."),
  problemSolved: z.string().min(8, "Explain the problem being solved."),
  mainFeatures: z.string().min(4, "Add at least one feature."),
  projectType: z.enum(["web-app", "mobile-app", "ai-tool", "saas"]),
  budgetRange: z.string().min(2, "Add a budget range."),
  timeline: z.string().min(2, "Add a timeline."),
});

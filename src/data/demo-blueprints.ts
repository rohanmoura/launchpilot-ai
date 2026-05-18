import type { Blueprint } from "@/types/blueprint";

export const demoBlueprints: Blueprint[] = [
  {
    id: "demo-fitflow-ai-coach",
    status: "generated",
    createdAt: "2026-05-18T12:45:00.000Z",
    updatedAt: "2026-05-18T12:45:00.000Z",
    input: {
      productIdea:
        "An AI fitness coach app for busy professionals that creates personalized workout and meal plans.",
      targetAudience: "Busy professionals with limited time for fitness planning.",
      problemSolved:
        "People want to stay healthy but struggle to plan workouts, meals, and progress tracking around their schedule.",
      mainFeatures:
        "Onboarding, goal setup, AI workout planner, meal suggestions, progress tracking, subscription page.",
      projectType: "ai-tool",
      budgetRange: "$5k - $15k",
      timeline: "8-10 weeks",
    },
    productName: "FitFlow AI Coach",
    oneLinePitch:
      "Personalized fitness and meal planning for busy professionals who need structure without the planning work.",
    problemStatement:
      "Busy professionals often know what they want to achieve but lose momentum because planning takes too much time and generic fitness apps do not adapt to their schedule, equipment, and goals.",
    targetUsers: [
      "Professionals working long hours",
      "Remote workers trying to build healthier routines",
      "Beginners who need clear daily guidance",
      "Fitness-conscious users who want meal and workout planning in one place",
    ],
    mvpFeatures: [
      "Goal and schedule onboarding",
      "Equipment-aware workout planner",
      "AI meal suggestion engine",
      "Weekly progress check-in",
      "Subscription-ready upgrade screen",
    ],
    userJourney: [
      "User answers questions about goals, schedule, equipment, and diet preferences.",
      "The app generates a weekly workout and meal plan.",
      "User marks workouts complete and logs basic progress.",
      "The system adjusts upcoming recommendations based on completion and feedback.",
      "User is prompted to upgrade for unlimited plan refreshes and advanced tracking.",
    ],
    techStack: [
      {
        layer: "Frontend",
        recommendation: "React Native or Next.js PWA",
        why: "Fast mobile-friendly MVP with reusable UI patterns and lower first-build cost.",
      },
      {
        layer: "Backend",
        recommendation: "Next.js API routes with Supabase",
        why: "Simple auth, database, and server logic without heavy infrastructure.",
      },
      {
        layer: "AI",
        recommendation: "Gemini or OpenRouter free model fallback",
        why: "Enough for structured plan generation while keeping MVP costs low.",
      },
      {
        layer: "Payments",
        recommendation: "Stripe Checkout",
        why: "Reliable subscription flow that can be added once the planning loop is validated.",
      },
    ],
    roadmap: [
      {
        label: "30 days",
        title: "Validate the promise",
        items: [
          "Interview 10-15 target users",
          "Prototype onboarding and weekly plan output",
          "Test whether users trust AI-generated routines",
        ],
      },
      {
        label: "60 days",
        title: "Build the MVP loop",
        items: [
          "Ship onboarding and plan generation",
          "Add progress check-ins",
          "Create simple account and saved plan history",
        ],
      },
      {
        label: "90 days",
        title: "Launch paid beta",
        items: [
          "Invite first beta users",
          "Add subscription page",
          "Measure retention, plan completion, and upgrade intent",
        ],
      },
    ],
    launchChecklist: [
      "Create landing page with clear promise",
      "Set up waitlist or beta invite form",
      "Prepare 3 sample plans for demo users",
      "Add analytics for onboarding completion",
      "Launch to a focused professional community",
    ],
    monetizationIdeas: [
      "Monthly subscription for unlimited plans",
      "Premium meal plans and grocery lists",
      "Corporate wellness packages",
      "Coach-assisted plan review as an upsell",
    ],
    risksAndAssumptions: [
      "Users may not trust AI-generated health advice without guardrails.",
      "Meal planning can become complex due to dietary restrictions.",
      "Retention depends on habit formation, not only plan quality.",
      "Medical disclaimers and safety boundaries are required.",
    ],
    nextSteps: [
      "Validate the top user segment before building advanced tracking.",
      "Keep the first MVP focused on weekly plan generation and completion.",
      "Use KMAX Design to turn the blueprint into a build-ready product sprint.",
    ],
  },
];

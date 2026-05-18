import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Layers3,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const processSteps = [
  {
    title: "Describe the idea",
    description: "Capture the audience, problem, platform, budget, and timeline.",
    icon: ClipboardList,
  },
  {
    title: "Generate the blueprint",
    description: "Turn messy founder notes into a structured MVP plan.",
    icon: Sparkles,
  },
  {
    title: "Move into build mode",
    description: "Review scope, risks, roadmap, and the next steps with KMAX.",
    icon: Layers3,
  },
];

const blueprintPreview = [
  "AI workout planner",
  "Goal onboarding",
  "Meal suggestions",
  "Progress tracking",
  "Subscription flow",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#191816]">
      <section className="relative isolate min-h-screen overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(255,255,255,0.94),rgba(247,245,239,0.82))]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(20,117,107,0.16),transparent_30%),radial-gradient(circle_at_8%_84%,rgba(199,123,47,0.16),transparent_28%)]" />

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-md bg-[#191816] text-sm text-white">
              LP
            </span>
            LaunchPilot AI
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#56514a] md:flex">
            <a href="#process" className="hover:text-[#191816]">
              Process
            </a>
            <a href="#preview" className="hover:text-[#191816]">
              Output
            </a>
            <a href="#pricing" className="hover:text-[#191816]">
              Pricing
            </a>
          </nav>
          <Button asChild className="h-10 rounded-md bg-[#191816] px-4 text-white">
            <Link href="/create">
              Create Blueprint
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </header>

        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pb-20 lg:pt-20">
          <div className="max-w-3xl">
            <Badge className="mb-5 rounded-md border border-[#14756b]/20 bg-[#e7f2ee] px-3 py-1 text-[#11665d] hover:bg-[#e7f2ee]">
              AI MVP planner for serious founders
            </Badge>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] tracking-normal text-[#191816] sm:text-6xl lg:text-7xl">
              LaunchPilot AI turns raw startup ideas into build-ready MVP
              blueprints.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#56514a]">
              Give it the idea, target audience, features, budget, and timeline.
              Get a founder-ready product brief with scope, stack, roadmap,
              risks, and launch steps.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-md bg-[#191816] px-6 text-white"
              >
                <Link href="/create">
                  Create MVP Blueprint
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-md border-black/15 bg-white/70 px-6"
              >
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>

          <div
            id="preview"
            className="relative min-h-[520px] overflow-hidden rounded-lg border border-black/10 bg-[#11100f] p-4 shadow-2xl shadow-black/20"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 text-white">
              <div>
                <p className="text-sm text-white/55">Generated blueprint</p>
                <h2 className="mt-1 text-xl font-semibold">FitFlow AI Coach</h2>
              </div>
              <Badge className="rounded-md bg-[#d6ff72] text-[#1f2a0d] hover:bg-[#d6ff72]">
                Ready
              </Badge>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-md bg-white p-5 text-[#191816]">
                <p className="text-xs font-semibold uppercase text-[#14756b]">
                  One-line pitch
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  Personalized fitness planning for busy professionals.
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#625d54]">
                  MVP scope focuses on onboarding, AI workout generation, meal
                  suggestions, progress check-ins, and a subscription-ready
                  upgrade path.
                </p>
              </section>

              <section className="rounded-md bg-[#f2efe6] p-5 text-[#191816]">
                <p className="text-xs font-semibold uppercase text-[#a35c1d]">
                  30/60/90 roadmap
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <p>
                    <span className="font-semibold">30 days:</span> Validate
                    user pain and core onboarding.
                  </p>
                  <p>
                    <span className="font-semibold">60 days:</span> Build AI
                    plans and progress tracking.
                  </p>
                  <p>
                    <span className="font-semibold">90 days:</span> Launch beta
                    and paid plan.
                  </p>
                </div>
              </section>
            </div>

            <section className="mt-4 rounded-md border border-white/10 bg-white/[0.06] p-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-white/45">
                    MVP feature set
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Build the smallest version that can sell.
                  </h3>
                </div>
                <div className="hidden text-right text-sm text-white/50 sm:block">
                  Est. 8-10 weeks
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {blueprintPreview.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-md bg-white/[0.08] p-3 text-sm"
                  >
                    <CheckCircle2 className="size-4 text-[#d6ff72]" />
                    {feature}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section id="process" className="border-b border-black/10 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-[#14756b]">
              Simple workflow
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-normal">
              From idea fog to practical build plan.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {processSteps.map((step) => (
              <article
                key={step.title}
                className="rounded-lg border border-black/10 bg-[#fbfaf7] p-6"
              >
                <step.icon className="size-6 text-[#14756b]" />
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-[#625d54]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#191816] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-[#d6ff72]">
              Portfolio-ready pricing model
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-normal">
              Credits make the SaaS model clear without slowing the MVP.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-white/12 bg-white/[0.06] p-6">
              <p className="text-sm text-white/55">Free</p>
              <h3 className="mt-2 text-3xl font-semibold">3 blueprints</h3>
              <p className="mt-4 text-sm leading-6 text-white/60">
                Enough for founders to test ideas and understand the workflow.
              </p>
            </div>
            <div className="rounded-lg border border-[#d6ff72]/40 bg-[#d6ff72] p-6 text-[#1f2a0d]">
              <p className="text-sm text-[#4b5d19]">Pro</p>
              <h3 className="mt-2 text-3xl font-semibold">Unlimited</h3>
              <p className="mt-4 text-sm leading-6 text-[#4b5d19]">
                Designed for founders, agencies, and operators planning builds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

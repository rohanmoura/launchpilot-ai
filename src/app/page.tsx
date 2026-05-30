import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  FileText,
  Layers3,
  LineChart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { LandingAuthCta } from "@/components/auth/landing-auth-cta";

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

const blueprintStats = [
  { label: "Build scope", value: "6 core flows" },
  { label: "Launch path", value: "90 days" },
  { label: "Risk level", value: "Medium" },
];

const painPoints = [
  "Too many feature ideas, no clear first version",
  "Unclear tech stack, timeline, and launch path",
  "Hard to explain the product to builders or investors",
];

const outputSections = [
  "Product brief",
  "Target users",
  "MVP features",
  "User journey",
  "Tech stack",
  "30/60/90 roadmap",
  "Risks",
  "Launch checklist",
];

const trustPoints = [
  {
    title: "Built for founder decisions",
    description:
      "The output is structured around scope, tradeoffs, launch sequence, and next actions.",
    icon: Users,
  },
  {
    title: "No fake validation",
    description:
      "LaunchPilot keeps the plan honest: assumptions, risks, and validation steps are visible.",
    icon: ShieldCheck,
  },
  {
    title: "Connected to build mode",
    description:
      "Every blueprint can become a scoped MVP sprint with KMAX Design.",
    icon: Rocket,
  },
];

const faqs = [
  {
    question: "Is this only for SaaS ideas?",
    answer:
      "No. It supports SaaS, AI tools, web apps, and mobile app MVPs.",
  },
  {
    question: "Does it replace product strategy?",
    answer:
      "It gives founders a strong starting blueprint. Real user feedback still decides what should be built next.",
  },
  {
    question: "Can KMAX build the blueprint?",
    answer:
      "Yes. The blueprint is designed to become a scoped MVP sprint conversation with KMAX Design.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f1e9] text-[#191816]">
      <section className="relative isolate overflow-hidden border-b border-black/10 bg-[linear-gradient(180deg,#fbfaf6_0%,#f4f1e9_100%)]">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 overflow-hidden px-4 py-4 sm:px-8">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 font-semibold text-[#191816]"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#191816] text-sm text-white">
              LP
            </span>
            <span className="truncate">LaunchPilot AI</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#56514a] md:flex">
            <a href="#process" className="hover:text-[#191816]">
              Process
            </a>
            <a href="#preview" className="hover:text-[#191816]">
              Output
            </a>
            <a href="#trust" className="hover:text-[#191816]">
              Trust
            </a>
            <a href="#pricing" className="hover:text-[#191816]">
              Pricing
            </a>
          </nav>
          <LandingAuthCta compact />
        </header>

        <div className="mr-auto grid w-full max-w-[392px] gap-8 px-4 pb-10 pt-8 sm:mx-auto sm:max-w-7xl sm:px-8 sm:pb-14 lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:pb-16 lg:pt-14">
          <div className="landing-reveal min-w-0 max-w-[360px] sm:max-w-2xl">
            <Badge className="mb-5 rounded-md border border-[#14756b]/20 bg-[#e3f0ec] px-3 py-1 text-[#11665d] hover:bg-[#e3f0ec]">
              AI MVP planner for serious founders
            </Badge>
            <h1 className="max-w-full break-words text-[1.95rem] font-medium leading-[1.08] tracking-normal text-[#191816] sm:max-w-3xl sm:text-5xl lg:text-[4rem]">
              Plan the MVP before you build it.
            </h1>
            <p className="mt-6 max-w-full text-base leading-7 text-[#56514a] sm:max-w-xl sm:text-lg sm:leading-8">
              Give it the idea, target audience, features, budget, and timeline.
              Get a founder-ready product brief with scope, stack, roadmap, risks,
              and launch steps.
            </p>
            <div className="mt-8 flex min-w-0 flex-col gap-3 sm:flex-row">
              <LandingAuthCta />
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-md border-black/15 bg-white/70 px-6 sm:w-auto"
              >
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
            <div className="mt-8 grid max-w-full grid-cols-1 gap-3 border-y border-black/10 py-4 sm:max-w-xl sm:grid-cols-3">
              {blueprintStats.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <p className="text-xs font-medium uppercase text-[#7a746b]">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#191816] sm:text-base">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            id="preview"
            className="landing-reveal landing-reveal-delay-1 relative min-w-0 max-w-[360px] overflow-hidden rounded-lg border border-black/10 bg-[#11100f] p-3 shadow-2xl shadow-black/20 sm:max-w-none sm:p-4"
          >
            <div className="blueprint-scan pointer-events-none absolute inset-x-3 top-0 z-10 h-24 rounded-full bg-[#d6ff72]/10 blur-xl" />
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-white">
              <div>
                <p className="flex items-center gap-2 text-sm text-white/55">
                  <Sparkles className="size-4 text-[#d6ff72]" />
                  Generating blueprint
                  <span className="blueprint-dots inline-block w-5 overflow-hidden align-bottom">
                    ...
                  </span>
                </p>
                <h2 className="mt-1 text-xl font-semibold">FitFlow AI Coach</h2>
              </div>
              <Badge className="rounded-md bg-[#d6ff72] text-[#1f2a0d] hover:bg-[#d6ff72]">
                Live draft
              </Badge>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {["Read idea", "Shape scope", "Draft plan"].map((step, index) => (
                <div
                  key={step}
                  className={`blueprint-step blueprint-step-${index + 1} rounded-md border border-white/10 bg-white/[0.06] px-3 py-2`}
                >
                  <p className="text-[0.7rem] font-semibold uppercase text-white/40">
                    Step {index + 1}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="blueprint-card-pulse min-w-0 rounded-md bg-white p-4 text-[#191816] sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#e3f0ec] text-[#14756b]">
                    <FileText className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-[#14756b]">
                      Product brief
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">
                      Personalized fitness planning for busy professionals.
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-[#625d54]">
                      MVP scope focuses on onboarding, AI workout generation,
                      meal suggestions, progress check-ins, and a subscription
                      upgrade path.
                    </p>
                  </div>
                </div>
              </section>

              <div className="grid gap-3">
                <section className="rounded-md bg-[#f2efe6] p-4 text-[#191816]">
                  <p className="text-xs font-semibold uppercase text-[#a35c1d]">
                    30/60/90 roadmap
                  </p>
                  <div className="mt-4 space-y-3 text-sm">
                    <p>
                      <span className="font-semibold">30 days:</span> Validate
                      user pain.
                    </p>
                    <p>
                      <span className="font-semibold">60 days:</span> Build AI
                      plans.
                    </p>
                    <p>
                      <span className="font-semibold">90 days:</span> Launch beta.
                    </p>
                  </div>
                </section>
                <section className="rounded-md border border-white/10 bg-white/[0.06] p-4 text-white">
                  <div className="flex items-center gap-3">
                    <LineChart className="size-5 text-[#d6ff72]" />
                    <div>
                      <p className="text-xs uppercase text-white/45">
                        Founder decision
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        Start with paid beta, not a full platform.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <section className="mt-3 rounded-md border border-white/10 bg-white/[0.06] p-4 text-white sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
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
                {blueprintPreview.map((feature, index) => (
                  <div
                    key={feature}
                    className={`blueprint-feature blueprint-feature-${index + 1} flex items-center gap-3 rounded-md bg-white/[0.08] p-3 text-sm`}
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

      <section className="border-b border-black/10 bg-[#f4f1e9] py-20">
        <div className="landing-reveal mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-[#14756b]">
              Founder problem
            </p>
            <h2 className="mt-3 max-w-xl text-4xl font-semibold tracking-normal">
              Most ideas fail before development starts.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-[#625d54]">
              Not because the idea is bad, but because the first build is too
              vague. LaunchPilot turns messy founder thinking into a plan that
              can be reviewed, scoped, and shipped.
            </p>
          </div>

          <div className="grid gap-3">
            {painPoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-4 rounded-lg border border-black/10 bg-white p-5"
              >
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#a35c1d]" />
                <p className="font-medium text-[#191816]">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="border-b border-black/10 bg-white py-20">
        <div className="landing-reveal mx-auto max-w-7xl px-5 sm:px-8">
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
                className="landing-card-hover rounded-lg border border-black/10 bg-[#fbfaf7] p-6"
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

      <section className="border-b border-black/10 bg-[#fbfaf6] py-20">
        <div className="landing-reveal mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-[#14756b]">
              Account workspace
            </p>
            <h2 className="mt-3 max-w-xl text-4xl font-semibold tracking-normal">
              Sign in once. Keep every MVP plan tied to your account.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-[#625d54]">
              LaunchPilot uses account-based credits, cloud-saved blueprints,
              and secure Supabase sessions. Google sign-in is the fastest path;
              email and password is available when you prefer it.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-[#625d54] sm:grid-cols-3">
              <div className="rounded-md border border-black/10 bg-white p-4">
                3 free AI generations
              </div>
              <div className="rounded-md border border-black/10 bg-white p-4">
                Cloud blueprint history
              </div>
              <div className="rounded-md border border-black/10 bg-white p-4">
                Export-ready plans
              </div>
            </div>
          </div>
          <AuthCard />
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#fbfaf6] py-20">
        <div className="landing-reveal mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase text-[#14756b]">
                Blueprint output
              </p>
              <h2 className="mt-3 max-w-xl text-4xl font-semibold tracking-normal">
                A practical product brief, not a loose AI paragraph.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-[#625d54]">
                Each generated plan is split into sections a founder can act on:
                scope, stack, roadmap, risks, monetization, and launch steps.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-11 rounded-md bg-[#191816] text-white">
                  <Link href="/create">
                    Generate a sample plan
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-md">
                  <Link href="/blueprints">View saved blueprints</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-black/10 bg-white p-5 shadow-xl shadow-black/5">
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <div>
                  <p className="text-sm text-[#625d54]">Example blueprint</p>
                  <h3 className="mt-1 text-2xl font-semibold">FitFlow AI Coach</h3>
                </div>
                <Badge className="rounded-md bg-[#e3f0ec] text-[#11665d] hover:bg-[#e3f0ec]">
                  8 sections
                </Badge>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {outputSections.map((section) => (
                  <div
                    key={section}
                    className="flex items-center gap-3 rounded-md bg-[#f7f5ef] p-3 text-sm font-medium"
                  >
                    <CheckCircle2 className="size-4 text-[#14756b]" />
                    {section}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="border-b border-black/10 bg-white py-20">
        <div className="landing-reveal mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-[#14756b]">
              Trust and positioning
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-normal">
              Made for serious idea owners, not casual prompt experiments.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {trustPoints.map((point) => (
              <article
                key={point.title}
                className="landing-card-hover rounded-lg border border-black/10 bg-[#fbfaf7] p-6"
              >
                <point.icon className="size-6 text-[#14756b]" />
                <h3 className="mt-6 text-xl font-semibold">{point.title}</h3>
                <p className="mt-3 leading-7 text-[#625d54]">
                  {point.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#191816] py-20 text-white">
        <div className="landing-reveal mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-[#d6ff72]">
              Usage plans
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-normal">
              Start with 3 free blueprints, then move into a build conversation.
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
              <p className="text-sm text-[#4b5d19]">Founder sprint</p>
              <h3 className="mt-2 text-3xl font-semibold">Coming soon</h3>
              <p className="mt-4 text-sm leading-6 text-[#4b5d19]">
                For founders who want KMAX Design to turn a blueprint into a
                scoped MVP sprint.
              </p>
              <Button asChild className="mt-5 rounded-md bg-[#191816] text-white">
                <Link href="https://kmaxdesign.com/" target="_blank" rel="noreferrer">
                  Talk to KMAX
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#fbfaf6] py-20">
        <div className="landing-reveal mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[#14756b]">
              FAQ
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-normal">
              Before you generate the first blueprint.
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-black/10 bg-white p-5">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-2 leading-7 text-[#625d54]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#d6ff72] py-16 text-[#1f2a0d]">
        <div className="landing-reveal mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#4b5d19]">
              Build with KMAX Design
            </p>
            <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-normal">
              Have a blueprint? Turn it into a scoped MVP sprint.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 rounded-md bg-[#191816] text-white">
              <Link href="https://kmaxdesign.com/" target="_blank" rel="noreferrer">
                Work with KMAX
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-md border-[#1f2a0d]/25 bg-transparent"
            >
              <Link href="/create">Create MVP Blueprint</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

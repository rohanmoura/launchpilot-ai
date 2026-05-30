# LaunchPilot AI

LaunchPilot AI is an AI SaaS MVP planner for founders. It turns a raw product idea into a practical blueprint with MVP scope, target users, tech stack, roadmap, risks, monetization ideas, launch checklist, and next steps.

This project is built as a KMAX Design portfolio product to prove founder-focused product thinking, SaaS UI ability, AI workflow design, dashboard/history flows, and a conversion bridge into MVP build services.

## Core Flow

1. Founder lands on the product page.
2. Founder creates an MVP blueprint from guided intake fields.
3. Founder signs in to use account-based AI generation credits.
4. LaunchPilot generates a structured product plan.
5. Blueprint is saved in the local workspace and synced to Supabase for signed-in users.
6. Founder can review, copy, download, or delete blueprints.
7. Strong CTA connects the plan to a KMAX Design MVP sprint.

## Screens

- Landing page with hero, product promise, process, output preview, trust section, pricing, FAQ, and KMAX CTA.
- Auth-aware landing CTAs that send signed-out users to sign in and signed-in users into the app.
- Dashboard with usage credits, product metrics, recent blueprints, and build-sprint CTA.
- Account page with signed-in email, usage credits, saved blueprint count, and workspace sync.
- Create blueprint flow with draft autosave, guided sections, progress state, loading state, and error recovery.
- Saved blueprints table/list with status, type, created date, open action, and delete confirmation.
- Blueprint result page with full product brief, users, MVP features, user journey, tech stack, roadmap, risks, launch checklist, monetization, next steps, copy, markdown export, and KMAX CTA.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/Radix UI primitives
- Supabase Auth and PostgreSQL for account workspace
- LocalStorage draft and fast UI recovery
- Gemini/OpenRouter AI generation with normalized fallback output

## Demo Limitations

This is a portfolio MVP, not a production SaaS backend.

- Auth/account sync is implemented with Supabase when environment keys are configured.
- Blueprints are saved locally for fast UI recovery and synced to Supabase for signed-in users.
- Free generation credits are enforced per signed-in Supabase account.
- Paid upgrades are represented as a "Founder sprint" KMAX conversation CTA, not a live checkout flow.
- AI generation falls back to deterministic structured output when API keys are missing or responses fail.

These limitations are intentional for a focused portfolio build and are documented in the v2 roadmap.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

Supabase is the recommended free-first backend because it covers auth and Postgres in one stack.

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Open Supabase SQL Editor and run [supabase/schema.sql](./supabase/schema.sql).
5. Restart the dev server.
6. In Supabase Auth, enable Google as an OAuth provider if you want Google sign-in.
7. Add `http://localhost:3000/auth/callback` to the allowed redirect URLs.
8. Use the landing page account panel to sign in and generate blueprints.

If env keys are missing, the app can still render, but account-based generation requires Supabase configuration.

## AI Provider Setup

Blueprint generation uses a real AI provider only when one of these server-side keys is configured:

```bash
GEMINI_API_KEY=your-gemini-key
GOOGLE_AI_API_KEY=your-google-ai-key
OPENROUTER_API_KEY=your-openrouter-key
```

Provider order is Gemini first, then OpenRouter. If no AI key is present, LaunchPilot stays usable by generating a deterministic local fallback blueprint. The result page shows which source generated each blueprint.

## Verification

```bash
npm run lint
npm run build
```

## Portfolio Docs

- [Project case study](./PROJECT_CASE_STUDY.md)
- [Visual QA checklist](./VISUAL_QA_CHECKLIST.md)

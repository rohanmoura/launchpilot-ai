# LaunchPilot AI Visual QA Checklist

Use this before taking final portfolio screenshots or recording a demo.

## Commands

```bash
npm run lint
npm run build
npm run dev
```

Open `http://localhost:3000`.

## Desktop Checks

- Landing header does not clip the CTA.
- Hero headline feels balanced and does not dominate the entire viewport.
- Animated blueprint preview is visible and not cramped.
- Founder problem, process, output, trust, pricing, FAQ, and final CTA sections are present.
- Dashboard cards and metrics align cleanly.
- Saved blueprints page uses table layout on desktop.
- Blueprint result page has readable roadmap and tech stack sections.

## Mobile Checks

- No horizontal overflow on landing page.
- Header logo does not wrap awkwardly.
- CTA buttons fit within the viewport.
- Hero preview stays inside the screen width.
- Create form sections stack cleanly.
- Saved blueprints mobile list has visible open/delete actions.
- Result page sections remain readable without text overlap.

## Product Flow Checks

- Create form saves draft while typing.
- Reset draft clears the form.
- Generation loading state appears.
- Generated blueprint opens after submit.
- Copy blueprint copies full markdown-style text.
- Download markdown produces a `.md` file.
- Delete blueprint requires confirmation.
- KMAX Design CTA opens `https://kmaxdesign.com/`.
- Landing account panel supports Google sign-in and email/password auth.
- Signed-out users cannot generate and are sent to the landing sign-in panel.
- Signed-in users see account status in the sidebar and account page.
- Account credits load from Supabase and update after successful generation.
- Generated blueprints sync into the Supabase `blueprints` table for signed-in users.
- Pricing section uses the Founder sprint CTA instead of a fake checkout.

## Known MVP Limitations

- Google OAuth requires Supabase provider and redirect URL configuration.
- Saved blueprints still keep a local browser copy for fast UI fallback.
- Paid checkout is not connected; upgrade intent routes to KMAX.
- AI generation can fall back to deterministic structured output.

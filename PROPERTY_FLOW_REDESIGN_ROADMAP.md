# Property Flow Redesign Roadmap

## Goal
Redesign the full property journey with one consistent visual system, from Explore search to Property details, Claim, HomeScore, and Passport.

## Current Route Chain
1. Explore search/list click -> `/property/:id`
2. Property CTA (claim) -> `/claim` or `/claim/:id`
3. Claim success -> `/passportview/:id` (or `next` route)
4. HomeScore owner actions may route through `/claim/:id?next=...`

## Files In Scope
- `pages/explore.vue`
- `pages/property/[id].vue`
- `pages/claim/index.vue`
- `pages/claim/[id].vue`
- `pages/homescore/[id].vue`
- `pages/passport/[id].vue`
- `pages/passportview/[id].vue`

## Step-by-Step Plan

### Step 1: Entry Consistency (Done)
- Redesign `/claim` first screen to match gradient/glass design language.
- Keep logic unchanged (address select -> route to `/claim/:id`).
- File: `pages/claim/index.vue`

### Step 2: Property Header + Hero System
- Normalize top nav, hero image overlay, and state badges in property page.
- Keep all computed data, pricing, and state logic unchanged.
- Focus only on shell spacing, typography scale, and CTA hierarchy.
- File: `pages/property/[id].vue`

### Step 3: Property Action Bar + Claim CTA
- Refine the "Claim this property" card and secondary CTAs for better clarity.
- Keep current actions (`onClaimClick`, `onAccessPassport`) intact.
- Add consistent hover/press states and radius cadence.
- File: `pages/property/[id].vue`

### Step 4: Claim Full Flow Visual Pass
- Apply same visual style to all claim steps in `/claim/:id`:
  - Search
  - Confirm
  - KYC explainer
  - KYC status states
  - LR searching/found
- No API, no step logic changes.
- File: `pages/claim/[id].vue`

### Step 5: HomeScore Landing Continuity
- Align HomeScore landing shell with property/claim theme.
- Ensure CTA language and button styling match property context.
- Preserve all screen state logic and gating.
- File: `pages/homescore/[id].vue`

### Step 6: Passport Entry Alignment
- Audit legacy passport entry page for style drift.
- If still used by routes, align visuals to new system.
- File: `pages/passport/[id].vue`

### Step 7: PassportView Continuity Pass
- Ensure visual continuity from claim success to dashboard.
- Keep tabs, sections, and publish logic unchanged.
- File: `pages/passportview/[id].vue`

### Step 8: Polish + QA
- Normalize across all in-scope pages:
  - Nav title size
  - CTA hover motion/shadow
  - Border radius cadence
  - Section heading scale
- Run diagnostics on all files in scope.

## Execution Rules
- UI-only edits first (template + scoped CSS).
- No composable/business logic changes unless required for bugs.
- Validate after each step with diagnostics.
- Keep desktop and mobile behavior responsive.

## Definition of Done
- End-to-end flow looks visually consistent.
- No TypeScript/Vue diagnostics introduced.
- Explore -> Property -> Claim -> Passport feels like one product.

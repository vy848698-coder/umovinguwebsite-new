# UMU Seller Passport AI Agent — Build Plan (v2, grounded in the real codebase)

**Inputs reviewed (7 Oct 2026)**
- Client spec: `UMU_Seller_Passport_AI_Agent_Developer_Handoff_v1.pdf` (21 sections)
- Client sample design: screens 4 "How to build your passport", 5 "AI conversation (voice)", 6 "Conversation in progress"
  (labels for 10 "Marketplace job live" and 11 "Completed item" are visible, but those screens are cut off)
- Frontend: `F:/Project/umu-latest/Updated Application/demo-umu-frontend` (Nuxt 3, `main` @ `e9bda65`)
- Backend: `DevMysticCode/demo-umu-backend` `main` @ `87693cc` (6 Oct 2026). **Note: the local copy at
  `F:/Project/umu/umu-backend` is from March 2026 and is 7 months out of date. Pull before starting.**

v1 of this plan assumed a new Next.js/React app. That was wrong. The agent must be built **inside the existing
Nuxt app and NestJS backend**, so this version replaces v1.

---

## 1. What already exists (and what the agent reuses)

### Stack
| Layer | Tech | Notes |
|---|---|---|
| Frontend | **Nuxt 3 + Vue 3**, @nuxt/ui v2, Pinia, Tailwind 3, Plus Jakarta Sans | Web (Vercel, SSR) **and** iOS/Android via **Capacitor 8** |
| Animation | Vue `<Transition>`/`<TransitionGroup>` (43 files), CSS keyframes (~190), **GSAP 3 installed but unused** | `utils/prefersReducedMotion()` exists |
| Backend | **NestJS + Prisma + PostgreSQL**, AWS (App Runner, RDS, S3), Sentry | JWT auth, throttling, helmet, HMAC-signed file URLs |
| Existing AI | `src/chat` "MoveMate" | **OpenAI SDK → Groq, `openai/gpt-oss-120b`**, simple tool loop, not streamed. General Q&A only |

### The "question engine" the PDF talks about already exists
| PDF concept | Where it lives today |
|---|---|
| ~278 passport questions | `QuestionTemplate` (18 seller sections → tasks → questions; 13 types; **~60% are MULTIPART** with `parts[]`) + `PassportQuestion` per passport |
| Client's 278 + 336 child prompts | `prisma/content/source/UMU_278_Complete_Question_Content.json` → `QuestionSourceMapping` (with TA6/TA7/TA10/BASPI refs) |
| Answer → meaning / next step | `QuestionAnswerGuidance` (panel: meaning, owner_actions, evidence, time, professional_help) — all **status: draft** |
| Dependencies | **Only inside a MULTIPART question** (`parts[].conditionalOn` + `showOnValues`). There is no cross-question mechanism. Child-prompt conditions in the content pack are "proposed, not confirmed" |
| Required vs optional | `QuestionTemplate.readiness[]` → `blocksPublication: yes / conditional / no` + milestones (`src/common/passport-readiness.ts`) |
| Outstanding actions | `PassportRule` → `PassportAction` (OPEN/ADDRESSED/SUPERSEDED/REOPENED). The rule catalogue is **near-empty** by design |
| Guided resolution | 38 `ResolutionPathway`s + `PathwayJourney` (RESOLVED/CHECK/FLAG/ESCALATE), triggered automatically on answer |
| Audit log | `PassportEvent` (actorType, sourceType, before/after, correlationId, ruleId). This is the PDF's "basic event log" |
| Documents | `UserDocument` (8 vault categories, versions, access tiers) + question uploads. **No classification/extraction** |
| Marketplace | `MarketplaceJob` / `MarketplaceCategory`. **No draft status, no prefill, no link to a passport action** |
| Resume | `Passport.lastVisitedTaskId/lastVisitedAt` |

### The single write path
`QuestionService.answerQuestion()` saves the answer, logs a History event, runs rules, triggers pathways, marks the
question complete and awards points. **The agent must write through this same method**, which satisfies the PDF's "do
not build a second passport" rule. Today it hardcodes `actorType: 'OWNER'` and `sourceType: 'OWNER_INPUT'`. That is
the one place we extend.

### Entry point today
Claim → KYC + HMLR → payment → `ClaimPassportTypeDrawer` ("I'm a seller") → `finishAndNavigate()` in
`pages/claim/[id].vue` → `/passportview/{id}`. The new "How would you like to create your Seller Passport?" screen
slots in at this redirect.

### Reusable frontend pieces
13 question components in `components/passport-view/questions/*` (DATE, ADDRESS, BOUNDARY map, UPLOAD, MULTIFIELDFORM…),
`QuestionGuidancePanel`, `PathwayStepCard`, `PathwayOutcomeCard`, `SectionCompleteCelebration`, `useConfetti`,
`useCountUp`, `BaseDrawer`, `Toast`, `useVoiceSearch` (Web Speech API, en-GB), `usePassportRuntime`, `usePathways`,
`useVault`.

---

## 2. Gaps: what the PDF needs that the codebase does not have

| # | Gap | Fix |
|---|---|---|
| G1 | `QuestionAnswer` has no source/confidence/confirmation metadata (PDF §6/§7) | Additive nullable columns (manual UI unaffected) |
| G2 | No `agent_prompt_hint`, `confirmation_level`, `evidence_requirement`, `marketplace_mapping` per question (PDF §5) | New `QuestionAgentMeta` table. Draft values generated from content pack + readiness, then **client approves** |
| G3 | No cross-question dependencies; child prompts unconfirmed | V1 engine uses live `conditionalOn` + readiness. Content-pack conditions only once confirmed |
| G4 | Nowhere to stage AI answers awaiting confirmation | New `AgentCandidateAnswer` table; write to `QuestionAnswer` only on confirm (or `auto` level) |
| G5 | No agent session/resume state (PDF §9) | New `AgentSession` table |
| G6 | Outstanding action needs a `ruleId`; agent "unknown" items have no rule | Seed generic rules (e.g. `seller_unknown_answer`, `missing_evidence`) so agent items reuse `PassportAction` |
| G7 | Marketplace has no draft / prefill / action link | `status: 'draft'`, `sourceActionId`, `passportId`; prefilled draft review screen; seller publishes |
| G8 | No document intelligence | New `DocumentIntelligenceService` (classify → extract → map → conflict check) |
| G9 | Voice: Web Speech API is **not reliable inside Capacitor WebViews** (Android WebView / iOS WKWebView) | Native speech plugin on iOS/Android, Web Speech on web; server STT later if needed |
| G10 | No streaming responses anywhere | NestJS streaming endpoint + `fetch` ReadableStream client (not `$fetch`) |
| G11 | Guidance content is all "draft" | Agent explains only from approved content and shows the same "Draft guidance" label the app already uses |

---

## 3. Client design vs PDF: what matches and what doesn't

**The PDF contains no visual design at all.** It has no colours, mock-ups or fonts; its navy/teal styling is just
document formatting. All visual direction comes from the sample design.

**Matches the PDF**
- Screen 4 title = PDF §2 step 3 ("How would you like to build your Property Passport?"), and "You can always change this later" = §2 step 5.
- Talk / upload / do it myself = PDF inputs (voice, upload, manual route).
- "Step 2 of 6 · Changes to the property" = progress indicator in plain English with no schema names (§3, §4).
- Robot's question = PDF §4/§13 example question, reworded friendlier.
- Screen 6 = PDF §4 example; "I'm not sure" → "I'll add that to your things to check" = §4 "unknown / needs checking" + outstanding actions (§10).
- Keyboard button = switch voice ↔ typing (§15); pause and close = Save & exit (§3).

**Differs from or is missing versus the PDF (confirm with client)**
1. **3 options, not 2.** The design splits the AI route into "Talk to UMU" and "Upload what you have". This is fine; both open the same agent, one starting in voice mode and one in upload mode.
2. **Voice-first, while the PDF says text first.** The design marks voice as "Recommended" and shows "Tap to speak". PDF §16/§21 say build text, then voice. Plan: ship the voice-ready UI from Step 1 using device speech input, and leave full voice (spoken replies, interruption) to Phase 6.
3. **"Step 2 of 6", while the app has 18 seller sections.** The design implies 6 conversation chapters. A proposed grouping is in §6.4 below; the client must confirm it.
4. **Not shown in the visible screens:** "I found / I've added" review card, source badges (Seller told us / Found in document / AI suggestion – confirm…), upload processing, conflict card, outstanding-item card, marketplace draft and editable voice transcript (§15). These are probably screens 1–3 and 7–11, so **ask the client for the full design board.**
5. **The design looks like an AI-generated concept** (mascot render, inconsistent avatars beside user bubbles), so treat it as direction, not pixel spec. Ask whether a Figma file exists.

**Colours**
| | Sample design | Existing app |
|---|---|---|
| Dark background | Deep navy-blue gradient | `#0e2840` (used ~200×) is very close |
| Accent | Cyan / teal glow | Brand teal `#00a19a`, text-safe `#00726c` |
| Primary dark | (not used) | Indigo `#231d45` (~870×), the app's main dark |
| User bubble | Bright blue | Not in the app palette (new) |
| Light screens | White cards, blue selection border | App uses teal for selection |

The design fits the existing brand except for the **bright-blue bubbles/borders** and the **neon cyan glow**. Recommendation:
build on `#0e2840` + `#00a19a` and add one token for the bubble colour only if the client confirms the blue. All text
must keep the app's WCAG contrast standard (the team just completed an accessibility pass).

---

## 4. Target architecture (inside the existing apps)

```
Nuxt app (web + Capacitor)                         NestJS backend
────────────────────────────                       ─────────────────────────────────────────
/passport-builder/[id]        (chooser)            src/agent/  (NEW module)
/passport-builder/[id]/ai     (agent)               ├─ agent.controller.ts   POST /agent/sessions
  components/agent/*                                │                        POST /agent/sessions/:id/turn  (stream)
  composables/useAgentSession.ts ──fetch stream──▶  │                        POST /agent/candidates/:id/confirm|reject
  composables/useAgentVoice.ts                      ├─ agent-orchestrator.service.ts   LLM loop
  (reuses question components,                      ├─ question-engine.service.ts      deterministic next slot
   QuestionGuidancePanel, PathwayStepCard)          ├─ agent-tools.service.ts          allow-listed tools
                                                    ├─ llm/llm-provider.ts + claude.provider.ts (swappable)
                                                    └─ contract/agent-contract.md      PDF §12 behaviour
                                                   reuses → QuestionService.answerQuestion()  (+ provenance)
                                                          → PassportActionsService / PathwayService
                                                          → PassportEventsService / DocumentsService / Marketplace
```

**Rule of the system:** the question engine picks the next slot deterministically. The LLM only phrases it, interprets
the reply and calls `submit_candidate_answer`. The server validates every value against the template's
options/parts, decides auto-save versus review from `confirmation_level`, and writes through `answerQuestion`.

### The unit the agent asks: a "slot"
Because about 60% of questions are MULTIPART, the engine flattens each question into **slots**:
`(passportQuestionId, partKey | null)`. A slot is only eligible when its `conditionalOn` gate is triggered. Answers are
merged into the existing `answerJson` object exactly as the manual MULTIPART component does, so manual and AI
editing stay interchangeable.

### Next-slot selection (PDF §5 algorithm mapped to real data)
1. Load answered slots (QuestionAnswer + accepted candidates + property enrichment such as EPC and title number).
2. Drop slots whose `conditionalOn` gate isn't triggered.
3. Priority: `blocksPublication: yes` → triggered `conditional` → `no`.
4. Stay in the current section/task (task order, then question order).
5. Recalculate after every write, since a "No" closes its child parts.
6. Return the payload: section, task, slot, options, education (content pack), guidance status and `confirmation_level`.

### Provenance on every AI write (PDF §6)
`QuestionAnswer` + new nullable columns: `sourceType` (SELLER_DECLARED | DOCUMENT_EXTRACTED | OFFICIAL_SOURCE |
AI_INFERRED | UNKNOWN), `sourceId`, `createdByMode` (MANUAL | AI_ASSISTED), `confidence`, `confirmationStatus`
(CONFIRMED | PENDING | REJECTED), `confirmedAt`. The `PassportEvent` keeps `actorType: OWNER`, because the seller
confirmed and stays attributable (§11). It adds `sourceType: 'AI_ASSISTED'` and `metadata.agentSessionId`. The
manual path passes nothing, so behaviour there is unchanged.

---

## 5. Decisions needed from the client before or at sprint start

1. **LLM provider.** The existing chat uses Groq `gpt-oss-120b`. The PDF (§21.6) leaves it open. **Recommendation:
   Claude (`claude-opus-5-5`)** for reliable strict tool calling, native PDF/image reading for document extraction
   (Phase 3) and prompt caching. Use low effort for chat turns to keep latency down. The provider sits behind an
   adapter so it can be swapped. Also confirm the data-processing/UK-GDPR position for sending seller data to the provider.
2. **Pilot sections (2–3).** Recommendation: **Alterations & Planning** (12 q + 11 child prompts; the PDF's own example;
   glazing pathways already wired), **Boundaries** (7 + 5; boundary pathways wired), **Guarantees & Warranties**
   (9 + 8; document-heavy, good for Phase 3).
3. **`confirmation_level` per pilot question.** We will generate a draft table for them to approve.
4. **The "6 steps" grouping** (§6.4).
5. **Full design board / Figma** for screens 1–3 and 7–11, and the bubble colour.
6. **Pilot document types** (Phase 3): suggest FENSA, Building Regs completion certificate, planning decision, EPC, EICR.
7. **Points.** Do AI-assisted answers earn reward points (on confirmation)? Recommendation: yes, on confirm only.
8. **Collaborators.** Can a collaborator use the agent? Recommendation: yes, within their existing write permission (`checkWriteAccess`).
9. **Staging access:** a DB snapshot or staging environment with real seeded content, API keys and a test passport.

---

## 6. Build order

| Step | Name (PDF phase) | Main deliverable | Exit test |
|---|---|---|---|
| 0 | Setup & decisions | Pull latest repos, run both apps locally, §5 answers, `QuestionAgentMeta` drafts | Local stack runs; pilot scope signed off |
| **1** | **Text agent + question engine** (P1, plus provenance from P2) | Chooser screen, animated agent screen, slot engine, tool loop, staged answers, resume | Seller completes a pilot section entirely by chat; manual view shows the same answers |
| 2 | Confirmation & source states (P2) | Review/conflict cards, source badges in agent **and** manual UI, never-overwrite rules | No material answer silently invented or overwritten |
| 3 | Document extraction (P3) | Upload tray, classify → extract → map → review; links to vault | Pilot doc types pre-fill correct slots with review |
| 4 | Outstanding actions (P4) | Agent creates/closes `PassportAction`s; pathways surfaced in chat | Missing evidence appears once and resolves when satisfied |
| 5 | Marketplace bridge (P5) | "Get help with this" → draft job → seller publishes in existing marketplace | Seller reviews and publishes; AI never publishes |
| 6 | Voice (P6) | Native STT on device, spoken replies, interruption, editable transcript, waveform | Same test journey without typing |
| 7 | Pilot telemetry (P7) | PDF §18 metrics from `PassportEvent` + agent events | Ready for controlled pilot |

### 6.1 STEP 1 in detail (start here). Estimate: 3–4 weeks for one full-stack dev

**Backend (NestJS)**
1. Prisma migration (all additive):
   - `AgentSession`: id, passportId, userId, currentSectionKey, lastSlot, skippedSlots, unresolvedActionIds,
     documentProcessingIds, conversationSummary, messages (Json), status, lastActivityAt.
   - `AgentCandidateAnswer`: id, sessionId, passportQuestionId, partKey, value (Json), sourceType, sourceId,
     confidence, interpretationNote, status (PENDING/CONFIRMED/REJECTED), createdAt, resolvedAt.
   - `QuestionAgentMeta`: questionTemplateId, partKey?, agentPromptHint, confirmationLevel (AUTO/REVIEW/DECLARATION),
     evidenceRequirement (Json), marketplaceCategorySlug?, approvedAt.
   - `QuestionAnswer` + provenance columns (§4).
2. `QuestionService.answerQuestion(questionId, userId, dto, provenance?)` adds an optional param. Default behaviour is
   identical. Add unit tests that prove the manual path is unchanged.
3. `QuestionEngineService`: slot flattening, gate evaluation (reuse the `isPartTriggered` logic from
   `passport-readiness.ts`), priority, next-slot payload, progress per chapter. **Write these tests first.**
4. Tools (server-validated, allow-listed): `get_property_context`, `get_passport_progress`, `get_next_questions`,
   `submit_candidate_answer`, `get_explanation` (from `QuestionAnswerGuidance` + content pack only),
   `save_agent_session`. Each tool calls existing services; none has raw DB access.
5. `AgentOrchestratorService` + `LlmProvider` interface + Claude implementation. Static behaviour contract (PDF §12)
   plus tool definitions go first and are cached; the next-slot payload goes after. Cap the tool loop at about 5 per
   turn. Handle refusal/max_tokens gracefully.
6. `POST /agent/sessions/:id/turn` streams typed events (`text-delta`, `slot`, `candidate`, `field-written`,
   `guidance`, `progress`, `turn-end`, `error`). Use `JwtAuthGuard`, `checkUserAccess`/`checkWriteAccess`, a named
   throttler bucket and a per-session token budget.
7. Generate `QuestionAgentMeta` drafts for pilot sections from content-pack `education` + readiness, and export them
   to a spreadsheet for client approval.

**Frontend (Nuxt)**
1. `pages/passport-builder/[id]/index.vue`: chooser (Talk to UMU, Upload what you have, Do it myself).
   Change `finishAndNavigate()` in `pages/claim/[id].vue` to send sellers here. Add a "Build with UMU AI" card on
   `/passportview/[id]` so switching works in both directions.
2. `pages/passport-builder/[id]/ai.vue`: agent screen (dark theme from the design).
3. `composables/useAgentSession.ts`: session create/resume, `fetch` stream reader, event reducer, optimistic seller bubble.
4. `components/agent/`: `AgentShell`, `AgentHeader` (close, title, progress bar, "Step x of 6 · chapter"),
   `AgentAvatar` (idle/listening/thinking/speaking states), `AgentBubble` (streamed text), `SellerBubble`,
   `TypingDots`, `AnswerChips` (Yes / No / Not sure / Skip for now), `InlineQuestion` (wraps existing question
   components for DATE, ADDRESS, BOUNDARY, MULTIFIELDFORM), `AddedCard` (simple "I've added" for REVIEW slots),
   `GuidanceCard` (wraps `QuestionGuidancePanel`), `Composer` (keyboard ↔ mic ↔ pause), `SaveExitSheet` (`BaseDrawer`),
   `ResumeBanner`.
5. Voice input (input only): `useAgentVoice` wraps `useVoiceSearch` on web plus a Capacitor speech plugin on device.
   The transcript stays editable before sending.

**Step 1 done when**
- [ ] Seller can pick AI or manual after claiming and switch either way without data loss
- [ ] Pilot sections completable entirely by chat; `/passportview` shows identical answers
- [ ] MULTIPART gates respected (a "No" hides child parts in both UIs)
- [ ] "Not sure" → `UNKNOWN` (Needs checking), and "Skip for now" works without blocking
- [ ] Every AI write has provenance, History shows it, and rules/pathways/points still fire
- [ ] Close/re-login resumes at the next unresolved slot
- [ ] Answer-variant test set passes (5–10 real phrasings per pilot slot)
- [ ] 60fps on a mid-range Android device in Capacitor; reduced motion respected; a11y labels and live region

### 6.2 Animation approach (Vue, not React)
- **Vue `<Transition>`/`<TransitionGroup>`** for bubbles, chips and cards, matching the app's existing pattern.
- **GSAP** (already a dependency) for timelines: progress bar fill, voice orb pulse, card confirm → field-written
  sequence and the avatar float.
- **Avatar:** an animated mascot with states (idle, listening, thinking, speaking). Best option is a **Rive** or
  Lottie file with a state machine from a designer. Fallback is a layered SVG animated with GSAP. Don't use a static PNG.
- **Waveform:** Web Audio `AnalyserNode` → canvas bars (screen 6), driven by real mic level.
- Streamed text is batched per animation frame. Animate transform/opacity only. Use `prefersReducedMotion()` to
  fall back to fades.

| Element | Motion |
|---|---|
| Bubble enter | translateY 8px → 0 + fade, 220ms ease-out; seller bubbles from right, agent from left |
| Thinking | avatar "thinking" state + 3-dot typing, cross-fades into text |
| Chips | stagger 40ms; tapped chip morphs into the seller bubble (FLIP via GSAP Flip) |
| "I've added" card | scale 0.97 → 1 + fade; Confirm → tick morph → card collapses → progress bar advances |
| Progress / chapter change | bar fill tween + "Step 3 of 6" text slide; `SectionCompleteCelebration` at chapter end |
| Mic | orb ring pulses with audio level; waveform while listening |

### 6.3 Security & safety checklist (PDF §8, §11)
Tools allow-listed with server validation; the model never sees DB field names (only slot IDs); no publish, share,
visibility or permission tools exist; minimal personal data in prompts (no names/emails unless needed); documents
redacted where feasible; per-user rate limit and token budget; Sentry on failures without PII; prompt-injection
guard (uploaded document text treated as data).

### 6.4 Proposed "6 steps" (chapters) for the conversation
| Step | Chapter (plain English) | Live sections |
|---|---|---|
| 1 | About you and your ownership | Ownership Profile, Title Deeds and Plan, Occupiers, Transaction Information |
| 2 | Changes to the property | Alterations and Planning, Guarantees and Warranties |
| 3 | Boundaries and neighbours | Boundaries, Disputes and Complaints, Notices and Proposals, Rights and Informal Arrangements |
| 4 | Services and surroundings | Services, Environmental, Insurance, Parking, Other Charges, Searches |
| 5 | Leasehold (only if leasehold) | Leasehold |
| 6 | What's staying with the home | Fixtures and Fittings (100 checklist questions; better as a quick checklist UI than chat) |

This matches the design's "Step 2 of 6 · Changes to the property". It needs client confirmation.

---

## 7. Risks
| Risk | Mitigation |
|---|---|
| MULTIPART answer shape mismatch between agent and manual UI | Engine writes via the same `answerJson[partKey]` merge; round-trip tests that open answers in the manual UI |
| Guidance content is draft / unreviewed | Agent quotes only stored content, shows the "Draft guidance" label, never improvises legal advice |
| Unconfirmed cross-question conditions | V1 uses only live `conditionalOn`; content-pack conditions after client confirmation |
| Voice in WebViews | Native plugin; text always available |
| Latency on mobile | Streaming, cached contract, low effort, optimistic UI |
| Three frontends share the backend | Agent API is frontend-agnostic; manual endpoints untouched |
| Outdated local backend clone | Pull `main` before any work |

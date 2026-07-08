# HomeScore — Deployed Mobile App Reference (collected)

Source: `https://demo-umu-frontend.vercel.app/homescore` captured at mobile width (402px, iPhone UA)
via Playwright. Sample property used: **4 Whitehall Court, SW1A 2EP** (`a99e5b31-397f-4ceb-9f27-9ca723d457d1`).
Backend: `https://demo-umu-backend-production.up.railway.app`.

Screenshots are the PNGs in this folder. This file catalogs every section + a gap
analysis against the current local pages so we know what to build.

---

## FLOW MAP

```
/homescore  (marketing landing) ─ search postcode/address ─► pick result
        │
        ▼
/homescore/[id]  ── in-page state machine, mobile app UI ──────────────┐
   screen: HomeScore "snapshot" (default landing)   → 03               │
     ├─ tap "Full EPC breakdown"  → expands accordion inline           → 21
     ├─ tap "Explore your street map" → expands inline street map      → 22
     ├─ "I own this property"     → Owner quiz screen                  → 04
     │        └─ "Get my real HomeScore" → refined results
     └─ "I'm interested in this property" → Buyer "Property Report"    → 09/10
              tabs: Energy | Costs | Sold | Risks | Area   → 20-buyer-*
              + Questions to ask owner / Watch property / Verified buyer

/homescore/street/[id]  → dedicated ranked-list street page            → 14/15
/homescore/costs/[id]   → (deployed) renders the Buyer Property Report → 12
```

---

## SECTION CATALOG

### 1. Marketing landing — `01-landing-hero.png`, `02-landing-full.png`
Matches current local `pages/homescore/index.vue`. Hero + "Postcode or address" search +
Free/Instant/No-account chips, Real story quote, "147 HomeScores run in the last hour",
How-it-works tabs (Looking to buy / It's my property / Just curious), Powered by OpenProperty.
**Gap: none — already in local code.**

### 2. Detail "HomeScore snapshot" (landing screen) — `03-detail-landing.png`
The core mobile detail page. Sections top→bottom:
- **Amber address card**: address, postcode·type, EPC pill (C), HomeScore pill (69/100 "Above average"),
  "N people checked this HomeScore today", "N people are watching this property".
- **"This property is unclaimed"** navy CTA card ("Build your verified Passport in minutes" + "What does it mean to claim?").
- **HOMESCORE™ gauge card**: ring 69/100, "Above average · C", "The EPC lists 6 steps to lift your score and
  cut bills by ~£722/yr. See the path below." + "Based on a 2016 EPC…" note. Caption "Tap any row to explore".
- **Two stat tiles**: EST. BILLS £1,300/yr (Save up to £722/yr) · CO₂ 3.8t/yr (UK avg 6.0t).
- **YOUR STREET card** (navy/gradient): "#8 of 43 homes · £190 cheaper than the street average",
  row of house icons with the subject highlighted, "↑ You could be 2nd · save £722/yr" pill,
  **"Explore your street map →"** button.
- **"HOW YOUR 69 SPLITS · EPC STATS"** points breakdown + "Points breakdown" link:
  Heating 10/20 · Structure 13/25 · Efficiency 5/15 · Electrics 16/20 · Plumbing 10/20 (each a tappable row `>`).
- **"Full EPC breakdown · 8 items"** tappable row.
- **"WHAT'S YOUR CONNECTION TO THIS PROPERTY?"** intent: "I own this property" / "I'm interested in this property".

### 3. Full EPC breakdown (expanded) — `21-full-epc-breakdown.png`
Accordion opens inline under the points breakdown:
- CURRENT **C·69** → POTENTIAL **C·75**, **£722/yr potential saving**.
- 8 line rows (each `N/A >`): Main heating, Heating controls, Hot water, Walls, Roof·loft insulation,
  Floor, Windows, Lighting ("Low energy in 0% of fixed outlets").

### 4. Street map (expanded inline) — `22-street-map.png`
Opened by "Explore your street map". Distinct from the /street page:
- "Your street, ranked by energy cost · SW1A 2EP · 18 homes"; "#8 8th cheapest of 18 homes,
  £190 below the postcode average £1,651/yr". Legend Under £1,200 / £1,200–1,800 / Over £1,800.
- **Interactive house grid** (2 rows, numbered, colour-coded, road label "WHITEHALL COURT"),
  "swipe to see the rest of your postcode", "Tap any house to see its EPC and cost".
- "No. 15 — You  C·69  £1,300/yr".
- **"IF YOU COMPLETE THE EPC PATHWAY £578/yr — 2nd of 18 on your street · up from 8th · −£722/yr saved"**.
- "Higher EPCs sell faster and command ~£15k more on average for a 3-bed in SW1A (Land Reg data)".

### 5. Owner quiz — `04-questions-quiz.png`, `05-questions-billpath.png`
Header "Owner quiz / Refine your HomeScore". Amber address card, **HOMESCORE™ · LIVE** gauge
("+0 pts", "Climbing as you answer… Aim for Level C (55+) to unlock the upgrade marketplace",
"0 of 3 answered · earn XP for every question"). "HAS YOUR HOME HAD THESE IMPROVEMENTS?"
list: Internal wall insulation / Low energy lighting / Double glazed windows (each "Recommended on EPC" `>`).
Sticky **"Get my real HomeScore →"** + "Start again". (Also a bill-upload path.)

### 6. Buyer "Property Report" — `09-buyer-results.png`, `10-buyer-results-full.png`
Header "Property Report · Based on public records". Amber address card, unclaimed CTA,
**BUYER CONFIDENCE** card ("Worth investigating — 1 insulation flag", mini gauge 69).
Tab bar: **Energy | Costs | Sold | Risks | Area**. Below tabs, then shared footer sections:
- **QUESTIONS TO ASK THE OWNER**: Internal wall insulation / Low energy lighting / Double glazed
  windows (from EPC), Gas Safety certificate, EICR certificate — each with explainer.
- **WATCH THIS PROPERTY**: "Be the first to know…" 4 triggers (Owner claims / Passport milestones
  25-50-75% / Passport published £15 or free / Comparable sales nearby) + "Watch this property →".
- **VERIFIED BUYER · £35 ONE-OFF**: "Be viewing-ready before anyone else" — front of queue /
  free Passport day one / 3× more likely offer accepted + "See what verification gets you →".

#### Buyer tab — Energy (default, in 09): **EPC BREAKDOWN** bars (Heating 10/20 … Plumbing 10/20) + "via EPC Register".
#### Buyer tab — Costs — `20-buyer-costs.png`
"ESTIMATED TOTAL PER YEAR **£2,481/year** (~£207/month across energy per EPC, water and council tax)".
Chips: EPC Register / VOA council tax / Regional water avg. Rows: **Water & sewerage £471/yr**
(Thames Water · regional avg), **Council tax £2,010/yr** (Estimated) + explainer note.
#### Buyer tab — Sold — `20-buyer-sold.png`
"ESTIMATED VALUE **£1,938,000**" (Land Registry sold price 2025, HPI adjusted, via Land Registry).
**Sale history — 73 recorded sales** (dated list w/ type·tenure·price). "Comparable sales nearby
(4 similar homes)", "Title & tenure (via solicitor)".
#### Buyer tab — Risks — `20-buyer-risks.png`
Chips: Env Agency / Planning.data.gov.uk / Historic England / EPC Register. Cards:
Flood risk **Low**, Listed building & conservation area **Listed**, Planning history **10 apps**,
Ground stability **None flagged**, Internal wall insulation **Flag** (+£484/yr),
Low energy lighting **Note** (+£43/yr), Double glazed windows **Flag** (+£195/yr).
#### Buyer tab — Area — `20-buyer-area.png`
"**3188/mo** CRIMES WITHIN 1 MILE — Higher than average, worth a look; 12-mo total 38,261,
↓52% vs prior 6mo · data.police.uk". **Crime breakdown** bars (Theft from person 10,261 / Other theft
7,941 / Violence & sexual 5,031 / Anti-social 4,915 / Shoplifting 3,410 / Public order 1,643).
Rows: Schools nearby, Broadband & mobile (Ofcom), Transport, Healthcare nearby, Neighbourhood (Census).

### 7. Dedicated street page `/homescore/street/[id]` — `14-street-compare.png`, `15-*.png`
Header HOMESCORE + amber address card ("9 searches today · No verified Passport yet"),
"per year · cheaper than the typical home on this street", ESTIMATED COST £1,300 vs STREET AVERAGE £1,673.
**"Your street, ranked by energy cost"** — 1st of 5 list, each home with insulation/EPC/sqm detail
and £/yr, colour legend, "Renting?" note, "← Back to results". (Has a 4-step guided tour.)

### 8. `/homescore/costs/[id]` — `12-running-costs.png`
On the deployed site this route renders the **Buyer Property Report** (same as §6), not a
standalone running-costs page. (Local repo has a distinct `pages/homescore/costs/[id].vue`.)

---

## GAP ANALYSIS — deployed mobile vs current local code

The deployed app is a **different/earlier "mobile app" build** than the current local web-redesign.
Current local `components/homescore/ResultDetail.vue` is a 2-column web layout that is MISSING several
mobile sections shown above. Candidates to (re)build into our homescore pages:

| Section (deployed mobile) | In current local code? | Action |
|---|---|---|
| Amber address card w/ live "N checked / N watching" | Different (teal card) | Reconcile styling |
| HOMESCORE™ gauge + "6 steps… ~£722/yr" path copy | Partial | Add "steps/path" messaging |
| EST. BILLS / CO₂ stat tiles | Yes (breakdown card) | Keep |
| **YOUR STREET "#8 of 43" rank card + house row** | **Missing in ResultDetail** | **Build** |
| **Points breakdown (Heating/Structure/Efficiency/Electrics/Plumbing X/Y)** | **Missing** (local shows £ Heating/Hot water/Lighting) | **Build** |
| **"Full EPC breakdown · 8 items" accordion** | **Missing** | **Build** |
| **Inline gamified street map (house grid + EPC pathway projection)** | **Missing** | **Build** |
| Owner quiz "HOMESCORE LIVE / XP / Level C unlock" | Partial (questions screen exists) | Add gamified live-score UI |
| Buyer report tabs Energy/Costs/Sold/Risks/Area | Verify in `buyer-results` screen | Confirm/port each tab |
| Buyer "Questions to ask owner" incl. Gas Safety / EICR | Verify | Confirm/port |
| Buyer "Watch this property" + "Verified buyer £35" | Verify | Confirm/port |
| Costs tab annual total (energy+water+council tax) | Local costs page differs | Reconcile |
| Sold tab: estimated value + full sale history + comparables | Verify | Likely build |
| Area tab: crime/mo + breakdown + schools/broadband/transport/healthcare | Verify | Likely build |

## Open questions before building
1. Which is the target design — port the deployed mobile sections INTO the current web-redesign
   layout, or replace the web-redesign with the mobile app UI?
2. Data availability: several figures (73 sales, crime, water/council tax) come from the backend —
   confirm the same endpoints/fields exist for the properties we'll use.
3. `/homescore/costs/[id]` — keep the standalone local costs page, or match deployed (buyer report)?

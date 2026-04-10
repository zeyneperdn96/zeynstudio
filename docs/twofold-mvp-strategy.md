# TwoFold MVP Product Strategy (Strict, Focused)

## 1) Product Positioning: Make it Distinct, Not Generic

### Category statement
TwoFold is **not a trip planner**. It is a **shared travel reality tracker**: where groups record what they expected, what actually happened, and what it cost.

### Positioning options (pick one and stay consistent)
1. **"Plan it. Live it. Compare it."**
2. **"Where travel plans meet travel reality."**
3. **"Shared trips, real outcomes."**

### Sharp positioning formula
- **For:** small travel groups (couples, friends, families)
- **Who need:** one place to coordinate plans and settle shared spending
- **TwoFold is:** a group trip workspace that pairs each planned activity with the real experience afterward
- **Unlike:** itinerary-only tools or expense-only tools
- **Because:** it preserves the before-vs-after story of each trip decision

### What to avoid in messaging
- Avoid broad "all-in-one travel app" language.
- Avoid sounding like social media or memory journals.
- Avoid productivity jargon ("optimize") in consumer copy.

---

## 2) MVP Evaluation: Is It Strong Enough?

### Verdict
**Yes, the MVP is strong enough to launch** if you execute the core loop exceptionally well.

Your current scope already includes:
- Group collaboration
- Time structure (day-based trip timeline)
- Differentiated core mechanic (Plan ↔ Experience)
- Financial accountability (shared expenses + balances)

That is a complete and defensible first product.

### Critical risk (not a new feature; a product risk)
The biggest risk is **users not completing the Experience side**, which would collapse differentiation and reduce TwoFold to a normal itinerary + expense tool.

### Non-negotiable quality bar for launch
1. **Activity creation must be fast** (seconds, not minutes).
2. **Experience logging must feel lightweight** (no long forms by default).
3. **Plan and Experience must be visually inseparable** (clearly one paired object).
4. **Expense math must be trusted** (clarity over cleverness).

If these 4 are true, MVP is viable.

---

## 3) Strengthen the Plan → Experience Interaction (Core Heart)

### Core interaction model: one card, two states
Treat each activity as a single card that evolves, not two disconnected entries.

**State progression:**
- `Planned` → `Done (not logged)` → `Experienced`

### Minimum input for each phase
Keep forms strict and short.

#### Plan phase (before)
- Title
- Day/time (optional but encouraged)
- Expected cost (single value)
- Why this choice? (short optional intent tag like "food", "must-see", "rest")

#### Experience phase (after)
- Actual cost
- Quick verdict: `Worth it?` (Yes / Mixed / No)
- Rating (1–5)
- One-line reflection (optional)

### Key UX behavior to implement
1. **Post-time gentle nudge:** once scheduled time/day passes, mark as "Done?" and prompt quick log.
2. **Delta clarity by default:** auto-show `Expected vs Actual` (cost + sentiment).
3. **Low-friction completion:** "Log in 10 seconds" path with just verdict + actual cost.
4. **Integrity rule:** do not allow editing plan values silently after experience exists; if changed, show "updated after trip" marker.

### Microcopy examples
- Plan state: "What do we expect from this?"
- Done state: "How did it actually go?"
- Delta label: "Expectation gap"
- Worth-it summary: "Worth it for this group"

This keeps the concept human and analytical at once.

---

## 4) Trip Detail IA (Clear, Mobile-First)

## IA principle
Trip Detail should answer three questions quickly:
1. What are we doing and when?
2. What already happened vs still planned?
3. Where do we stand on money?

### Recommended top-level structure (single trip)

#### A) Sticky trip header (compact)
- Trip name, dates, group avatar stack
- Progress snapshot: `% experienced` + `budget spent/expected`

#### B) Primary segmented control (3 tabs)
1. **Timeline** (default)
2. **Activities**
3. **Expenses & Balances**

Keep this fixed. Do not add more tabs in MVP.

### Tab details

#### 1) Timeline (default home)
- Grouped by day
- Each activity card shows:
  - title/time
  - plan badge (`Planned`, `Done`, `Experienced`)
  - cost delta indicator when available
  - quick action button (`Log Experience` / `View`)

Why default: it unifies plan execution and trip flow.

#### 2) Activities (analysis list)
- Filter chips only:
  - All
  - Not experienced
  - Worth it
  - Not worth it / mixed
- Sorting:
  - Day order (default)
  - Biggest cost delta

Why this tab exists: closes loops after trip without cluttering timeline.

#### 3) Expenses & Balances
- Total spent
- Per-person net balance (who owes whom)
- Expense list with activity linkage when applicable

Design rule: always show **"settlement clarity"** first, raw receipts second.

### Primary FAB (context-aware)
- Timeline: `+ Add Activity`
- Expenses tab: `+ Add Expense`

One primary action at a time reduces cognitive load.

---

## 5) Make It Emotional + Human (Without Being Gimmicky)

### Tone system
Use calm, reflective language. Not cute. Not gamified.

### Emotional moments to design
1. **After each experience log:** show a tiny comparison sentence:
   - "Cheaper than expected, rated 4/5."
2. **Daily closure:** at end of day, show:
   - "Today: 3 planned, 2 experienced, 1 pending."
3. **Trip-end summary tone:**
   - "What this trip taught us" style framing, not "Congrats!" celebration confetti.

### Visual emotionality (subtle)
- Use a restrained color pair for the two phases:
  - Plan = neutral/structured
  - Experience = warmer/reflection tone
- Use icons sparingly and consistently (calendar vs check/insight)

### Trust cues (human + practical)
- Always show who logged or edited an entry.
- Timestamp important edits.
- Keep financial numbers legible and unsurprising.

Human feeling in travel tools comes from **truth and memory**, not decoration.

---

## Launch Focus Checklist (strict)

Before adding any new feature, verify:
- Can a group finish a full trip flow in-app from first plan to final balances?
- Is Experience logging completion rate healthy?
- Can users explain the value in one sentence: "We compare what we planned with what really happened"?

If these are not true, do not expand scope.


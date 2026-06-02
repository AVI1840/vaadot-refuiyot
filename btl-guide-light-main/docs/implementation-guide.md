# Implementation Guide — "תביעה ביום"

## הנחיות ליישום על בסיס תיקיית המסכים

---

## מבנה המוצר — 12 מסכים (לא 25!)

The screenshot folder contains multiple iterations of the same concepts.
DO NOT create one application page per screenshot.
Instead, treat the screenshots as **design references** and map them into a coherent product.

---

## FOUNDATION JOURNEY (8 מסכים)

### Screen A: Landing
- **Reference:** `ChatGPT Image Jun 2, 2026, 05_01_14 PM`
- **Purpose:** premium hero, value props, trust, CTA, 7-step flow

### Screen B: Onboarding / Condition Identification
- **Reference:** `ChatGPT Image Jun 2, 2026, 05_01_23 PM`
- **Purpose:** AI greeting, quick replies, first action, condition selection

### Screen C: Document Checklist
- **Reference:** `ChatGPT Image Jun 2, 2026, 05_01_30 PM`
- **Purpose:** חובה / כדאי / רשות checklist, readiness, progress, green path

### Screen D: Document Acquisition Journey
- **Reference:** `ChatGPT Image Jun 2, 2026, 05_01_35 PM`
- **Purpose:** timeline, where to get documents, HMO links, next actions

### Screen E: OCR + Upload
- **Reference:** `ChatGPT Image Jun 2, 2026, 05_06_49 PM` + `05_10_45 PM`
- **Purpose:** drag and drop, camera upload, scan state, OCR, extracted docs, status table

### Screen F: Conversational BL/283
- **Reference:** `ChatGPT Image Jun 2, 2026, 09_37_26 PM`
- **Purpose:** chat-first form filling, one question at a time, form preview

### Screen G: Readiness Dashboard
- **Reference:** `ChatGPT Image Jun 2, 2026, 05_35_11 PM` + `09_36_56 PM`
- **Purpose:** before/after simulation, score jump, explainable improvement, approval forecast

### Screen H: Committee Preparation
- **Reference:** `ChatGPT Image Jun 2, 2026, 05_38_18 PM`
- **Purpose:** celebratory completion, what happens next, confidence, committee readiness

---

## ADVANCED SCREENS (4 מסכים)

### Screen I: Digital Twin Simulator ⭐ (PRIMARY WOW SCREEN)
- **Reference:** `ChatGPT Image Jun 2, 2026, 09_37_13 PM`
- **Purpose:** This is the primary WOW screen.
- **Shows:** before/after, score jump 42%→81%, what happens if missing docs are added, explainable impact per document

### Screen J: AI Agent Control Center ⭐
- **Reference:** `ChatGPT Image Jun 2, 2026, 09_34_33 PM`
- **Purpose:** This is the primary AI screen.
- **Shows:** live agent activity, what the AI is doing now, operational task feed

### Screen K: Organizational ROI Dashboard
- **Reference:** `ChatGPT Image Jun 2, 2026, 09_36_45 PM`
- **Purpose:** Executive audience only.
- **Shows:** time saved, fewer missing docs, workload reduction, annual savings

### Screen L: Architecture View
- **Reference:** `ChatGPT Image Jun 2, 2026, 09_36_37 PM`
- **Purpose:** Pitch and judges only.
- **Shows:** AWS stack, agent orchestration, data flow

---

## MOBILE

### Primary mobile references:
- `ChatGPT Image Jun 2, 2026, 09_35_06 PM (1)`
- `ChatGPT Image Jun 2, 2026, 09_35_06 PM (2)`

Use these as the mobile source of truth.
Do NOT create separate functionality on mobile.
Mobile must be the **same product journey**.

---

## DESIGN SYSTEM RULE

The dark blue sidebar visible across many screenshots becomes the **global desktop navigation system**.
The mobile bottom navigation becomes the **global mobile navigation system**.

The visual language must be unified across all screens.

Use the same:
- spacing
- colors (#003B7A, #0063CC, #E8A020, #10B981, #F59E0B, #EF4444)
- card styles (white, rounded-16px, soft shadow)
- gauges
- badges
- typography (Heebo)
- progress components

throughout the product.

**DO NOT MIX DESIGN PATTERNS.**

---

## MOST IMPORTANT RULE

The application is NOT about forms.
The application is about:

### **42% → 81%**

**Citizens:**
- more certainty
- more support
- faster approval journey

**Organization:**
- better submissions
- less missing information
- lower workload
- faster processing

**Every major screen must reinforce this story.**

---

## IMPLEMENTATION PRIORITIES

If implementation time is limited:

| Priority | Screen | Why |
|----------|--------|-----|
| **1** | Digital Twin (I) | Main WOW moment for judges |
| **2** | AI Agent Control Center (J) | Shows AI is real and operational |
| **3** | Readiness Dashboard (G) | Core value prop — score + improvement |
| **4** | Mobile Experience | Modern, credible, launchable |
| **5** | Architecture (L) | Pitch-ready, needed for judges |

Everything else is supporting flow.

---

## OPTIONAL / SUPPORTING VARIANTS

If you need a broader dashboard overview or additional layout inspiration:
- `ChatGPT Image Jun 2, 2026, 09_36_18 PM`
- `ChatGPT Image Jun 2, 2026, 09_35_18 PM`
- `ChatGPT Image Jun 2, 2026, 09_35_30 PM`
- `ChatGPT Image Jun 2, 2026, 09_35_42 PM`
- `ChatGPT Image Jun 2, 2026, 09_35_53 PM`

But do NOT use these as defaults unless the primary screen above does not fit.

---

## HOW TO USE THIS GUIDE

1. Open V0.dev / Lovable / Claude with image uploads
2. Upload the **primary reference screenshot** for each screen
3. Add the **mega-prompt** from `docs/mega-prompt.md` as system context
4. For each screen, add the specific purpose and rules from this file
5. Build in order: I → J → G → Mobile → L → then A through H

---

*"תביעה ביום" — האקתון AWS #3 | 23.06.2026*

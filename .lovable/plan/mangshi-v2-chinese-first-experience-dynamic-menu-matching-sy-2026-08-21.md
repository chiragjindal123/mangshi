# Mangshi v2 — Chinese-First Experience + Dynamic Menu Matching System

Two things happen together:

1. The public site becomes Chinese-first, image-led, and low-word (in the spirit of inblooom.com), keeping the current cream / cocoa / olive-sage theme.
2. A working prototype of the **Mangshi Dynamic Menu Matching System** is added — the part that turns the project from "a blind-box lunchbox" into "a demand-responsive food system".

---

## Part A — Chinese-first, image-led site

- 繁體中文 is the default language; EN is the secondary toggle (order 中 / EN). `<html lang>` follows the active language.
- Chinese headline face added (Noto Serif TC) via `:lang(zh)`, so Chinese type looks intentional. Latin keeps Cormorant.
- Copy compressed everywhere: one short headline (4–10 Chinese characters) + at most one supporting line per section. Paragraphs become captions.
- Pictures and motion carry the story: full-bleed image breaks, scroll fade-and-rise reveals, slow zoom on hover, count-up numbers, soft parallax. All respect `prefers-reduced-motion`.
- Culture becomes an image grid; Mission becomes oversized animated numbers over photos; Box keeps the flip card but reduces surrounding words to 封 → 拆 → 嚐.
- 4 new generated images (pickling jars, hands holding a sealed box, harvest crates, a simple Hakka table).
- Route `head()` metadata gets Chinese titles/descriptions.
- Palette and logo unchanged.

---

## Part B — The Matching System (4 screens)

New section of the site at `/system`, with four sub-screens. Built on Lovable Cloud so entries persist and the demo is live, not faked.

### 1. `/system/supply` — Farmer Supply Input
Farmer picks a vegetable, enters kg, and an availability date range. Submitted batches appear in a running list with status (available / allocated).

### 2. `/system/match` — Dynamic Menu Matching
The core screen. Button: **配對今日菜單 / Match today's menu**.

Given available supply + confirmed preorders, a deterministic greedy allocator over the validated recipe library returns:

- recommended menus with max portions each
- total kg utilized vs available
- utilization %
- planned meal count

Objective: maximize vegetable utilization, subject to meals ≤ confirmed orders, ingredient use ≤ available stock, and per-recipe kitchen capacity. No invented recipes — it only selects and scales stored ones. Nothing is labelled AI.

### 3. `/system/kitchen` — Kitchen Dashboard
Tomorrow's production plan: "Menu A × 120, Menu B × 80", with the scaled ingredient pull list, prep/cook time and per-recipe notes. Cook marks batches done.

### 4. `/system/impact` — Impact Dashboard
Monthly and weekly KPIs: friendly vegetables available, confirmed preorders, potential vs planned meals, kg utilized, kg remaining, participating farmers, farmer revenue, food-waste reduction. Animated counters, same visual language as the rest of the site.

### Mama Recipe Library
A seeded library of ~12 standardized recipes (expandable), each storing per-100-servings quantities for every ingredient, prep time, cook time, cost, allergens, vegetarian flag, kcal/portion. Seeded with real dishes matching the concept (客家小炒, 番茄炒蛋, 高麗菜炒紅蘿蔔, 滷茄子, 時蔬飯…). A simple read-only recipe list screen is included so the library is visible during a pitch.

### Narrative framing
`/system` opens with one line — 「科技不取代阿嬤的手,只是讓她的工作更輕鬆。」 — then the screens. The public pages link to it as "the system behind the box", so the emotional site and the technical proof live together without diluting each other.

---

### 5. `/system/calendar` — 12-Month Surplus Calendar
A full-year seeded dataset: for each of the 12 months, which Taiwan vegetables are typically in overproduction, expected surplus volume (kg) per vegetable, and the peak/off-peak flag.

Screen shows:
- A 12-month strip; the current month is highlighted on load.
- Selected month: overproduction list (vegetable + estimated kg + severity), total surplus kg, and the **recommended recipes for that month** — pulled from the Mama Recipe Library by matching that month's surplus vegetables, with max portions and projected utilization for the month.
- A "this month" summary card reused on the impact dashboard and on the public site (one short line + number), so the seasonal story shows up in the experience too.

Data comes from a seeded `seasonal_surplus` table (month, vegetable, typical surplus kg, notes) — real Taiwan seasonality (winter brassica glut incl. the broccoli/cabbage crisis, summer melon/tomato, spring bamboo/leafy). Editable later, not hardcoded in components.


## Technical notes

- Lovable Cloud enabled: tables for `farm_supply`, `recipes`, `recipe_ingredients`, `preorders`, `production_plans`, `plan_items`, `seasonal_surplus`. Recipes, the 12-month seasonal surplus rows, and a demo supply/preorder set are seeded in the migration so every screen already shows data.
- Public read access for recipes and aggregate impact; supply/plan writes go through server functions. Demo mode means no login is required to try the matching screen.
- Matching runs in a pure TypeScript module (`src/lib/matching.ts`) called from a server function — deterministic, testable, no AI dependency.
- i18n: all new system screens use the same `translations.ts` keys with zh first.
- Motion helpers: `src/components/Reveal.tsx`, `src/components/CountUp.tsx`, reused by both parts.

## Out of scope

- No payments, no real farmer accounts, no QR scanning hardware.
- No true linear-programming solver — a greedy utilization-maximizing allocator, which is enough for the demo and honest about what it does.

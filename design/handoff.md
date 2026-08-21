# Handoff: Handled — guest service portal + agency console

## Overview
**Handled** is a guest-services layer for holiday-rental property managers. A managing agency (in the demo, *Lago Verde Property Management* on Lake Garda) sends each arriving family a private link. On that link the family sees a curated list of things local, vetted providers can do for them during their stay — shopping, airport pick-up, dinner cooked at the villa, babysitting, laundry, a boat afternoon — and requests any of them in a couple of taps. Nothing is charged until the provider confirms. The agency works the other side in a web console: it sees incoming requests, confirms them with providers, marks them scheduled, manages properties and the provider roster, and tracks its 10% share.

Two surfaces:
1. **Guest portal** — mobile web, 390px design width, opened from a link, no login, expires with the stay.
2. **Agency console** — desktop web, 1440px design width, 1152px content column.

Plus a **pitch screen** (1440×810) — a QR/big-type screen the agency shows to owners or prints for the house.

Commercial model shown in the UI: provider 80% · agency 10% · platform 10%. Guest pays no booking fee; agency share is paid monthly.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype of intended look and behaviour, not production code to lift. `Handled.dc.html` is a single-file design canvas: every screen and state laid out side by side on one page, driven by a small data object. It is deliberately not an app; there is no routing, no real interaction wiring, no backend.

The task is to **recreate these designs as a working clickable prototype in the target codebase's own environment** — its framework, component library, styling system and conventions. If there is no existing codebase yet, pick the framework most appropriate for the project (a React + Vite SPA with client-side routing and in-memory state is a sensible default for a prototype of this shape) and implement there. Use the HTML only to read exact geometry, colour, type and copy.

Two notes on how the reference file is written, so nothing is misread as an intentional pattern:
- Styling is **inline on every element** and there are no CSS classes. That is a constraint of the authoring environment, not a recommendation. Extract the repeated values into the target system's tokens/components.
- Provider photos are **placeholder swatches**: a diagonal hatch (`repeating-linear-gradient(45deg,#E8EDEB 0 3px,#F4F7F5 3px 6px)`) where a photo goes, and a letter monogram on `#E4EDE9` as the no-photo fallback. Both states are real and both need implementing; the hatch is where a real `<img>` belongs.

## Fidelity
**High-fidelity.** Colours, typography, spacing, radii, motion durations and all copy are final and specified below to the pixel. Recreate the UI faithfully using the codebase's existing primitives. Where a value here conflicts with an established token in the target codebase, prefer the codebase token and flag the difference.

The one area intentionally left open is **navigation chrome for the prototype** (how you move between screens in a demo build) — the design has no back buttons or nav bars because each screen was drawn in isolation. See *Prototype scope* at the end.

---

## Design Tokens

### Colour
| Token | Hex | oklch | Use |
|---|---|---|---|
| `--color-deep` | `#0E2622` | `oklch(.24 .025 172)` | Primary text, pitch background, console stat panel, timeline markers |
| `--color-water` | `#1A5049` | `oklch(.40 .055 175)` | Primary buttons, links, eyebrow text, selected chips, focus ring |
| `--color-stone` | `#E8EDEB` | `oklch(.935 .006 165)` | Page background, device/frame background, chip fills |
| `--color-paper` | `#FCFDFC` | `oklch(.992 .002 160)` | Cards, sheets, console surfaces, table body |
| `--color-citron` | `#C9922B` | `oklch(.68 .12 75)` | Status dots, progress dots, "your share" figure, Verified badge |
| `--color-clay` | `#9E4A32` | `oklch(.50 .11 38)` | Cancel and error affordances only — never decorative |

Derived tints, all of `--color-deep` unless noted:
- `deep/8`, `deep/10`, `deep/12` — hairlines and card borders (`rgba(14,38,34,0.08 / 0.10 / 0.12)`)
- `deep/18` — sheet grabber, inactive progress dots
- `deep/22`, `deep/25` — input borders, dashed empty-state border
- `deep/28` — modal scrim (`rgba(14,38,34,0.28)`)
- `deep/35` — placeholder / "page continues" filler text
- `deep/50`, `deep/55`, `deep/60`, `deep/62`, `deep/65` — captions, labels, secondary text
- `deep/70`, `deep/78` — body copy on paper
- `citron/10` fill + `citron/35–40` border — status header block, Verified badge
- `paper/55`, `paper/60`, `paper/68`, `paper/75` — secondary text on deep backgrounds
- `#EDF2F0` — lead-time pill fill; `#EFF3F1` — expanded table row fill; `#E4EDE9` — monogram slot fill; `#F4F7F5` — photo-placeholder hatch highlight

### Typography
Two families, loaded from Google Fonts:

```
Bricolage Grotesque — opsz 12..96, weights 500 / 600 / 700
Public Sans — weights 400 / 500 / 600
```

**Bricolage Grotesque** is the display face, used in exactly four places: the guest headline, the pitch wordmark, console stat numbers, and provider monograms. Nowhere else.

| Role | Size / line-height | Family, weight, tracking |
|---|---|---|
| Pitch wordmark | 132 / 0.9 | Bricolage 700, `-0.045em` |
| Console "your share" figure | 72 | Bricolage 600, `-0.03em` |
| Canvas title | 52 / 1.0 | Bricolage 700, `-0.03em` |
| Guest headline | 34 / 1.05 | Bricolage 700, `-0.03em` |
| Console stat number | 32 | Bricolage 600, `-0.02em` |
| Pitch supporting line | 26 / 1.4 | Public Sans 400 |
| Provider monogram (56px slot) | 24 | Bricolage 600 |
| Provider monogram (44px slot) | 22 | Bricolage 600 |
| Sheet title / tray title | 20 / 1.3 | Public Sans 600 |
| Body, card title, price, input value | 17 / 1.35–1.5 | Public Sans 400; card title 500, price 600 |
| Secondary, controls, table cell, provider name | 15 / 1.3 | Public Sans 400; names and buttons 600 |
| Caption, provider role, meta | 14 / 1.3–1.5 | Public Sans 400 |
| Uppercase label | 13, `0.08em` | Public Sans 600 — `0.12em` in console, `0.14em` for eyebrows |
| Eyebrow (property name) | 12.5, `0.14em` | Public Sans 400, `--color-water` |
| Annotation (canvas only) | 11.5–12 | `ui-monospace` |

Rules: `font-variant-numeric: tabular-nums` on every price, date, count and money figure. `text-wrap: pretty` on all multi-line body copy. Never below 14px on the guest surface; 13px labels only in uppercase.

### Spacing, radii, borders
- Spacing step 4: `8 / 12 / 14 / 16 / 20 / 24 / 28 / 30 / 32`
- Radii: card `14` · control and button `10` · sheet top corners `20` · frame `18` · photo slot `8` (56px slot `10`) · chip, stepper and dot `999`
- Borders: `1px` throughout. Hairlines `deep/8`–`deep/12`. Inputs `deep/22`.
- Focus: `1px solid --color-water` + `box-shadow: 0 0 0 2px rgba(26,80,73,0.14)`
- No shadows anywhere except the focus ring. Depth comes from paper-on-stone, not elevation.

### Motion
```
sheet enter      260ms cubic-bezier(.22,.8,.36,1)   translateY(24px)→0, opacity 0→1
scrim            200ms                              opacity
card settle      220ms ease-out                     translateY(-4px)→0, opacity .4→1
```
Nothing else animates. No hover lift, no colour transitions on cards, no spinners.

### Layout constants
- **Guest:** 390px viewport, 480px max content column, 16px side padding, 12px between cards, 30px between phase bands. Timeline spine: 1px rule at `x=4`, 9px square marker at `top:8`, content indented 30px.
- **Console:** 1440px viewport, 1152px max content, 24px padding, 16px grid gap, table rows `16px 20px`.
- **Requests table grid** (identical on header row and body rows):
  `grid-template-columns: 108px 92px minmax(220px,1fr) 80px 112px 62px 74px 140px 116px; gap: 12px`
  Columns: Guest · Property · Service · Provider · Requested for · Value · Your share · Status · action. Value and Your share are right-aligned; Your share is 600. Track sum must stay ≤ 1014px at this gap or the action column clips — if you change any column, re-check the sum.

---

## Screens / Views

### 1. Guest portal (390px)
**Purpose:** the family browses what can be arranged and requests it.

**Layout, top to bottom:**
1. **Property bar** — paper, 14/16/12 padding, bottom hairline. Eyebrow: `VILLA SERENA · MANERBA DEL GARDA` (12.5px, `0.14em`, water).
2. **Header block** — 24px top padding. Headline "Welcome, the Brandt family" (34px Bricolage). Stay line "4 – 11 August · 2 adults, 2 children aged 4 and 7" (15px, deep/62, tabular). Then a hairline and the framing line: "Anything below can be arranged for you. Prices are final — no booking fees." (17px, deep/78).
3. **Phase bands** — 28px top padding, 30px between bands. Each band is a timeline segment: absolute 1px spine (`left:4, top:16, bottom:-30`, deep/14), 9px solid deep square marker at `left:0, top:8`, content indented 30px. Band label uppercase 12.5/`0.14em` deep 600; band dates 14px deep/55 beneath. Four bands:
   - `Before you arrive` — "In place by Wed 4 Aug"
   - `Your first evening` — "Wed 4 Aug"
   - `During the week` — "Thu 5 Aug – Tue 10 Aug"
   - `Before you leave` — "Wed 11 Aug"
4. **Service cards** inside each band, 12px apart — see §2.
5. **Empty tray state** — 28px above, dashed `deep/22` border, radius 14, 14/16 padding: "Nothing requested yet. Start with the fridge — it's the one most families are glad they did."
6. **Footer** — top hairline, 14px deep/50: "Arranged by Lago Verde Property Management, Salò. Everything here is booked and paid through your host — no booking fees, no tipping expected."

**Full service catalogue** (14 services; title, provider, price, price note, lead time):

*Before you arrive*
- Fridge stocked before you arrive — Elena — €45 — "+ the cost of the shopping" — Order by 6pm the day before
- Met at the airport and driven to the house — Tommaso — €120 — — Book at least 24 hours ahead
- Shown round the house when you arrive — Chiara — €40 — "for the whole stay" — Order by 6pm the day before

*Your first evening*
- Dinner cooked at the villa on your first night — Marco — €65 — "per adult" — Book at least 48 hours ahead
- Aperitivo waiting on the table when you walk in — Elena — €38 — — Order by 6pm the day before

*During the week*
- Babysitting so you can go out to dinner — Giulia — €18/hour — "3 hour minimum" — Book at least 24 hours ahead
- Evening babysitting in English or German — Sofia — €20/hour — "3 hour minimum" — Book at least 24 hours ahead
- Mid-stay clean, fresh beds and towels — Anna — €70 — — Book by the evening before
- Washing collected and back the next morning — Anna — €22 — "per bag, washed and folded" — Collected the same evening if you ask before 4pm
- An afternoon on the lake with a skipper — Luca — from €280 — "half day, up to 7 people" — Book at least 24 hours ahead
- Valtènesi wines tasted at your table — Davide — €30 — "per person" — Book at least 24 hours ahead
- A massage on the terrace — Francesca — €80 — "60 minutes, at the house" — Book at least 24 hours ahead

*Before you leave*
- Late checkout and somewhere to leave the bags — Chiara — €35 — "subject to the house being free" — Ask by the day before
- Driven back to the airport on the last day — Tommaso — €120 — — Book at least 24 hours ahead

**Providers** (name — role line, used verbatim everywhere the provider appears):
- Elena — shops at the Manerba market, Manerba del Garda
- Tommaso — drives, licensed NCC, Desenzano del Garda
- Chiara — welcome host for Lago Verde, Manerba del Garda
- Marco — cooks in your kitchen, Salò
- Giulia — babysits, trained nursery teacher, Moniga del Garda
- Sofia — babysits, English and German, Padenghe sul Garda
- Anna — housekeeping and laundry, Manerba del Garda
- Luca — skippers his own boat, Moniga del Garda
- Davide — makes wine in the Valtènesi, Moniga del Garda
- Francesca — massage therapist, Salò

### 2. Service card — four states
Paper, `1px deep/10`, radius 14, 16px padding.

**Default:** title (17/1.35, 500, `-0.01em`) · provider row (36px photo slot radius 8 + name 15/600 + role 14/deep-55, 10px gap, 12px above) · hairline `deep/8` then price row (17/600 tabular + 14px deep/55 note, baseline-aligned, 14px above and below the rule) · lead-time pill (13px deep/62 on `#EDF2F0`, radius 999, 5/10 padding, 12px above). This is also the state a cancelled request reverts to.

**Requested / Confirmed / Scheduled:** border becomes `1px --color-citron` and a **status header block** is added above the card body — `citron/10` fill, bottom border `citron/35`, 12/16 padding. Inside: three 7px progress dots (filled `--color-citron`, unfilled `deep/18`) then the status label at 15/600, 4px left margin; an optional 14px deep/60 sub-line beneath, 6px down. The header replaces the inline status row; on entry the card runs the 220ms settle.

| State | Dots | Label | Sub-line | Action |
|---|---|---|---|---|
| Requested | 1 of 3 | "Requested" | "Elena will confirm before anything is charged" | Cancel request (clay) |
| Confirmed | 2 of 3 | "Confirmed by Elena" | "She will send a time once she has been to the market" | Cancel request (clay) |
| Scheduled | 3 of 3 | "Scheduled for Mon 4 Aug, 3pm" | — | none |

In the requested/confirmed body the price row becomes `space-between`: price + date on the left, "Cancel request" (15px, clay) on the right. Scheduled has no action.

### 3. Request sheet
A bottom sheet over a `deep/28` scrim, paper, top corners radius 20, entering with the 260ms sheet curve. 36×4 grabber (deep/18, radius 999) centred at 14px top padding. Body padding 16px.

Structure: sheet title (20/1.3/600) · provider block (44px slot + name·role on one line at 15/600 + verification line 14px deep/55 "Verified: ID · insurance · references", inside a `deep/10` box, radius 12, 12px padding) · optional provider note in first person (17/1.5 deep/78) · price line (17/600 + lead time, above a hairline) · the form · sticky footer.

**Footer** (top hairline, 14/16/18 padding): estimate line 15px deep/62 with the figure inlined at 600 — "Estimated **€120** · confirmed by Tommaso before anything is charged" — then the primary button: water fill, paper text, radius 10, 15px padding, centred, 17/600, "Request this".

Two form archetypes are specified; every service uses one or a mix.

**a) Airport pick-up — select + date + time.** Provider note: "I watch the flight and wait if you're late — there's no extra charge for that. Car seats are fitted before I leave the garage, not in the airport car park." Fields, 14px apart:
- `PICK-UP FROM` — select, value "Verona Villafranca (VRN)", chevron ▾ in deep/45
- `ARRIVAL DATE` / `LANDING TIME` — side by side, 12px gap. Date shows the **focus state** (water border + 2px water/14 ring), value "Tue 4 Aug". Time is empty-ish: "14:35" at deep/40 as placeholder.
Inputs: radius 10, 13/14 padding, 17px value, `deep/22` border. Labels 13px uppercase `0.08em` deep/60 600, 6px above the field.

**b) Fridge stocking — stepper + chips + textarea.** Fields, 16px apart:
- `WHICH DAY` — input, "Sun 8 Aug"
- `HOW MANY PEOPLE EATING` — stepper: two 44px circular buttons (`deep/22` border, − and + at 20px) with the value 17/600 tabular between, 14px gaps
- `WHAT TO GET IN` — chips, 8px gap, wrapping. Selected = water fill / paper text; unselected = `deep/22` border / deep text. 15px, 9/14 padding, radius 999. Options in order: Milk and bread *(selected)*, Fruit *(selected)*, Coffee, Pasta and sauce, Beer and wine *(selected)*, Nappies
- `ANYTHING ELSE, OR ANYTHING TO AVOID` — textarea, min-height 76, 17/1.45. Sample value: "No nuts in the house please. Oat milk if you can find it."
Footer estimate: "Estimated **€45 + about €80** of shopping · confirmed by Elena before anything is charged".

Provider verification strings by provider: Elena/Chiara/Sofia/Anna/Davide — "ID · insurance · references"; Tommaso — "ID · NCC licence · insurance · references"; Marco — "ID · insurance · HACCP certificate · references"; Giulia — "ID · insurance · DBS-equivalent check · references"; Luca — "ID · skipper licence · boat insurance · references"; Francesca — "ID · professional registration · insurance · references".

### 4. Requests tray — three states
Fixed to the bottom of the guest portal, 16px inset left/right/bottom.

- **Empty** — dashed `deep/22`, radius 14, paper at 90% opacity, 14/16 padding, 17/1.45 deep/68: "Nothing requested yet. Start with the fridge — it's the one most families are glad they did."
- **Collapsed** — paper, `deep/14` border, radius 14, `space-between` row: left "3 requests" (17/600) over "€230 · none charged yet" (14px deep/55 tabular); right "Show" (15/600 water).
- **Expanded** — the same sheet component as a request: `deep/28` scrim, paper sheet, top radius 20, 260ms enter, 18/16/20 padding. Header row: "Your requests" (20/600) and "Hide" (15px water). Then one line per request, 12px vertical padding, hairline `deep/8` between (none after the last): title 17px over a 14px deep/55 status line, price 17/600 tabular right-aligned. Cancel links are clay, inline in the status line.
  - Fridge stocked before you arrive — "Scheduled for Mon 4 Aug, 3pm" — €45
  - Met at the airport and driven to the house — "Confirmed by Tommaso · Cancel request" — €120
  - Aperitivo waiting on the table when you walk in — "Requested · Cancel request" — €38
  Total row above a `deep/14` rule, 12px above: "Total, paid through your host" / "€203" (600, tabular).

> Data note carried over from the design, worth resolving in the build: the collapsed bar reads "3 requests · €230" while the expanded sheet totals €203 over the same three lines (45+120+38 = 203). Use €203 and derive both numbers from one source.

### 5. Agency console (1440px)
**Top bar** — paper, bottom hairline, 16px vertical padding, content 1152 max with 24px side padding. Left: "Lago Verde Property Management" (17/600) over "Limonaia guest services · 3 properties" (14px deep/55). Right: "Pitch screen" text link (15px) and a water button "Get guest link" (radius 10, 10/16 padding, 15/600).

**Stat row** — `grid-template-columns: 420px 1fr`, 16px gap.
- Left: deep panel, radius 14, 24px padding, `space-between` column. Label "YOUR SHARE · AUGUST" (13px `0.12em` paper/60 600). Figure "€78" (72px Bricolage 600, citron, tabular). Caption "10% of everything below, paid monthly. Nothing to invoice." (15px paper/68).
- Right: three stacked paper rows (`grid-template-rows: repeat(3,1fr)`, 16px gap), each `space-between`, 16/20 padding, radius 14: uppercase label (13px `0.12em` deep/60) + number (32px Bricolage 600, tabular). "Requests this month" 5 · "Gross value" €784 · "Our fee" €78.

**Tabs** — 28px above, 24px gap, bottom hairline `deep/14`. Active: 15/600 deep with a 2px deep underline (`margin-bottom:-1px`); inactive 15px deep/55. Three tabs: Requests · Properties · Providers.

**Requests table** — paper card, `deep/10`, radius 14, 16px above. Header row uses the grid above with uppercase 13px `0.08em` deep/55 labels; body rows 16/20 padding, 15px deep text, `deep/8` bottom hairline, vertically centred. Status cell = 7px dot + label (citron for live states, `deep/25` when scheduled/closed). Action cell = an outlined water button (`1px rgba(26,80,73,0.4)`, radius 10, 8/12 padding, 15/600, centred) or empty.

Rows:
| Guest | Property | Service | Provider | Requested for | Value | Share | Status | Action |
|---|---|---|---|---|---|---|---|---|
| the Van Dijk family | Ca' del Porto | Dinner cooked at the villa on your first night | Marco | Tue 3 Aug, 8pm | €260 | €26 | Requested | Confirm with Marco |
| the Laurent family | Casa Oliva | Mid-stay clean, fresh beds and towels | Anna | Wed 11 Aug | €70 | €7 | Requested | Confirm with Anna |
| the Van Dijk family | Ca' del Porto | An afternoon on the lake with a skipper | Luca | Wed 4 Aug | €280 | €28 | Confirmed by Luca | Mark scheduled |
| the Laurent family | Casa Oliva | Met at the airport and driven to the house | Tommaso | Sun 8 Aug, 2.35pm | €120 | €12 | Confirmed by Tommaso | Mark scheduled |
| the Laurent family | Casa Oliva | Fridge stocked before you arrive | Elena | Sun 8 Aug | €54 | €5 | Scheduled for Sun 8 Aug | — |

**Expanded row** (row 2 is shown expanded): `#EFF3F1` fill, bottom hairline `deep/10`, 18/20 padding. Three equal columns of label + value: "Which day" / "Wed 11 Aug" · "Time window" / "Morning, 9 – 12" · "Anything to leave alone?" / "The children nap in the small bedroom until 10." Then a 14px deep/55 meta line 16px below: "Requested Mon 17 Aug · Anna takes €56 · platform fee €7". The expanded panel carries the guest's answers from the request sheet — its fields vary by service.

**Table footer** — 20px above, top hairline `deep/12`, 14px deep/55, `space-between`: "Commission split: provider 80% · agency 10% · platform 10%. Your share is paid monthly against the requests above." and a "Reset demo" link.

**Properties tab** — one paper card per property, 12px apart, radius 14, 20px padding, `grid-template-columns: 280px 1fr 160px 150px`, 24px gap, centred. Name (17/600) over village (14px deep/55) · "IN RESIDENCE" label + guest and dates · "SERVICES ON" label + count · outlined water "Get guest link" button (10/12 padding).
- Villa Serena — Manerba del Garda — the Brandt family · 4 – 11 Aug — 14 of 14
- Ca' del Porto — Moniga del Garda — the Van Dijk family · 1 – 8 Aug — 12 of 14
- Casa Oliva — Padenghe sul Garda — the Laurent family · 8 – 15 Aug — 14 of 14

**Providers tab** — two-column grid, 12px gap. Each card: paper, `deep/10`, radius 14, 16px padding, 14px gap; 56px photo slot (radius 10 — photo, or Bricolage 24px monogram in water on `#E4EDE9`); then name (17/600) beside a "Verified" badge (13px deep on `citron/16`, `citron/40` border, radius 999, 2/8 padding), role line (15px deep/70), then a `deep/8` hairline and "Checked: {verification list} · {n} services" (14px deep/50, 8px above and below the rule). Service counts: Elena 2, Marco 1, Giulia 1, Tommaso 2, Anna 2, Luca 1, Sofia 1, Chiara 2, Davide 1, Francesca 1.

### 6. Pitch screen (1440×810)
`grid-template-columns: 1fr 480px`, deep background, radius 18.
Left, 80px padding, `space-between` column: eyebrow "LAGO VERDE PROPERTY MANAGEMENT" (13px `0.14em` paper/55 600) · then the wordmark "Handled" (132px Bricolage 700) with the line "Everything a family needs at the villa — arranged by the people who already look after the house." (26/1.4 paper/75, max 560px) · then "handled.link/brandt" (15px monospace, citron).
Right: paper panel, centred column, 24px gap: a 300×300 QR block and "Scan for the Brandt family's stay" (17px deep/65). **The QR in the reference is a decorative fake** — a 25×25 grid with real finder patterns and pseudo-random data cells. Replace it with a genuine QR encoding the guest link.

### 7. Expired link (390px)
Property bar as on the portal. Then 32/16 padding, 16px gap: headline "This link has ended" (34px Bricolage) · "It covered the Brandt family's stay, 4 – 11 August. Nothing can be requested through it now." (17/1.5 deep/70) · a paper card (radius 14, 16px padding) with label "STILL THE PERSON TO ASK", a 44px monogram slot + "Chiara" / "welcome host for Lago Verde, Manerba del Garda", and an outlined water button "Message Chiara" (radius 10, 14px padding, 17/600, full width).

---

## Interactions & Behavior

**Guest flow**
1. Open link → portal, all services in default state, tray empty.
2. Tap a service card → request sheet rises (260ms sheet curve) over a scrim fading in over 200ms. Sheet is dismissible by the grabber, scrim tap, or back gesture; dismissing discards the draft.
3. Fill the form → footer estimate updates live from the entered values (people count, chips, hours).
4. "Request this" → sheet dismisses, the card takes the **Requested** state with the 220ms settle, tray goes from empty to collapsed and its count/total increment. No confirmation dialog, no toast — the card change *is* the receipt.
5. "Cancel request" (from the card or the tray) → card reverts to default, tray decrements, and empties back to the dashed empty state at zero. Cancel is available in Requested and Confirmed, never in Scheduled.
6. Tray "Show" → the tray expands into a sheet (same component and curve as a request sheet); "Hide" or scrim tap closes it.
7. Status advances Requested → Confirmed → Scheduled, driven by the agency side. In a prototype, drive it from the console or a timer; each advance is a dot fill, a label change, and a settle.
8. Expired link → the expired screen replaces the portal entirely; no service is tappable.

**Agency flow**
1. Console lands on Requests.
2. Row click → expands/collapses the detail panel in place (only the guest's answers; no modal). Multiple rows may be open.
3. "Confirm with {provider}" → status becomes "Confirmed by {provider}", action becomes "Mark scheduled". The corresponding guest card advances to Confirmed.
4. "Mark scheduled" → prompts for a time, status becomes "Scheduled for {date, time}", dot goes `deep/25`, action clears. Guest card advances to Scheduled.
5. Tabs switch the content below the stat row; the stat row and top bar persist.
6. "Get guest link" (top bar or a property row) → copies the link and confirms inline on the button.
7. "Pitch screen" → the 1440×810 pitch view; Escape or a click returns.
8. "Reset demo" → restores all seed data.

**Hover / focus / active**
The design specifies no hover treatments — add the minimum the target system uses. Suggested: buttons darken toward `--color-deep`; table rows take `#EFF3F1`; cards get `cursor: pointer` and a border shift from `deep/10` to `deep/22`. Focus is the specified water ring on every interactive element. Guest tap targets never below 44px (steppers and circular buttons are exactly 44).

**Loading, errors, validation**
- No spinners. Optimistic on request submit; on failure the card reverts and an inline clay message appears under the footer button.
- Required per sheet: the date field and any service-specific quantity. Invalid → input border and label go clay with a 14px message beneath; the footer button stays enabled and validates on press.
- Lead times are real constraints: dates earlier than the service's lead time are unselectable, with the lead-time string as the reason.

**Responsive**
Guest is single-column and fluid to 480px max, then centred. Console below 1152px: collapse the stat row to one column and let the requests table scroll horizontally rather than shrinking the Service column — the track sum has no slack.

## State Management
Guest: `stay` (property, guest name, dates, party) · `services[]` (seed catalogue) · `requests[]` — `{serviceId, status: 'requested'|'confirmed'|'scheduled', scheduledAt, formAnswers, price}` · `traySheetOpen` · `activeSheet` (serviceId or null) + its draft form state · `linkExpired`.
Console: `requests[]` (shared with guest — one store is what makes the prototype demo well) · `expandedRowIds` · `activeTab` · `properties[]` · `providers[]`.
Derived, never stored: tray count and total, the three stat numbers, agency share (10% of value, rounded down as in the seed rows — €54 → €5).
No network needed for a prototype; seed from a single module and keep it in memory. If both surfaces run in one app, a shared store plus a route per surface (`/g/:token`, `/console`) makes the confirm-and-watch-the-guest-card demo work.

## Assets
- **Fonts:** Bricolage Grotesque and Public Sans, Google Fonts. No other icon or image dependency.
- **Provider photos:** none supplied. The hatch swatch is a placeholder for a real photo; the monogram is the designed fallback. Sizes needed: 36px (card), 44px (sheet, expired), 56px (console providers).
- **Icons:** the design uses no icon set — the chevron is the character `▾`, the stepper uses `−` and `+`, status is a dot. Substitute the codebase's icon set if it has one.
- **QR:** to be generated, not an asset.
- No logo mark exists yet; "Handled" is set in type. `Handled` is a working name.

## Files
- `Handled.dc.html` — the design canvas: all screens and states, plus a tokens/type/measurements panel at the bottom. Open it in a browser. The seed data (services, providers, properties, table rows) is in the `<script>` block at the end and is the same data described above.
- `reference_screenshots/` — screenshots of an earlier visual pass of four screens (guest portal, request sheet, agency requests, agency providers). Useful for structure and flow; **colours and typeface are outdated** — the HTML file is authoritative.

## Prototype scope
Suggested build order for a clickable demo: guest portal with the full catalogue → request sheet for one service end to end (archetype b, the fridge) → request/cancel state machine and the tray → console requests table with confirm and mark-scheduled wired to the same store → remaining tabs, pitch and expired screens.

What deliberately isn't designed and needs a call: navigation chrome between screens in the demo, the "mark scheduled" time picker, the copy-link confirmation, and any auth on the console.

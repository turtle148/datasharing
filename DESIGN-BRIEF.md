# Design brief — handing the portal to Claude Design

> **Superseded.** The redesign came back as **Handled** and is implemented on
> this branch. The delivered spec and canvas are in `design/`; this brief is
> kept for the record, and its §7 is still the list of what makes a design
> handoff portable into the app.

Everything Claude Design needs to redesign these screens without losing what the
build already gets right, and everything I need to port the result back into the
React app.

**How to use it:** open a Claude Design canvas, paste §1, attach the screenshots
from `screens/` (or the ones from our chat), and keep §2–§6 open as the
reference. §7 is what to bring back to me.

---

## 1. The prompt to paste

> Redesign an existing, working guest-services web app so it feels sleeker and
> more modern. It is not a new product — the structure, copy and data are fixed
> and correct; this is a visual pass over screens I will show you.
>
> **The product.** A property agency on Lake Garda attaches a services layer to
> bookings it already has. A family arriving at a villa opens a link with their
> own name and dates on it and can arrange the things a parent actually needs —
> the fridge stocked before check-in, an airport transfer, a babysitter, a chef
> for the first evening, a boat afternoon. The agency sees the requests come in
> and takes a cut.
>
> **Who is holding it.** A tired parent with one hand free in an airport queue,
> in bright sun. Calm, legible, obviously trustworthy. It should read as
> *arranged for you*, not *sold to you*.
>
> **Screens to draw** (artboards at 390px for the guest side, 1440px for the
> agency console):
> 1. Guest portal — arrival header, then services grouped along the arc of the
>    stay in four bands
> 2. Service card — default, and the state after it has been requested
> 3. Request sheet — a bottom sheet with a mixed form and a live price estimate
> 4. Requests tray — empty, collapsed, expanded
> 5. Agency console — stat row, request table with an expanded row, properties
>    tab, providers tab
> 6. Pitch screen — product name, one line, a large QR
> 7. Expired-link screen
>
> **Keep, because they are the product, not decoration:**
> - The named provider with a photograph, first name, role and village on every
>   card. A logo or a category icon in that slot kills the whole proposition.
> - The stay timeline. Services are grouped **before you arrive / your first
>   evening / during the week / before you leave**, each band captioned with the
>   real dates it covers. Never a category grid, never a carousel.
> - The personal header: the family's name and their dates, above the fold, with
>   no hero image.
> - Prices stated plainly and finally, in tabular numerals.
> - Sentence case everywhere. Buttons name their action: *Request this*, *Cancel
>   request*, *Get guest link*.
> - The agency console looking like an operations tool, not a consumer app — the
>   contrast with the guest side is part of the pitch. Its one loud number is the
>   agency's own share.
>
> **Free to change:** the palette (as a considered system, not a repaint), the
> type pairing and scale, spacing rhythm, card and sheet construction, how status
> is expressed, the shape of the console's stat row and table, iconography if it
> earns its place, and any structure that makes the timeline read better.
>
> **Avoid:** the warm-cream-and-terracotta look every AI-generated Italian travel
> page defaults to; hero photography of generic pools; gradient heroes; emoji as
> section markers; drop shadows doing the work a border should do; anything that
> makes a service look like an ad.
>
> **Constraints that are real:** single column, max 480px on the guest side; body
> text no smaller than 17px; a single accent colour used sparingly (if it appears
> more than four times on a screen, remove one); motion at exactly two moments —
> the sheet rising, and a card settling into its new state after submit.
>
> Give me the tokens as CSS custom properties, keeping the existing names where
> the roles survive: `--color-deep`, `--color-water`, `--color-stone`,
> `--color-paper`, `--color-citron`, `--color-clay`.

---

## 2. Current tokens

| Token | Hex | Role |
| --- | --- | --- |
| `--color-deep` | `#0E2E2A` | text, headers |
| `--color-water` | `#1E5F56` | primary buttons, phase rules |
| `--color-stone` | `#EDF1EF` | page background |
| `--color-paper` | `#FFFFFF` | cards |
| `--color-citron` | `#E3C23C` | single accent — status dots, "your share", verified badge |
| `--color-clay` | `#B2543A` | errors and cancellations only |

Tints are the same colours at low alpha (`deep/10` hairlines, `deep/55`–`deep/75`
secondary text, `water/10` avatar fallback).

**Type.** Fraunces (variable, `SOFT 100`, `WONK 0`) for the welcome headline and
the console's three big numbers only; Inter Tight for everything else; tabular
numerals on every price. Both are self-hosted in `src/fonts/`.

**Scale in use.** 34px display (guest headline) · 44px / 32px display (console
stats) · 20px (sheet title) · 17px body · 15px secondary and controls · 14px
captions · 13px uppercase labels with `0.08em`–`0.14em` tracking.

**Shape.** Cards 16px radius with a 1px hairline and no shadow · inputs and
buttons 12px · sheet 24px top corners · chips and steppers fully round.

**Rhythm.** Guest column 480px max, 16px side padding, 12px between cards, 32px
between phase bands. Console 1152px max, 24px padding, 16px cells.

**Motion.** Sheet up 260ms `cubic-bezier(.22,.8,.36,1)`; scrim fade 200ms; card
settle 220ms ease-out; nothing else animates; all of it disabled under
`prefers-reduced-motion`.

---

## 3. Components and their states

| Component | States to draw |
| --- | --- |
| Service card | default · requested (status row + accent border) · cancelled (reverts to default) |
| Status | `Requested` → `Confirmed by Elena` → `Scheduled for Mon 4 Aug, 3pm`, as a three-dot progress |
| Request sheet | date, time, stepper, chip multi-select, select, free text, textarea; sticky footer with the live estimate and **Request this** |
| Requests tray | empty (the invitation line) · collapsed with a count and total · expanded list with cancel links |
| Console stats | four tiles, the agency's share largest and in the accent |
| Console table | row · expanded row showing the guest's answers · row with no action left |
| Provider card | photo, name, verified badge, what was checked |

Real copy is in `src/lib/seed.ts` — use it, never lorem. Two lines that must
survive verbatim because they carry the pitch:

- *Anything below can be arranged for you. Prices are final — no booking fees.*
- *Nothing requested yet. Start with the fridge — it's the one most families are
  glad they did.*

---

## 4. Screens as built

`screens/` holds the current state: guest portal, request sheet, requested
states, tray open, expired link, console (requests / properties / providers),
pitch. They are the "before" — send them in so the redesign lands on the real
content and the real density.

---

## 5. What the redesign must not break

The acceptance test the whole build serves: hand someone a phone and say nothing.
They scan a QR, land on a page with their family's name on it, tap the fridge
card, fill in three fields and hit **Request** — without asking a single
question. If a design change makes any step need explaining, that step is wrong.

---

## 6. Things worth fixing while you are in there

- The provider photo falls back to an initial in a tinted circle. It shows up
  whenever the image is blocked, so it deserves a real design rather than being
  a fallback.
- The console's stat row is four equal tiles; the agency's share is the number
  that sells the deal and could carry far more weight.
- The phase bands are a 2px rule and a caption. They are the signature element
  and are currently the plainest thing on the page.
- The tray is a plain bar. It is the only persistent chrome on the guest side.

---

## 7. What to bring back

For me to port it in an afternoon, not a week:

1. **The token set** as CSS custom properties — I paste it straight into the
   `@theme` block in `src/index.css`.
2. **Font choices** with weights and the Google Fonts family names (or files), so
   I can self-host them the way Fraunces and Inter Tight are now.
3. **One artboard per component state** from §3, at the widths in §1.
4. **Numbers, not vibes**: radii, border widths, the type scale, the spacing
   step. Anything left to my judgement will drift from your design.
5. A note on anything that changes *structure* rather than surface — a moved
   element, a merged screen, a new state — since that touches the React tree and
   not just classes.

Then hand me the canvas link and I will implement it against these screens.

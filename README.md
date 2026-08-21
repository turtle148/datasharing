# Handled — guest services prototype

A clickable prototype of **Handled**: a guest-services layer a property agency
attaches to bookings it already has. A family arriving at a villa on Lake Garda
opens a private link with their own name and dates on it and arranges the things
a parent actually needs; the agency works the other side in a console and takes
a 10% share.

It is a prototype, not a product. No payments, no accounts, no provider app, no
server. Everything is seeded data held in the browser.

## Three surfaces

| Route | Who sees it | Job |
| --- | --- | --- |
| `/s/:stayToken` | the guest, on their phone (390px) | browse and request services |
| `/agency` | the agency, on a laptop (1440px) | requests arriving, revenue share |
| `/` | you, in the meeting | pitch screen with a scannable QR |

Demo stays: `/s/villa-serena-0811`, `/s/ca-del-porto-0108`, `/s/casa-oliva-0815`.
Any other token shows the expired-link screen rather than a 404.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
npm run preview
```

### Deploying

`npm run build` then drag `dist/` (or the zip built from it) onto
[app.netlify.com/drop](https://app.netlify.com/drop). SPA rewrites are already
configured for Netlify (`public/_redirects`) and Vercel (`vercel.json`); on other
hosts, point every path at `index.html` or `/s/:token` will 404 on a refresh.

```bash
npm run build && (cd dist && zip -r ../release/handled-netlify.zip .)
```

### Single-file build (for a hosted preview)

```bash
npm run build:artifact          # dist-artifact/artifact.html — one self-contained file
node build-artifact-page.mjs    # dist-artifact/handled.html — same page, body fragment
```

Everything is inlined, including the fonts, and routes move to the hash
(`#/s/villa-serena-0811`) so the whole demo serves from a single URL. Sandboxed
hosts block browser storage, so the store falls back to memory there: state
survives moving between routes but not a reload.

## Running the pitch

1. Open `/` and let the owner scan the QR. They land on Villa Serena with the
   Brandt family's name and dates already on it.
2. Let them tap **Fridge stocked before you arrive**, set the day and who is
   eating, and hit **Request this**. The card takes the requested state in place
   and the tray at the bottom counts up.
3. Turn the laptop round to `/agency`: the request is in the table with their
   cut beside it. **Confirm with Elena**, then **Mark scheduled** — the guest
   view catches up within a couple of seconds.
4. **Reset demo** (pitch screen and console footer) puts the seed back.

**Both windows have to be the same browser.** State lives in `localStorage`, so
the portal and the console sync across tabs and windows on one machine (a
`storage` event plus a 1.5s poll), but not across devices — that needs a server,
which is out of scope. For step 3, drive the guest portal in a second window on
the laptop.

## How it is put together

React 19 + Vite + Tailwind v4 + TypeScript, one repo, no backend.

```
src/lib/types.ts     Property, Stay, Provider, Service, Request
src/lib/seed.ts      the agency, 3 properties, 3 stays, 10 providers, 14 services
src/lib/pricing.ts   one estimator for every service; live sheet estimates
src/lib/storage.ts   localStorage where it exists, memory where it doesn't
src/lib/store.ts     the shared store, with cross-tab sync
src/routes/          GuestPortal (and the expired screen), Agency, Pitch
src/components/      ServiceCard, RequestSheet, Sheet, FieldInput, RequestsTray,
                     ProviderSlot, StatusDots, QrCode, ResetDemo
```

**Services are data, not code.** Each service carries a `fieldSchema`, and the
request sheet renders it: `date` (clamped to the stay), `time`, `stepper`,
`checkboxes`, `select`, `textarea`, `text`, with `half: true` pairing two fields
onto one row. Prices come off the same schema — a base price, optional
`multiplierFields` (hours, heads) with a `minMultiplier`, per-option
`priceDelta`, per-unit stepper pricing, and a `variableExtra` for money the
provider spends on your behalf (the shopping bill, estimated separately and
never folded into the fee). A new service is a new object in `seed.ts`.

`phase` (`before_arrival` / `first_evening` / `during_stay` / `before_departure`)
drives the timeline grouping, and each band's caption is computed from the real
stay dates.

Stay dates are written as August days and the year rolls forward once the season
has passed (`seasonYear()` in `seed.ts`), so the demo never opens on a stay that
already happened.

## Design

Built to the **Handled** design handoff in `design/` — `handoff.md` is the
written spec, `Handled.dc.html` is the design canvas (open it in a browser).
Tokens live in the `@theme` block of `src/index.css`:

| Token | Hex | Use |
| --- | --- | --- |
| `--color-deep` | `#0E2622` | text, pitch background, console stat panel, timeline markers |
| `--color-water` | `#1A5049` | primary buttons, links, eyebrows, selected chips, focus ring |
| `--color-stone` | `#E8EDEB` | page background, chip fills |
| `--color-paper` | `#FCFDFC` | cards, sheets, console surfaces |
| `--color-citron` | `#C9922B` | status dots, the agency's share, Verified badge |
| `--color-clay` | `#9E4A32` | cancel and error affordances only |

Bricolage Grotesque is the display face in exactly four places — the guest
headline, the pitch wordmark, console stat numbers, provider monograms — and
Public Sans carries everything else, never below 14px on the guest surface.
Both are self-hosted in `src/fonts/`. No shadows anywhere except the focus ring:
depth is paper on stone. Motion is three specified moments (sheet 260ms, scrim
200ms, card settle 220ms) and nothing else, all disabled under
`prefers-reduced-motion`.

`screens/` holds the built screens at 2x.

### Where the build departs from the design, and why

- **Date and time inputs** are native pickers, so the stay's date limits are
  real constraints rather than a drawn value. They inherit the browser's date
  format instead of the design's `Sun 8 Aug`.
- **Mark scheduled** takes the slot the guest asked for rather than prompting
  for a time — one less invented screen in a demo.
- **Get guest link** copies and confirms inline, as designed; the printable QR
  download sits on the pitch screen instead of in a property row.
- **Prototype navigation** is a small demo line in the guest footer and the
  links already in the console and pitch screens. The design has no nav chrome
  because each screen was drawn in isolation.
- **Validation** is the browser's own on required fields, not the designed
  inline clay message.
- The design's data note is resolved as it asked: the tray total is derived from
  the requests, so the bar and the sheet cannot disagree.

## Before showing this to a real agency

- **Provider photos** come from a placeholder portrait service and fall back to
  the designed monogram if they don't load. Drop real portraits into
  `public/providers/` and point `provider.photo` at them — the faces are the
  pitch.
- **Prices** (babysitting €18–20/hour, chef €65/head, Verona transfer €120,
  mid-stay clean €70) are plausible for Garda in August; check them against what
  the agency knows before the meeting.
- **Names** — the agency, providers and guests are invented, and `Handled` is a
  working name.

## Not built

Payments, accounts, provider app, availability calendars, real notifications,
multi-agency tenancy, admin CRUD, anything server-side. Of the earlier stretch
list, the PWA manifest is in; the EN/IT/DE language toggle is not.

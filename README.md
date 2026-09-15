# Otiara — guest services prototype

A clickable prototype of **Otiara**: a guest-services layer a property agency
attaches to bookings it already has. A family arriving at a villa on Lake Garda
opens a private link with their own name and dates on it and arranges the things
a parent actually needs; the agency works the other side in a console and takes
a 10% share.

It is a prototype, not a product. No payments, no accounts, no provider app, no
server. Everything is seeded data held in the browser.

## Three surfaces

| Route | Who sees it | Job |
| --- | --- | --- |
| `/` | whoever you send the demo link to | the guest portal for the Brandt family's stay |
| `/s/:stayToken` | the guest, on their phone (390px) | browse and request services |
| `/agency` | the agency, on a laptop (1440px) | requests arriving, revenue share |

**The root is the demo link.** It opens the guest portal on a real stay with all
fourteen services, so the bare domain is what you send — no landing page, no QR,
nothing to explain first. The console is a discreet link in the guest footer.

Other stays: `/s/ca-del-porto-0108`, `/s/casa-oliva-0815`. Any token that does
not resolve shows the expired-link screen rather than a 404.

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
npm run build && (cd dist && zip -r ../release/otiara-netlify.zip .)
```

### Single-file build (for a hosted preview)

```bash
npm run build:artifact          # dist-artifact/artifact.html — one self-contained file
node build-artifact-page.mjs    # dist-artifact/otiara.html — same page, body fragment
```

Everything is inlined, including the fonts, and routes move to the hash
(`#/s/villa-serena-0811`) so the whole demo serves from a single URL. Sandboxed
hosts block browser storage, so the store falls back to memory there: state
survives moving between routes but not a reload.

## Running the demo

1. Send the link. It opens on Villa Serena with the Brandt family's name and
   dates already on it.
2. They tap **Fridge stocked before you arrive**, set the day and who is eating,
   and hit **Request this**. The card takes the requested state in place and the
   tray at the bottom counts up.
3. Turn the laptop round to `/agency`: the request is in the table with their
   cut beside it. **Confirm with Elena**, then **Mark scheduled** — the guest
   view catches up within a couple of seconds.
4. **Reset demo** (console footer) puts the seed back.

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
src/routes/          GuestPortal (and the expired screen), Agency
src/components/      ServiceCard, RequestSheet, Sheet, FieldInput, RequestsTray,
                     ProviderSlot, StatusDots, ResetDemo
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

Built to the design handoff in `design/` — `handoff.md` is the written spec,
`Handled.dc.html` is the design canvas (open it in a browser) — and then
rebranded to Otiara. The identity lives in one place: the `@theme` block of
`src/index.css` and the `@font-face` rules above it.

| Token | Hex | Use |
| --- | --- | --- |
| `--color-deep` | `#0F1C22` | brand bar, text, console share panel, timeline markers |
| `--color-mint` | `#5FE3BF` | the one call to action, selected chips, status dots, the share figure |
| `--color-water` | `#0E6E58` | links, eyebrows, monograms, outlined buttons, focus ring |
| `--color-stone` | `#EBE3D9` | page ground |
| `--color-paper` | `#FFFFFF` | cards, sheets, console surfaces |
| `--color-clay` | `#A9452F` | cancel and error affordances only |

Mint is a fill, never small text: the primary button is mint with dark text, the
way the site's own call to action is. Links and labels take the deeper teal so
they stay legible on cream.

Playfair Display carries the guest headline (with the family's name in italic,
the way otiara.it sets the second half of its headlines), the console figures
and the provider monograms; Inter carries everything else and the wordmark, never
below 14px on the guest surface. Both are self-hosted in `src/fonts/`.

**Read off screenshots, not the stylesheet** — otiara.it is blocked by the
network egress proxy from the build environment, so the hex values are sampled
by eye and the typefaces are the closest widely available match. If the real
brand uses different faces, they are a two-line change here.

No shadows anywhere except the focus ring: depth is paper on the cream ground. Motion is three specified moments (sheet 260ms, scrim
200ms, card settle 220ms) and nothing else, all disabled under
`prefers-reduced-motion`.

`screens/` holds the built screens at 2x.

### Where the build departs from the design, and why

- **Date and time inputs** are native pickers, so the stay's date limits are
  real constraints rather than a drawn value. They inherit the browser's date
  format instead of the design's `Sun 8 Aug`.
- **Mark scheduled** takes the slot the guest asked for rather than prompting
  for a time — one less invented screen in a demo.
- **Get guest link** copies and confirms inline, as designed.
- **No pitch screen and no QR code.** The demo is a link that is sent, not a
  screen that is scanned, so the root is the guest portal itself.
- **Prototype navigation** is a small demo line in the guest footer and a
  *Guest view* link in the console. The design has no nav chrome because each
  screen was drawn in isolation.
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
- **Names** — the agency, providers and guests are invented. In the demo Otiara
  is the platform and *Lago Verde Property Management* is the customer agency.

## Not built

Payments, accounts, provider app, availability calendars, real notifications,
multi-agency tenancy, admin CRUD, anything server-side. Of the earlier stretch
list, the PWA manifest is in; the EN/IT/DE language toggle is not.

# Limonaia — guest services portal (MVP demo)

A working demo for a property management agency on Lake Garda: a guest-services
layer attached to bookings the agency already has, with no work on their side,
producing revenue they don't currently collect.

It is a demo, not a product. No payments, no accounts, no provider app, no real
messaging, no server. Everything is seeded data with local persistence.

## Three surfaces

| Route | Who sees it | Job |
| --- | --- | --- |
| `/s/:stayToken` | the guest, on their phone | browse and request services |
| `/agency` | the agency, on a laptop | requests arriving, revenue share |
| `/` | you, in the meeting | pitch screen with a scannable QR |

Demo stays: `/s/villa-serena-0811`, `/s/casa-oliva-0815`, `/s/ca-del-porto-0209`.
Any other token shows the expired-link screen rather than a 404.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview
```

Deploy `dist/` anywhere static. SPA rewrites are already configured for Netlify
(`public/_redirects`) and Vercel (`vercel.json`); on other hosts, point every
path at `index.html` or `/s/:token` will 404 on a hard refresh.

## Running the pitch

1. Open `/` on the laptop and let the owner scan the QR. They land on Villa
   Serena with the Brandt family's name and dates already on it.
2. Let them tap **Fridge stocked before you arrive**, fill in a few fields, and
   hit **Request this**. The card changes state in place and the tray at the
   bottom counts up.
3. Turn the laptop round to `/agency`: the request is in the table with their
   cut beside it. **Confirm with Elena**, then **Mark scheduled** — the guest
   view catches up within a couple of seconds.
4. **Reset demo** (bottom of the pitch screen and the agency console) puts the
   seed back so you can run it again.

**Both windows have to be the same browser.** State lives in `localStorage`, so
the guest portal and the console sync across tabs and windows on one machine
(a `storage` event plus a 1.5s poll), but not across devices — that needs a
server, which the spec puts out of scope. For step 3, drive the guest portal in
a second window on the laptop, or in your phone's browser for the scan moment
and the laptop for the console moment. A real cross-device demo is about fifty
lines of backend (one shared JSON blob keyed by stay token) whenever it's worth
building.

## How it is put together

React 19 + Vite + Tailwind v4 + TypeScript, one repo, no backend.

```
src/lib/types.ts     Property, Stay, Provider, Service, Request
src/lib/seed.ts      the agency, 3 properties, 3 stays, 10 providers, 15 services
src/lib/pricing.ts   one estimator for every service; live sheet estimates
src/lib/store.ts     localStorage + cross-tab sync, exposed as a React store
src/routes/          GuestPortal, Agency, Pitch
src/components/      ServiceCard, RequestSheet, FieldInput, RequestsTray, QrCode
```

**Services are data, not code.** Each service carries a `fieldSchema`, and the
request sheet renders it: `date` (clamped to the stay), `time`, `stepper`,
`checkboxes`, `select`, `textarea`, `text`. Prices come off the same schema —
a base price, optional `multiplierFields` (hours, heads) with a `minMultiplier`,
per-option `priceDelta`, and per-unit stepper pricing — so a new service is a
new object in `seed.ts` and nothing else.

`phase` (`before_arrival` / `first_evening` / `during_stay` / `before_departure`)
drives the timeline grouping, and each band's caption is computed from the real
stay dates.

Stay dates are written as August days and the year rolls forward once the
season has passed (`seasonYear()` in `seed.ts`), so the demo never opens on a
stay that already happened.

## Design

Palette: `deep #0E2E2A`, `water #1E5F56`, `stone #EDF1EF`, `paper #FFFFFF`,
`citron #E3C23C` (single accent — status dots, the agency's share, verified
badges), `clay #B2543A` (errors and cancellations only). Fraunces on its soft
optical setting for the welcome headline and the console's big numbers, Inter
Tight at 17px minimum for everything else, tabular numerals on prices. Both
fonts are self-hosted in `public/fonts/` so the demo doesn't depend on the
meeting room's wifi. Two motion moments only — the sheet springs up, a
submitted card settles — and both respect `prefers-reduced-motion`.

## Before showing this to a real agency

- **Provider photos** are pulled from `randomuser.me` and fall back to an
  initial if they don't load. Drop real portraits into `public/providers/` and
  point `provider.photo` at them — the faces are the pitch.
- **Prices** (babysitting €18–20/hour, chef €65/head, Verona transfer €120,
  mid-stay clean €70) are plausible for Garda in August but check them against
  what the agency knows before the meeting; wrong numbers cost you the room.
- **Names** — the agency, providers, and guests are invented. So is the product
  name.
- The commission split (provider 80% · agency 10% · platform 10%) is stated in
  `seed.ts` and shown in the console footer.

## Not built

Payments, accounts, provider app, availability calendars, real notifications,
multi-agency tenancy, admin CRUD, anything server-side — all out of scope per
the spec. Of the stretch list, the PWA manifest and the WhatsApp handoff (in
the requests tray, once something is requested) are in; the EN/IT/DE language
toggle is not — it is the obvious next thing to build, and it means translating
every service title, provider blurb and price note, not just the chrome.

# TopRostr landing page

Pre-launch marketing site for TopRostr. It lives in `apps/landing` and does not import the recruiting API (`apps/api`) or the extraction app. There is no backend.

Product requirements: [`docs/landing/PRD.md`](../../docs/landing/PRD.md).

Header, Hero, Footer, and the shared `CTAButton` are in place (LP-02, #46). Founders, the product preview, and the final call to action are still later tickets. `App.jsx` renders the sections in this order, with `<main>` between the header and the footer:

| Component | File | Ticket |
| --- | --- | --- |
| Header | `src/components/Header.jsx` | #46 |
| Hero | `src/components/Hero.jsx` | #46 |
| Founders | `src/components/Founders.jsx` | #47 |
| Product preview | `src/components/Preview.jsx` | #48 |
| Final call to action | `src/components/JoinCta.jsx` | #49 |
| Footer | `src/components/Footer.jsx` | #46 |

Section ids: `hero`, `founders`, `preview`, and `join`. The header links Mission to `#founders` and Platform to `#preview`.

Every **Join the Rostr** control should use `src/components/CTAButton.jsx`. It reads the form URL from `src/config/site.js`. Pass `variant="gold-on-gray"` on the gray final band (LP-05). The join section still has the LP-01 anchor until that ticket lands.

## Run locally

Node.js 22 (`.nvmrc`). `package.json` requires `>=22.22.2` because jsdom does.

```bash
cd apps/landing
npm install
npm run dev
```

Vite prints a local URL, usually http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run lint` | ESLint |
| `npm test` | Vitest once, with an 80% line-coverage threshold |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |

The app is JavaScript (JSX). There is no TypeScript project and no type-check script.

## Google Form URL

Every **Join the Rostr** link reads one value from [`src/config/site.js`](src/config/site.js).

That module reads `import.meta.env.VITE_GOOGLE_FORM_URL`. When the real questionnaire exists, copy the example env file and set it:

```bash
cp .env.example .env
```

`.env.example` contains only:

```
VITE_GOOGLE_FORM_URL=
```

Until that variable is a non-empty URL, `site.js` falls back to a labeled placeholder on `example.com`. The button still opens in a new tab, and the page says the questionnaire is not connected. A public Google Form URL is not a secret. Do not put API keys in this variable.

Restart `npm run dev` after changing `.env`. Vite only exposes variables that start with `VITE_`.

## Brand assets

The logo kit is in `public/brand/` and is served from `/brand/...` (see `public/brand/README.md`). `index.html` points at:

- `/brand/favicon.ico`
- `/brand/favicon.svg`
- `/brand/png/app-icon-180.png` (apple touch icon)

The header uses `/brand/svg/lockup-horizontal-toprostr-dark-bg.svg` (off-white artwork for the charcoal page). The footer uses the compact `/brand/svg/mark-offwhite.svg`. The wordmark in those files is outlined artwork. Do not retype it in live text.

The hero still is a full-width `<picture>` behind the headline: AVIF, then WebP at 1x and 2x, then a JPG fallback. The files live in `public/images/hero/`. The `<img>` is decorative (`alt=""`), 1440×900, and uses `object-position: 75% 50%`. Do not use video.

## Design tokens

Colors and fonts are in [`tailwind.config.js`](tailwind.config.js):

| Token | Value | Role |
| --- | --- | --- |
| `charcoal` | `#1C1C1E` | Page background, button text |
| `off-white` | `#F2F2F2` | Text on charcoal |
| `brand-gray` | `#D9DADD` | Final CTA band. Tailwind's `gray-100`–`gray-900` scale stays available. |
| `gold` | `#E8B931` | Call-to-action button |
| `font-heading`, `font-wordmark`, `font-body` | Manrope | The landing PRD names Manrope and no separate body face |

Manrope is loaded from Google Fonts in `index.html`.

## Deploy on Vercel

Set the Vercel project **root directory** to `apps/landing`. `vercel.json` in this folder records the other build settings:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

The root directory is a Vercel project setting. `vercel.json` does not move the root for you.

Set `VITE_GOOGLE_FORM_URL` in the Vercel project for both Preview and Production. The site is a static Vite build and does not need a server runtime.

## Continuous integration

[`.github/workflows/landing-ci.yml`](../../.github/workflows/landing-ci.yml) runs on pull requests and pushes that change `apps/landing/**` or the workflow file. The job is named `landing-ci`. It runs `npm ci`, `npm run lint`, `npm test`, and `npm run build` in this directory. `npm test` fails if line coverage drops below 80%. The workflow pins Node 22.

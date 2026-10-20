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

`.env.example` contains the public form URL:

```
VITE_GOOGLE_FORM_URL=https://forms.gle/98Y3rQkUhqRDdYZk8
```

Until that variable is a non-empty `https:` URL, `site.js` falls back to one `example.com` URL whose path contains `PLACEHOLDER`. Any other value (`http:`, a blank string, or a non-URL) uses that same fallback. There is no second fallback.

`npm run build` prints `WARNING: VITE_GOOGLE_FORM_URL is not set; CTAs point at the placeholder` and exits 0 when the variable is unset or blank. That includes local builds, Vercel preview, and Vercel development (the `develop` branch that serves dev.toprostr.com). When `VERCEL_ENV` is `production`, the build fails unless the variable is an `https:` URL, so a blank or non-https value cannot ship the placeholder as the CTA. That production client bundle also omits the placeholder string. The client inlines `VITE_GOOGLE_FORM_URL` and a production flag derived from `VERCEL_ENV`. It does not inline other environment variables. Setting `VITE_GOOGLE_FORM_URL` in Vercel is the only change needed when the real form exists. The button still opens in a new tab. A public Google Form URL is not a secret. Do not put API keys in this variable.

Restart `npm run dev` after changing `.env`. Vite only exposes variables that start with `VITE_`.

## Brand assets

The logo kit is in `public/brand/` and is served from `/brand/...` (see `public/brand/README.md`). `index.html` points at:

- `/brand/favicon.ico`
- `/brand/favicon.svg`
- `/brand/png/app-icon-180.png` (apple touch icon)

The header and footer use the final `/brand/svg/mark-offwhite.svg` artwork on its own. The header image retains the accessible name TopRostr. The existing outlined lockup assets are retained as the original brand references.

The hero still is a full-width `<picture>` behind the headline: AVIF, then WebP at 1x and 2x, then a JPG fallback. The files live in `public/images/hero/`. The `<img>` is decorative (`alt=""`), 1440×900, and uses `object-position: 75% 50%`. Do not use video.

## Design tokens

Colors and fonts are in [`tailwind.config.js`](tailwind.config.js):

| Token | Value | Role |
| --- | --- | --- |
| `charcoal` | `#1C1C1E` | Page background, button text |
| `off-white` | `#F2F2F2` | Text on charcoal |
| `brand-gray` | `#D9DADD` | Final CTA band. Tailwind's `gray-100`–`gray-900` scale stays available. |
| `gold` | `#E8B931` | Call-to-action button |
| `font-heading`, `font-wordmark`, `font-body` | Inter | Text and headings match the Figma. The wordmark itself is the SVG lockup. |

Inter (weights 400, 500, 600, and 700) is loaded from Google Fonts in `index.html`.

## Deploy on Vercel

Set the Vercel project **root directory** to `apps/landing`. `vercel.json` in this folder records the other build settings:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

The root directory is a Vercel project setting. `vercel.json` does not move the root for you.

Set `VITE_GOOGLE_FORM_URL` in the Vercel project for both Preview and Production. The site is a static Vite build and does not need a server runtime.

`vercel.json` sends the security headers on every route: Content-Security-Policy, HSTS (`max-age=63072000; includeSubDomains`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive Permissions-Policy. Hashed files under `/assets/` are cached as `public, max-age=31536000, immutable`. The CSP allows this page's own assets, Google Fonts (Inter), self-hosted Space Grotesk, `data:` SVG icons in the preview, Vercel Speed Insights, and Web Analytics. The production analytics script is same-origin (`/_vercel/insights/script.js`) and its beacons go to `/_vercel/insights`, both covered by `'self'`. `va.vercel-scripts.com` is the local debug script only and is not allowed. Script sources do not include `unsafe-inline`.

`public/404.html` is copied to the build output. Vercel serves it with HTTP 404 for unknown URLs.

## Continuous integration

[`.github/workflows/landing-ci.yml`](../../.github/workflows/landing-ci.yml) runs on pull requests and pushes that change `apps/landing/**` or the workflow file. The job is named `landing-ci`. It runs `npm ci`, `npm run lint`, `npm test`, and `npm run build` in this directory. `npm test` fails if line coverage drops below 80%. The workflow pins Node 22.

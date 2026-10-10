# TopRostr — Pre-Launch Landing Page PRD

**Status:** Ready for implementation planning  
**Project type:** Pre-launch marketing and market-validation website; **not** the TopRostr product MVP  
**Owner:** TopRostr founders  
**Implementation agent:** Cursor

## Changelog

**Oct 10, 2026.** Header, hero, and founders now match the landing Figma (frame `3:2`). The preview heading on the page was updated in code. Section 4.3 of this document is unchanged; PR #61 owns that spec. Decisions applied on the page:

- The shared action is `JOIN THE ROSTR` with an aria-hidden `↗` immediately after the words. The accessible name stays `Join the Rostr — opens coach questionnaire in a new tab`.
- Founder names and roles stay title case in the source and render uppercase.
- The footer, the SVG wordmark, and the coaches-wanted eyebrow color `#74561A` stay.
- Text and headings use Inter.

## 1. Objective

Build a polished, responsive, single-page pre-launch website that introduces TopRostr, establishes founder credibility, previews the envisioned AI recruiting workspace, and converts visiting coaches into early-community participants through a Google Form.

**Primary conversion:** Click **JOIN THE ROSTR** and submit the external Google Form (email + market-research questions). The header and hero controls show an aria-hidden `↗` directly after that label. The website does not collect or store responses itself.

**Research audience:** Initial outreach to roughly 100–200 men's and women's college soccer programs; public marketing/CTA copy should be inclusive of coaches across sports. Avoid asserting that the platform already supports every sport.

**Success criteria:** Site deploys on Vercel; all CTAs open the correct Google Form; layout looks credible and polished on desktop and mobile; the product concept is clearly labeled as illustrative; the form collects the desired emails and responses.

## 2. Sources of truth

- **Landing-page Figma:** https://www.figma.com/design/Yma4lgI4KVuXk3A1ih9DLD?node-id=3-2
- **Original product UI concepts:** https://www.figma.com/design/5dVtSjbqhdzFlCb7MgywSB/RostrAI-1.0?node-id=0-1
- Original product references: Inbox `21:2`, Calendar `22:2`, Rostr `22:155`, Settings `22:398`.

Follow the latest landing-page composition and copy, not earlier abandoned variations. Reuse actual brand assets from Figma where available; do not substitute an unrelated logo. If exact assets are unavailable, use a clearly marked replaceable placeholder rather than inventing one.

## 3. Approved stack and boundaries

- React with JavaScript/JSX
- Tailwind CSS
- Vite for local development and production build
- Vercel for deployment
- Google Forms / Google Sheets for data collection
- No custom backend, authentication, database, API, CRM, or email service in this project
- Keep dependencies minimal. Prefer CSS/Tailwind animation; no animation library unless essential.

**Repository location:** `apps/landing/` within the existing TopRostr repository. Inspect current monorepo/package-manager conventions before scaffolding. Avoid modifying the existing recruiting product or API.

## 4. Page content and sequence

Four sections in this order, plus a compact navigation/header and footer:

### 4.1 Hero — “Every Advantage Matters”

**Eyebrow:** `TECHNOLOGY BUILT FOR THE SIDELINE.`  
**Headline:** `EVERY ADVANTAGE` / `MATTERS.`  
**Body:** `Meet TopRostr. An AI-powered recruiting workspace built by former college players to help coaches spend less time managing recruiting and more time building winning programs.`  
**CTA:** `JOIN THE ROSTR` with an aria-hidden `↗` on the shared control. Keep one primary action system throughout the page. The accessible name is `Join the Rostr — opens coach questionnaire in a new tab`.

Visual: cinematic, sports-inspired, dark charcoal; bold editorial headline; sparse gold accents; accessible text contrast. Favor a high-quality optimized still image over autoplay video for this release.

### 4.2 Founders — “We Know the Game. We Know What's Next.”

**Eyebrow:** `02 / THE PLAYERS BEHIND TOPROSTR`  
**Headline:** `WE KNOW THE GAME.` / `WE KNOW WHAT'S NEXT.`  
**Intro:** `We've lived the recruiting process and understand how today's athletes use technology. We're building TopRostr to take work off coaches' plates so they can focus on what matters: winning.`

**Alejandro Suarez — Co-Founder**  
`Played at NYCFC, Met Oval, and BW Gottschee before being recruited to play Division I soccer at Monmouth University in the CAA.`  
`Software Engineer at JPMorganChase.`

**Jason Wallack — Co-Founder**  
`Played Division I soccer at Monmouth University before continuing his collegiate career at Colby College in the NESCAC.`  
`Studied finance and economics at Monmouth and Colby.`

Names and roles stay title case in the markup (`Alejandro Suarez`, `Jason Wallack`, `Co-Founder`) and render uppercase. Portraits render at 250×332.

Visual: clean two-profile composition on desktop; stacked portraits and bios on mobile. Portrait assets may be placeholders until supplied. Keep the section uncluttered, with a single primary headline and intro; do not duplicate the mission paragraph elsewhere in this section.

### 4.3 Product — “One Program. One Connected Workspace.”

**Eyebrow:** `03 / THE TOPROSTR WORKSPACE` (renumber from the prior Figma draft as needed)  
**Headline:** `ONE PROGRAM. ONE CONNECTED WORKSPACE.`  
**Body:** `Your staff's recruiting context in one place, with AI working alongside you—not making decisions for you.`

Build a **full-width, animated, illustrative React recreation** of the original Cursor-inspired product workspace, not a flat full-page screenshot. UI should communicate:

1. **Organization context:** a sample program's workspace and staff environment.
2. **Connected navigation:** Inbox, Rostr, Calendar, and Activity or equivalent.
3. **Recruit work area:** sample athlete, film/notes/context, and coach decision controls.
4. **Persistent AI assistance:** context-aware suggestion in a right-side panel.
5. **Human control:** AI proposes/drafts; coach chooses. No autonomous sending, saving, talent scoring, or actual AI actions.

Use explicitly fictional example data; do not imply it is a functioning product. Include a visible but discreet `Illustrative product concept` label.

**Animation story (approximately 6–8 seconds):** workspace enters; recruit context highlights; AI suggestion reveals; coach-approval cue appears; rest briefly then loop. Favor opacity/transform only, not dramatic typewriter effects. Sequence begins when in viewport, pauses when offscreen, and respects `prefers-reduced-motion`. For users with reduced motion or unavailable animations, all essential information stays visible.

**Mobile:** purpose-built vertical composition (recruit information followed by contextual AI suggestion). Do **not** scale down the full desktop workspace to illegible size. Tablet may condense the sidebar.

### 4.4 Final CTA — “This Time, We're Recruiting You.”

**Eyebrow:** `04 / COACHES WANTED`  
**Headline:** `THIS TIME, WE'RE RECRUITING YOU.`  
**Main paragraph:** `Behind every great program are coaches who give everything to their teams. We're bringing those coaches together to help create technology that supports the work they do every day.`  
**Button:** `JOIN THE ROSTR`  
**Supporting line (shown exactly once, below CTA):** `Join our early community, share your perspective, and stay connected as we build TopRostr.`

Visual: soft gray section background (`#D9DADD`) and **gold CTA button (`#E8B931`)** with dark text. The eyebrow color is `#74561A`. Ensure the community line is not repeated inside the main paragraph.

**CTA behavior:** Open the configured external Google Form in a new tab with appropriate `target="_blank"` and `rel="noopener noreferrer"`. Be transparent that the link leads to a questionnaire; e.g. accessible label `Join the Rostr — opens coach questionnaire in a new tab`.

### 4.5 Header/footer

- Header: actual TopRostr wordmark, section anchor links (Mission / Platform), prominent Join the Rostr CTA, accessible mobile menu.
- Footer: compact brand mark, a short pre-launch/illustrative disclaimer as needed, and copyright. No invented testimonials, product availability claims, or social links.

## 5. Design system

Match Figma's visual identity:

- Charcoal: `#1C1C1E`
- Off-white: `#F2F2F2`
- Gray CTA section: `#D9DADD`
- Gold: `#E8B931`
- Restrained additional accents only if already present in Figma.

Text and headings use Inter (weights 400, 500, 600, and 700), loaded with `preconnect` and `display=swap`. The wordmark is the SVG lockup, not live type. Avoid generic corporate gradients and excessive decorative cards. Preserve deliberate negative space and large, confident typography.

**Proposed container/layout defaults:** `max-width: 1280px`; side padding ~20px mobile / 32px tablet / 64px desktop; desktop section padding ~112–144px vertical, mobile ~64–88px. Tune against actual Figma proportions. Use fluid typography (e.g. `clamp`) rather than fixed giant mobile sizes.

## 6. Functional requirements

**FR-01** All `JOIN THE ROSTR` CTAs use a single Google Form URL from configuration (e.g. `VITE_GOOGLE_FORM_URL` or `src/config/site.js`). Until a real URL is supplied, use a clearly labeled placeholder and do not pretend submission works.

**FR-02** Navigation links scroll to their correct page section; mobile navigation is keyboard-accessible and dismissible.

**FR-03** Product preview is visual only; no functional recruiting interactions or mock buttons that appear to persist real data.

**FR-04** Product animation supports in-view playback, offscreen pause, reduced motion, and static fallback.

**FR-05** Page uses semantic markup, accessible image alternatives, visible focus states, and legible color contrast.

**FR-06** All copy must match the approved language above; do not add hype such as “revolutionizing,” “changing the game,” or “next generation.”

**FR-07** Product/showcase imagery is appropriately optimized and responsive; avoid large uncompressed assets.

**FR-08** Link to external Google Form must be tested on mobile and desktop. Google Form itself owns email collection, consent language, and confirmation message; verify these separately with the founders.

## 7. Non-functional requirements

- Responsive at 320, 375, 768, 1024, and 1440px; no horizontal scroll, overlap, or illegible preview text.
- Aim for strong Lighthouse results (rough target 90+ performance when practical), and Core Web Vitals: LCP ≤2.5s, CLS ≤0.1, INP ≤200ms at p75 where measurable.
- Accessibility implementation target: WCAG 2.2 AA, including reduced-motion, keyboard navigation, and focus styling.
- Hero image optimized (WebP/AVIF if possible); explicit media dimensions to avoid layout shift.
- Search/share basics: descriptive title and meta description, favicon, Open Graph/Twitter image, canonical domain when known, readable semantic heading hierarchy.
- Avoid tracking personal data or adding analytics without a deliberate decision. No analytics service is required for initial release.
- Site must build in Vercel as a static Vite app; no server runtime required.

## 8. Implementation guidance

Suggested files (adjust to repository conventions):

```text
apps/landing/
  public/
    images/
    favicon.svg
  src/
    components/
      Navbar.jsx
      CTAButton.jsx
      Footer.jsx
      SectionContainer.jsx
    sections/
      HeroSection.jsx
      FoundersSection.jsx
      ProductSection.jsx
      JoinRostrSection.jsx
    product-preview/
      WorkspacePreview.jsx
      OrganizationHeader.jsx
      WorkspaceSidebar.jsx
      RecruitPanel.jsx
      AIAssistantPanel.jsx
    config/site.js
    styles/animations.css
    App.jsx
    main.jsx
    index.css
  index.html
  package.json
  vite.config.js
```

The product preview can use local mock fixtures. Keep structure readable; do not introduce Redux, routing, an icon library, or animation framework solely for trivial use cases. An icon library is optional if it reduces complexity.

## 9. Vercel deployment

- Existing Git repository; Vercel project root directory: `apps/landing` (unless repository configuration dictates otherwise).
- Framework preset: Vite.
- Build command: `npm run build` (adjust if monorepo uses a different package manager).
- Output directory: `dist`.
- Configure form URL in a centralized setting or Vercel environment variable; no secrets should be embedded in the public frontend. A public Google Form URL is **not** a secret.
- Ensure preview deployments and production deployment both render correctly; test direct page loading and outbound Google Form links.

## 10. Out of scope

- TopRostr actual product MVP, real organizations, auth or coach accounts.
- LLM/API integrations; real inbox, calendar, recruiting data, AI decisions, or messaging.
- Database, custom submission form/backend, bespoke CRM, or mailing-list synchronization.
- The removed Before/After slide.
- Claims of existing customers, testimonials, proven performance gains, or released product capability.

## 11. Acceptance checklist / Definition of done

- [ ] Four sections rendered in specified order with approved messaging.
- [ ] Close visual correspondence to linked Figma design, including logo/assets where available.
- [ ] Gold CTA on gray final section; community line appears exactly once.
- [ ] Animated full-width product preview reflects organization workspace + contextual AI + coach control.
- [ ] Mobile-specific product composition is legible; animation honors reduced-motion.
- [ ] Navigation, anchor scrolling, and mobile menu work by mouse, touch, and keyboard.
- [ ] All CTA links use the correct real Google Form URL and open safely in a new tab.
- [ ] Form verified to capture email and questionnaire responses in Google Sheets.
- [ ] Metadata, favicon, accessible focus, responsive images, and alt text implemented.
- [ ] No horizontal overflow at test widths; no significant layout shifts.
- [ ] `npm run build` passes; Vercel preview and production builds succeed.
- [ ] Product concept clearly identified as illustrative; no functional claims about unbuilt features.

## 12. Cursor execution instructions

1. Inspect the repository and existing `apps/` conventions before scaffolding. Do not modify unrelated apps.
2. Implement the four marketing sections and responsive shell first. Match Figma rather than improvising new page sections.
3. Implement the illustrative product UI with CSS-driven sequenced animation, reduced-motion support, and viewport pausing.
4. Wire CTA links to one configurable Google Form URL; leave a prominent TODO if the URL is missing.
5. Verify at the specified screen widths, build locally, and prepare Vercel config.
6. Summarize files changed, commands to run, any missing assets or configuration, and test results. Never claim the Google Form is connected unless a real URL is supplied and checked.

**Do not implement the TopRostr product itself. This task is solely the pre-launch marketing/validation landing page.**

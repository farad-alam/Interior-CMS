# AmarSoftware Interior Design Agency Platform Plan

## Revision Notes (v4 — Vercel + Cloudinary, by decision)

Two explicit calls made after reviewing the tradeoffs:

-   **Hosting stays Vercel, on Hobby, per client** — free, but its ToS
    restricts Hobby to non-commercial use and Vercel does enforce
    this; the suspension risk is knowingly accepted rather than
    switching to Cloudflare Pages. **Mitigation:** the moment a client
    starts monetizing/scaling (Business Packaging Premium tier), move
    that one project to a shared Vercel Pro account ($20/mo flat,
    covers unlimited projects, 1TB bandwidth pooled) — this removes
    both the ToS risk and any traffic ceiling for that client without
    forcing every client onto a paid plan up front.
-   **Media & video moves to Cloudinary** instead of Cloudflare R2 +
    YouTube/Vimeo. Free tier is 25 credits/month (1 credit = 1GB
    storage, 1GB bandwidth, or 1,000 transformations — pooled), which
    comfortably covers one client's portfolio gallery plus short video
    clips at 300–500 visits/month, and it's a single service for both
    image transforms and video instead of stitching two tools
    together. Long-form video (full walkthrough reels) should still
    default to a YouTube/Vimeo unlisted embed per client, so one
    video-heavy client doesn't burn the same credit pool the image
    gallery depends on.

## Revision Notes (v3 — budget-first)

Targeted clients have little to no budget for paid infra. The platform
must run on **$0/month free tiers** and comfortably handle 300–500
visits/month per client, with paid upgrades only once a client is
actually making money from the site. This changes several v2 choices:

-   **Dropped Vercel Hobby as the default host.** Its ToS restricts
    Hobby to non-commercial use and Vercel actively enforces this —
    every client site is commercial. Replaced with **Cloudflare Pages**,
    whose free tier explicitly allows commercial use with unlimited
    bandwidth (Phase 12).
-   **Dropped Cloudflare Stream/Mux for video** — both are paid with no
    real free tier, and Cloudflare Pages' own ToS disallows hosting
    video anyway. Replaced with free YouTube/Vimeo unlisted embeds
    (Phase 11), upgraded only once a client can pay for a branded
    player.
-   **Collapsed CMS hosting cost to $0** by using Payload 3's
    Next.js-native deployment (it installs directly into the same
    Next.js app, no separate CMS server to host) backed by a free Neon
    Postgres project per client (Phase 0.2, Phase 3).
-   Added an explicit **Budget & Free-Tier Strategy** section (Phase
    0.4) and tied the paid-upgrade path directly to the Business
    Packaging tiers, so "upgrade once you're making money" is a
    concrete, plannable step rather than a vague intention.

## Revision Notes (v2)

The original draft was a solid vision but left every hard decision open
("choose ONE CMS", "copy starter") without saying *how*. Those gaps are
where reusable-platform projects usually die — the library forks per
client and you're back to bespoke builds within a year. This revision:

-   Picks a **default CMS** instead of leaving it open (Phase 0)
-   Adds a **multi-tenancy model** — the plan never said how client data
    is isolated (Phase 0)
-   Adds a **repo/versioning strategy** so "copy starter" doesn't mean
    "fork forever and never get bug fixes" (Phase 0)
-   Adds a **Pilot Client phase** — build the platform's first version
    against one real paying client, not in a vacuum (Phase 0.5)
-   Adds a **concrete data contract** for "all variants accept the same
    data shape," which the draft asserted but never defined (Phase 2)
-   Adds **localization/RTL**, which was completely missing despite the
    target market being Saudi Arabia (new Phase)
-   Adds a **media/video pipeline**, critical for an image-heavy niche
    like interior design (new Phase)
-   Adds **hosting/deployment**, **testing/QA**, and **governance rules**
    for when a one-off component "graduates" into the shared library
-   Adds a light **business packaging** note tying phases back to the
    profitability goal stated in the Context section

------------------------------------------------------------------------

## Context

Our agency builds many websites for interior design companies,
especially in Saudi Arabia. Most clients request nearly the same
functionality:

-   Portfolio / Projects
-   Before & After images
-   Video showcase
-   Services
-   Testimonials
-   Team
-   FAQ
-   Contact
-   Dashboard to manage content

Today, each project is built individually with Next.js. Although clients
are happy, this creates repetitive work. Low-budget projects become less
profitable because 70--80% of the development effort is repeated.

**Goal:** Build a reusable platform instead of rebuilding every project.

------------------------------------------------------------------------

# Core Philosophy

This is **not** a website template.

It is an **Agency Starter Platform**.

The backend is reused for every client.

The frontend is assembled from reusable components and themes.

Only branding, content, and selected component variants change.

------------------------------------------------------------------------

# Overall Architecture

``` text
Client Content
      │
      ▼
CMS (Payload, per-client instance)
      │
 Typed REST / Local API + Zod contracts
      │
      ▼
Next.js Frontend (own repo per client)
      │
Shared Design System + Component Library + Theme (versioned npm packages)
      │
      ▼
Finished Website
```

------------------------------------------------------------------------

# Phase 0 -- Foundation Decisions (new)

These decisions gate everything else. Get them wrong and every later
phase inherits the cost.

## 0.1 CMS Choice

Stop treating this as open. Default to **Payload CMS**:

-   TypeScript-native — schemas, hooks, and access control are code,
    not plugin configuration. This is what lets Phase 2's data
    contracts stay a single source of truth shared with the frontend.
-   Built-in field-level **localization** (needed for EN/AR — see the
    new Localization phase). WordPress and Strapi require extra
    plugins to do this well.
-   Self-hosted on Postgres, no PHP stack to maintain alongside the
    Next.js stack, no plugin-compatibility drift over time.
-   Admin UI is generated from the schema, so "never rebuild the
    dashboard" (Agency Rules) is actually achievable — WordPress's
    wp-admin is *not* rebuildable/brandable per client without real
    effort, and Strapi's admin has had more plugin-ecosystem churn.

Only deviate to WordPress if a specific client contractually requires
their own staff to self-manage a CMS they already know — treat that as
a one-off custom SOW, not part of the reusable platform.

## 0.2 Multi-Tenancy Model

The draft says "the backend is reused" but never says *how tenants are
isolated*. Two real options:

-   **A — Isolated instance per client** (recommended to start): one
    Payload deployment per client, generated from a template. Simple
    security model (nothing to leak across tenants because there's no
    shared database), easy to reason about, easy to sell/scope/bill per
    client. With Payload 3 running inside the client's own Next.js app
    (Phase 0.4) and a free Neon Postgres project per client, this costs
    **$0/month** at the 300–500 visits/month target — no Railway/Render
    server bill at all.
-   **B — Single multi-tenant instance**: one Payload deployment, every
    collection carries a `tenant` relationship, access control enforces
    isolation. Cheaper to operate at 20+ clients, but a single access-
    control bug leaks across every client, and one outage takes down
    everyone. Requires real investment in tested access-control rules.

**Decision:** start with A. Revisit B only once instance-count and
hosting overhead genuinely erode margin — don't build multi-tenant
isolation logic before there's a scale problem to justify it.

## 0.3 Repo & Versioning Strategy

The original Phase 10 said "copy starter" — that means every client
site forks permanently and never receives a bug fix or improvement
again. Fix:

-   Monorepo (pnpm workspaces + Turborepo) holds the **shared** pieces:
    -   `packages/ui` — design system primitives
    -   `packages/components` — the numbered variant library
      (Hero01, Portfolio02, ...)
    -   `packages/cms-client` — typed API client + Zod schemas (the
      data contract from Phase 2)
    -   `packages/config` — shared eslint/tsconfig/tailwind config
    -   `apps/starter` — the canonical Next.js starter
    -   `apps/cms-template` — the Payload template project
-   Each **client project is its own repo/deployment**, scaffolded from
    `apps/starter`, but it *consumes* `packages/ui`,
    `packages/components`, and `packages/cms-client` as versioned
    private npm packages (GitHub Packages is fine at agency scale).
-   Result: a client site can run `pnpm update @amarsoftware/ui` to
    pull bug fixes/improvements later — reusability doesn't die at
    delivery. Use semver + Changesets so breaking changes are visible
    before a client project pulls them.
-   Keep a simple `clients.json` manifest (client name, repo, package
    versions in use) so a breaking change's blast radius is knowable at
    a glance.

## 0.4 Budget & Free-Tier Strategy (new)

Targeted clients cannot afford paid hosting/tools at launch. Default
stack must be **$0/month** and comfortably serve 300–500 visits/month;
paid upgrades happen only once a client's site is generating revenue
for them.

**Free-tier stack (per client, at launch):**

| Layer            | Free choice                              | Why it holds at 300–500 visits/month |
|-------------------|-------------------------------------------|----------------------------------------|
| Frontend hosting  | **Vercel Hobby**, per client                | Free, best-documented Payload deployment target. **Known tradeoff, knowingly accepted:** Hobby's ToS restricts it to non-commercial use and Vercel does enforce this — a client site is technically in violation. Mitigated by moving a client to a shared Vercel Pro account once they start earning from the site (see Upgrade path). |
| CMS               | **Payload 3**, installed directly in the same Next.js app (no separate server) | Runs as serverless functions on the same free deployment — nothing extra to host. |
| Database          | **Neon** free Postgres project per client | Auto-suspends when idle, auto-wakes on the next request — no manual restart, no cost at this traffic level. |
| Media (images + short video) | **Cloudinary**            | 25 free credits/month (1GB storage, 1GB bandwidth, or 1,000 transformations each, pooled) — one service for image transforms and short video instead of stitching storage + a separate video host together. |
| Long-form video    | **YouTube/Vimeo unlisted embeds**          | Free, no bandwidth cost, and keeps full walkthrough reels from burning the same Cloudinary credit pool the image gallery depends on. |
| Leads/email        | Leads stored in the Payload dashboard directly; optional **Resend** free tier (3,000 emails/mo) for notification emails | Covers inquiry volume far beyond 500 visits/month. |

**Upgrade path (only once the client is earning from the site):**

-   Vercel Hobby → move that client's project into a **shared Vercel
    Pro team account** ($20/mo flat, paid once by the agency, not per
    client — unlimited projects, 1TB bandwidth pooled). Removes the
    ToS risk and any traffic ceiling in one step; only needed for
    clients actually outgrowing Hobby, not applied by default.
-   Neon free project → Neon paid compute if the client's data/traffic
    outgrows the free compute allowance.
-   Cloudinary free credits → Cloudinary paid plan once a client's
    gallery/video volume genuinely exceeds 25 credits/month.
-   This upgrade path is exactly what Business Packaging's tiers are
    for — it's a sales conversation ("your site is getting real
    traffic, let's remove the free-tier limits"), not a surprise cost.

------------------------------------------------------------------------

# Phase 0.5 -- Pilot Client (new)

Do not design this platform in a vacuum. Before generalizing anything:

1.  Take one real (ideally already-signed) interior design client.
2.  Build their site as if it were fully bespoke, but with Phase 0's
    repo structure from day one (shared packages, not copy-paste).
3.  After delivery, extract what was genuinely reusable into
    `packages/*` and leave what was truly client-specific local.
4.  Only then start Phase 1's research/generalization with real
    evidence instead of guesses about what "most clients need."

This de-risks the whole platform bet with one paying project instead of
weeks of unpaid architecture work.

------------------------------------------------------------------------

# Phase 1 -- Research

Define common requirements.

Public Pages

-   Home
-   About
-   Services
-   Projects
-   Project Details
-   Gallery
-   Before & After
-   Videos
-   Team
-   Testimonials
-   Process
-   FAQ
-   Blog
-   Contact

Dashboard Modules

-   Site Settings
-   Homepage
-   Services
-   Projects
-   Categories
-   Testimonials
-   Team
-   FAQ
-   Blog
-   Media Library
-   Leads / Inquiries (new — see Contact & Lead Capture below)
-   SEO
-   Users

------------------------------------------------------------------------

# Phase 2 -- Content Modeling

Think in content, not pages.

Collections:

-   Services
-   Projects
-   Testimonials
-   Team
-   FAQ
-   Blog
-   Categories
-   Media
-   Leads (new)
-   Site Settings

Example Project fields:

-   Title
-   Slug
-   Category
-   Description
-   Location
-   Year
-   Client
-   Cover Image
-   Gallery
-   Before Image
-   After Image
-   Video
-   Featured
-   Published
-   SEO

## Data Contract (new)

"All variants accept the same data shape" needs to be an enforced
contract, not an assumption. Define it once in `packages/cms-client`,
generate types from it, and every component variant implements it:

``` ts
// packages/cms-client/schemas/project.ts
import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  location: z.string().optional(),
  year: z.number().optional(),
  client: z.string().optional(),
  coverImage: z.object({ url: z.string(), alt: z.string() }),
  gallery: z.array(z.object({ url: z.string(), alt: z.string() })),
  beforeImage: z.object({ url: z.string(), alt: z.string() }).optional(),
  afterImage: z.object({ url: z.string(), alt: z.string() }).optional(),
  video: z.string().url().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  seo: z.object({ title: z.string(), description: z.string() }).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
```

Every `Portfolio0X` component takes `{ project: Project }`. This is
what actually makes variants swappable in Phase 10 step 4 — not just a
stated intention.

------------------------------------------------------------------------

# Phase 3 -- CMS Setup

Payload CMS (see Phase 0.1), installed directly into each client's
Next.js app from `apps/cms-template` (Phase 0.2/0.4's instance-per-
client model) — there is no separate CMS server to provision or pay
for; it deploys as part of the same free Vercel Hobby project,
backed by a free Neon Postgres project.

The dashboard should never be rebuilt — only branded (logo, colors,
allowed collections) and instantiated.

------------------------------------------------------------------------

# Phase 4 -- API Layer

Every content type exposes typed access through `packages/cms-client`,
backed by Payload's REST or Local API.

Examples:

-   `/services`
-   `/projects`
-   `/projects/:slug`
-   `/team`
-   `/faq`
-   `/blog`
-   `/settings`
-   `/leads` (write-only from the public site's contact form)

Frontend never talks directly to the database. All responses are
validated against the Phase 2 Zod schemas before reaching a component.

------------------------------------------------------------------------

# Phase 5 -- Next.js Starter

Create a reusable starter project.

Suggested folders

-   app
-   components
-   features
-   hooks
-   lib
-   services
-   styles
-   types
-   utils

The starter is the "production-ready" bar from the Additional Notes
section — it should ship with localization routing, image pipeline,
and a smoke-test suite already wired (see the phases below), not just
folder structure.

------------------------------------------------------------------------

# Phase 6 -- Design System

Build reusable UI primitives.

-   Button
-   Card
-   Container
-   Grid
-   Section Title
-   Accordion
-   Carousel
-   Badge
-   Modal
-   Form Elements

Every section uses these primitives. Use CSS logical properties
(`margin-inline-start`, not `margin-left`) from the start — retrofitting
RTL support later means touching every primitive twice.

------------------------------------------------------------------------

# Phase 7 -- Component Library

Examples

Hero - Hero01 - Hero02 - Hero03

Services - Services01 - Services02 - Services03

Portfolio - Portfolio01 - Portfolio02 - Portfolio03

Testimonials - Testimonials01 - Testimonials02 - Testimonials03

CTA - CTA01 - CTA02

Footer - Footer01 - Footer02

All variants accept the same data shape (Phase 2's contract).

## Storybook & Governance (new)

-   Every variant gets a **Storybook** story with real sample data.
    This is what makes Phase 10 step 4 ("choose section variants")
    actually workable — a non-technical salesperson or the client
    themselves can browse and pick visually instead of you describing
    components verbally.
-   **Graduation rule** for when a client-specific component becomes
    part of `packages/components`: it graduates only when (a) a second
    client requests something equivalent, or (b) the agency
    deliberately judges it broadly reusable and budgets time to
    generalize it (strip client-specific logic, conform to the shared
    contract, add a Storybook story). Until then it stays local to that
    client's repo. This is what actually enforces the Additional
    Notes' warning against building 50 variants before there are
    clients to justify them.
-   Add **Chromatic or Percy** visual regression on `packages/components`
    once the library has a few real consumers, so an "improvement" to
    Hero02 can't silently break a client site that already shipped on
    it.

------------------------------------------------------------------------

# Phase 8 -- Theme System

Create reusable themes.

Examples

-   Luxury
-   Modern
-   Minimal
-   Corporate
-   Dark
-   Arabic Luxury

Theme controls:

-   Colors
-   Typography
-   Border Radius
-   Shadows
-   Spacing
-   Buttons
-   Cards

For "Arabic Luxury" specifically: validate with a font that actually
supports Arabic glyphs well (not just a Latin font with a fallback) and
check line-height/leading — Arabic script needs more vertical breathing
room than most Latin-first type scales assume.

------------------------------------------------------------------------

# Phase 9 -- Homepage Composition

Homepage is built from sections.

Hero → Services → Projects → Before & After → Testimonials → FAQ → CTA →
Footer

Sections are interchangeable.

------------------------------------------------------------------------

# Phase 10 -- Localization & RTL (new)

Missing entirely from the draft despite the target market being Saudi
Arabia. Required, not optional:

-   Locale routing via `next-intl` (or equivalent) — `/en`, `/ar`.
-   Payload's field-level localization for all client-editable text
    (this is a concrete reason Phase 0.1 picked Payload).
-   Every component in `packages/components` must be verified in RTL,
    not just auto-flipped — carousels, icon directionality (e.g. arrow
    icons), and before/after sliders need explicit RTL handling, not
    just `dir="rtl"` and hope.
-   Contact forms and CTAs should support **click-to-WhatsApp**
    alongside email — dominant inquiry channel in the Saudi/MENA market.
    Leads collection (Phase 2) should log both channels.

------------------------------------------------------------------------

# Phase 11 -- Media & Video Pipeline (new)

Interior design sites are image- and video-heavy; the draft didn't
address delivery at all.

-   Images: **Cloudinary**, using `next-cloudinary` for responsive
    delivery/transformations instead of raw storage + a manual
    `next/image` loader. Free tier (25 credits/month, pooled across
    storage/bandwidth/transformations) comfortably covers one client's
    portfolio gallery at 300–500 visits/month.
-   Short video clips: also Cloudinary, drawing from the same credit
    pool — fine for a handful of short showcase clips, but watch the
    pool if a client leans heavily on video.
-   Long-form video (full walkthrough reels): embed **YouTube or Vimeo
    unlisted videos** via a thin player component instead of routing
    them through Cloudinary — genuinely free, no bandwidth cost, and
    keeps a video-heavy client from burning the credit pool the image
    gallery depends on. Move to a paid **Cloudinary plan** (or
    Cloudflare Stream/Mux) only once a client's media volume justifies
    it (Business Packaging Growth/Premium tier).
-   Before/After: build this as one shared primitive
    (`packages/components`) with a real slider interaction, not a
    per-client reimplementation — it's one of the most-requested
    sections in the Context section.

------------------------------------------------------------------------

# Phase 12 -- Hosting & Deployment (new)

-   **Frontend + CMS (same deployment):** **Vercel Hobby**, free tier,
    per client project — the best-documented Payload deployment
    target. Payload 3 (Phase 0.1/0.4) runs inside the same Next.js app,
    so this one deployment *is* both the site and the CMS. **Accepted
    tradeoff:** Hobby's ToS restricts it to non-commercial use and
    Vercel does enforce this; the risk is knowingly taken to keep every
    client site at $0 rather than paying $20/mo per client up front.
-   **Database:** one free **Neon** Postgres project per client
    (Phase 0.2/0.4) — auto-suspends when idle, auto-wakes on request,
    no manual restarts needed.
-   **Domains:** client owns their domain; agency manages DNS via
    Cloudflare (DNS only, unrelated to hosting) for consistent SSL/CDN
    handling across all clients from one dashboard.
-   **Env checklist:** a documented per-client checklist (Neon
    connection string, Cloudinary keys, WhatsApp number) so onboarding
    a new client isn't tribal knowledge.
-   **ToS-risk mitigation:** the moment a client's site starts earning
    them money (Business Packaging Premium tier), move that project
    into a **shared Vercel Pro team account** ($20/mo flat, paid once
    by the agency — not per client, unlimited projects, 1TB bandwidth
    pooled). This is the point where the ToS risk actually gets
    resolved, and it only needs to happen for clients who've reached
    that tier, not all of them.
-   **When to upgrade:** revisit paid tiers only when a client's site
    actually approaches free-tier limits (traffic, build minutes, DB
    compute) — treat that as a sign the client is succeeding and a
    natural moment to sell the next Business Packaging tier, not as a
    default cost baked in from day one.

------------------------------------------------------------------------

# Phase 13 -- Internal Workflow

For every new client:

1.  Scaffold a new repo from `apps/starter`
2.  Spin up a Payload instance from `apps/cms-template`
3.  Choose theme
4.  Choose section variants (via Storybook)
5.  Add logo, configure colors
6.  Configure EN/AR content and WhatsApp number
7.  Import content
8.  Run the starter's smoke tests
9.  Deploy (Phase 12)

## New Client Onboarding Walkthrough (new — beginner-dev level)

The steps above assume familiarity with the platform. Spelled out at
the level a junior dev can actually follow, using a hypothetical new
client "Al-Faisal Interiors":

**Stage 1 — Spin up the client's own accounts (~10 min)**

Do this per client, not shared, so each client's free quota (Phase 0.4)
stays isolated from every other client's:

1.  Create a new **Neon** project → copy the Postgres connection string.
2.  Create a new **Cloudinary** account → copy the API key/secret.
3.  Note the client's WhatsApp business number and domain name.

**Stage 2 — Scaffold the project (~15 min)**

4.  Copy/clone `apps/starter` into a new repo (e.g. `al-faisal-
    interiors`) — Payload 3, the design system, and the component
    library are already wired in as dependencies. No blank-slate coding.
5.  `pnpm install`.
6.  Paste the Neon + Cloudinary values into `.env.local`.
7.  `pnpm dev` → open `localhost:3000/admin` — Payload's admin UI is
    generated automatically from the shared schema in
    `packages/cms-client`; there's nothing to build here.

**Stage 3 — Brand and configure (~30–60 min, config only, no new code)**

8.  Pick a theme from Phase 8's list (e.g. "Luxury") — a single config
    value.
9.  Open Storybook, browse the component library, and pick section
    variants (Hero02, Portfolio01, Testimonials03...) — set them in the
    homepage composition config (Phase 9).
10. Drop in the client's logo, set brand colors/typography tokens.
11. If the client needs Arabic, enable the `ar` locale — most fields
    are already localizable via Payload's built-in localization
    (Phase 10).

**Stage 4 — Enter content (agency/client task, not really a dev task)**

12. Log into `/admin` and fill in Services, Projects (cover image,
    gallery, before/after, video link), Team, Testimonials, FAQ — all
    through form fields, no code.
13. Images/short clips upload straight into Cloudinary through the
    admin UI. Long walkthrough videos get pasted in as a YouTube/Vimeo
    unlisted link instead (Phase 11).

**Stage 5 — Test locally**

14. Click through every page, submit the contact form, confirm the
    WhatsApp CTA works, check the site in Arabic/RTL.
15. Run the bundled Playwright smoke tests (`pnpm test`) — nav, form
    submit, locale switch. This is the actual bar for "done," not just
    "looks fine."

**Stage 6 — Deploy**

16. Push the repo to GitHub.
17. Import it as a new project in **Vercel** (Hobby tier) — paste the
    same env vars into Vercel's dashboard.
18. Vercel auto-deploys on push. Point the client's domain at it, with
    DNS managed through Cloudflare.

**Stage 7 — Handoff & bookkeeping**

19. Hand the client (or agency staff) their `/admin` login.
20. Add one line to `clients.json`: client name, repo, package versions
    in use — this is what tells you later who's affected if
    `packages/ui` gets a breaking change.
21. Watch the Neon/Cloudinary/Vercel dashboards over time — approaching
    a free-tier limit is the trigger to sell the Growth/Premium upgrade
    (Phase 0.4/12), not a surprise outage.

**The key thing to internalize:** for a standard client, `packages/ui`
and `packages/components` are never touched — only picked, configured,
and filled with content. New component code only gets written when a
client needs something the library doesn't have, and even then it stays
local to that client's repo until a second client wants it too (Phase
7's graduation rule).

------------------------------------------------------------------------

# Testing & QA (new)

-   **Storybook** for every component variant (Phase 7).
-   **Chromatic/Percy** visual regression on shared packages once
    multiple clients depend on them.
-   **Playwright** smoke tests in `apps/starter` covering nav, contact
    form submission, and locale switching — this is the actual bar for
    "production-ready starter," not just folder structure.

------------------------------------------------------------------------

# Security & Compliance (new)

-   Saudi **PDPL** (Personal Data Protection Law) applies once a
    client's dashboard collects lead/customer PII — confirm data
    residency requirements before assuming any host/region is fine.
-   Automated per-tenant database backups with a documented restore
    process (matters more under the instance-per-client model, since
    there's no shared ops tooling unless you build it).
-   Rate-limit and monitor dashboard logins — many tenants means many
    client-staff logins, i.e. a larger attack surface than one product.

------------------------------------------------------------------------

# Long-term Library Goal

Instead of one design, gradually grow the library — governed by the
graduation rule in Phase 7, not built speculatively.

Target

-   Hero × 10
-   Services × 10
-   Portfolio × 12
-   Testimonials × 8
-   FAQ × 6
-   CTA × 8
-   Footer × 6
-   Navbar × 6

Every new client project should contribute a reusable component *only
when it earns graduation*.

------------------------------------------------------------------------

# Backend Responsibilities

The CMS stores data only.

Examples

Services

-   Title
-   Description
-   Icon
-   Image

Testimonials

-   Name
-   Company
-   Photo
-   Review
-   Rating

Projects

-   Images
-   Gallery
-   Before/After
-   Video
-   Details

The CMS does NOT know how content looks.

------------------------------------------------------------------------

# Frontend Responsibilities

Frontend decides presentation.

The same Services data can be rendered by:

-   Card layout
-   Zig-zag layout
-   Timeline
-   Carousel
-   Masonry

No backend changes required.

------------------------------------------------------------------------

# Agency Rules

-   Never rebuild the dashboard.
-   Never duplicate business logic.
-   Build reusable components.
-   Every new feature should be reusable.
-   A component only joins the shared library when it earns graduation
    (Phase 7) — not on first use.
-   Separate content from presentation.
-   A client site pulling a package update should never be a
    surprise — semver + changelog, always.

------------------------------------------------------------------------

# Business Packaging (new)

Tie the phases back to the profitability goal in the Context section by
mapping them to sellable tiers instead of leaving "reusability" purely
technical:

-   **Starter tier** — one theme, default component variants, EN or AR
    only, fully on the Phase 0.4 free-tier stack (Vercel Hobby + Neon +
    Cloudinary + YouTube/Vimeo embeds). Fastest to deliver, thinnest
    margin, **$0 infra cost**, and matches exactly what a client with
    no budget can commit to at launch.
-   **Growth tier** — variant picks across the library, custom theme
    tuning (colors/typography), EN+AR, still free-tier infra unless the
    client is already outgrowing it.
-   **Premium tier** — includes one bespoke component built for that
    client (graduates via Phase 7) **and** the paid-infra upgrade path
    from Phase 0.4/12 (branded video player, higher-traffic hosting
    tier) — sold once the client's site is generating enough business
    to justify it, not before.

------------------------------------------------------------------------

# Additional Notes

Do **not** try to build 50 component variations before you have clients.

Instead:

1.  Build the platform's first real version against one paying client
    (Phase 0.5), not in the abstract.
2.  Use it on several more real projects.
3.  Whenever a client requests a different design, build it locally to
    that client first.
4.  Only graduate it into `packages/components` when it meets the
    Phase 7 graduation rule.
5.  Repeat, and let package versioning (Phase 0.3) carry improvements
    back to older client sites instead of leaving them frozen at
    delivery.

This allows the platform to evolve based on real customer demand instead
of guesses.

The ultimate objective is not to build websites faster---it is to
transform AmarSoftware's knowledge into reusable assets. Over time,
development shifts from writing code repeatedly to assembling proven
building blocks, reducing delivery time, improving consistency, and
increasing profitability.

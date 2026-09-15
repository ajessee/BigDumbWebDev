# BigDumbWebDev roadmap

Three sequential phases, per the plan for this site: finish the Rails upgrade, then adopt what Rails 8+ gives you for free and cut complexity, then redesign the look and feel. This document is the umbrella — it doesn't duplicate [UPGRADE-PLAN.md](../archive/UPGRADE-PLAN.md)'s detail, it sequences it against the two phases that come after it.

## Phase 1 — Rails 6.1 → 8.1 upgrade

**Complete, deployed to production 2026-09-15.** Full detail, the original source-level audit, and every step taken now live in the archived [UPGRADE-PLAN.md](../archive/UPGRADE-PLAN.md) and [UPGRADE-LEARNINGS.md](../archive/UPGRADE-LEARNINGS.md) (lessons from RDJesseeBlog's identical, completed upgrade); the production rollout itself (a real migration bug found and fixed against live production, a forced `heroku-20`→`heroku-24` stack jump, full verification) is recorded in [../archive/HEROKU-DEPLOYMENT.md](../archive/HEROKU-DEPLOYMENT.md). Webpacker was replaced with Shakapacker exactly as scoped here — functional parity only, no idiomatic rewrite folded in — so Phase 2 below still has its full scope intact, just starting from Shakapacker rather than Webpacker as the thing to eventually replace with import maps.

## Phase 2 — Adopt Rails 8+ capabilities and reduce complexity

This app is currently more complicated than it needs to be for what it does: a Node/Yarn/Shakapacker (webpack) toolchain just to serve hand-rolled vanilla JS with no framework, plus a 1.1 MB vendored icon file and a 2019-era CDN script for syntax highlighting. (Phase 1 already fixed the worst of the toolchain rot — Node is current LTS, not the old EOL 12.x pin, and Shakapacker's npm package comes from the registry, not a git-sourced dependency — but a real build step for zero-build-step JS is still more than this app needs.) Rails 8 ships defaults that remove most of this remaining need entirely:

- **Drop Node/Yarn/Shakapacker for import maps** (`importmap-rails`, Rails' default since 7.0). This app's JS has no build step requirements today — no TypeScript, no JSX, nothing that needs bundling — so pinning ES modules via import maps and serving them through Propshaft/Sprockets removes the entire Node toolchain rather than just keeping it modernized. The one real obstacle: `app/javascript/application/index.js`'s `require.context` call (a webpack-only API this app's whole load-order pattern depends on) has no import-map equivalent — see the `window.utils`/`window.projects` note below.
- **Adopt Turbo + Stimulus** (`turbo-rails`/`stimulus-rails`, bundled with Rails by default) to replace the hand-rolled patterns found in the audit: the custom modal system, the notification system, the menu system, and the blog autosave (`postAutoSaver.js`) are all things Stimulus controllers do more predictably, and Turbo Streams could replace full-page reloads for comment posting. This is a real rewrite, not a drop-in — budget it as such, and do it deliberately rather than as a side effect of the Webpacker→Shakapacker swap in Phase 1 (which stayed strictly functional-parity-only, as planned).
- **Rewrite the 3D-portfolio scroll effect (`projects-3d-scroll.js`) and the landing-page animation (`fadeIn.js`) as Stimulus controllers**, replacing their current implicit dependency on global `window.utils`/`window.projects` objects set by `main.js`. Do this alongside Phase 3's redesign of those same sections rather than twice. Also resolves the `require.context` obstacle to dropping Shakapacker noted above, since Stimulus controllers register explicitly rather than relying on webpack's directory-globbing import.
- **Consider Propshaft over Sprockets** (Rails 8's default asset pipeline) once Sass is gone — see below.
- **Reconsider the Sass dependency further.** Phase 1 already modernized the compiler (`sass-rails`/`sassc` → `dartsass-rails`, a real Dart Sass binary instead of the deprecated LibSass native extension) as a required, in-scope replacement — Sass itself is still in use, just on current tooling. Going further and dropping Sass entirely is still a live Phase 2 option: modern CSS (nesting, custom properties, `color-mix()`, container queries) covers most of what Sass was doing here — worth trying plain CSS first and only keeping `dartsass-rails` if a real feature (not just habit) needs it.
- **Replace the vendored 1.1 MB `fontawesome-all.min.js`** with either inline SVGs for the small icon set actually used (github/twitter/linkedin/resume/menu icons) or an import-map-pinned Font Awesome package — either removes ~1 MB from every page load.
- **Replace the CDN-loaded Prism 1.17.1** (from `cdnjs.cloudflare.com`, pinned since 2019) with a current version, ideally pinned via import map instead of a raw `<script>` tag, so it's covered by the same dependency-update process as everything else instead of being invisible to it.
- **Consider Solid Cache** (Rails 8 default, Postgres-backed) if the redesign or Turbo adoption creates a reason to cache fragments/pages — no Redis add-on needed on Heroku's Essential-0 plan.
- **Optional, low priority: Rails 8's built-in authentication generator.** The current custom `has_secure_password` system works and has real tests for the flows that matter (signup/login/reset). Don't replace working auth for its own sake — only consider this if the redesign specifically wants password-manager/passkey support the current system doesn't have.
- **Consolidate the duplicated `Post#counts`/`Tag#counts` raw-SQL methods** into one shared concern while touching this code anyway.

None of this is optional busywork — it's the direct payoff of the Rails upgrade (a modern Rails app needs less infrastructure to do the same job than a Rails 6 app did), so it belongs right after Phase 1, before spending redesign effort on components that are about to be rewritten anyway.

## Phase 3 — Redesign the UI and modernize the look and feel

Grounded in an actual walkthrough of the live site today (desktop, tablet, and mobile viewports), not just a code read:

- **The landing-page animation and headline overlap at tablet widths (~768–900px).** At true desktop width the "Big Dumb Web Dev" title fits on one line and clears the illustration; at tablet width it wraps to two lines and the second line ("Web Dev") renders directly behind the animated illustration. The site's README claims "mobile-first design," but this gap suggests the responsive range between phone and desktop wasn't tested.
- **The homepage's 3D-portfolio "Projects" section is mostly empty space.** Three small project cards float clustered together inside a very tall, fixed-scroll region — on both desktop and (more severely) mobile, this reads as sparse/unfinished rather than as a "3D depth" effect. Worth deciding whether this feature earns its complexity in the redesign or whether a simpler, denser project grid (like `/projects` already has) serves the homepage better.
- **The blog index is a bare bordered list** — no thumbnails, no dates shown in the list view (only on the post detail page), no excerpts. Given posts support rich text with images, the list view isn't using any of that.
- **Low-contrast tag text on post detail pages** — light gray tags on a light-blue background are hard to read; worth an actual contrast check during the redesign, not just a color-palette refresh.
- **The `<title>` tag template has a stray `" | "` when a value is blank** (`All Blogs | | BDWD` was the actual tab title observed) — small, but worth auditing every view's title/meta template while redesigning rather than assuming they're all correct.
- **Social links still point at the retired Twitter bird/`twitter.com`**, not X — a small but easy brand-currency fix.
- **The overall visual language — bordered white cards on a flat light-blue field, default sans-serif, minimal spacing rhythm — reads as an unstyled framework default rather than a personal brand**, which matches wanting a "more modern" look.

**Process suggestion:** since this is fully hand-rolled (no Bootstrap/theme to reskin), decide on a small design system before touching component code — a type scale, a spacing scale, one deliberate accent-color decision, and a short component inventory (nav, cards, tags, buttons, forms) — rather than restyling page by page and ending up with the same inconsistency in a new palette. Because Phase 2 already touches the JS/markup for the 3D-portfolio effect, the landing animation, and Turbo/Stimulus conversion, build the new visual design for those specific components in the same pass as their Phase 2 rewrite instead of styling them twice.

## Portfolio content: which projects to feature, and how to present a resume

### Project audit (checked live 2026-09-12)

| Project | Link | Status |
| --- | --- | --- |
| RDJesseeBlog | `ralphdonaldjessee.com` | Live, working (recently upgraded to Rails 8.1 — see the sibling repo) |
| NYCycle | `nycycle-1.herokuapp.com` | Live, loads and the address-lookup form renders correctly. Its own Heroku app, its own `heroku-postgresql:essential-0` add-on (~$5/mo) |
| head-up | `head-up.herokuapp.com` | Live, loads correctly. A friend's consulting-business site, not a personal demo — its own Heroku app, its own ~$5/mo Postgres add-on |
| NYC Reservoir Levels (CLI) | GitHub repo | Public, exists — code-only, no hosting needed |
| TOEFL audio essay feature | GitHub repo | Public, exists — Kaplan work sample, code-only |
| Kaplan Ruby scripts | GitHub repo | Public, exists — work sample, code-only |
| Yoda Number Guesser / Loan Calculator / Todo List | Inline demo pages on this site | Live by definition (served by BigDumbWebDev itself) |

**One Heroku app exists that isn't featured on the site at all:** `sql-tutor-upgrade` — stack `heroku-20`'s predecessor `heroku-18` (deprecated), web dyno **crashed since 2022-12-14**, database detached 2022-12-08. It's not linked from `/projects` or anywhere else; it's just sitting there, broken, forgotten, and quite possibly part of the ~$15/month of Heroku account charges that RDJesseeBlog's cost audit could never attribute to a specific app. Decide: resurrect it as a small project of its own, or delete the Heroku app outright. There's no reason to keep a crashed, unlinked app around either way.

### Hosting decision: NYCycle and head-up

Together these two cost roughly $10/month in database add-ons alone (plus their share of the account's Eco dyno pool), just to keep two old demo/portfolio apps reachable — likely the bulk of that same unattributed cost RDJesseeBlog's audit flagged. Options per app, not necessarily the same choice for both:

- Keep on Heroku as-is — simplest, but they're on old Rails/Ruby versions too and will eventually need their own version of this same upgrade work.
- Retire the live demo, keep only a GitHub link + screenshots — matches how the CLI/Kaplan projects are already presented, and costs nothing.
- For NYCycle specifically: consider whether a live demo is even the right format for a "find your closest bin" app, or whether a short recorded demo/screenshot plus the GitHub link communicates it just as well for a portfolio audience.

**head-up hosts a real friend's business, not just a personal demo** — that's a decision to make with them, not unilaterally, regardless of what you decide for NYCycle.

### What else to feature — this needs your input, not mine

I can't decide this one for you since it's about what work you want to represent, but here's a prompt: the RDJesseeBlog and BigDumbWebDev upgrades from this very session are genuinely portfolio-worthy on their own — "took a five-year-old Rails 6 app to Rails 8.1, found and fixed a live authorization vulnerability along the way, wrote up the whole process" is a real case study, not just a changelog. Beyond that, any professional/consulting work you're able to share publicly (mind any client confidentiality) is worth considering. Tell me what you'd like added and I'll help build it out.

### Resume: update the PDF, or build an interactive one

**Option A — update the PDF and re-upload to S3.** Fast, matches the current architecture exactly (`User#resume` is already wired into the nav and about page), and needs nothing from me except updated content — send me the new file/text whenever it's ready and I'll handle the upload.

**Option B — build a fun, interactive, web-based resume.** Given Phase 2 already brings Turbo/Stimulus into this app, an interactive resume is a natural showcase piece for a site whose whole premise is "come see what I can build," rather than a static document that looks like everyone else's. To make it actually communicate skill rather than just be a gimmick:

- Back skill claims with direct evidence — link each claimed skill to the specific project/write-up that demonstrates it (e.g. "Rails upgrades" → the RDJesseeBlog/BigDumbWebDev write-ups; "security" → the `remove_resume` fix as a concrete found-and-fixed example).
- Frame it as a timeline/narrative rather than a flat bullet list, matching the blog's existing "journey" framing.
- Keep a compact, ATS-friendly view available by default, with the interactive layer as progressive disclosure — a recruiter skimming fast still needs the plain facts; don't make everyone click through an experience to get them.
- Keep a downloadable PDF export alongside the interactive version — some application processes still require a plain file upload.

**Recommendation:** Option B, sequenced into Phase 2/3 since it benefits from the same Hotwire/design-system foundation being built there anyway, with a PDF export kept available. If you want something live sooner, Option A is a same-day fix whenever you have updated content ready.

## Other opportunities found, not tied to a specific phase

These came out of the source audit during Phase 1 — see [UPGRADE-PLAN.md](../archive/UPGRADE-PLAN.md)'s "Known issues" section for full detail on each. Most are now resolved; what's left is genuinely still open:

- [x] **Done.** CSP: deliberately deferred to Phase 2 (decided 2026-09-14, not skipped — see UPGRADE-PLAN.md Section 3 for the full reasoning on why waiting for Prism/Font Awesome's Phase 2 resourcing avoids redoing the policy twice).
- [x] **Done.** `config/database.yml`'s production credentials reconciled against `DATABASE_URL` (Section 3).
- [x] **Done, but corrected from the original premise.** The `Geocoder`-based `User` methods turned out *not* to be dead code (a profile view calls them on every own-profile visit) — guarded against nil results instead of removed (Section 3). The two orphaned `versions`/`version_associations` schema tables were dropped via a real migration, deployed to production (Section 5) — the migration itself needed an `if_exists: true` fix after production turned out not to have these tables at all, unlike local dev.
- [x] **Mostly done.** A daily backup schedule now exists (previously none, last manual backup was 2021-03-08) — see [BACKUP-AND-RESTORE.md](BACKUP-AND-RESTORE.md). **Still open:** an actual restore drill — the process is written up but not yet executed.
- [ ] **Still open, untouched by Phase 1.** Resolve the ~$15/month of Heroku account charges not yet attributed to a specific app — see the `sql-tutor-upgrade`/NYCycle/head-up discussion below. One small new data point: the dead `sendgrid:starter` add-on (see [DOMAIN-AND-EMAIL.md](DOMAIN-AND-EMAIL.md)) is still attached to the Heroku app, reporting free — not itself contributing to the discrepancy, but a candidate for cleanup now that SES fully replaced it.
- [ ] **New, found during Phase 1's rollout, not yet triaged.** Pushing to GitHub after the `master`→`main` rename surfaced Dependabot alerts (133 vulnerabilities as of the last push, 11 critical/58 high) — a broader scan than the production-scoped `bin/security-scan`/Docker Scout work done during Phase 1 (which came back clean of anything actionable). Worth a dedicated look.

## Considered and deferred: folding RDJesseeBlog into this app

Evaluated 2026-09-12, deferred rather than scheduled. The idea: one Rails app/repo, one Postgres database, one Heroku dyno, serving both `www.bigdumbweb.dev` and `ralphdonaldjessee.com` via host-based routing, to cut costs.

**It's technically straightforward and the savings are real, not marginal.** Rails routes cleanly on `request.host`; Heroku attaches multiple custom domains to one app for free; RDJesseeBlog's content (stories/pictures/recordings) and this app's content (posts/projects/tags) never overlap, so they could share one database as two independent sets of tables with no multi-tenant scoping needed. Confirmed via `heroku ps:type`/`heroku addons`: RDJesseeBlog is its own Basic dyno ($7/mo) + its own Postgres essential-0 ($5/mo) = $12/mo (~$144/year), fully eliminated by merging.

**Deferred anyway, for two reasons:**

1. **The engineering cost is bigger than it looks.** Both apps already have their own complete, independently-designed `User` model, `SessionsController`, and `ApplicationController` — RDJesseeBlog's for family-memorial readers/admins, this app's for guest-commenter portfolio visitors. Merging means reconciling two already-finished auth systems, not copy-pasting one into the other. Realistically comparable in size to one of the Rails upgrades on this roadmap, not a quick follow-on step.
2. **Shared blast radius.** Today, a bad deploy or crashed dyno on one site doesn't touch the other. After merging, they'd share one dyno and one database — an incident on this portfolio site could take down RDJesseeBlog (a site the extended family actually relies on) with it, and vice versa. That's a real ongoing cost independent of engineering time, not just a one-time migration risk.

**Decision:** do the cheap, low-risk cost cuts first — retire `sql-tutor-upgrade`, decide on NYCycle/head-up (see above) — after Phase 1 lands, and see how much of the "$15/month unattributed" that actually resolves on its own. Only revisit this merge if the remaining savings still feel worth the reliability tradeoff and the real engineering lift once that's known.

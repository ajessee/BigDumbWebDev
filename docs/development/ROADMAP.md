# BigDumbWebDev roadmap

Three sequential phases, per the plan for this site: finish the Rails upgrade, then adopt what Rails 8+ gives you for free and cut complexity, then redesign the look and feel. This document is the umbrella — it doesn't duplicate [UPGRADE-PLAN.md](UPGRADE-PLAN.md)'s detail, it sequences it against the two phases that come after it.

## Phase 1 — Rails 6.1 → 8.1 upgrade

Not started. Full detail, a source-level audit, and a sequenced testing strategy live in [UPGRADE-PLAN.md](UPGRADE-PLAN.md) (start there) and [UPGRADE-LEARNINGS.md](UPGRADE-LEARNINGS.md) (lessons from RDJesseeBlog's identical, now-complete upgrade). One thing worth flagging here specifically: **Webpacker has to be replaced as part of this phase regardless of what Phase 2 decides**, since Webpacker itself is incompatible with modern Rails. Keep that replacement scoped to functional parity only — swap the build mechanism, keep current JS behavior identical — and save the idiomatic rewrite for Phase 2 rather than doing both at once. Scope creep here is the main risk to this plan's sequencing.

## Phase 2 — Adopt Rails 8+ capabilities and reduce complexity

This app is currently more complicated than it needs to be for what it does: a Node/Yarn/Webpacker toolchain (with a git-sourced dependency and an EOL Node pin) just to serve hand-rolled vanilla JS with no framework, a native-extension Sass compiler, a 1.1 MB vendored icon file, and a 2019-era CDN script for syntax highlighting. Rails 8 ships defaults that remove most of this need entirely:

- **Drop Node/Yarn/Webpacker for import maps** (`importmap-rails`, Rails' default since 7.0). This app's JS has no build step requirements today — no TypeScript, no JSX, nothing that needs bundling — so pinning ES modules via import maps and serving them through Propshaft/Sprockets removes the entire Node toolchain (and with it, the git-sourced `@rails/webpacker` dependency and the Node 12 pin) rather than just modernizing it.
- **Adopt Turbo + Stimulus** (`turbo-rails`/`stimulus-rails`, bundled with Rails by default) to replace the hand-rolled patterns found in the audit: the custom modal system, the notification system, the menu system, and the blog autosave (`postAutoSaver.js`) are all things Stimulus controllers do more predictably, and Turbo Streams could replace full-page reloads for comment posting. This is a real rewrite, not a drop-in — budget it as such, and do it deliberately rather than as a side effect of the Webpacker swap in Phase 1.
- **Rewrite the 3D-portfolio scroll effect (`projects-3d-scroll.js`) and the landing-page animation (`fadeIn.js`) as Stimulus controllers**, replacing their current implicit dependency on global `window.utils`/`window.projects` objects set by `main.js`. Do this alongside Phase 3's redesign of those same sections rather than twice.
- **Consider Propshaft over Sprockets** (Rails 8's default asset pipeline) once Sass is gone — see below.
- **Reconsider the Sass dependency.** `sass-rails`/`sassc` is a native-extension gem that has to be replaced alongside Webpacker anyway. Modern CSS (nesting, custom properties, `color-mix()`, container queries) covers most of what Sass was doing here — worth trying plain CSS first and only reaching for `dartsass-rails` if a real feature (not just habit) needs it.
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

These came out of the source audit and don't need to wait for or block any phase above — see [UPGRADE-PLAN.md](UPGRADE-PLAN.md)'s "Known issues" section for full detail on each:

- Close the disabled CSP once Prism/Font Awesome's final sourcing (Phase 2) is decided.
- Reconcile `config/database.yml`'s production credentials against the `DATABASE_URL` Heroku actually sets.
- Remove the dead `Geocoder`-based `User` methods and decide on the two orphaned `versions`/`version_associations` schema tables.
- Set up scheduled database backups and an actual restore test — the last manual backup was 2021-03-08, and restoration has never been verified.
- Resolve the ~$15/month of Heroku account charges not yet attributed to a specific app.

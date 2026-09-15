# Security acceptance

Temporarily-accepted, tracked security findings — matching the pattern used on the sibling RDJesseeBlog app (see its own `docs/development/SECURITY-ACCEPTANCE.md`). A finding lives here when it's real, understood, and deliberately not blocking right now, with a clear condition for reassessing it. Nothing here is suppressed silently — see `bin/security-scan`'s comments for exactly how each item is carried.

## Shakapacker `EnvironmentPlugin` env-leak (GHSA-96qw-h329-v5rg) — accepted 2026-09-14

**Finding:** `shakapacker` 8.4.0 (current version, gem and npm package) ships default webpack plugins that pass the *entire* build environment to `webpack.EnvironmentPlugin(process.env)`. Any JS code (app code or a dependency) referencing `process.env.SOME_VAR` gets that value substituted as a literal string into the compiled, publicly-served bundle. Severity: Critical (CVSS 7.5) per the advisory — this app's production asset build runs via Heroku buildpacks with real secrets (`DATABASE_URL`, `RAILS_MASTER_KEY`) present in that build environment, so the *mechanism* for a real leak is present.

**Verified not currently exploited, 2026-09-14:** downloaded the actual live production JS bundle from `www.bigdumbweb.dev` and searched it for the real secret values (the production `RAILS_MASTER_KEY`, `DATABASE_URL`'s host/scheme, an `AKIA`-prefixed AWS access key, the RDS hostname, the old SendGrid key prefix) — zero matches. Confirmed by inspecting this app's own JS (`app/javascript/`) and its declared npm dependencies (`@rails/actioncable`, `@rails/activestorage`, `@rails/ujs`, `trix`, `flatpickr`, the vendored Font Awesome bundle): none reference `process.env.X` for anything. The vulnerability is real in the tool, dormant in this app's actual bundle content.

**Why deferred rather than fixed now:** the fix is upgrading to `shakapacker >= 9.5.0` (current latest is `10.3.2` — two major versions past what this app runs). The original Webpacker → Shakapacker migration earlier in this same upgrade project (see UPGRADE-PLAN.md) surfaced two real, non-obvious regressions at a *minor*-version-adjacent change (the `rack-proxy` SSRF-hardening default, and `webpack-dev-server`'s `allowed_hosts` behavior) — a two-major-version jump deserves the same level of dedicated verification (real browser check of Trix/3D-scroll/landing animation, not just the test suite), not a rushed side effect of setting up `bin/security-scan`.

**How this is carried in tooling, not just this doc:** `bin/security-scan` passes `--ignore GHSA-96qw-h329-v5rg` to `bundler-audit` explicitly (see its own comments) so the scan stays meaningful for *new* findings rather than being permanently red from this one.

**Reassess when:** the shakapacker upgrade (tracked as its own follow-up, not part of this Phase 1 upgrade) lands, or if this app's own JS ever gains a `process.env.X` reference (grep `app/javascript/` for `process.env` before adding any new client-side env-var usage until then).

## Shakapacker-era npm toolchain findings (`yarn audit --groups dependencies`) — accepted 2026-09-14

**Finding:** 13 findings (2 High, 8 Moderate, 3 Low) in this app's actual `dependencies` group (not `devDependencies`) as of 2026-09-14, all transitively pulled in by `shakapacker`'s own build-toolchain packages (e.g. `compression-webpack-plugin` → `serialize-javascript`, a ReDoS advisory). Same root cause as the `EnvironmentPlugin` finding above — an outdated `shakapacker`-era dependency tree — and expected to resolve via the same upgrade.

**Practical risk today:** low. These packages run only at asset-build time (`assets:precompile`), operating on this app's own known asset content, not on attacker-controlled input from a live request.

**Explicitly out of scope, not an accepted risk needing its own sign-off:** `yarn audit`'s *unscoped* result additionally reports 28 findings (1 Critical, 5 High) rooted in `webpack-dev-server` (a `devDependency`, via `chokidar`/`picomatch`/`websocket-driver`). `webpack-dev-server` only ever runs inside a local dev Docker container — it's never part of a production build, image, or deployed bundle — so `bin/security-scan` excludes it via `--groups dependencies` rather than tracking it as an accepted production risk. If the dev container is ever exposed beyond localhost/Docker-internal networking, revisit this exclusion.

**Tooling limitation, noted rather than worked around:** Yarn Classic (v1) has no per-advisory allowlist mechanism (unlike `bundler-audit`'s `--ignore` or npm 7+'s equivalents), so `bin/security-scan`'s `yarn audit` step is informational only (`|| true`) until the shakapacker upgrade resolves the underlying findings — its output should still be read by a human, just doesn't gate the script's exit code.

**Reassess when:** same as above — the shakapacker upgrade.

## Container image scan (`bin/container-security-scan`) — baseline as of 2026-09-14

Building the production image and scanning it (`docker scout cves`) surfaced real, fixable findings alongside the shakapacker one above, all addressed the same session rather than deferred wholesale:

- **5 Critical (perl, glibc) + several High (dpkg, libpcre2, libsqlite3) base-OS package CVEs** — fixed by explicitly listing these already-present-but-not-yet-installed-by-name packages in the Dockerfile's `apt-get install` line, forcing apt to actually upgrade them to the patched version already available in the Trixie repos, rather than leaving them at whatever version the base image layer happened to be built with (same pattern RDJesseeBlog used for its own OpenSSL base-layer CVE).
- **`erb`/`net-imap` (Ruby default gems, CVE-2026-41316/CVE-2026-42246)** — Ruby 3.3.9's bundled default versions (4.0.3 / 0.4.21) have known CVEs; pinned newer versions in the Gemfile (`>= 4.0.3.1` / `>= 0.4.24`, resolved to 6.0.7/0.6.7). The *old* default-gem files stayed physically present in the image even after that (a separate path from where Bundler installs its own copy) and a scanner has no way to know they're unused - removed them explicitly in the Dockerfile's final stage (`gem uninstall` refuses for true default gems like `erb`, so deleted the files directly). Caught and fixed a real bug in this fix itself: the removal originally ran in the intermediate `build` stage, which the final image doesn't inherit from directly (it starts fresh `FROM base`) - moved it to the final stage where it actually takes effect, and verified via `find` inside the built image both before and after.

**Current baseline, 2026-09-14 (after all of the above): 0 Critical, 5 High.** All 5 are either the documented shakapacker finding above (counted twice, gem + npm) or genuinely unfixed upstream in Debian Trixie as of this date (`libxml2` CVE-2026-74860/CVE-2026-86140, `zlib` CVE-2026-85091 - all report "Fixed version: not fixed"). Nothing here is being hidden: `bin/container-security-scan` still exits non-zero on this baseline (matching RDJesseeBlog's own practice of not suppressing findings) - a future run showing *more* than this 5-High baseline is the actionable signal, not the baseline itself.

**Reassess when:** the shakapacker upgrade (accounts for 2 of the 5), or whenever Debian Trixie ships patches for `libxml2`/`zlib` (rebuild and rescan periodically rather than waiting for a specific trigger, since these are base-OS packages outside this app's own control).

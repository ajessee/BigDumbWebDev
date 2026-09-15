# Security acceptance

Temporarily-accepted, tracked security findings — matching the pattern used on the sibling RDJesseeBlog app (see its own `docs/development/SECURITY-ACCEPTANCE.md`). A finding lives here when it's real, understood, and deliberately not blocking right now, with a clear condition for reassessing it. Nothing here is suppressed silently — see `bin/security-scan`'s comments for exactly how each item is carried.

## Resolved: Shakapacker upgrade (8.4.0 → 10.3.2), 2026-09-15

Both shakapacker-era findings previously tracked in this doc are resolved — `shakapacker` (gem + npm) upgraded from 8.4.0 to 10.3.2, verified with the same rigor as the original Webpacker → Shakapacker migration (full test suite, system tests, and a real browser check of every JS-touched feature: landing animation, 3D-portfolio scroll section, the slide-out nav menu, login modal + logout notification, Trix's full custom toolbar — heading levels, color swatches, underline, and specifically the horizontal-rule divider, since that exact feature regressed once before during the original migration — and the blog autosave). All confirmed working, zero new console errors, dev-server proxy (the historically fragile area under Docker Compose) unaffected.

Concrete changes made:
- `config/shakapacker.yml`: renamed `webpack_loader` → `javascript_transpiler` (shakapacker 9.0 renamed this key; setting it explicitly also avoids a v9/v10 landmine where an unspecified transpiler can default to `swc` without `swc-loader` installed).
- `compression-webpack-plugin` bumped 11 → 12 (pulls in `serialize-javascript` 7.1.1, fixing its RCE advisory — this was a `dependencies`-group finding riding along with the shakapacker upgrade, not part of the CVE this upgrade specifically targeted).
- No CSS Modules migration or ESM `baseConfig`/`rules` import fixes were needed — this app uses neither pattern (confirmed by grep before upgrading, not assumed).

Both findings below are kept as a record of what was found and how it was verified, not because either is still open:

**GHSA-96qw-h329-v5rg (shakapacker `EnvironmentPlugin` env-leak):** `bin/container-security-scan` and `bundler-audit`/`yarn audit` all confirm this is gone post-upgrade (shakapacker 9.5.0+ uses an allowlist — only `NODE_ENV`/`RAILS_ENV`/`WEBPACK_SERVE` plus any `SHAKAPACKER_PUBLIC_*`-prefixed vars are exposed to client JS by default). Before upgrading, this was verified as *not currently exploited* by downloading the actual live production bundle from `www.bigdumbweb.dev` and searching it for real secret values (the production master key, `DATABASE_URL`'s host, an AWS key prefix, the old SendGrid key prefix) — zero matches, and this app's own JS/dependencies never referenced `process.env.X` anyway. `bin/security-scan`'s `--ignore GHSA-96qw-h329-v5rg` flag on `bundler-audit` has been removed now that it's fixed.

**Shakapacker-era npm toolchain findings:** the 2 High findings in the `dependencies` group (via `compression-webpack-plugin` → `serialize-javascript`) are fixed by the `compression-webpack-plugin` bump above. `yarn audit --level high --groups dependencies` now reports 0 High/Critical (3 Low + 7 Moderate remain, none gating). The `|| true` on `bin/security-scan`'s `yarn audit` line stays for now — Yarn Classic still has no per-advisory allowlist mechanism, so it remains informational-only as a general policy, not because of this specific (now-resolved) finding.

**Still correctly out of scope, unrelated to any of the above:** `yarn audit`'s *unscoped* result reports far more findings rooted in `webpack-dev-server` (a `devDependency`) — that package only ever runs inside a local dev Docker container, never part of a production build/image/bundle, so `--groups dependencies` continues to exclude it. Revisit only if the dev container is ever exposed beyond localhost/Docker-internal networking.

## Container image scan (`bin/container-security-scan`) — baseline as of 2026-09-15

Building the production image and scanning it (`docker scout cves`) surfaced real, fixable findings, all addressed directly rather than deferred wholesale:

- **5 Critical (perl, glibc) + several High (dpkg, libpcre2, libsqlite3) base-OS package CVEs** — fixed by explicitly listing these already-present-but-not-yet-installed-by-name packages in the Dockerfile's `apt-get install` line, forcing apt to actually upgrade them to the patched version already available in the Trixie repos, rather than leaving them at whatever version the base image layer happened to be built with (same pattern RDJesseeBlog used for its own OpenSSL base-layer CVE).
- **`erb`/`net-imap` (Ruby default gems, CVE-2026-41316/CVE-2026-42246)** — Ruby 3.3.9's bundled default versions (4.0.3 / 0.4.21) have known CVEs; pinned newer versions in the Gemfile (`>= 4.0.3.1` / `>= 0.4.24`, resolved to 6.0.7/0.6.7). The *old* default-gem files stayed physically present in the image even after that (a separate path from where Bundler installs its own copy) and a scanner has no way to know they're unused - removed them explicitly in the Dockerfile's final stage (`gem uninstall` refuses for true default gems like `erb`, so deleted the files directly).
- **The shakapacker `EnvironmentPlugin` finding (2 of the original 5 High)** — resolved by the upgrade above.

**Current baseline, 2026-09-15 (after all of the above): 0 Critical, 3 High.** All 3 remaining are genuinely unfixed upstream in Debian Trixie as of this date (`libxml2` CVE-2026-74860/CVE-2026-86140, `zlib` CVE-2026-85091 - all report "Fixed version: not fixed"), unrelated to anything this app controls. Nothing here is being hidden: `bin/container-security-scan` still exits non-zero on this baseline (matching RDJesseeBlog's own practice of not suppressing findings) - a future run showing *more* than this 3-High baseline is the actionable signal, not the baseline itself.

**Reassess when:** Debian Trixie ships patches for `libxml2`/`zlib` (rebuild and rescan periodically rather than waiting for a specific trigger, since these are base-OS packages outside this app's own control).

# Backup and restore

## Current state (as of 2026-09-15)

- **Scheduled backups:** daily at 07:00 America/New_York (`heroku pg:backups:schedules --app big-dumb-web-dev`), set up as part of the Section 5 deploy work.
- **Manual backup on demand:** `heroku pg:backups:capture --app big-dumb-web-dev`.
- **Continuous protection** is also enabled on the Postgres Essential-0 plan (Heroku's own WAL-based rolling protection, separate from the logical `pg:backups` snapshots above) — this is why `pg:backups:capture` prints a "Logical backups of large databases are likely to fail" warning; harmless at this app's small size (~10MB), and continuous protection itself provides fast point-in-time recovery for the last ~4 hours to few days independent of the snapshot schedule above.
- **Restore drill: not yet done.** A schedule existing is not the same as proof a restore actually works — this doc's process below is written but not yet executed. Tracked as an open item in [UPGRADE-PLAN.md](../archive/UPGRADE-PLAN.md) Section 5.

## Restore drill process (TODO: execute, not yet run)

The goal: prove a real backup can actually be restored into a working database, without ever touching the live production `DATABASE_URL`. Never restore directly onto the production database as a "test" — always restore into an isolated, temporary target first.

1. **Identify the backup to test.** `heroku pg:backups --app big-dumb-web-dev` — use the most recent scheduled backup, not always the same manual one, so the drill actually validates the automated schedule.
2. **Provision a temporary, isolated Postgres to restore into** — do not restore onto `DATABASE_URL`. Two options, either is fine:
   - A second, temporary addon on the same app: `heroku addons:create heroku-postgresql:essential-0 --app big-dumb-web-dev --as RESTORE_DRILL` (creates a new attachment, e.g. `RESTORE_DRILL_URL`, alongside the existing `DATABASE_URL` — leaves the real one untouched).
   - Or a throwaway Heroku app entirely (`heroku create bdwd-restore-drill-temp`, then its own `heroku-postgresql:essential-0`) — more isolated, slightly more setup.
3. **Restore:** `heroku pg:backups:restore <backup-id> RESTORE_DRILL_URL --app big-dumb-web-dev --confirm big-dumb-web-dev` (the `--confirm` flag requires typing the app name, a safety check against restoring onto the wrong target).
4. **Verify the restored data is real and complete**, not just that the command exited 0:
   - Row counts on a few key tables (`users`, `posts`, `comments`) match what's expected.
   - Spot-check a specific known record (e.g., a specific post's content) rather than just counts.
   - Confirm `schema_migrations` in the restored DB matches the same migration version as production.
5. **Tear down the temporary resource immediately after verifying** — this is a real, billed (prorated) Postgres instance for as long as it exists: `heroku addons:destroy RESTORE_DRILL --app big-dumb-web-dev` (or destroy the whole throwaway app if that approach was used).
6. **Record the result** (date, backup ID tested, what was verified, any issues found) — append it to this doc as a dated entry below, the same way Section 5's other work is dated in [UPGRADE-PLAN.md](../archive/UPGRADE-PLAN.md).

**Cadence:** re-run this drill periodically (e.g., quarterly, or after any major schema change) rather than once and forgetting — a schedule that silently stopped working, or a backup format that silently became unrestorable, is exactly the kind of failure that a drill catches and a schedule alone doesn't.

## Drill history

*(none yet — this section gets a new dated entry each time the drill above is actually run)*

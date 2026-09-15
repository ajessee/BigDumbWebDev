# Domain, DNS, and email

Reference doc for how `bigdumbweb.dev` is registered, resolved, and mailed. Started 2026-09-14 while diagnosing the dead `SENDGRID_API_KEY` (see [UPGRADE-PLAN.md](../archive/UPGRADE-PLAN.md) Section 3); updated the same day once the fix landed on **Amazon SES** rather than SendGrid. Read this before touching DNS, email deliverability, or AWS SES/IAM for this app.

## Registrar / DNS host

**Squarespace Domains** (`account.squarespace.com` → Domains → `bigdumbweb.dev` → DNS Settings). This is where all DNS records for the domain live and are edited — not PointDNS (the `pointdns:developer` Heroku add-on referenced in the upgrade plan's cost table is attached but not actually where records are managed; Squarespace is authoritative). The sibling personal domain `ralphdonaldjessee.com` (used by RDJesseeBlog) is also registered here, on the same Squarespace account. DNS edits require a one-time email verification code sent to the account owner's Gmail — expect that step.

- Auto-renew and WHOIS privacy are on; domain lock is on.
- Apex (`bigdumbweb.dev`) forwards via an `A` record to Squarespace's forwarding IP (`198.49.23.145`) → `https://www.bigdumbweb.dev`.
- `www` is a `CNAME` to a `herokudns.com` target — this is the actual live app (Heroku).

## Email receiving: iCloud Mail, not Rails

`@bigdumbweb.dev` mail **receiving** is routed to **iCloud Mail** via Apple's "Custom Email Domain" feature (part of iCloud+), confirmed by:
- `MX` records: `mx01.mail.icloud.com` / `mx02.mail.icloud.com` (priority 0)
- `TXT @`: `v=spf1 include:icloud.com ~all`
- `CNAME sig1._domainkey` → `sig1.dkim.bigdumbweb.dev.at.icloudmailadmin.com`
- `TXT @`: `apple-domain=CjTPZETjO8uQ9Flb` (Apple's domain-ownership verification token)

This is completely separate from the app's **outbound** mail (now Amazon SES) — it only governs whether a real inbox exists behind an `@bigdumbweb.dev` address for **receiving**. Which specific local-parts (`admin@`, `welcome@`, `passwords@`, `comments@` — the four addresses `app/mailers/user_mailer.rb`/`application_mailer.rb` send *from*) are actually configured as receiving aliases in iCloud is managed in Apple ID / iCloud+ settings, not here — not yet checked as of this writing, and not relevant to sending via SES domain verification (which is DNS-only, doesn't require any address to be receivable).

## Outbound mail: Amazon SES (decided 2026-09-14, replacing SendGrid)

**Why not SendGrid:** the app's original SendGrid setup (Heroku `sendgrid:starter` add-on, provisioned 2019) turned out to be completely dead — API key revoked, and Heroku's SSO link into that SendGrid sub-account fails outright (`Single Sign-On failed`), meaning the account itself is orphaned, not just holding a stale credential. A fresh SendGrid trial account was created directly (bypassing Heroku's add-on marketplace) but two facts ruled it out for the long term: Heroku's `sendgrid:starter` free plan no longer exists (cheapest paid plan is `sendgrid:essentials50k`, ~$20-35/month), and Twilio [retired SendGrid's permanent Free plan entirely starting May 27, 2025](https://www.twilio.com/en-us/changelog/sendgrid-free-plan) — the "Free Trial" a new signup gets is genuinely time-limited (2 months), after which sending is paused until you upgrade to a paid plan. At this app's real traffic (a personal blog's signup/password-reset/comment-notification emails), SendGrid's cheapest paid tier would be pure recurring overhead. Amazon SES costs ~$0.10 per 1,000 emails with no free-tier cliff, and the app already has a working AWS relationship (S3 for Active Storage).

**IAM setup:**
- The app's existing AWS credentials (`Rails.application.credentials.dig(:aws)`, used for S3) have no SES permissions and were deliberately *not* widened — a separate, narrowly-scoped IAM user was created instead: **`bigdumbwebdev-ses-sender`**, with a dedicated policy (**`bigdumbwebdev-ses-send`**) granting only `ses:SendEmail`/`ses:SendRawEmail`, scoped to the `arn:aws:ses:us-east-1:736773231048:identity/bigdumbweb.dev` resource — no S3 or other access. Its access key/secret are stored in `config/credentials.yml.enc` under a new top-level `ses:` key, separate from the existing `aws:` key (which stays S3-only).
- The account's personal admin IAM user (`andrejessee`, in the `admins` group) didn't have SES permissions either — the `admins` group already followed a pattern of one AWS-managed `*FullAccess` policy per service in use (S3, EC2, ECS, Elastic Beanstalk), so `AmazonSESFullAccess` was added to that group to match, rather than inventing a new pattern. That's what was used to create the domain identity and the dedicated sender user above.

**Domain identity / DKIM:** an SES domain identity for `bigdumbweb.dev` was created (`aws sesv2 create-email-identity`) with Easy DKIM. Verification is DNS-only (3 CNAME records), confirmed **verified** (`VerificationStatus: SUCCESS`, `VerifiedForSendingStatus: true`) same day:

```
CNAME  es4lotfu6bbbpgjtqtp6qapwycorum3e._domainkey  → es4lotfu6bbbpgjtqtp6qapwycorum3e.dkim.amazonses.com
CNAME  sh7j7pkqj36ess4emi5u4nh2t4mjdh2t._domainkey  → sh7j7pkqj36ess4emi5u4nh2t4mjdh2t.dkim.amazonses.com
CNAME  ks4ffag2y6p3blduxcirk3cwkcqcgy4w._domainkey  → ks4ffag2y6p3blduxcirk3cwkcqcgy4w.dkim.amazonses.com
```

These replaced four now-deleted, dead SendGrid domain-authentication CNAMEs that existed from the original 2019 account (`9820724` → `sendgrid.net`, `em4470` → `u9820724.wl225.sendgrid.net`, `s1._domainkey`/`s2._domainkey` → `*.domainkey.u9820724.wl225.sendgrid.net`) — removed as part of this same DNS edit since they were tied to the dead account and would only cause confusion later.

**Status as of 2026-09-14:**
- [x] Production access: already enabled (`aws sesv2 get-account` → `ProductionAccessEnabled: true`) — this AWS account has been in active use since 2016 (EC2/S3), so it already had this from prior use. No sandbox request was needed.
- [x] Rails switched to SES: `config/environments/production.rb` uses `config.action_mailer.delivery_method = :ses`, backed by `app/lib/ses_delivery_method.rb` (a small custom delivery class wrapping `Aws::SESV2::Client#send_email`). Note: `aws-sdk-rails` was tried first but its ActionMailer/SES integration has been removed from the gem entirely (5.2.0 only does SQS/Elastic Beanstalk worker middleware) — switched to the lighter `aws-sdk-sesv2` gem directly instead. Also hit and fixed a Zeitwerk timing issue: the delivery-method registration had to move into a `config.after_initialize` block, since `config/environments/production.rb` evaluates before autoloading is ready.
- [x] Real test send confirmed working end-to-end, 2026-09-14 (delivered and visually confirmed by the user).
- [x] **Re-confirmed in actual production, 2026-09-15**, after this code finally deployed (see [../archive/HEROKU-DEPLOYMENT.md](../archive/HEROKU-DEPLOYMENT.md)): `heroku run rails runner` against the live app confirmed `delivery_method: ses` with real credentials resolving correctly in the real Heroku runtime, not just the dev container.
- **Leftover, not yet cleaned up:** the `sendgrid:starter` Heroku add-on itself (as opposed to its config vars, already removed) is still attached to the app — free, genuinely unused now, a small cleanup candidate. See [ROADMAP.md](ROADMAP.md)'s "Other opportunities" section.

There's also a `TXT mx._domainkey` record containing an inline RSA public key (`k=rsa; p=...`) that doesn't match the naming convention of the iCloud or SES/SendGrid records — likely a leftover from some even-older mail setup, not yet identified. Harmless to leave (a DKIM TXT record only matters if some mail server actually signs outbound mail with the matching private key), but worth investigating if anything mail-related ever behaves unexpectedly.

## Google site-verification record

`CNAME 2z6lu6dq45ye → gv-t2nbemmsmq5uvl.dv.googlehosted.com` — a Google Search Console domain-ownership verification record, unrelated to mail or hosting.

## Practical guidance

- **Don't touch** the iCloud MX/SPF/DKIM records or the `www`/apex records — those aren't related to outbound mail and are load-bearing for real mail receiving and the live site.
- Any DNS edit here is a production change for a live site (mail receiving + the app's own domain resolution) — confirm before adding/removing records, same standing rule as any other production change.
- Any IAM policy/user change in the AWS account is likewise a real security-relevant change — done deliberately narrow (see the dedicated `bigdumbwebdev-ses-sender` user above) rather than reusing or widening the existing S3 credentials.

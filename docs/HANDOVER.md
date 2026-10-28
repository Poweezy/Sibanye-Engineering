# SES Website — Deployment & Handover Runbook

> Audience: Analytical Sigma (delivery) and SES (receiving). Deployment happens only with written SES authorization (`docs/GATES.md`, Gate 5 → Gate 6).

## 1. What ships

`dist/` is the complete deployable artifact (Astro static build — no database, no CMS):

- 39 pages, including services, sectors, projects and case studies
- `api/enquiry.php` — the only server-side component
- `.htaccess` — security headers, CSP, browser caching, dotfile denial and custom 404
- `robots.txt` and sitemap files
- Brand assets and the approved SES capability-statement PDF

Build and verify locally before every deployment:

```sh
npm run build
npm test
```

## 2. Deploy steps (cPanel)

1. **Backup:** zip the current `public_html` contents and store the archive outside the web root.
2. **Upload:** copy the *contents* of `dist/` (not the `dist` folder itself) into `public_html`.
3. **Dotfiles:** ensure `.htaccess` was copied; it is hidden in many FTP clients and File Manager views.
4. **Permissions:** files `644`, directories `755` (cPanel defaults). PHP runs through the host's PHP-FPM/CGI.
5. **Rate-limit state:** `.enquiry-ratecheck` is created above `public_html` (next to it) on first valid form request. Do not move it into the web root or delete it during routine deployment.

## 3. Enquiry form configuration and delivery

- **Recipient:** `corporate@sibanyeengineering.com` in `public/api/enquiry.php`. Confirm it is an active, monitored mailbox before launch.
- **Email host:** Real Image (client-confirmed 2026-10-28). Obtain Real Image's production mail-routing, retention, backup and security-log details and compare them with the published Privacy Notice.
- **From/envelope sender:** `no-reply@sibanyeengineering.com`. Confirm this mailbox/domain sender is permitted by the cPanel mail configuration.
- **Important limitation:** PHP `mail()` returning `true` means the local mail transport accepted the message for processing. It does **not** prove that the recipient server accepted it or that it reached the inbox. The endpoint logs the reference and transport outcome; logs are diagnostic evidence, not proof of delivery.
- **SPF:** use cPanel **Email Deliverability** / Zone Editor to install the exact SPF record recommended for the actual host. Do not publish a second SPF record; merge authorised senders into one record.
- **DKIM:** enable the key and DNS record recommended by cPanel **Email Deliverability**.
- **DMARC:** publish a TXT record at `_dmarc.sibanyeengineering.com`. Start with monitoring, for example `v=DMARC1; p=none; rua=mailto:corporate@sibanyeengineering.com`, only after confirming that address can receive reports. Tighten policy after reviewing reports and all legitimate senders.
- **If mail delivery remains unreliable:** configure authenticated SMTP through the host's supported mail service. Do not add credentials to the repository or public files; store them in hosting environment/configuration outside the web root.

## 4. Rate-limit behaviour

The endpoint requires **PHP 8.0+** (`str_contains`) with the **mbstring** extension (`mb_substr`/`mb_strlen`). The endpoint uses a file above the document root, a SHA-256 hash of the client IP, and an exclusive `flock()` covering the full read/check/prune/write sequence. It allows one submission per IP per 30 seconds and prunes entries older than one hour. If the state file cannot be opened, locked, read or written, the endpoint fails closed with HTTP 503 rather than bypassing the limit.

The lock is effective only when all PHP workers share the same filesystem and lock semantics, as expected for a single cPanel account. Confirm the path is writable by PHP and remains outside `public_html`.

## 5. Enquiry privacy and retention

The public `/privacy/` notice records SES's retention schedule for enquiry emails, abandoned enquiries, converted engagements, mail/security logs and backups. It identifies Real Image as the email host and discloses that the form includes the submitter IP in the enquiry email and that service providers process information to operate the site and deliver messages. The hashed IP in the rate-limit state file is pruned after one hour.

Before launch, obtain Real Image's email-processing, data-location, backup and log-retention details and verify the notice matches its actual arrangements. Separately verify the website host's processing and backup arrangements. Keep the 90-day backup deletion/overwrite schedule and 30-day security-log retention aligned with the published policy. Privacy requests are directed to `corporate@sibanyeengineering.com`.

## 6. Content Security Policy

`.htaccess` now sends an enforcing CSP. The current policy allows first-party scripts, connections, images, fonts, and media; disallows objects; restricts form actions and framing to the same origin; and permits inline **styles** because the site uses style attributes for per-item CSS custom properties. It permits only the exact SHA-256 hashes of the inline module scripts emitted by the current Astro build; it does not use `'unsafe-inline'` for scripts or allow third-party origins. `scripts/smoke-test.mjs` verifies the CSP hashes against every built HTML page, so changes to inline scripts must be accompanied by updated hashes.

Before release, verify the policy on the actual host and review browser console violations on representative routes, including Home, Projects, Contact and the capability statement download. If a required script is blocked, prefer moving it into a bundled same-origin asset or updating the smoke-verified hash list; do not casually add `'unsafe-inline'` to `script-src` or broad third-party wildcards. If a required third-party service is intentionally introduced later, add only its exact required origin and directive.

`upgrade-insecure-requests` is included; verify the production hostname has working HTTPS before enforcing the policy.

## 7. Post-deploy verification checklist

- [ ] HTTPS works and HTTP redirects to HTTPS at the hosting layer.
- [ ] Homepage, navigation, projects, contact page, downloads and sitemap load.
- [ ] Browser console shows no unexpected CSP violations on representative routes.
- [ ] Submit a real enquiry and record its reference.
- [ ] Confirm the message actually arrives in the recipient inbox; also check spam/quarantine and cPanel mail delivery/track logs.
- [ ] Verify sender, SPF, DKIM and DMARC results in the received message headers.
- [ ] Submit invalid data; confirm HTTP 422 / visible validation feedback and no email.
- [ ] Submit again within 30 seconds from the same IP; confirm HTTP 429.
- [ ] Confirm `.enquiry-ratecheck` is above `public_html`, not publicly accessible, and has restrictive permissions where supported.
- [ ] Test the form when the rate-limit file is unwritable in a staging copy; it should fail closed with HTTP 503.
- [ ] Verify downloads, keyboard navigation, responsive layouts and cross-browser behaviour.
- [ ] Obtain Real Image's live mail, data-location, backup, log and retention details; confirm the Privacy Notice accurately reflects them.
- [ ] Verify the website host's processing and backup arrangements separately.
- [ ] Run `npm test` and record the result alongside manual QA.

## 8. Rollback

Restore the previous `public_html` backup. Keep the prior `api/enquiry.php` and `.htaccess` alongside the backup. No database rollback is needed for this static architecture. The rate-limit file is transient and can be regenerated, but do not delete it during normal operation.

## 9. Ongoing care

- **Content updates:** edit `src/content/*.json`, rebuild, and redeploy.
- **Runtime surface:** the PHP endpoint is the only executable application code. Keep the cPanel PHP version current, directory listing disabled, and credentials out of the public web root.
- **Release status:** live mailbox delivery, CSP compatibility and production-host verification remain open until the checklist above is completed. Code changes alone do not authorize deployment.

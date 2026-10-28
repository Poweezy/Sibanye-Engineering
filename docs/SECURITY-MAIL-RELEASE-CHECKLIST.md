# Security hardening change — review and release checklist

This change covers the PHP enquiry endpoint, Apache CSP header, and deployment runbook.

## Code changes
- The rate-limit state read/check/prune/write sequence is held under one exclusive `flock()` lock.
- IPs are stored as SHA-256 hashes, not raw addresses.
- Rate-limit storage errors fail closed with HTTP 503.
- `mail()` uses the configured domain sender as the envelope sender and logs a per-submission reference plus transport outcome.
- Success wording does not claim confirmed inbox delivery.
- `.htaccess` enforces a first-party CSP that allows only the exact SHA-256 hashes of the inline module scripts emitted by the current Astro build, with no `unsafe-inline` script allowance. The smoke test checks the hashes against every built HTML page. A narrowly retained inline-style allowance remains for CSS custom-property attributes.

## Must be tested on the real hosting account
- Obtain Real Image's email-hosting, data-location, backup and log-retention details and verify that the published Privacy Notice matches them; verify the website host's processing and backup arrangements separately.
- Verify the recipient mailbox is active and monitored.
- Send a real test enquiry and confirm receipt, including spam/quarantine and cPanel mail logs.
- Inspect received headers for SPF, DKIM and DMARC results.
- Verify the envelope sender is allowed by the host.
- Inspect browser console CSP violations on Home, Projects, Contact and Capabilities.
- Confirm HTTPS is functional before keeping `upgrade-insecure-requests`.
- Confirm concurrent submissions from the same IP do not bypass the 30-second limit.
- Confirm the rate-limit file is created outside the document root and is writable by PHP.

## Limitations
A successful `mail()` return and an application log entry prove only that PHP reported local transport acceptance. They do not prove final delivery. If live tests show unreliable delivery, use authenticated SMTP supported by the host, with credentials stored outside the repository. Do not close the QA/deployment gate until these live checks pass.

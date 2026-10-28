# SES Website — Deployment & Handover Runbook

> Audience: Analytical Sigma (delivery) and SES (receiving). This document satisfies the
> "hosting and rollback steps are documented" item in the project Definition of Done and is
> the runbook referenced by `public/api/enquiry.php` (mail-deliverability notes).
> Scope guard: deployment happens only with written SES authorization (`docs/GATES.md`, Gate 5 → T6).

## 1. What ships

`dist/` is the complete deployable artifact (Astro static build — **no database, no CMS**):

- **39 pages**: 7 core routes (home, about, sectors, capabilities, approach, leadership, contact) + services index + 8 service pages + projects index + 21 case studies + the 404 page
- `api/enquiry.php` — the only server-side component (honeypot, validation, rate limit, header-injection guards — ADR-012)
- `.htaccess` — security headers, browser caching, dotfile denial, custom 404 (ADR-012b)
- `robots.txt` + `sitemap-index.xml` / `sitemap-0.xml` (`@astrojs/sitemap`)
- Brand assets: `logo-official.jpg` (official lockup, ADR-015), `favicon.png`, `apple-touch-icon.png`, `og.jpg` (1200×630 social card), master `SIBANYE-LOGO-(OFFICIAL).jpg`
- `downloads/ses-capability-statement-2026.pdf` (download link intentionally disabled until SES confirms the approved version — content-open-items item 1)

Build and verify locally before every deploy:

```
npm run build     # astro build
npm test          # build + smoke-test.mjs (artifact/integrity gate) + link-check.mjs
```

## 2. Deploy steps (cPanel)

1. **Backup**: zip the current `public_html` contents and store the archive outside the web root.
2. **Upload** the *contents* of `dist/` (not the `dist` folder itself) into `public_html`.
3. **Dotfiles**: ensure `.htaccess` actually copied — it is hidden in most FTP clients and File Manager views.
4. **Permissions**: files `644`, directories `755` (cPanel defaults). PHP runs via the host's PHP-FPM/CGI; `api/enquiry.php` needs no special mode.
5. **Do not clean above the web root**: the enquiry rate-limit file `.enquiry-ratecheck` lives in the cPanel home directory (next to `public_html`) once the form runs (ADR-016). It is auto-created and must never be web-readable.

## 3. Enquiry form configuration

- **Recipient**: the `RECIPIENT` constant at the top of `public/api/enquiry.php` (currently `corporate@sibanyeengineering.com` — confirm the live mailbox with SES, content-open-items item 6).
- **Envelope/From**: `no-reply@sibanyeengineering.com` — must be a real mailbox on the hosting domain or mail() will be rejected/spam-foldered.
- **Deliverability (SPF/DKIM/DMARC)** — required for the form to reach inboxes reliably:
  - **SPF**: in cPanel *Zone Editor*, add a TXT record for the domain: `v=spf1 a mx include:<host-spf> ~all` (cPanel's *Email Deliverability* tool proposes the exact record for the server).
  - **DKIM**: enable via cPanel *Email Deliverability* ("Enable DKIM" — one click on most hosts) which installs the selector + TXT record.
  - **DMARC** (recommended, start lenient): TXT `_dmarc` → `v=DMARC1; p=none; rua=mailto:corporate@sibanyeengineering.com`.
- **Rate limiting**: file-based above the document root; one submission per IP per 30 s window (ADR-016). No database.
- **Failure path**: if `mail()` fails the endpoint returns a visible error directing visitors to `corporate@sibanyeengineering.com` / WhatsApp.

## 4. Post-deploy verification checklist

- [ ] HTTPS redirect works (hosting layer — ADR-012b deliberately deferred this to cPanel: *Domains → Force HTTPS Redirect*, or a hosting-added `.htaccess` rule)
- [ ] Homepage and all header/footer navigation load (link-check was green pre-deploy)
- [ ] Submit a real enquiry → success confirmation shows and mail arrives (content item 6)
- [ ] Submit empty/invalid → inline errors, no mail sent
- [ ] `.enquiry-ratecheck` appears in the cPanel home directory — **not** in `public_html`
- [ ] `https://www.sibanyeengineering.com/sitemap-index.xml` reachable; submit to Google Search Console
- [ ] Social card previews resolve (og.jpg 1200×630, large-image card)
- [ ] Capability-statement download enabled only after SES confirms the approved PDF version (item 1)

## 5. Rollback

- Restore = re-upload the backup zip from step 2.1. **No database rollback exists or is needed** (static architecture).
- If `enquiry.php` changed between deploys, keep the previous version alongside the backup (it is the only runtime surface).
- The rate-limit file is stateless-and-regenerable; deleting it carries no data risk.

## 6. Ongoing care (E2 500/yr hosting & care plan)

- **Content updates**: edit `src/content/*.json` (services, sectors, projects, leadership, clients), rebuild, redeploy — or raise a request with Analytical Sigma.
- **Runtime surface**: the PHP endpoint is the only executable code; keep the cPanel PHP version current and directory listing off.
- **Open approvals** that gate features (see `docs/content-open-items.md`): approved PDF version, live mailbox, photography permissions, statistics, client-logo wall, brand guide/vector/compact logo variants.

# Phase Gates — Approval Workflow

| Gate | Scope | State |
| --- | --- | --- |
| **Gate 0** | Engagement, commercial terms (E9 500 once-off; E2 500/yr hosting & care), 3–4 week window | ✅ Agreed |
| **Gate 1** | Phase 1 audit + architecture recommendation accepted (Astro 5 static + selective PHP, Tailwind v4) | ✅ Accepted by client 2026-10-21 |
| **Gate 2** | **Design approval** — visual identity (navy/teal tokens, Space Grotesk/Inter, blueprint motif) + homepage prototype | 🔶 **OPEN — awaiting SES review** |
| **Gate 3** | Full build — all routes, case studies, PHP enquiry endpoint, `.htaccess`, security headers, downloads | ⏸ Gated on Gate 2 |
| **Gate 4** | Content freeze — all `[CONFIRM WITH SES]` placeholders resolved or explicitly deferred | ⏸ Gated on SES content supply |
| **Gate 5** | QA signoff — routes, responsive, a11y, form behaviour, downloads, SEO metadata, Lighthouse budgets, production build; unresolved issues documented | ⏸ Gated on Gate 3/4 |
| **Gate 6** | Deployment to agreed host + handover (care plan, DNS/SSL cutover) | ⏸ No deployment without written approval |

## Evidence conventions

- Each gate closure is recorded in `docs/STATUS.md` with the decision date.
- Gate 5 requires both automated checks (build, link check, Lighthouse) and documented manual
  testing (cross-browser, real form submission, downloads on the live host).
- No gate may be closed by the agency alone where it requires client content or approval.

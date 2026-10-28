# Phase Gates — Approval Workflow

| Gate | Scope | State |
| --- | --- | --- |
| **Gate 0** | Engagement, commercial terms (E9 500 once-off; E2 500/yr hosting & care), 3–4 week window | ✅ Agreed |
| **Gate 1** | Phase 1 audit + architecture recommendation accepted (Astro 5 static + selective PHP, Tailwind v4) | ✅ Accepted by client 2026-10-21 |
| **Gate 2** | **Design approval** — visual identity (official amber `#D69C1F` with remaining brand tokens provisional per ADR-013, Space Grotesk/Inter, blueprint motif) + full-site review | ✅ **Approved by client confirmation 2026-10-28**; approver name/signature not supplied |
| **Gate 3** | Full build — all routes, case studies, PHP enquiry endpoint, `.htaccess`, security headers, downloads | 🔶 **Implementation complete** (39 routes, endpoint, hardening; sitemap + link-check green). Capability-statement download remains gated on approved PDF or explicit deferral; Gate 2 is approved |
| **Gate 4** | Content freeze — all `[CONFIRM WITH SES]` placeholders resolved or explicitly deferred | ⏸ Gated on SES content supply |
| **Gate 5** | QA signoff — routes, responsive, a11y, form behaviour, downloads, SEO metadata, Lighthouse budgets, production build; unresolved issues documented | ⏸ Automated build/smoke/link checks pass; formal signoff gated on Gate 3/4 and live-host/manual QA |
| **Gate 6** | Deployment to agreed host + handover (care plan, DNS/SSL cutover) | ⏸ No deployment without written approval |

## Evidence conventions

- Each gate closure is recorded in `docs/STATUS.md` with the decision date.
- Gate 5 requires both automated checks (build, link check, Lighthouse) and documented manual
  testing (cross-browser, real form submission, downloads on the live host).
- No gate may be closed by the agency alone where it requires client content or approval.
- Latest local evidence (2026-10-28): 39-page production build, 87/87 smoke checks, 86/86 internal references. This does not close content/rights approvals or substitute for live-host testing.
- Gate 2 approval recorded 2026-10-28 from client confirmation. Gate 4 content freeze and Gate 5 QA remain open; Gate 6 deployment still requires written authorization.

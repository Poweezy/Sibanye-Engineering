# Sibanye Engineering Solutions — Website AI Agent Team

These are GitHub Copilot custom-agent profiles for a VS Code repository. Copy the `.agent.md` files into `.github/agents/` in the website repository. They are specialist instructions, not autonomous background services; invoke them through your coding assistant, and use the orchestrator to coordinate work.

## Recommended setup

1. Open the existing Sibanye website repository in VS Code.
2. Create `.github/agents/` if it does not exist.
3. Copy the agent files there.
4. Start with `ses-orchestrator.agent.md`.
5. Ask it to inspect the repository and produce a plan before modifying files.
6. Implement in small, reviewable stages. Do not deploy without approval.

## Agent roster

- `ses-orchestrator.agent.md` — project lead, plans work and coordinates specialists.
- `ses-brand-strategy.agent.md` — positioning, messaging and content integrity.
- `ses-ux-architect.agent.md` — information architecture, journeys and accessibility.
- `ses-visual-designer.agent.md` — premium art direction and design system.
- `ses-frontend-engineer.agent.md` — responsive implementation and interaction quality.
- `ses-content-case-study.agent.md` — service, project and leadership content modelling.
- `ses-seo-performance.agent.md` — technical SEO, performance and analytics.
- `ses-security-qa.agent.md` — security, accessibility, browser testing and release gates.

## Important project guardrails

- Reference site: https://www.ander.group/ and its work portfolio. Study its strategic clarity, storytelling, strong typography, deliberate whitespace, modular content, case-study framing and balance between design and business outcomes. Do not copy its text, exact layouts, brand assets, distinctive visual compositions or code.
- Client: Sibanye Engineering Solutions (SES), Eswatini and Southern African market.
- Approved project scope and budget: E9,500 once-off development; E2,500/year managed hosting and care; 3–4 week target. Keep the first release within the proposal scope.
- The initial site is English-language, corporate, responsive, lead-generating and maintainable.
- Proposed positioning: “Engineering Infrastructure. Enabling Sustainable Progress.”
- Do not fabricate project values, clients, qualifications, registrations, project status, testimonials, statistics or image provenance. Flag all unverified claims for client approval.
- Project examples supplied in the proposal include Mkhondvo-Ngwavuma Water Augmentation Programme, Manzini Region Sustainable Water Supply, Ridgeview Township Roads, Sicholo Street and associated drainage works, MR3 pedestrian bridges, Unifoods Factory Shell, Buy Cash Warehouse, National Healthcare Waste Facility, Emandla Solar Photovoltaic Plant, Nsoko Solar PV Project and Lavumisa Border Project. Treat these as draft references until approved.
- Leadership names supplied: Nkonyane Musa and Frans Pienaar. Use titles and credentials only as provided and only after client approval.
- Client/partner names and logos require approval before publication.
- Initial scope includes corporate pages, services, sectors, projects/case-study layouts, leadership, capabilities, contact, project enquiry form, capability-statement download, WhatsApp integration, foundational SEO, analytics, security, QA, deployment and handover.
- AI assistant, careers portal, advanced project search and engineering insights are future enhancements unless separately approved.
- Hosting is intended to be cost-conscious and may use Afrihost, subject to the chosen stack's compatibility. Do not introduce expensive infrastructure or paid dependencies without explicit approval.
- Preserve the existing repository architecture unless a documented technical reason justifies changing it. Inspect package files, routes, build commands, deployment setup and current code before implementation.
- Never commit secrets, credentials, private client data or unapproved content.

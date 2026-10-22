---
name: ses-content-case-study
description: Structures SES services, sectors, capability content, leadership profiles and project case studies without inventing facts.
---

Act as an engineering-sector content architect and case-study editor.

## Goal
Turn approved company material and the capability statement into structured, scannable web content that makes SES's expertise understandable to procurement teams, project owners and partners.

## Brand-derived content cautions
- The official logo lockup prints a services tagline ("Civil Engineering Advisory Services | Transportation | Water Infrastructure | Mining | Energy | Structures | Project Management"). These are brand-artifact wordings — do NOT rename `services.json` entries or create new service pages from them without SES approval. Log naming mismatches (e.g. "Mining" vs "Mining Engineering", "Structures" vs "Structural Engineering") in `docs/content-open-items.md`.
- A header/footer monogram extracted from the lockup is a derivative of the official mark, not a supplied variant — list it for SES approval in `docs/content-open-items.md`.

## Proposed project data model
Each project may contain:
- `slug`
- `title`
- `client` (only if approved for public disclosure)
- `location`
- `sector`
- `services[]`
- `status` (only when confirmed)
- `project_value` (only when confirmed and approved)
- `summary`
- `scope[]`
- `outcomes[]` (evidence required)
- `images[]` with alt text, source and permission status
- `related_services[]`
- `publication_status` (`draft`, `needs-approval`, `approved`)

Do not show empty fields or imply values are public if approval is missing.

## Candidate projects from the proposal
Mkhondvo-Ngwavuma Water Augmentation Programme; Manzini Region Sustainable Water Supply; Ridgeview Township Roads; Sicholo Street and associated drainage works; MR3 pedestrian bridges; Unifoods Factory Shell; Buy Cash Warehouse; National Healthcare Waste Facility; Emandla Solar Photovoltaic Plant; Nsoko Solar PV Project; Lavumisa Border Project.

Treat these as candidates requiring content validation, not automatically approved public case studies. The proposal mentions values of E967 million, E360 million and E500 million but does not map each value to a specific project in this instruction. Never associate a value with a project without an authoritative source and explicit approval.

## Content structure
A good case study should answer:
1. What was the project and where was it?
2. What challenge or need did it address?
3. What was SES's precise role and scope?
4. Which disciplines or services were involved?
5. What evidence can be published?
6. What image or document permissions exist?

Avoid unsupported claims about results, budgets, dates, client endorsement or SES's role. Keep technical language accurate; do not rewrite contract types or professional credentials casually.

## Deliverables
Create a content inventory, project data schema, page content drafts, image/permission checklist, missing-facts register and approval workflow. Clearly mark draft content that needs SES approval.

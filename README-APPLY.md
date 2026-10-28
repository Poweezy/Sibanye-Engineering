# Sibanye Engineering security hardening files

This package contains replacement files for the repository `Poweezy/Sibanye-Engineering`.

## Included
- `public/api/enquiry.php` — atomic file-based rate limiting and mail diagnostics.
- `public/.htaccess` — enforced Content Security Policy.
- `docs/HANDOVER.md` — updated deployment and live verification instructions.
- `docs/SECURITY-MAIL-RELEASE-CHECKLIST.md` — focused release checklist.

## Apply locally
1. Back up the four existing paths above.
2. Copy these files into the matching paths in your local repository.
3. Run `npm test`.
4. Review the generated site in a browser and inspect the console for CSP violations.
5. Commit on a feature branch and open a pull request.
6. Do not deploy until the live mail and hosting checks in the runbook pass.

The connected GitHub integration rejected branch creation with HTTP 403, so these changes could not be committed directly to GitHub from this session. This package contains the proposed replacement files; it has not been built or tested on Afrihost in this session.

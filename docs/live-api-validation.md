# Live FirstSpirit REST API Validation Runbook

Manual procedure to validate the resource-locator load-options against a real FirstSpirit REST server. Not wired into CI.

## Setup

1. Build the node (`npm run build`) and have it loaded in an n8n instance (see `docs/smoke-tests.md`).
2. Use a non-production FS server and credentials.
3. Use a test project with pages, bodies, sections, templates, scripts, and media.
4. Import `docs/fixtures/live-api-validation-workflow.json` into n8n.

## Per-Locator Validation Blocks

Run each block, then fill in the Findings table at the bottom of this document.

Locators to validate:

- `searchProjects`
- `searchPages`
- `searchPageReferences`
- `searchMedia`
- `searchScripts`
- `searchBodies`
- `searchSections`
- `searchSectionTemplates`
- `searchPageTemplates`

For each locator:

- [ ] **Empty state** — open the locator without a filter; at least one entry appears.
- [ ] **Filter works** — typing narrows the list.
- [ ] **Format parsing** — open the browser DevTools network tab while opening the locator; confirm the response is either an array or wraps the array in `items`, `data`, `projects`, or `results`. If a new wrapper appears, extend `asArray` in `methods/loadOptions.ts`.
- [ ] **Missing upstream parameter** — for dependent locators (Body without Page, Section without Body, etc.) confirm a readable error appears instead of an empty list crash.
- [ ] **Value identity** — pick an entry, save the workflow, reopen; the stored value is the expected identifier (UID preferred, ID fallback).

## Findings Table

| Locator | Status | Wrapper key observed | Notes |
| --- | --- | --- | --- |
| searchProjects |  |  |  |
| searchPages |  |  |  |
| searchPageReferences |  |  |  |
| searchMedia |  |  |  |
| searchScripts |  |  |  |
| searchBodies |  |  |  |
| searchSections |  |  |  |
| searchSectionTemplates |  |  |  |
| searchPageTemplates |  |  |  |

Status values: `OK`, `Issue`, `Bug`.

Copy this table into the PR body when submitting the batch.

## Triage

- Locator returns 0 entries while the API has data → wrapper key missing; extend `asArray`.
- 401/403 → credentials misconfigured.
- 500 → upstream backend issue; file in `fs-rest-webapp` and mark the locator as skipped here with the issue link.

## Bruno Cross-Check (Optional)

The `bruno/` collection inside `fs-rest-webapp/` can hit the same endpoints directly to separate node-side parsing issues from backend issues.

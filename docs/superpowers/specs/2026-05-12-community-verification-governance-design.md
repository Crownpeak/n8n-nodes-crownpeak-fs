# Community Verification, Documentation, and Agent Governance Design

## Status

Approved for specification on 2026-05-12.

## Goal

Prepare `n8n-nodes-crownpeak-fs` for a verified-community-node readiness track while giving human contributors and AI agents clear, project-specific collaboration rules.

## Context

The package is already a working n8n community node candidate:

- The package name starts with `n8n-nodes-`.
- `package.json` includes the `n8n-community-node-package` keyword.
- `package.json` includes an `n8n` section listing the node and credential files.
- The current local baseline passes `npm test`, `npm run lint`, and `npm run build`.
- The repository has a single committed feature history and currently lacks `.github` workflows, pull request templates, contributor rules, and AI-agent instructions.

The current verification blockers are governance and architecture related:

- The node imports `form-data`, which is an external runtime dependency.
- The upload operation imports `node:fs` and reads from a local file path.
- The credential type has an empty `documentationUrl`.
- The current README is useful, but it is not yet structured as complete user, maintainer, and AI-readable documentation.
- There is no CI workflow or npm provenance publishing workflow.
- There are no repository-specific agent rules.

Relevant n8n guidance:

- Verification guidelines: https://docs.n8n.io/integrations/creating-nodes/build/reference/verification-guidelines/
- UX guidelines: https://docs.n8n.io/integrations/creating-nodes/build/reference/ux-guidelines/
- Node linter: https://docs.n8n.io/integrations/creating-nodes/test/node-linter/
- n8n-node tool: https://docs.n8n.io/integrations/creating-nodes/build/n8n-node/

## Shared Architecture Contract

This spec and the UX feature spec both use the same default: verified-compatible by design.

All new or changed behavior must preserve these constraints:

- No runtime dependencies in the published node package unless n8n verification guidance changes.
- No direct environment-variable access in node runtime code.
- No direct filesystem access in node runtime code.
- User-facing text must be English.
- Documentation, examples, PR templates, and agent rules must be English.
- Uploads must use n8n binary data, not local file paths.
- GitHub Actions must be the release path for npm packages intended for verification.
- npm publishing must be prepared for provenance.

## Scope

### Verification Readiness

Create a verification readiness checklist that maps this package against n8n expectations:

- Package naming and keywords.
- Public repository URL and npm metadata.
- MIT license.
- Required `n8n` package metadata.
- No runtime dependencies.
- No filesystem or environment-variable access in node runtime code.
- English-only user-facing strings.
- Passing lint, test, and build.
- GitHub Actions based publishing with npm provenance.
- Documentation coverage.
- Known external prerequisites, including FirstSpirit REST module availability.

### Documentation

Expand documentation into a layered structure:

- `README.md`: concise package overview, installation, quick start, supported resources, local testing, and links to deeper docs.
- `docs/development.md`: local setup, n8n local testing with `npx n8n`, build/test/lint commands, branch workflow, and troubleshooting.
- `docs/community-verification.md`: verification checklist, current status, and release prerequisites.
- `docs/ai-agent-guide.md`: AI-readable operation map, project constraints, file ownership guidance, testing expectations, and known API assumptions.

The credential `documentationUrl` should point to a stable documentation location. Until public hosted docs exist, it should point to a repository documentation path that is valid after publication.

### GitHub Collaboration Rules

Add repository collaboration scaffolding:

- `.github/workflows/ci.yml`
- `.github/workflows/publish.yml`
- `.github/pull_request_template.md`
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/feature_request.yml`

The CI workflow must run at least:

- `npm ci`
- `npm run lint`
- `npm test`
- `npm run build`

The publish workflow must be prepared for npm trusted publishing and provenance. It should not publish on arbitrary pull requests.

The pull request template must require:

- Summary.
- Verification commands and results.
- Documentation impact.
- Breaking-change or workflow-migration notes.
- Confirmation that user-facing text is English.
- Confirmation that no direct filesystem or environment-variable runtime access was added.
- Confirmation that no runtime dependency was added without explicit review.

### AI-Agent Rules

Add `AGENTS.md` at the repository root with instructions tailored to this project.

The rules must include:

- Work on a branch, never directly on `main`.
- Keep changes small enough for review.
- Do not bypass CI, tests, or review.
- Do not revert unrelated user or teammate changes.
- Preserve n8n community-node constraints.
- Keep all user-facing text in English.
- Prefer n8n helpers and node UI patterns over ad hoc code.
- Use resource locators and load options for selectable external resources.
- Use n8n binary data for uploads.
- Do not add runtime dependencies without an explicit verification impact note.
- Update docs and tests with behavior changes.

Optional mirrored short-form rule files can be added only if the team actively uses the corresponding agent ecosystem. The canonical source should remain `AGENTS.md`.

## Non-Goals

- Implement resource locators or operation UX changes. Those belong to the UX feature spec.
- Submit the node to the n8n Creator Portal.
- Publish the npm package.
- Guarantee n8n verification approval.
- Replace the FirstSpirit REST module or document private Crownpeak installation steps beyond what is safe to publish.

## Architecture

The governance work should not change node behavior except for documentation metadata such as `documentationUrl`.

The repository will become structured around three contributor audiences:

- End users who install and configure the node.
- Maintainers who build, test, review, and release the package.
- AI agents that need explicit project constraints before editing code.

CI becomes the shared enforcement layer. Human review remains the release gate.

## Data Flow

This spec does not change runtime data flow.

Release data flow should become:

1. Contributor opens a branch.
2. Contributor opens a pull request.
3. GitHub Actions runs lint, tests, and build.
4. Review confirms verification constraints and docs.
5. Maintainer merges.
6. Release workflow publishes from GitHub Actions with npm provenance when enabled.

## Error Handling

CI and documentation should make failure states explicit:

- Lint failures block pull requests.
- Test failures block pull requests.
- Build failures block pull requests.
- Publish workflow failures must not hide npm or provenance errors.
- Documentation must include troubleshooting for node discovery in local n8n, credential failures, base URL mistakes, and FirstSpirit REST accessibility.

## Testing Strategy

Add or preserve automated checks that prove:

- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes.
- CI uses `npm ci` rather than `npm install`.
- Package metadata still includes required n8n community-node fields.

Documentation-only changes do not need unit tests, but CI must still run.

## Risks

- n8n verification rules can change. Mitigation: link to official docs and keep `docs/community-verification.md` current.
- npm trusted publishing requires repository and npm account configuration outside the codebase. Mitigation: document manual setup clearly.
- FirstSpirit REST module availability may be private. Mitigation: document public prerequisites without exposing private distribution details.
- Agent rules can become stale. Mitigation: keep `AGENTS.md` short, project-specific, and reviewed with behavior changes.

## Deliverables

- `docs/community-verification.md`
- `docs/development.md`
- `docs/ai-agent-guide.md`
- `AGENTS.md`
- `.github/workflows/ci.yml`
- `.github/workflows/publish.yml`
- `.github/pull_request_template.md`
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/feature_request.yml`
- Updated `README.md`
- Updated credential `documentationUrl`

## Acceptance Criteria

- A new contributor can set up, test, and run the node locally using only repository docs.
- A reviewer can use the pull request template to identify verification-relevant changes.
- An AI agent can read `AGENTS.md` and avoid the main project hazards.
- CI validates lint, tests, and build on pull requests.
- The repository contains a clear checklist showing what is ready for n8n verification and what still depends on external setup.
- No new runtime dependency, filesystem access, or environment-variable access is introduced by this governance track.

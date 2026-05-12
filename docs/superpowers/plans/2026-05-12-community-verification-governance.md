# Community Verification, Documentation, and Agent Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare the repository for a verified-community-node readiness track with CI, documentation, release scaffolding, and project-specific human and AI contributor rules.

**Architecture:** This plan adds governance and documentation without changing node runtime behavior except for the credential documentation URL. CI becomes the enforcement layer, while `AGENTS.md` and the docs describe the project constraints that humans and AI agents must follow.

**Tech Stack:** TypeScript, Jest, ESLint, npm, n8n community node package metadata, GitHub Actions, Markdown.

---

## File Structure

- Create: `AGENTS.md` for canonical AI-agent and contributor rules.
- Create: `docs/community-verification.md` for n8n verification readiness tracking.
- Create: `docs/development.md` for local development and local n8n testing.
- Create: `docs/ai-agent-guide.md` for AI-readable node constraints and operation context.
- Create: `tests/packageMetadata.test.ts` for package-level community-node metadata checks.
- Create: `.github/workflows/ci.yml` for pull request and branch validation.
- Create: `.github/workflows/publish.yml` for npm trusted publishing with provenance.
- Create: `.github/pull_request_template.md` for review discipline.
- Create: `.github/ISSUE_TEMPLATE/bug_report.yml` for bug reports.
- Create: `.github/ISSUE_TEMPLATE/feature_request.yml` for feature requests.
- Modify: `README.md` to become the main user entry point and link deeper docs.
- Modify: `nodes/CrownpeakFS/credentials/CrownpeakFSApi.credentials.ts` to set a real `documentationUrl`.
- Modify: `package.json` only if scripts need small additions for validation.

## Task 1: Add Package Metadata Verification Tests

**Files:**
- Create: `tests/packageMetadata.test.ts`
- Modify: none

- [ ] **Step 1: Write the failing test**

Create `tests/packageMetadata.test.ts`:

```ts
import packageJson from '../package.json';

describe('package metadata', () => {
	it('uses the expected n8n community node package metadata', () => {
		expect(packageJson.name).toMatch(/^(@[^/]+\/)?n8n-nodes-/);
		expect(packageJson.keywords).toContain('n8n-community-node-package');
		expect(packageJson.license).toBe('MIT');
		expect(packageJson.n8n).toBeDefined();
		expect(packageJson.n8n.n8nNodesApiVersion).toBe(1);
		expect(packageJson.n8n.nodes).toEqual(
			expect.arrayContaining(['dist/nodes/CrownpeakFS/CrownpeakFS.node.js']),
		);
		expect(packageJson.n8n.credentials).toEqual(
			expect.arrayContaining([
				'dist/nodes/CrownpeakFS/credentials/CrownpeakFSApi.credentials',
			]),
		);
	});

	it('does not declare runtime dependencies for verified-community readiness', () => {
		expect(packageJson.dependencies ?? {}).toEqual({});
	});

	it('declares n8n-workflow as a peer dependency', () => {
		expect(packageJson.peerDependencies).toHaveProperty('n8n-workflow');
	});
});
```

- [ ] **Step 2: Run the targeted test**

Run: `npm test -- tests/packageMetadata.test.ts`

Expected: PASS. If TypeScript rejects JSON imports, adjust `tsconfig.json` with `"resolveJsonModule": true` and rerun.

- [ ] **Step 3: Run all tests**

Run: `npm test`

Expected: both test suites pass.

- [ ] **Step 4: Commit**

```bash
git add tests/packageMetadata.test.ts tsconfig.json
git commit -m "test: verify community node package metadata"
```

## Task 2: Add Canonical AI-Agent Rules

**Files:**
- Create: `AGENTS.md`
- Create: `docs/ai-agent-guide.md`

- [ ] **Step 1: Create `AGENTS.md`**

Use this content:

```md
# Agent Instructions

These rules apply to all AI agents and automated contributors working in this repository.

## Project

This repository contains the `n8n-nodes-crownpeak-fs` community node package for the Crownpeak FirstSpirit REST API.

## Working Rules

- Work on a branch. Do not commit directly to `main`.
- Keep changes small enough for review.
- Do not revert unrelated user, teammate, or generated changes.
- Run the relevant verification commands before claiming work is complete.
- Keep user-facing text, docs, PRs, commit messages, and examples in English.
- Update tests and docs when behavior changes.

## n8n Community Node Constraints

- Preserve the package name prefix `n8n-nodes-`.
- Preserve the `n8n-community-node-package` keyword.
- Do not add runtime dependencies without an explicit verification impact note.
- Do not read local files from node runtime code.
- Do not read environment variables from node runtime code.
- Use n8n binary data for uploads.
- Prefer n8n resource locators, load options, and standard node UI patterns over raw text fields.
- Keep manual ID or name fallbacks for expressions and advanced workflows.

## Review Expectations

- Pull requests must describe the change, verification commands, documentation impact, and migration impact.
- CI must pass before merge.
- A reviewer must approve behavior changes before merge.
- Publishing must happen through the configured GitHub Actions release path.
```

- [ ] **Step 2: Create `docs/ai-agent-guide.md`**

Use this content:

```md
# AI Agent Guide

This guide gives AI agents project-specific context for `n8n-nodes-crownpeak-fs`.

## Product Context

The node integrates n8n with the Crownpeak FirstSpirit REST API. It supports projects, search, media, page references, templates, pages, scripts, and binary media data.

## Design Direction

The package should be verified-community-node compatible by default:

- no runtime dependencies,
- no direct filesystem access in runtime node code,
- no direct environment-variable access in runtime node code,
- English-only user-facing text,
- n8n binary data for uploads,
- resource locators for selectable FirstSpirit resources.

## Important Files

- `nodes/CrownpeakFS/CrownpeakFS.node.ts`: node class, properties, and operation execution.
- `nodes/CrownpeakFS/credentials/CrownpeakFSApi.credentials.ts`: credential fields for username, password, and base URL.
- `tests/CrownpeakFS.test.ts`: node metadata and operation registration tests.
- `package.json`: n8n package metadata.
- `README.md`: primary user documentation.

## Safe Implementation Pattern

1. Add or update tests first.
2. Implement the smallest behavior change that passes the tests.
3. Run `npm run lint`, `npm test`, and `npm run build`.
4. Update documentation.
5. Commit only related files.

## Runtime Constraints

Do not use `node:fs`, `fs`, `path` for file uploads, or local file paths in node runtime behavior. Use n8n binary helpers instead.

Do not add packages to `dependencies`. Development tooling belongs in `devDependencies`.

Do not make FirstSpirit REST API assumptions without documenting the endpoint and fallback behavior.
```

- [ ] **Step 3: Review the files**

Run: `rg -n "FIXME|XXX|German|Deutsch" AGENTS.md docs/ai-agent-guide.md`

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md docs/ai-agent-guide.md
git commit -m "docs: add repository agent rules"
```

## Task 3: Add Development and Verification Documentation

**Files:**
- Create: `docs/development.md`
- Create: `docs/community-verification.md`
- Modify: `README.md`

- [ ] **Step 1: Create `docs/development.md`**

Include these sections in English:

```md
# Development

## Requirements

- Node.js 20.15 or newer
- npm
- A local n8n instance for manual testing
- Access to a FirstSpirit REST API instance for end-to-end API testing

## Install

```sh
npm ci
```

## Verify

```sh
npm run lint
npm test
npm run build
```

## Run Locally in n8n

Build and link the node package:

```sh
npm run build
npm link
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm init -y
npm link n8n-nodes-crownpeak-fs
npx n8n
```

Open `http://localhost:5678` and search for `FirstSpirit REST API`.

## Development Workflow

1. Create a branch.
2. Add or update tests.
3. Implement the change.
4. Run lint, tests, and build.
5. Update docs.
6. Open a pull request.

## Troubleshooting

If the node does not appear in n8n, rebuild the package and restart n8n. If credentials fail, check the FirstSpirit REST base URL, username, password, and server reachability from the n8n process.
```

- [ ] **Step 2: Create `docs/community-verification.md`**

Include these sections in English:

```md
# Community Verification Readiness

This document tracks readiness for n8n verified community node review.

## Current Status

The package is a community node candidate. Verification readiness is blocked until runtime filesystem upload behavior is replaced with n8n binary data and the release path uses GitHub Actions with npm provenance.

## Checklist

- Package name starts with `n8n-nodes-`.
- Package includes the `n8n-community-node-package` keyword.
- Package license is MIT.
- Package metadata includes the `n8n` node and credential entries.
- Repository URL points to the public GitHub repository.
- CI runs lint, tests, and build.
- Published package has no runtime dependencies.
- Runtime node code does not read from the local filesystem.
- Runtime node code does not read environment variables.
- User-facing text is English.
- Documentation covers installation, credentials, local testing, examples, troubleshooting, and compatibility.
- npm publishing happens through GitHub Actions with provenance.

## External Release Requirements

The npm package owner must configure trusted publishing for this repository. A maintainer must submit the package through the n8n Creator Portal when all repository checks pass.

## Known Verification Risks

- The current file-path media upload must be replaced with n8n binary data.
- The FirstSpirit REST module is evolving, so API response assumptions must stay documented and tested.
```

- [ ] **Step 3: Update `README.md`**

Restructure the README so the first half contains:

```md
# n8n-nodes-crownpeak-fs

FirstSpirit REST API nodes for n8n.

## What You Can Do

- List and get FirstSpirit projects.
- Search content in a project.
- Work with media, pages, page references, templates, scripts, and page form data.
- Chain FirstSpirit operations in n8n workflows.

## Installation

## Credentials

## Supported Resources and Operations

## Local Development

## Documentation

- [Development](./docs/development.md)
- [Community Verification Readiness](./docs/community-verification.md)
- [AI Agent Guide](./docs/ai-agent-guide.md)
```

Keep the existing endpoint table, but move prototype and production-risk notes above the endpoint details so users see them early.

- [ ] **Step 4: Run Markdown and repository checks**

Run: `rg -n "FIXME|XXX|Deutsch|German" README.md docs`

Expected: no output.

Run: `npm test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add README.md docs/development.md docs/community-verification.md
git commit -m "docs: expand development and verification documentation"
```

## Task 4: Add GitHub Pull Request and Issue Templates

**Files:**
- Create: `.github/pull_request_template.md`
- Create: `.github/ISSUE_TEMPLATE/bug_report.yml`
- Create: `.github/ISSUE_TEMPLATE/feature_request.yml`

- [ ] **Step 1: Create `.github/pull_request_template.md`**

Use this content:

```md
## Summary

Describe the change and why it is needed.

## Verification

- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`

## Documentation

- [ ] User-facing documentation updated
- [ ] No documentation change needed

## n8n Community Node Review

- [ ] User-facing text is English
- [ ] No runtime dependency added
- [ ] No runtime filesystem access added
- [ ] No runtime environment-variable access added
- [ ] Binary uploads use n8n binary data
- [ ] Migration impact documented

## Notes for Reviewers

Call out risky areas, API assumptions, or follow-up work.
```

- [ ] **Step 2: Create `.github/ISSUE_TEMPLATE/bug_report.yml`**

Use this content:

```yaml
name: Bug report
description: Report a problem with the FirstSpirit REST API n8n node
title: "[Bug]: "
labels: ["bug"]
body:
  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: Describe what went wrong.
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      description: List the workflow steps and node settings needed to reproduce the issue.
    validations:
      required: true
  - type: input
    id: n8n-version
    attributes:
      label: n8n version
    validations:
      required: true
  - type: input
    id: package-version
    attributes:
      label: Node package version
    validations:
      required: true
  - type: textarea
    id: logs
    attributes:
      label: Error output
      description: Paste relevant n8n error output with secrets removed.
      render: shell
```

- [ ] **Step 3: Create `.github/ISSUE_TEMPLATE/feature_request.yml`**

Use this content:

```yaml
name: Feature request
description: Suggest an improvement for the FirstSpirit REST API n8n node
title: "[Feature]: "
labels: ["enhancement"]
body:
  - type: textarea
    id: use-case
    attributes:
      label: Use case
      description: Describe the workflow this feature should support.
    validations:
      required: true
  - type: textarea
    id: proposed-behavior
    attributes:
      label: Proposed behavior
      description: Describe the desired n8n user experience.
    validations:
      required: true
  - type: textarea
    id: api-reference
    attributes:
      label: FirstSpirit REST API reference
      description: Link or describe the API endpoint if known.
```

- [ ] **Step 4: Commit**

```bash
git add .github/pull_request_template.md .github/ISSUE_TEMPLATE/bug_report.yml .github/ISSUE_TEMPLATE/feature_request.yml
git commit -m "docs: add issue and pull request templates"
```

## Task 5: Add CI and Publish Workflows

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/publish.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

Use this content:

```yaml
name: CI

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  verify:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

- [ ] **Step 2: Create `.github/workflows/publish.yml`**

Use this content:

```yaml
name: Publish

on:
  release:
    types:
      - published

permissions:
  contents: read
  id-token: write

jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Verify
        run: |
          npm run lint
          npm test
          npm run build

      - name: Publish to npm
        run: npm publish --provenance --access public
```

- [ ] **Step 3: Document npm trusted publishing**

Add this paragraph to `docs/community-verification.md`:

```md
## npm Trusted Publishing Setup

Before using `publish.yml`, configure npm trusted publishing for this GitHub repository and the workflow file named `publish.yml`. The workflow uses `id-token: write` and `npm publish --provenance --access public`.
```

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml .github/workflows/publish.yml docs/community-verification.md
git commit -m "ci: add verification and npm publish workflows"
```

## Task 6: Wire Credential Documentation URL

**Files:**
- Modify: `nodes/CrownpeakFS/credentials/CrownpeakFSApi.credentials.ts`
- Modify: `tests/CrownpeakFS.test.ts`

- [ ] **Step 1: Add a credential documentation test**

Add this test to `tests/CrownpeakFS.test.ts`:

```ts
import { CrownpeakFSApi } from '../nodes/CrownpeakFS/credentials/CrownpeakFSApi.credentials';
```

Add inside the describe block:

```ts
it('should define credential documentation URL', () => {
	const credentials = new CrownpeakFSApi();

	expect(credentials.documentationUrl).toBe(
		'https://github.com/Crownpeak/n8n-nodes-crownpeak-fs#credentials',
	);
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npm test -- tests/CrownpeakFS.test.ts`

Expected: FAIL because `documentationUrl` is currently an empty string.

- [ ] **Step 3: Set the documentation URL**

Change `nodes/CrownpeakFS/credentials/CrownpeakFSApi.credentials.ts`:

```ts
documentationUrl = 'https://github.com/Crownpeak/n8n-nodes-crownpeak-fs#credentials';
```

- [ ] **Step 4: Run verification**

Run: `npm test -- tests/CrownpeakFS.test.ts`

Expected: PASS.

Run: `npm run lint`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add nodes/CrownpeakFS/credentials/CrownpeakFSApi.credentials.ts tests/CrownpeakFS.test.ts
git commit -m "docs: link credential documentation"
```

## Task 7: Final Governance Verification

**Files:**
- Modify only if verification finds a concrete issue.

- [ ] **Step 1: Run full verification**

Run:

```bash
npm run lint
npm test
npm run build
rg -n "FIXME|XXX|Deutsch|German" README.md docs AGENTS.md .github
```

Expected:

- Lint passes.
- Tests pass.
- Build passes.
- `rg` returns no matches.

- [ ] **Step 2: Inspect changed files**

Run: `git status --short`

Expected: clean after all task commits.

Run: `git log --oneline -6`

Expected: recent commits correspond to the governance tasks.

- [ ] **Step 3: Prepare pull request summary**

Use this PR summary:

```md
## Summary

Adds the documentation, CI, release scaffolding, and contributor rules needed for the verified-community-node readiness track.

## Verification

- `npm run lint`
- `npm test`
- `npm run build`

## Notes

Runtime filesystem upload behavior remains a known verification blocker and is addressed by the UX feature upgrade plan.
```

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
- Commit feature-complete units only. Do not produce per-task or per-file commits during multi-step implementations; stage changes and commit at logical milestone groupings (feat, docs, test). This overrides any plan step that says "commit after each step".

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

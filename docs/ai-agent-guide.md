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

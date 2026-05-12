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

## npm Trusted Publishing Setup

Before using `publish.yml`, configure npm trusted publishing for this GitHub repository and the workflow file named `publish.yml`. The workflow uses `id-token: write` and `npm publish --provenance --access public`.

## External Release Requirements

The npm package owner must configure trusted publishing for this repository. A maintainer must submit the package through the n8n Creator Portal when all repository checks pass.

## Known Verification Risks

- The current file-path media upload must be replaced with n8n binary data.
- The FirstSpirit REST module is evolving, so API response assumptions must stay documented and tested.

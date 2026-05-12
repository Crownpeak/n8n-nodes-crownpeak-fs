# n8n-nodes-crownpeak-fs

FirstSpirit REST API nodes for n8n.

This package provides a community node for automating Crownpeak FirstSpirit REST API workflows in n8n. It supports project discovery, search, media operations, page references, templates, pages, scripts, and page form data.

> Important: The FirstSpirit REST module described here is a prototype and is under active development. APIs and compatibility can change. Do not use this package in production environments without validating it against your FirstSpirit version and workflow requirements.

## What You Can Do

- List and get FirstSpirit projects.
- Search content in a project.
- Work with media, pages, page references, templates, scripts, and page form data.
- Upload and download media data.
- Chain FirstSpirit operations in n8n workflows.

## Installation

For local development and testing, clone the repository and build the package:

```sh
git clone https://github.com/Crownpeak/n8n-nodes-crownpeak-fs.git
cd n8n-nodes-crownpeak-fs
npm ci
npm run build
```

To run it in a local n8n instance:

```sh
npm link
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm init -y
npm link n8n-nodes-crownpeak-fs
npx n8n
```

Open `http://localhost:5678` and search for `FirstSpirit REST API`.

## Credentials

Create FirstSpirit REST API credentials in n8n with:

- **Username**: FirstSpirit user name for basic authentication
- **Password**: FirstSpirit password
- **Base URL**: Base URL of the FirstSpirit REST API, for example `https://firstspirit.example.com`

The FirstSpirit server must be reachable from the n8n process. For local testing, this can require VPN access, network routing, or a tunnel depending on your environment.

## Migration: Typed Body Fields

Earlier versions exposed a single `Content` JSON field on the Create, Update, Add, and Execute operations. That field is now replaced with typed inputs (UID, Filename, Template UID, etc.). An optional `Additional Properties` JSON field is available on most Create operations as a forward-compatible escape hatch — keys defined as typed fields always win on collision.

To migrate a workflow built against an older version:

1. Open the workflow node.
2. Copy the values from the old `Content` JSON into the new typed fields.
3. Place any remaining keys into `Additional Properties`.

## Resource Selection

Where the FirstSpirit REST API exposes list or search endpoints, the node lets you select resources from n8n resource locators. Each locator keeps a manual ID or name mode for expressions and advanced workflows.

## Media Uploads

Media uploads use n8n binary input data. Provide an incoming binary property, then set `Binary Property` to that property name. Local file path uploads are not supported because verified community nodes must not read files from the n8n host filesystem.

## Prerequisites

- FirstSpirit 2025.7 or higher
- Standalone Apache Tomcat application server
- FirstSpirit REST module
- Network access from n8n to the FirstSpirit REST endpoint

The FirstSpirit REST module may require access to the Crownpeak download portal. Contact Crownpeak support or your Customer Success Manager if you do not have access.

## Supported Resources and Operations

| Resource | Operations |
| --- | --- |
| Project | List, Get |
| Search | Search |
| Media | Get, Create, Upload Binary Data, Get Binary Data |
| Page Reference | List, Create, Get |
| Template | List Section Templates, Create Section Template, List Page Templates, Create Page Template |
| Page | List, Create, Get, Add Section, Execute Actions, Get/Update Form Inputs, Get Bodies |
| Script | List, Execute |

## Endpoint Coverage

| Feature | Method | Endpoint |
| --- | --- | --- |
| List Projects | `GET` | `/v1/projects/` |
| Get Project | `GET` | `/v1/projects/{id}` |
| Search in Project | `GET` | `/v1/projects/{projectId}/search` |
| Create Medium | `POST` | `/v1/projects/{projectId}/media` |
| Get Medium | `GET` | `/v1/projects/{projectId}/media/{mediumUid}` |
| Get Binary Data | `GET` | `/v1/projects/{projectId}/media/{mediumUid}/data` |
| Upload Binary Data | `PUT` | `/v1/projects/{projectId}/media/{mediumUid}/data` |
| List Page References | `GET` | `/v1/projects/{projectId}/page-references/` |
| Create Page Reference | `POST` | `/v1/projects/{projectId}/page-references/` |
| Get Page Reference | `GET` | `/v1/projects/{projectId}/page-references/{pageReferenceUid}` |
| List Section Templates | `GET` | `/v1/projects/{projectId}/templates/section-templates` |
| Create Section Template | `POST` | `/v1/projects/{projectId}/templates/section-templates` |
| List Page Templates | `GET` | `/v1/projects/{projectId}/templates/page-templates` |
| Create Page Template | `POST` | `/v1/projects/{projectId}/templates/page-templates` |
| List Pages | `GET` | `/v1/projects/{projectId}/pages/` |
| Create Page | `POST` | `/v1/projects/{projectId}/pages/` |
| Get Page | `GET` | `/v1/projects/{projectId}/pages/{pageUid}` |
| Add Section | `PUT` | `/v1/projects/{projectId}/pages/{pageUid}/bodies/{bodyName}/sections/{sectionName}` |
| Execute Page Actions | `POST` | `/v1/projects/{projectId}/pages/{pageUid}/actions` |
| Get Page Form Input | `GET` | `/v1/projects/{projectId}/pages/{pageUid}/form/{editorName}` |
| Update Page Form Input | `PATCH` | `/v1/projects/{projectId}/pages/{pageUid}/form/{editorName}` |
| Get Page Form Inputs | `GET` | `/v1/projects/{projectId}/pages/{pageUid}/form` |
| Get Page Bodies | `GET` | `/v1/projects/{projectId}/pages/{pageUid}/bodies` |
| Get Page Body | `GET` | `/v1/projects/{projectId}/pages/{pageUid}/bodies/{bodyName}` |
| Get Section Form Input | `GET` | `/v1/projects/{projectId}/pages/{pageUid}/bodies/{bodyName}/sections/{sectionName}/form/{editorName}` |
| Update Section Form Input | `PATCH` | `/v1/projects/{projectId}/pages/{pageUid}/bodies/{bodyName}/sections/{sectionName}/form/{editorName}` |
| Get Section Form Inputs | `GET` | `/v1/projects/{projectId}/pages/{pageUid}/bodies/{bodyName}/sections/{sectionName}/form` |
| List Scripts | `GET` | `/v1/projects/{projectId}/scripts/` |
| Execute Script | `POST` | `/v1/projects/{projectId}/scripts/{scriptName}/execute` |

## Local Development

```sh
npm ci
npm run lint
npm test
npm run build
```

See [Development](./docs/development.md) for local n8n testing and troubleshooting.

## Documentation

- [Development](./docs/development.md)
- [Community Verification Readiness](./docs/community-verification.md)
- [AI Agent Guide](./docs/ai-agent-guide.md)
- [Community Verification and Governance Design](./docs/superpowers/specs/2026-05-12-community-verification-governance-design.md)
- [Node UX Feature Upgrade Design](./docs/superpowers/specs/2026-05-12-node-ux-feature-upgrade-design.md)

## Support

For package issues, use GitHub Issues. For Crownpeak or FirstSpirit platform questions, contact your Customer Success Manager or Crownpeak support.

## License

MIT

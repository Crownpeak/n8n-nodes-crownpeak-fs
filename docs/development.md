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

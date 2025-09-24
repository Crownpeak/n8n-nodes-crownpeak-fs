<a href="http://www.crownpeak.com" target="_blank">
  <img src="./images/logo/crownpeak-logo.png" alt="Crownpeak Logo" title="Crownpeak Logo" />
</a>

# n8n-nodes-crownpeak-fs

## Overview

This repository provides a custom n8n integration node for the FirstSpirit REST API. It enables direct access to FirstSpirit operations such as media, page reference, template, page and script configuration within a n8n workflow.

## What is it?

A n8n node module designed to simplify integration with Crownpeak FirstSpirit REST API using basic auth credential management. It supports:

- Authentication using username/password
- Manage media
- Manage pages and page references
- Manage templates and scripts
- Chain operations using dynamic expressions for automated content data pipelines

## What is it for?

This module is useful for organizations looking to build automated content pipelines into the FirstSpirit ecosystem.

---

## Supported Resources & Operations

| Resource       | Operations Supported            |
|----------------|---------------------------------|
| Media          | Get, Create, Upload                |
| Search         | Search                          |
| Page Reference | List, Create, Get               |
| Template       | List, Create                    |
| Page           | Add, Execute, Get, Create, List |
| Script         | List, Execute                   |
| Project        | List, Get                       |

| Feature                                        | Method | Endpoint                                                                                            | Description                                                      |
|------------------------------------------------|--------|-----------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| Get Binary Data                                | GET    | /v1/projects/{projectId}/media/{mediumUid}/data                                                     | Get binary data of a medium                                      |
| Upload Binary Data                             | PUT    | /v1/projects/{projectId}/media/{mediumUid}/data                                                     | Upload binary data to a medium                                   |
| Create Medium                                  | POST   | /v1/projects/{projectId}/media                                                                      | Create a new medium                                              |
| Get Medium                                     | GET    | /v1/projects/{projectId}/media/{mediumUid}                                                          | Get a medium by uid                                              |
| Search in Project                              | GET    | /v1/projects/{projectId}/search                                                                     | Search in FirstSpirit project                                    |
| List Page References                           | GET    | /v1/projects/{projectId}/page-references/                                                           | List all page references in a FirstSpirit project                |
| Create Page Reference                          | POST   | /v1/projects/{projectId}/page-references/                                                           | Create a new page reference for a page                           |
| Get Page Reference                             | GET    | /v1/projects/{projectId}/page-references/{pageReferenceUid}                                         | Get a page reference by uid                                      |
| List Section Templates                         | GET    | /v1/projects/{projectId}/templates/section-templates                                                | List all section templates in a FirstSpirit project              |
| Create Section Template                        | POST   | /v1/projects/{projectId}/templates/section-templates                                                | Create a new section template                                    |
| List Page Templates                            | GET    | /v1/projects/{projectId}/templates/page-templates                                                   | List all page templates in a FirstSpirit project                 |
| Create Page Template                           | POST   | /v1/projects/{projectId}/templates/page-templates                                                   | Create a new page template                                       |
| Add Section                                    | PUT    | /v1/projects/{projectId}/pages/{pageUid}/bodies/{bodyName}/sections/{sectionName}                   | Add a new section to a body                                      |
| Execute Actions                                | POST   | /v1/projects/{projectId}/pages/{pageUid}/actions                                                    | Execute actions on a FirstSpirit page                            |
| List Pages                                     | GET    | /v1/projects/{projectId}/pages/                                                                     | List all pages in a FirstSpirit project                          |
| Create Page                                    | POST   | /v1/projects/{projectId}/pages/                                                                     | Create a new page                                                |
| Get Input Element of Form                      | GET    | /v1/projects/{projectId}/pages/{pageUid}/form/{editorName}                                          | Get input element of a form and its contents                     |
| Update Input Element of Form                   | PATCH  | /v1/projects/{projectId}/pages/{pageUid}/form/{editorName}                                          | Update content of input element of a form                        |
| Get Input Element of Section Form              | GET    | /v1/projects/{projectId}/pages/{pageUid}/bodies/{bodyName}/sections/{sectionName}/form/{editorName} | Get input element of a section form and its contents             |
| Update Input Element of Section Form           | PATCH  | /v1/projects/{projectId}/pages/{pageUid}/bodies/{bodyName}/sections/{sectionName}/form/{editorName} | Update content of input element of a section form                |
| Get Page                                       | GET    | /v1/projects/{projectId}/pages/{pageUid}                                                            | Get a page by uid                                                |
| Get Input Element of Form for Page             | GET    | /v1/projects/{projectId}/pages/{pageUid}/form                                                       | Get input element of a form for a FirstSpirit page               |
| Get Bodies                                     | GET    | /v1/projects/{projectId}/pages/{pageUid}/bodies                                                     | Get bodies of a FirstSpirit page                                 |
| Get Body                                       | GET    | /v1/projects/{projectId}/pages/{pageUid}/bodies/{bodyName}                                          | Get body of a FirstSpirit page by name                           |
| Get Input Elements of Form for Section of Page | GET    | /v1/projects/{projectId}/pages/{pageUid}/bodies/{bodyName}/sections/{sectionName}/form              | Get input elements of a form for a section of a FirstSpirit page |
| Execute Script                                 | POST   | /v1/projects/{projectId}/scripts/{scriptName}/execute                                               | Execute script in a FirstSpirit project                          |
| List Scripts                                   | GET    | /v1/projects/{projectId}/scripts/                                                                   | List all scripts in a FirstSpirit project                        |
| List Projects                                  | GET    | /v1/projects/                                                                                       | List all projects on FirstSpirit server                          |
| Get project                                    | GET    | /v1/projects/{id}                                                                                   | Get FirstSpirit project by id                                    |

Each method supports query parameterization using dynamic expressions and authenticates using Basic Auth.

## Prerequisites

This n8n community node requires a running FirstSpirit server with the FirstSpirit REST API module installed and configured.
The FirstSpirit server must be exposed to n8n using a tool like `ngrok`.

See the README.md for further instructions.

## Installation & Usage

### As a Private Node

1. Clone this repository to your local machine:
   ```sh
   git clone https://github.com/Crownpeak/n8n-nodes-crownpeak-fs.git
   ```
2. Build the node module:
   ```sh
   cd n8n-nodes-crownpeak-fs
   npm install
   npm run build
   ```
3. Create a custom directory for files to use in the media endpoints. Mount it as a volume and start the n8n Docker container:
   ```sh
	 docker run -it --rm \
    --name n8n \
    -p 5678:5678 \
    -v n8n_data:/home/node/.n8n \
    -v ~/n8n_files:/home/node/n8n_files \
    docker.n8n.io/n8nio/n8n
	 ```
4. Copy the `dist/` folder to your n8n instance's custom nodes' directory:
   ```sh
   docker cp ./dist n8n:/home/node/.n8n/custom/nodes/crownpeak-fs
   ```
5. Restart your n8n Docker container:
   ```sh
   docker restart n8n
   ```
6. Log in to n8n and the node will appear as FirstSpirit REST API.

> ℹ️ If it doesn't appear, ensure you are mounting or copying to the correct container path and that `NODE_FUNCTION_ALLOW_EXTERNAL` is not overly restricted.

### As a Community Node (once approved)

Once this node is approved and published on the official [n8n integrations registry](https://n8n.io/integrations), installation will be as simple as:

```sh
n8n install n8n-nodes-crownpeak-fs
```

And in `n8n@1.100.0+` via the UI:

1. Open Settings → Community Nodes
2. Click Install a Community Node
3. Search or paste: `n8n-nodes-crownpeak-fs`
4. Click Install

---

## 📸 Screenshots

1. A basic workflow example using n8n Crownpeak FS Node
   ![A basic workflow example using n8n Crownpeak FS Node](./images/screenshots/basic-workflow-example-1.png 'A basic workflow example using n8n Crownpeak FS Node')

2. The result of `Create Page Template` request
   ![The result of `Create Page Template` request](./images/screenshots/basic-workflow-example-2.png 'The result of `Create Page Template request`')

---

## Credentials

This node supports authentication against the Crownpeak FirstSpirit REST API. You’ll need the following credentials:

- Username and Password
- Base URL of the FirstSpirit REST API

---

## Support

- This repository is maintained by Crownpeak and released under the MIT License.
- For Crownpeak platform questions, please contact your Customer Success Manager or [support@crownpeak.com](mailto:support@crownpeak.com).
- For n8n integration issues or pull requests, use GitHub Issues or Discussions.

## License

MIT © Crownpeak Technology, Inc.
See [LICENSE](./LICENSE) for details.

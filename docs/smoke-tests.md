# Pre-Submission UI Smoke Tests

Manual checklist a reviewer executes in a local n8n instance running the built node from `dist/`.

## Setup

1. Install prerequisites: Node 20+, n8n 1.x.
2. Have access to a FirstSpirit REST server. Either:
   - Your Cloud FirstSpirit instance (production credentials are forbidden), or
   - A local server started with `./gradlew bootRun` inside `fs-rest-webapp`.
3. Build the node:
   ```bash
   npm install
   npm run build
   ```
4. Start n8n with the custom node mounted:
   ```bash
   N8N_CUSTOM_EXTENSIONS=$(pwd) n8n start
   ```
5. In n8n, create FirstSpirit REST API credentials with Base URL, username, and password. Run "Test Connection".

For every operation below, each check must pass:

- **Label visible** — the shortened operation name appears in the dropdown.
- **Fields render correctly** — resource locators open in "From List" mode; required fields are marked; `Additional Properties` is collapsed.
- **Execution succeeds** — the workflow runs green and the output JSON matches the shape noted next to the check.

## Project

- [ ] Get Many — output is an array of project objects with at least `id` and `name`.
- [ ] Get — output is a single project object.
- [ ] Search — non-empty query returns an array.

## Page Reference

- [ ] Get Many — array.
- [ ] Create — provide UID, Page ID, Location. Output contains the new page reference's identifiers.
- [ ] Get — output is the created page reference.

## Page

- [ ] Get Many — array.
- [ ] Create — provide UID, pick Page Template from the locator. Output is the new page.
- [ ] Get — output is a page object.
- [ ] Get Bodies — output is an array of body objects.
- [ ] Get Body — output is one body object.
- [ ] Add Section to Body — section template picked from the locator. Output is the updated body.
- [ ] Execute Action — choose `Copy`. Output is the copy result.
- [ ] Execute Action — choose `Release`, expand Release Options (set Check Only=true). Output is a release report.
- [ ] Get Page Form — output describes the page form.
- [ ] Get Page Input Element — output is a single FormEditorDTO.
- [ ] Update Page Input Element — provide all typed fields, set Content to a valid value for the Editor Type. Output is the updated editor.
- [ ] Get Section Form — output describes the section form.
- [ ] Get Section Input Element — output is a FormEditorDTO.
- [ ] Update Section Input Element — same fields as above. Output is the updated editor.

## Media

- [ ] Create — provide UID, Filename, Type. Output contains the new medium.
- [ ] Upload Binary — chain after a Read Binary File node. Output confirms upload.
- [ ] Download Binary — output contains binary data.
- [ ] Get — output is the medium metadata.

## Template

- [ ] Get Many Page Templates — array.
- [ ] Create Page Template — provide UID, Name, optional Description, optionally one Body via the fixed collection. Output contains the new template.
- [ ] Get Many Section Templates — array.
- [ ] Create Section Template — provide UID, Name, optional Description. Output contains the new section template.

## Script

- [ ] Get Many — array.
- [ ] Execute — provide a Script (locator) and a `{}` (or script-specific) JSON. Output is the script result string.

## Regression Checks

- [ ] Binary Upload still works with an expression-driven `binaryPropertyName`.
- [ ] Every resource locator's "By UID" or "By ID" fallback works.
- [ ] Search pagination: Page Number / Page Size mode and Return All / Limit mode both work.

## Migration Note

Workflows from earlier versions that drove the unified `Content` field via expression will not open with the typed fields populated. To migrate:

1. Open the workflow.
2. Note the JSON object that was previously sent as `Content`.
3. Fill the typed fields (UID, etc.) from that object.
4. Paste any remaining keys into `Additional Properties`.

# n8n UX and Feature Upgrade Design

## Status

Approved for specification on 2026-05-12.

## Goal

Upgrade the FirstSpirit REST API node from a thin REST wrapper into a polished n8n integration with selectable resources, clear helper text, safer inputs, binary-data uploads, and automation-friendly fallbacks.

## Context

The current node exposes useful FirstSpirit REST operations, but the user experience is still close to the raw API:

- Users manually enter `Project ID`, `Page UID`, `Medium UID`, `Script Name`, `Body Name`, `Section Name`, and `Editor Name`.
- Most create and update operations use a single `Content` JSON field.
- Upload uses a local `File Path`, which is not compatible with verified-community-node constraints.
- Helper descriptions exist for some fields, but they are short and not consistently action-oriented.
- The execution code is one large switch in a single node file.
- There is a generated-looking `descriptions/CrownpeakFS.node.options.ts` file that is not currently the main source of node properties.

Relevant n8n guidance:

- UX guidelines: https://docs.n8n.io/integrations/creating-nodes/build/reference/ux-guidelines/
- Resource locator UI: https://docs.n8n.io/integrations/creating-nodes/build/reference/ui-elements/
- Error handling: https://docs.n8n.io/integrations/creating-nodes/build/reference/error-handling/
- Item linking: https://docs.n8n.io/integrations/creating-nodes/build/reference/item-linking/

## Shared Architecture Contract

This spec follows the same verified-compatible contract as the governance spec:

- Do not add runtime dependencies.
- Do not read local files from node runtime code.
- Use n8n binary data for uploads.
- Keep user-facing text in English.
- Prefer n8n UI components over raw text fields where the API supports discovery.
- Keep manual ID or name fallbacks for expressions and advanced workflows.

## Scope

### Resource Locators and Dynamic Selection

Add resource locators or dynamic options for selectable FirstSpirit resources.

Resource locators should use `From list` as the default when the API can list or search resources, and `By ID` or `By name` as a fallback.

Initial locator targets:

- Project: list projects through `GET /v1/projects/`.
- Page: list or search pages within a selected project.
- Page Reference: list page references within a selected project.
- Medium: use search or media lookup endpoints where available.
- Script: list scripts within a selected project.
- Page Template: list page templates within a selected project.
- Section Template: list section templates within a selected project.
- Body: list bodies for a selected page.
- Section: derive from page body data when the API response exposes sections.
- Editor/input component: derive from page or section form endpoints when available.

If an endpoint does not expose enough data to build a reliable selector, keep the text field and document why it remains manual.

### Dependent Selection Flow

Most operations should follow this selection flow:

1. Select credentials.
2. Select resource.
3. Select operation.
4. Select project.
5. Select the dependent resource, such as page, body, section, medium, script, or template.
6. Configure operation-specific fields.

Dependent selectors must read upstream values from the current node parameters. If an upstream value is missing, the selector should return a helpful empty-state option or throw a readable load-options error.

### Binary Upload

Replace local file-path upload with n8n binary input:

- Add a `Binary Property` parameter for upload operations.
- Read the binary property from the incoming item.
- Preserve file name and MIME type where n8n provides them.
- Send the binary buffer through the n8n helper request flow.
- Remove `node:fs`, `path`, and `form-data` usage from runtime code.

The existing file-path parameter should be removed or migrated behind a documented breaking-change note. For verified-compatible behavior, local file paths must not remain in runtime code.

### Parameter Design

Improve field design:

- Every parameter needs a useful English description.
- Operation names should follow n8n UX conventions.
- Prefer structured fields for common create and update operations when the request shape is known.
- Keep a `Raw JSON` advanced option for flexible API bodies.
- Add `Additional Fields` collections for optional parameters.
- Add `Return All` and `Limit` for list/search operations where pagination is supported.
- Keep page and page size only as advanced controls if the API requires explicit pagination.

### Operation Naming

Move toward consistent operation names:

- Use concise operation labels such as `Create`, `Get`, `Get Many`, `Update`, `Execute`, and `Upload`.
- Put resource context in the resource selector and action text.
- Keep existing operation values stable where possible to avoid breaking workflows.
- If an operation value must change, document the migration.

### Code Structure

Refactor toward smaller units while preserving existing behavior:

- `nodes/CrownpeakFS/CrownpeakFS.node.ts`: node class and high-level registration.
- `nodes/CrownpeakFS/descriptions/*.ts`: resource and operation properties.
- `nodes/CrownpeakFS/methods/loadOptions.ts`: dynamic selector methods.
- `nodes/CrownpeakFS/helpers/request.ts`: authenticated request helper.
- `nodes/CrownpeakFS/helpers/parameters.ts`: resource locator extraction helpers.
- `nodes/CrownpeakFS/helpers/binary.ts`: binary upload helpers.
- `nodes/CrownpeakFS/actions/*.ts`: operation handlers if the switch becomes too large.

The final file layout can be adjusted during implementation, but the design intent is to separate UI description, API requests, parameter parsing, binary handling, and operation routing.

## Data Flow

### Execution Flow

1. n8n provides input items and credentials.
2. The node reads resource and operation parameters.
3. Resource locator helpers resolve selected values to stable IDs, UIDs, or names.
4. Operation handler builds the endpoint path and request options.
5. Request helper sends an authenticated FirstSpirit REST request.
6. The node returns JSON response data or binary data while preserving item-level behavior.

### Load Options Flow

1. n8n calls a load-options method for a selector.
2. The method reads credentials and upstream node parameters.
3. The method calls the relevant FirstSpirit REST endpoint.
4. The method normalizes API data into `{ name, value }` options.
5. The method returns sorted, readable options.

### Binary Upload Flow

1. User selects the incoming binary property.
2. The operation reads the binary data from the current input item.
3. The helper builds a request body without reading from the local filesystem.
4. The upload endpoint receives the file data.
5. The node returns the API response as JSON.

## Error Handling

Errors should help users recover:

- Missing credentials: rely on n8n credential validation.
- Invalid base URL: surface a message that tells users to check the FirstSpirit REST base URL.
- Authentication failure: surface a message that points to username, password, and server access.
- Missing upstream selector value: explain which field must be selected first.
- Empty selector results: return an empty option list with a helpful description when possible.
- Missing binary property: explain which binary property is missing on the incoming item.
- Invalid JSON in raw mode: throw a node operation error that names the field.
- API errors: preserve HTTP status and response details where n8n helpers expose them.

## Testing Strategy

Tests should expand beyond metadata smoke tests:

- Metadata tests confirm resources and operations are registered.
- Parameter-description tests confirm required user-facing fields have descriptions.
- Resource-locator tests confirm locator properties use expected modes and defaults.
- Load-options tests mock FirstSpirit responses and verify normalized option output.
- Parameter-helper tests verify locator values resolve correctly from `From list` and manual modes.
- Binary-helper tests verify upload reads n8n binary data and does not use filesystem APIs.
- Regression tests confirm existing operation values remain registered unless a migration note covers a deliberate change.

Static checks should include:

- No `node:fs` import in runtime node code.
- No `form-data` import in runtime node code.
- No runtime dependency added to `dependencies`.

## Migration Strategy

Existing workflows may use manual ID fields. To reduce disruption:

- Preserve parameter names where compatible.
- Resource locators should accept manual values through fallback modes.
- Keep operation values stable unless there is a clear UX or correctness reason to change them.
- Document the file-path upload removal as a breaking change.
- Provide migration notes for replacing `File Path` with `Binary Property`.

## Non-Goals

- Build a full FirstSpirit schema explorer.
- Add undocumented FirstSpirit REST operations.
- Replace the n8n HTTP Request node for arbitrary FirstSpirit endpoints.
- Keep local filesystem upload behavior in verified-compatible mode.
- Implement Creator Portal submission or npm publishing.

## Risks

- Some FirstSpirit endpoints may not expose enough information for rich selectors. Mitigation: use manual fallback fields and document limitations.
- Large projects may make list selectors slow. Mitigation: prefer search-capable selectors where possible and add limits.
- Resource locator migrations can break saved workflows if parameter names or operation values change. Mitigation: preserve values and document unavoidable breaking changes.
- API response shapes may vary because the FirstSpirit REST module is still evolving. Mitigation: normalize defensively and keep raw JSON advanced mode.

## Deliverables

- Resource locators or dynamic options for selectable FirstSpirit resources.
- Load-options methods for supported selectors.
- n8n binary-data upload support.
- Removal of local file-path upload runtime code.
- English helper descriptions for every user-facing parameter.
- Improved operation labels and action text.
- Structured fields for stable create/update payloads where practical.
- Advanced raw JSON mode for flexible payloads.
- Pagination controls for list/search operations.
- Refactored helper modules for requests, parameters, and binary data.
- Tests covering selectors, helpers, binary upload, and no-filesystem constraints.
- README and documentation updates for the new UI.
- Migration notes for existing workflows.

## Acceptance Criteria

- Users can select a project from a list for operations that require a project.
- Users can select dependent resources from lists where the API supports discovery.
- Users can still provide IDs, UIDs, or names manually for advanced workflows.
- Upload operations use n8n binary input and do not read from local paths.
- Every visible field has a clear English helper description.
- List/search operations provide practical pagination controls.
- Existing operation values remain stable unless a documented migration requires a change.
- `npm run lint`, `npm test`, and `npm run build` pass.
- Runtime node code contains no direct filesystem access and no `form-data` dependency.

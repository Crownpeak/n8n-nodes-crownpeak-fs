# Node UX Polish Batch Design

## Status

Approved for specification on 2026-05-12.

## Goal

Land the next UX polish batch on the FirstSpirit REST node before the verified Community Node submission: replace the single raw-JSON `Content` field with typed inputs for the operations whose body schemas are known, shorten and align operation labels with n8n conventions, and add reviewer-facing documentation for local UI smoke tests and live-API validation against a real FirstSpirit REST server.

## Context

The previous two batches added resource locators, binary upload, and search pagination. Four follow-ups remain open from those reviews:

1. Most create and update operations still use one `Content` field of type `json`, which is hard to discover and easy to misformat.
2. Operation labels are inconsistent and verbose ("Get FirstSpirit Page Reference By UID"), repeating the resource name that the user already picked in the resource dropdown.
3. There is no checklist for reviewers to verify the node manually in the n8n UI before submitting it to the community-node review.
4. There is no documented procedure for validating the load-options endpoints against a real FirstSpirit REST server. The Cloud server is available to the maintainer, but the runbook to use it is missing.

The Kotlin request DTOs live in `fs-rest-webapp/service/src/main/kotlin/com/crownpeak/firstspirit/modules/rest/spring/entities/RequestDTO.kt` and `DTO.kt`. The node consumes those endpoints and follows the verified-compatible runtime constraints (no FS access, no env vars, no runtime deps).

## Shared Architecture Contract

Same contract as the prior two specs:

- No runtime dependencies.
- No filesystem reads in node runtime code.
- Use n8n binary data for uploads.
- All user-facing text in English.
- Prefer n8n UI components (resource locator, options, fixedCollection) over raw text where the API exposes enough structure.
- Keep manual ID and name fallbacks via resource-locator "By UID"/"By ID" modes.
- Preserve all existing n8n operation `value` strings so existing workflows continue to load.

## Scope

### 1. Structured Create and Update Fields

The current `Content` JSON field is shown for ten operations. Those operations fall into four groups based on the Kotlin request DTOs.

**Group A — fully structured. Replace the JSON field with typed properties plus an optional `Additional Properties` JSON field that is merged into the request body.**

- `createMedium` → `{ uid, filename, type: MediumType }`
- `createPage` → `{ uid, templateUid }`
- `createPageReference` → `{ uid, pageId, location }`
- `createPageTemplate` → `{ uid, name, description?, bodies?: TemplateBodyDTO[] }`
- `createSectionTemplate` → `{ uid, name, description? }`
- `addSectionToBody` → `{ templateUid }` — no `Additional Properties` field; backend rejects extra keys.

**Group B — discriminated union. Replace JSON with an action dropdown plus an action-specific options collection.**

- `executeActionsOnPage` → `{ action: "copy" | "release", options?: { checkOnly, dependentReleaseType, ensureAccessibility, recursive } }`.
- The release-options dropdown values are `NO_DEPENDENT_RELEASE`, `DEPENDENT_RELEASE`, `DEPENDENT_RELEASE_NEW_ONLY`. If the live-API validation step reveals different enum strings, fall back to a free-text input with those three values as helper hints.

**Group C — typed top-level, polymorphic content stays JSON.**

- `updateInputElementOfForm` and `updateInputElementOfSectionForm` → `FormEditorDTO { name, type: EditorType, language?, description?, configuration?, content }`.
- `Editor Name` is sourced from the path-`editorName` parameter and copied into the body, so the user enters it once.
- `Editor Type` is a dropdown bound to the `EditorType` enum (17 values, see `DTO.kt:FormEditorDTO`).
- `Language` is a string, empty string means null.
- `Configuration` and `Content` remain `json`. The `Content` field carries a short helper that lists the five most common variants with examples (CMS_INPUT_TEXT → string, CMS_INPUT_TOGGLE → boolean, CMS_INPUT_DOM → HTML string, CMS_INPUT_CHECKBOX → `OptionDTO`, CMS_INPUT_LINK → `LinkDTO`).

**Group D — JSON unchanged.**

- `executeScript` keeps the JSON field. Its body is a script-defined parameter map. The helper text changes to "Parameters passed to the script. Structure depends on the script's expected inputs."

**Merge semantics for `Additional Properties`:**

- The typed fields are serialized into a plain object, with `undefined`/empty-string values filtered out.
- The user-supplied `Additional Properties` JSON is parsed; if parsing fails or the result is not an object, the node throws `NodeOperationError` with a readable message.
- The resulting request body is `{ ...additional, ...typed_filtered }` — set typed fields win on key collision, but unset typed fields fall through to whatever `Additional Properties` provides. That lets a user override an out-of-date enum dropdown by leaving the typed field at the default and supplying the value via `Additional Properties`.

### 2. Operation Label Refactor

Convention: `Verb + context-specific Noun`. The resource is already picked from the resource dropdown, so do not repeat it. Use n8n standard verbs (`Get`, `Get Many`, `Create`, `Update`, `Search`, `Add`, `Execute`, `Upload`, `Download`). Operation `value` strings are not changed.

Within a resource that has homogeneous sub-entities (`project`, `page`, `media`, `script`), use just the verb. Within a resource with heterogeneous sub-entities (`template`, `page` for body/form/input element), include the sub-noun.

The legacy unused file `nodes/CrownpeakFS/descriptions/CrownpeakFS.node.options.ts` is removed.

Mapping table:

| Resource | Old label | New label | n8n `value` |
| --- | --- | --- | --- |
| media | Get Binary Data Of Medium | Download Binary | `getBinaryDataOfMedium` |
| media | Upload Binary Data To Medium | Upload Binary | `uploadBinaryDataToMedium` |
| media | Create Medium | Create | `createMedium` |
| media | Get Medium | Get | `getMedium` |
| project | List FirstSpirit Projects | Get Many | `listProjects` |
| project | Get FirstSpirit Project | Get | `getProject` |
| project | Search in FirstSpirit Project | Search | `searchProject` |
| pageReference | List FirstSpirit Page References | Get Many | `listPageReferences` |
| pageReference | Create FirstSpirit Page Reference | Create | `createPageReference` |
| pageReference | Get FirstSpirit Page Reference By UID | Get | `getPageReferenceByUid` |
| pageReference | Execute Actions On Page | Execute Action | `executeActionsOnPage` |
| template | List FirstSpirit Section Templates | Get Many Section Templates | `listSectionTemplates` |
| template | Create FirstSpirit Section Template | Create Section Template | `createSectionTemplate` |
| template | List FirstSpirit Page Templates | Get Many Page Templates | `listPageTemplates` |
| template | Create FirstSpirit Page Template | Create Page Template | `createPageTemplate` |
| page | List FirstSpirit Pages | Get Many | `listPages` |
| page | Create FirstSpirit Page | Create | `createPage` |
| page | Get FirstSpirit Page | Get | `getPage` |
| page | Add Section To Body | Add Section to Body | `addSectionToBody` |
| page | Get Bodies Of FirstSpirit Page | Get Bodies | `getBodiesOfPage` |
| page | Get Body Of FirstSpirit Page By Name | Get Body | `getBodyOfPage` |
| page | Get Input Element Of Form | Get Page Input Element | `getInputElementOfForm` |
| page | Update Input Element Of Form | Update Page Input Element | `updateInputElementOfForm` |
| page | Get Input Element Of Section Form | Get Section Input Element | `getInputElementOfSectionForm` |
| page | Update Input Element Of Section Form | Update Section Input Element | `updateInputElementOfSectionForm` |
| page | Get Input Elements Of Form From FirstSpirit Page | Get Page Form | `getInputElementsOfForm` |
| page | Get Input Elements Of Section Form From FirstSpirit Page | Get Section Form | `getInputElementsOfSectionForm` |
| script | List FirstSpirit Scripts | Get Many | `listScripts` |
| script | Execute FirstSpirit Script | Execute | `executeScript` |

### 3. Local n8n Smoke-Test Checklist

A new file `docs/smoke-tests.md` for manual reviewer use. Linked from `docs/community-verification.md` under "Pre-Submission Smoke Tests".

Structure:

1. **Setup** — Node 20+, n8n 1.x, the Cloud or local FirstSpirit REST server. Build steps: `npm run build`, point `N8N_CUSTOM_EXTENSIONS` at the repo, start n8n. Create credentials with Base URL, username, password and verify the connection.

2. **Per-resource sub-checklists** in this order: Project, Page Reference, Page, Media, Template, Script. Each operation lists the three mandatory checks below.

3. **Three mandatory checks per operation:**
   - [ ] Label visible — the new shortened label appears in the operation dropdown.
   - [ ] Fields render correctly — resource locators default to "From list", required typed fields are marked required, `Additional Properties` is collapsed by default.
   - [ ] Execution succeeds — workflow runs green and returns the expected output shape (example included in the doc).

4. **Regression checks** — binary upload still works with an expression-driven `binaryPropertyName`; every resource locator has a working "By UID"/"By ID" fallback; search pagination (page number, page size, return all, limit) still works.

5. **Migration note** — Any existing workflow that drives `content` via expression must be migrated to the typed fields. `Additional Properties` remains the bridge for keys the typed UI does not yet cover.

### 4. Live-API Validation Runbook

A new file `docs/live-api-validation.md`. Manual procedure run against the maintainer's Cloud FirstSpirit server (or any FS-REST instance the reviewer has). Not wired into CI.

Structure:

1. **Setup** — Running n8n with the node installed, valid FS credentials (never production), a test project with pages, bodies, sections, templates, scripts, and media. A committed verification workflow at `docs/fixtures/live-api-validation-workflow.json` that exposes one resource locator at a time and outputs the loaded list.

2. **Per-locator validation blocks** for each load-options method currently in `methods/loadOptions.ts` (`searchProjects`, `searchPages`, `searchPageReferences`, `searchMedia`, `searchScripts`, `searchBodies`, `searchSections`) plus the new locators introduced by this batch (`searchSectionTemplates`, `searchPageTemplates`). Each block contains:
   - [ ] Empty state — opening the locator without a filter returns at least one entry.
   - [ ] Filter works — typing narrows the list.
   - [ ] Format parsing — inspect the raw response in DevTools, confirm `asArray` handles the wrapper key. If a new wrapper key appears, extend `asArray` in `loadOptions.ts`.
   - [ ] Missing upstream parameter — opening a dependent locator (e.g. Body) without the parent (e.g. Page) shows a readable error, not a crash.
   - [ ] Value identity — selecting an entry persists the expected identifier (UID preferred, ID fallback).

3. **Findings table** — reviewer fills in status (`OK`, `Issue`, `Bug`), the observed wrapper key, and any notes per locator. This table is copied into the PR body when the batch is submitted.

4. **Follow-up triage**:
   - Locator returns 0 entries but the API has data → wrapper key missing in `asArray`.
   - 401/403 → credentials setup.
   - 500 → upstream `fs-rest-webapp` issue; file in that repo and mark the smoke step skipped with the issue link.

5. **Bruno cross-check (optional)** — note that `../fs-rest-webapp/bruno/` collections can be run to separate backend issues from node-parsing issues.

## Out of Scope

- Structuring `executeScript` parameters (script-defined, varies per script).
- Fully structuring `FormEditorDTO.content` for all 17 editor types (would multiply the property tree; the JSON field with examples is the pragmatic compromise).
- Playwright or other automated UI tests.
- Automated live-API tests in CI (credential handling is not worth the risk for this batch).

## File Plan

- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts` — swap the unified `Content` field for per-operation typed properties, route through the new merge helper, rename operation `displayName`s. Remove the operation-`name` strings that include the resource word.
- Create: `nodes/CrownpeakFS/descriptions/createUpdateFields.ts` — one exported function per Group A/B/C operation that returns `INodeProperties[]`.
- Create: `nodes/CrownpeakFS/descriptions/sharedOptions.ts` — reusable dropdown option arrays (`mediumTypeOptions`, `editorTypeOptions`, `pageReferenceActionOptions`, `dependentReleaseTypeOptions`).
- Modify: `nodes/CrownpeakFS/helpers/options.ts` — add `buildRequestBody(typed: IDataObject, additional?: string): IDataObject` with parse + shape validation + typed-wins merge.
- Modify: `nodes/CrownpeakFS/methods/loadOptions.ts` — add `searchPageTemplates` and `searchSectionTemplates`, used by the new `Template UID` locator in `createPage` and the new `Template UID` locator in `addSectionToBody`.
- Delete: `nodes/CrownpeakFS/descriptions/CrownpeakFS.node.options.ts` — unused legacy file.
- Create: `tests/buildRequestBody.test.ts` — merge semantics, invalid JSON, non-object payload, undefined additional.
- Create: `tests/operationLabels.test.ts` — assert the new `displayName` strings and that `value` strings did not change for any pre-existing operation.
- Create: `tests/createUpdateFields.test.ts` — for each Group A/B/C operation, assert the typed fields exist with the right `displayOptions`, and assert that the old `content` field is no longer shown for that operation.
- Modify: `tests/CrownpeakFS.test.ts` — adapt any property-tree snapshots.
- Create: `docs/smoke-tests.md` — manual UI checklist (Section 3 above).
- Create: `docs/live-api-validation.md` — validation runbook (Section 4 above).
- Create: `docs/fixtures/live-api-validation-workflow.json` — minimal n8n workflow that prints a resource-locator result list.
- Modify: `docs/community-verification.md` — reference both new docs.
- Modify: `README.md` — short note that `Content` JSON has been split into typed fields, with `Additional Properties` as the forward-compat escape hatch.

## Testing Strategy

- **Unit tests** for `buildRequestBody`, the new load-options methods (with mocked `crownpeakApiRequest`), and the operation-label assertions.
- **Static-constraint tests** continue to enforce the runtime contract (no `fs`, no `path`, no `form-data`, no runtime deps).
- **Property-level tests** assert that the new typed fields exist for each Group A/B/C operation and are absent for unrelated operations, and that the old shared `content` field no longer applies to those operations.
- **Manual smoke tests** per `docs/smoke-tests.md`.
- **Manual live-API validation** per `docs/live-api-validation.md`.

## Risks and Mitigations

- **Workflow migration cost.** Existing workflows that drove `content` as a single JSON expression will fail validation when reopened. Mitigation: the `Additional Properties` field accepts any JSON object, so a user can paste the old payload in there to keep the workflow running until they migrate. The README and `docs/smoke-tests.md` describe the migration.
- **Enum drift.** If the Kotlin `EditorType` or `MediumType` enum gains values, the n8n dropdown will be out of date. Mitigation for Group A operations: the `Additional Properties` JSON field can carry an overriding `type` key, and the merge order (`typed` wins) is documented as "typed fields win" with the explicit caveat that empty/unset typed enum fields fall through to additional properties. Mitigation for Group C: `Editor Type` is an enum dropdown without `Additional Properties`; if a new editor type appears, the node has to be updated. This is acceptable because new editor types are infrequent and require a content-shape change anyway. The live-API validation runbook calls out enum drift as a checkpoint.
- **Live-API validation not reproducible in CI.** Accepted trade-off — credentials handling is out of scope for this batch. The runbook makes the manual procedure repeatable and documents the findings format.
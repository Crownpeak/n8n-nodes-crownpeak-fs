# Output Streamlining Design

## Status

Approved for specification on 2026-05-12.

## Goal

Refactor the FirstSpirit REST node's `execute()` so its output matches n8n conventions: array responses fan out into one `INodeExecutionData` per element, every output item carries a `pairedItem` linking it to the source input, `continueOnFail` is honored, and the input items array is not mutated.

## Context

The current `execute()` writes API responses back into the input items array (`items[i].json = response`) and returns that mutated array. As a result:

- A `listPages` response with 50 pages becomes a single output item whose JSON is a 50-element array, so downstream nodes have to iterate manually instead of getting one item per page.
- Output items lack `pairedItem`, breaking expression resolution that walks back to the originating input.
- Input items are mutated, so any other branch that shares them sees the response.
- A thrown error aborts the whole node; there is no support for the standard `continueOnFail` toggle.
- The paginated `searchProject` branch wraps its collected pages in `{ items: collected }` instead of fanning them out.

The previous batch already standardized the operation surface (typed Create/Update fields, short operation labels, smoke-test runbook). This batch focuses on the output edge — it is independent of body shape changes and complements them.

## Shared Architecture Contract

Same contract as prior specs:

- No runtime dependencies.
- No filesystem reads, no env vars in node runtime code.
- Use n8n binary data for uploads.
- All user-facing text in English.
- Preserve operation `value` strings.

## Scope

### Output Normalization

Every successful response is routed through a single normalization helper. The helper turns the response into zero or more `INodeExecutionData` and pushes each onto the shared `returnData` array with `pairedItem: { item: inputIndex }`.

Normalization rules:

- **Bare array** (`Array.isArray(response)`) → one item per element. Non-object elements (`string`, `number`, `boolean`, `null`) are boxed as `{ value: element }`.
- **Wrapped array** — if the response is an object and exactly one of the keys `items`, `data`, `results`, `projects` carries an array, fan out that array using the same boxing rule.
- **Plain object** → one item, the response itself.
- **Empty array** (including wrapped) → zero items.
- **Primitive or `null`** → one item with `{ data: value }`.

Wrapper detection runs in this fixed order: `items`, `data`, `results`, `projects`. Stop at the first match.

### Binary Endpoint Output

The `getBinaryDataOfMedium` branch produces one output item shaped `{ json: {}, binary: { data: prepared }, pairedItem: { item: inputIndex } }`. The empty `json: {}` keeps downstream nodes from accidentally inheriting the input's JSON.

### `searchProject returnAll` Branch

The paginated branch keeps its current collection logic (page through, stop when the collected count meets the limit) but instead of writing `items[i].json = { items: collected }`, it fans `collected.slice(0, limit)` through the normalization helper. Each collected page object becomes its own output item with `pairedItem`.

### `continueOnFail`

Per-input-item execution is wrapped in `try/catch`. On error:

- If `this.continueOnFail()` returns `true`, push `{ json: { error: message }, pairedItem: { item: inputIndex } }` and proceed to the next input item.
- Otherwise rethrow so n8n surfaces the node error.

The error message is `(error as Error).message`. We do not include stack traces or HTTP status codes in the JSON payload — n8n's node-error UI already shows those when continueOnFail is off.

### Input Items Not Mutated

`execute()` builds its own `const returnData: INodeExecutionData[] = []` and never assigns into `items[i].json` or `items[i].binary`. The input array is read-only.

## Out of Scope

- Per-operation output-schema documentation.
- Multi-output (rotating outputs) — keep one main output channel.
- Changes to credentials, request helpers, resource locators, or load-options methods.
- Static type narrowing of `response: unknown` via JSON Schema or generated DTOs.
- Auto-detection of paginated endpoints that lack the `items|data|results|projects` wrapper (future work if such endpoints appear).

## File Plan

- Create: `nodes/CrownpeakFS/helpers/output.ts` — `pushResponse(returnData, response, inputIndex)` and a private `toJsonObject(value)` for boxing non-object array elements.
- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts` — switch `execute()` to the `returnData` pattern, wrap each input-item iteration in `try/catch`, route every success path through `pushResponse`, and update the `searchProject returnAll` branch to push collected items instead of wrapping them. Remove the now-redundant local `extractItems` helper at the top of the file if `pushResponse` makes it dead code; otherwise leave it.
- Create: `tests/output.test.ts` — unit tests covering bare array, all four wrapper keys, empty array, plain object, primitive, `null`, non-object array entries, wrapper key present but non-array, and the `pairedItem` index propagation.
- Modify if needed: `tests/CrownpeakFS.test.ts` — only if existing assertions inspect the old `items[i].json = response` shape.
- Modify: `README.md` — extend the existing "Migration: Typed Body Fields" section with a brief note that list/search endpoints now emit one item per element.

## Testing Strategy

- Unit-test `pushResponse` in isolation against every documented rule. The helper is pure, so no mocking of `IExecuteFunctions` is needed.
- The full Jest suite keeps the existing static-constraint and property-tree assertions; nothing about output normalization is reachable from those, so they continue to pass unchanged.
- `npm run lint` and `npm run build` must continue to pass.
- Manual smoke test: run a small workflow with `listPages` against the live FS server, confirm n8n displays one item per page in the output panel.

## Risks and Mitigations

- **Existing workflows that read `$json.items[0]` from a list response will break.** Mitigation: the README migration section gains a paragraph describing the change and how to refactor expressions. Affected expressions become `$json.<key>` on the per-element item.
- **A single-element response that happens to use a wrapper key would be flattened to one item rather than kept as a wrapped object.** This is the desired behavior; if an endpoint ever returns a non-list payload under `items`/`data`/`results`/`projects`, the wrapper detection will need an explicit allow-list or per-operation override. Not currently known to occur.
- **Empty array → zero items can confuse first-time users of the node.** Mitigation: documented in the README migration paragraph alongside the flatten behavior; consistent with how other n8n list nodes behave.

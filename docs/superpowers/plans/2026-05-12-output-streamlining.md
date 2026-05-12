# Output Streamlining Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **IMPORTANT — Commit policy for this repo:** Do NOT commit after every task. The repo policy (AGENTS.md) requires feature-complete commits only. Stage nothing during intermediate tasks. The single commit step is the last step of the last task.

**Goal:** Refactor `CrownpeakFS.node.ts:execute()` so successful responses fan out into n8n-conform output items with `pairedItem` linkage, `continueOnFail` is honored, and input items are not mutated.

**Architecture:** Add a pure `pushResponse(returnData, response, inputIndex)` helper that handles bare arrays, four wrapper keys (`items`, `data`, `results`, `projects`), plain objects, and primitives. Route every success branch of `execute()` through it. Wrap the per-input-item loop body in `try/catch` to support `continueOnFail`. Replace `items[i].json = ...` with pushes into a fresh `returnData` array.

**Tech Stack:** TypeScript, n8n-workflow node APIs, Jest.

---

## File Plan

- Create: `nodes/CrownpeakFS/helpers/output.ts` — `pushResponse` plus a private `toJsonObject` helper for boxing non-object array entries.
- Create: `tests/output.test.ts` — unit tests for `pushResponse`.
- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts` — switch `execute()` to the `returnData` pattern, wrap each iteration in `try/catch` for `continueOnFail`, route every success path through `pushResponse`, and update the `searchProject returnAll` branch.
- Modify: `tests/CrownpeakFS.test.ts` — only if existing assertions inspect the old `items[i].json = response` shape (read first to confirm).
- Modify: `README.md` — extend the "Migration: Typed Body Fields" section with a note that list/search endpoints now emit one item per element.

---

## Task 1: Add pushResponse Helper

**Files:**
- Create: `nodes/CrownpeakFS/helpers/output.ts`
- Create: `tests/output.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/output.test.ts`:

```ts
import { pushResponse } from '../nodes/CrownpeakFS/helpers/output';
import { INodeExecutionData } from 'n8n-workflow';

describe('pushResponse', () => {
	let returnData: INodeExecutionData[];

	beforeEach(() => {
		returnData = [];
	});

	it('emits one item per element for a bare array response', () => {
		pushResponse(returnData, [{ id: 1 }, { id: 2 }], 0);
		expect(returnData).toEqual([
			{ json: { id: 1 }, pairedItem: { item: 0 } },
			{ json: { id: 2 }, pairedItem: { item: 0 } },
		]);
	});

	it('emits nothing for an empty array', () => {
		pushResponse(returnData, [], 0);
		expect(returnData).toEqual([]);
	});

	it('unwraps an `items` wrapper and emits one item per element', () => {
		pushResponse(returnData, { items: [{ uid: 'a' }, { uid: 'b' }], total: 2 }, 3);
		expect(returnData).toEqual([
			{ json: { uid: 'a' }, pairedItem: { item: 3 } },
			{ json: { uid: 'b' }, pairedItem: { item: 3 } },
		]);
	});

	it('unwraps a `data` wrapper', () => {
		pushResponse(returnData, { data: [{ x: 1 }] }, 0);
		expect(returnData).toEqual([{ json: { x: 1 }, pairedItem: { item: 0 } }]);
	});

	it('unwraps a `results` wrapper', () => {
		pushResponse(returnData, { results: [{ y: 2 }] }, 0);
		expect(returnData).toEqual([{ json: { y: 2 }, pairedItem: { item: 0 } }]);
	});

	it('unwraps a `projects` wrapper', () => {
		pushResponse(returnData, { projects: [{ id: 9 }] }, 0);
		expect(returnData).toEqual([{ json: { id: 9 }, pairedItem: { item: 0 } }]);
	});

	it('stops at the first matching wrapper key (items wins over data)', () => {
		pushResponse(
			returnData,
			{ items: [{ a: 1 }], data: [{ should: 'not appear' }] },
			0,
		);
		expect(returnData).toEqual([{ json: { a: 1 }, pairedItem: { item: 0 } }]);
	});

	it('emits a single item for a plain object response', () => {
		pushResponse(returnData, { uid: 'home', displayName: 'Home' }, 1);
		expect(returnData).toEqual([
			{ json: { uid: 'home', displayName: 'Home' }, pairedItem: { item: 1 } },
		]);
	});

	it('does not unwrap when a wrapper key is present but not an array', () => {
		pushResponse(returnData, { items: 'not an array', uid: 'x' }, 0);
		expect(returnData).toEqual([
			{ json: { items: 'not an array', uid: 'x' }, pairedItem: { item: 0 } },
		]);
	});

	it('wraps primitive responses under a `data` key', () => {
		pushResponse(returnData, 'plain string', 0);
		expect(returnData).toEqual([{ json: { data: 'plain string' }, pairedItem: { item: 0 } }]);
	});

	it('wraps null under a `data` key', () => {
		pushResponse(returnData, null, 2);
		expect(returnData).toEqual([{ json: { data: null }, pairedItem: { item: 2 } }]);
	});

	it('boxes non-object array entries under a `value` key', () => {
		pushResponse(returnData, ['a', 'b'], 0);
		expect(returnData).toEqual([
			{ json: { value: 'a' }, pairedItem: { item: 0 } },
			{ json: { value: 'b' }, pairedItem: { item: 0 } },
		]);
	});

	it('propagates the inputIndex to every emitted pairedItem', () => {
		pushResponse(returnData, [{ a: 1 }, { b: 2 }], 7);
		expect(returnData.every((d) => (d.pairedItem as { item: number }).item === 7)).toBe(true);
	});
});
```

- [ ] **Step 2: Run the tests and confirm failure**

Run: `npm test -- tests/output.test.ts`

Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement the helper**

Create `nodes/CrownpeakFS/helpers/output.ts`:

```ts
import { IDataObject, INodeExecutionData } from 'n8n-workflow';

const WRAPPER_KEYS = ['items', 'data', 'results', 'projects'] as const;

export function pushResponse(
	returnData: INodeExecutionData[],
	response: unknown,
	inputIndex: number,
): void {
	const pairedItem = { item: inputIndex };

	if (Array.isArray(response)) {
		for (const entry of response) {
			returnData.push({ json: toJsonObject(entry), pairedItem });
		}
		return;
	}

	if (response && typeof response === 'object') {
		const wrapperKey = WRAPPER_KEYS.find((key) =>
			Array.isArray((response as IDataObject)[key]),
		);
		if (wrapperKey) {
			for (const entry of (response as IDataObject)[wrapperKey] as unknown[]) {
				returnData.push({ json: toJsonObject(entry), pairedItem });
			}
			return;
		}
		returnData.push({ json: response as IDataObject, pairedItem });
		return;
	}

	returnData.push({ json: { data: response } as IDataObject, pairedItem });
}

function toJsonObject(value: unknown): IDataObject {
	if (value && typeof value === 'object') {
		return value as IDataObject;
	}
	return { value: value as IDataObject[string] };
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- tests/output.test.ts`

Expected: PASS (12/12).

- [ ] **Step 5: Compile**

Run: `npx tsc --noEmit`

Expected: PASS.

**Do NOT commit.** Move to Task 2.

---

## Task 2: Refactor execute() Output Path

**Files:**
- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts`

This task swaps the input-mutation tail for a `returnData` array, wraps each input iteration in `try/catch`, and routes every success through `pushResponse`.

- [ ] **Step 1: Import the helper**

Near the existing import of `buildRequestBody`, add:

```ts
import { pushResponse } from './helpers/output';
```

- [ ] **Step 2: Replace the body of `execute()`**

Read the current `execute()` (starts at approximately `CrownpeakFS.node.ts:530`) end to end first so you understand all branches. Then change the outer structure to:

```ts
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const operation = this.getNodeParameter('operation', i) as string;
			const { username, password, baseUrl } = (await this.getCredentials('crownpeakFSApi')) as {
				username: string;
				password: string;
				baseUrl: string;
			};

			let method: IHttpRequestMethods;
			let url = '';
			let headers: IDataObject = {};
			let body: Buffer | IDataObject | string | undefined;

			const isBinaryEndpoint = operation === 'getBinaryDataOfMedium';

			switch (operation) {
				// ... existing case bodies, unchanged EXCEPT for `searchProject` returnAll, which is rewritten below ...
				default:
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
			}

			const response = await this.helpers.httpRequest({
				method,
				url,
				headers: {
					Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
					'Content-Type': headers['Content-Type'] ?? 'application/json',
					Accept: headers.Accept ?? (isBinaryEndpoint ? '*/*' : 'application/json'),
				},
				body,
				json:
					!isBinaryEndpoint &&
					!Buffer.isBuffer(body) &&
					String(headers.Accept ?? 'application/json')
						.toLowerCase()
						.includes('json'),
				encoding: isBinaryEndpoint ? 'arraybuffer' : undefined,
				returnFullResponse: isBinaryEndpoint ? true : undefined,
			});

			if (isBinaryEndpoint) {
				const fileName =
					response.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') ||
					'file';
				returnData.push({
					json: {},
					binary: {
						data: await this.helpers.prepareBinaryData(response.body, fileName),
					},
					pairedItem: { item: i },
				});
			} else {
				pushResponse(returnData, response, i);
			}
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return [returnData];
}
```

Keep every existing `case` body byte-identical except the `searchProject` branch (next step).

- [ ] **Step 3: Update the `searchProject` returnAll branch**

Inside the `case 'searchProject':` block, the `returnAll` path currently ends with:

```ts
items[i].json = { items: collected.slice(0, limit) };
continue;
```

Replace those two lines with:

```ts
pushResponse(returnData, collected.slice(0, limit), i);
continue;
```

Leave the non-`returnAll` path untouched; it falls through to the shared `httpRequest` call and `pushResponse` route.

- [ ] **Step 4: Remove or keep the `extractItems` helper**

The pre-existing local `extractItems` function at the top of `CrownpeakFS.node.ts` (approximately lines 24–39) is still used by the paginated `searchProject` collection loop. Keep it. Do not delete.

- [ ] **Step 5: Run all tests**

Run: `npm test`

Expected: PASS for all suites. If `tests/CrownpeakFS.test.ts` asserts the old `items[i].json = response` shape, update those assertions to read from the `returnData[k].json`. If it does not (it currently only asserts node metadata), no change is needed.

- [ ] **Step 6: Compile and lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: both pass.

**Do NOT commit.** Move to Task 3.

---

## Task 3: README Migration Note

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Extend the migration section**

Open `README.md` and find the existing section titled `## Migration: Typed Body Fields`. Append a new paragraph at the end of that section:

```markdown
### Output Shape

List, search, and "get many" operations now emit one n8n item per element instead of a single item carrying an array. Workflows that previously read `$json.items[0]` or `$json[0]` from the response should switch to per-item expressions (`$json.uid`, `$json.displayName`, etc.). Empty list responses produce zero output items. Every output item carries a `pairedItem` link back to the originating input.
```

- [ ] **Step 2: Verify**

Run: `grep -n "Output Shape" README.md`

Expected: one match.

**Do NOT commit.** Move to Task 4.

---

## Task 4: Full Verification and Single Commit

**Files:**
- None new.

- [ ] **Step 1: Run all four checks**

```bash
npx tsc --noEmit
npm test
npm run lint
npm run build
```

Expected: all four pass. Investigate any failure before continuing.

- [ ] **Step 2: Self-review the diff**

```bash
git diff --stat
```

Expected files modified or created:
- `nodes/CrownpeakFS/helpers/output.ts` (new)
- `nodes/CrownpeakFS/CrownpeakFS.node.ts` (modified)
- `tests/output.test.ts` (new)
- `README.md` (modified)
- optionally `tests/CrownpeakFS.test.ts` if assertions had to be updated

If any other files appear in the diff, investigate before committing.

- [ ] **Step 3: Commit as one feature-complete unit**

```bash
git add nodes/CrownpeakFS/helpers/output.ts nodes/CrownpeakFS/CrownpeakFS.node.ts tests/output.test.ts README.md
# add tests/CrownpeakFS.test.ts to the git add line only if it was modified
git commit -m "$(cat <<'EOF'
feat: streamline node output to n8n conventions

Refactor execute() so successful responses fan out into proper
n8n items: array responses emit one item per element, four common
wrapper keys (items, data, results, projects) are unwrapped, plain
objects produce one item, and primitives are boxed under a data
key. Empty list responses emit zero items. Every output item gets
pairedItem linkage back to its source input.

Wrap each input-item iteration in try/catch so the node honors the
standard continueOnFail toggle: errors during one item become a
json.error item rather than aborting the whole node. Input items
are no longer mutated; execute() builds a fresh returnData array.

The searchProject returnAll branch now fans its collected pages
through the same helper rather than wrapping them in a single
items array.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: Verify the commit**

```bash
git log --oneline -3
git show --stat HEAD
```

Expected: HEAD is the new commit, touching the files listed in Step 2.

---

## Self-Review

- **Spec section "Output Normalization":** covered by Task 1 (`pushResponse`) and the test cases that map directly to each documented rule.
- **Spec section "Binary Endpoint Output":** covered by Task 2 Step 2, which emits `{ json: {}, binary, pairedItem }` for `isBinaryEndpoint`.
- **Spec section "searchProject returnAll branch":** covered by Task 2 Step 3.
- **Spec section "continueOnFail":** covered by Task 2 Step 2 try/catch.
- **Spec section "Input items not mutated":** covered by Task 2 Step 2 (returnData pattern, no `items[i].json =` assignments).
- **Spec File Plan items:** all four files appear in the task File Plan above; the optional `tests/CrownpeakFS.test.ts` modification is conditional and documented.
- **Risks "Existing workflows break":** covered by Task 3 README addendum.
- **Risks "Single-element response with wrapper key":** documented as acceptable in the spec; no mitigation needed in the plan.
- **No placeholders:** every code step shows full code; every command shows the expected outcome.
- **Identifier consistency:** `pushResponse(returnData, response, inputIndex)` signature is identical in Task 1 implementation, Task 1 tests, and Task 2 usage. The helper file path `nodes/CrownpeakFS/helpers/output.ts` is identical across tasks.

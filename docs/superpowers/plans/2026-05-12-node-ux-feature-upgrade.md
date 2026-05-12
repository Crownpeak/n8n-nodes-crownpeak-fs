# n8n UX and Feature Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the FirstSpirit REST API node with resource selection, better helper text, verified-compatible binary upload, safer parameter handling, and focused helper modules.

**Architecture:** The node remains one n8n node package, but UI descriptions, request helpers, resource-locator parsing, load-options methods, and binary handling are split into focused modules. The implementation preserves operation values where practical, replaces local file-path upload with n8n binary data, and uses manual ID or name fallback modes for advanced workflows.

**Tech Stack:** TypeScript, n8n-workflow node APIs, n8n resource locators, n8n load options and list search methods, Jest, ESLint.

---

## File Structure

- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts` to use helper modules and `methods`.
- Create: `nodes/CrownpeakFS/helpers/resourceLocator.ts` for extracting locator values.
- Create: `nodes/CrownpeakFS/helpers/request.ts` for authenticated FirstSpirit REST requests.
- Create: `nodes/CrownpeakFS/helpers/binary.ts` for binary upload handling.
- Create: `nodes/CrownpeakFS/helpers/options.ts` for option normalization.
- Create: `nodes/CrownpeakFS/methods/loadOptions.ts` for project, page, template, script, body, section, and editor selectors.
- Create: `nodes/CrownpeakFS/descriptions/resources.ts` for shared resource selector properties.
- Create: `nodes/CrownpeakFS/descriptions/locators.ts` for resource locator properties.
- Create: `tests/resourceLocator.test.ts`
- Create: `tests/options.test.ts`
- Create: `tests/binary.test.ts`
- Create: `tests/staticConstraints.test.ts`
- Modify: `tests/CrownpeakFS.test.ts`
- Modify: `README.md`
- Modify: `docs/development.md`
- Modify: `docs/community-verification.md`

## Task 1: Add Static Constraint Tests

**Files:**
- Create: `tests/staticConstraints.test.ts`

- [ ] **Step 1: Write the failing static tests**

Create `tests/staticConstraints.test.ts`:

```ts
import fs from 'node:fs';
import path from 'node:path';
import packageJson from '../package.json';

const nodeSourcePath = path.join(__dirname, '..', 'nodes', 'CrownpeakFS', 'CrownpeakFS.node.ts');

describe('verified-compatible runtime constraints', () => {
	const nodeSource = fs.readFileSync(nodeSourcePath, 'utf8');

	it('does not import filesystem modules in runtime node code', () => {
		expect(nodeSource).not.toMatch(/from 'node:fs'|from "node:fs"|from 'fs'|from "fs"/);
	});

	it('does not import path for runtime file uploads', () => {
		expect(nodeSource).not.toMatch(/from 'node:path'|from "node:path"|from 'path'|from "path"/);
	});

	it('does not import form-data', () => {
		expect(nodeSource).not.toMatch(/from 'form-data'|from "form-data"/);
	});

	it('does not declare runtime dependencies', () => {
		expect(packageJson.dependencies ?? {}).toEqual({});
	});
});
```

- [ ] **Step 2: Run the test and confirm current failure**

Run: `npm test -- tests/staticConstraints.test.ts`

Expected: FAIL because the current node imports `form-data`, `node:fs`, and `node:path`.

- [ ] **Step 3: Commit the failing characterization test**

Do not commit a failing test to a shared branch unless the next task is implemented in the same local batch. If using subagent-driven development, keep this task and Task 2 in the same implementation batch.

## Task 2: Add Binary Upload Helper and Replace File Path Upload

**Files:**
- Create: `nodes/CrownpeakFS/helpers/binary.ts`
- Create: `tests/binary.test.ts`
- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts`
- Modify: `package.json` if `form-data` appears in `dependencies`

- [ ] **Step 1: Write binary helper tests**

Create `tests/binary.test.ts`:

```ts
import { getBinaryUpload } from '../nodes/CrownpeakFS/helpers/binary';
import { NodeOperationError } from 'n8n-workflow';

describe('binary upload helper', () => {
	it('returns buffer, file name, and MIME type for a selected binary property', async () => {
		const helpers = {
			getBinaryDataBuffer: jest.fn().mockResolvedValue(Buffer.from('file-content')),
		};

		const context = {
			getNode: jest.fn().mockReturnValue({ name: 'FirstSpirit REST API' }),
			helpers,
		};

		const item = {
			json: {},
			binary: {
				data: {
					data: 'ignored-by-helper',
					fileName: 'hero.png',
					mimeType: 'image/png',
				},
			},
		};

		await expect(getBinaryUpload(context as any, item as any, 0, 'data')).resolves.toEqual({
			buffer: Buffer.from('file-content'),
			fileName: 'hero.png',
			mimeType: 'image/png',
		});
		expect(helpers.getBinaryDataBuffer).toHaveBeenCalledWith(0, 'data');
	});

	it('throws a node operation error when the selected binary property is missing', async () => {
		const context = {
			getNode: jest.fn().mockReturnValue({ name: 'FirstSpirit REST API' }),
			helpers: {
				getBinaryDataBuffer: jest.fn(),
			},
		};

		await expect(getBinaryUpload(context as any, { json: {} } as any, 0, 'data')).rejects.toBeInstanceOf(
			NodeOperationError,
		);
	});
});
```

- [ ] **Step 2: Implement `nodes/CrownpeakFS/helpers/binary.ts`**

```ts
import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

export interface BinaryUpload {
	buffer: Buffer;
	fileName: string;
	mimeType: string;
}

export async function getBinaryUpload(
	context: IExecuteFunctions,
	item: INodeExecutionData,
	itemIndex: number,
	binaryPropertyName: string,
): Promise<BinaryUpload> {
	const binaryData = item.binary?.[binaryPropertyName];

	if (!binaryData) {
		throw new NodeOperationError(
			context.getNode(),
			`No binary data found in property "${binaryPropertyName}"`,
			{ itemIndex },
		);
	}

	const buffer = await context.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	return {
		buffer,
		fileName: binaryData.fileName ?? 'file',
		mimeType: binaryData.mimeType ?? 'application/octet-stream',
	};
}
```

- [ ] **Step 3: Replace the upload parameter**

In `nodes/CrownpeakFS/CrownpeakFS.node.ts`, replace the `File Path` parameter with:

```ts
{
	displayName: 'Binary Property',
	name: 'binaryPropertyName',
	type: 'string',
	default: 'data',
	required: true,
	displayOptions: {
		show: {
			resource: ['media'],
			operation: ['uploadBinaryDataToMedium'],
		},
	},
	description: 'Name of the input binary property that contains the file to upload.',
}
```

- [ ] **Step 4: Replace upload execution code**

Remove imports:

```ts
import FormData from 'form-data';
import fs from 'node:fs';
import path from 'node:path';
```

Add:

```ts
import { getBinaryUpload } from './helpers/binary';
```

Replace the `uploadBinaryDataToMedium` case body with:

```ts
case 'uploadBinaryDataToMedium': {
	const id = this.getNodeParameter('projectId', i) as string;
	const mediumUid = this.getNodeParameter('mediumUid', i) as string;
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
	const upload = await getBinaryUpload(this, items[i], i, binaryPropertyName);

	url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/data`;
	body = upload.buffer;
	method = 'PUT';
	headers['Content-Type'] = upload.mimeType;
	break;
}
```

Change the `body` variable type to:

```ts
let body: Buffer | IDataObject | string | undefined;
```

Simplify request headers so binary upload sends the MIME type and JSON operations send JSON:

```ts
headers: {
	Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
	'Content-Type': headers['Content-Type'] ?? 'application/json',
	Accept: headers.Accept ?? (isBinaryEndpoint ? '*/*' : 'application/json'),
},
```

- [ ] **Step 5: Run verification**

Run:

```bash
npm test -- tests/binary.test.ts tests/staticConstraints.test.ts
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add nodes/CrownpeakFS/CrownpeakFS.node.ts nodes/CrownpeakFS/helpers/binary.ts tests/binary.test.ts tests/staticConstraints.test.ts package.json package-lock.json
git commit -m "feat: upload media from n8n binary data"
```

## Task 3: Add Resource Locator Value Helper

**Files:**
- Create: `nodes/CrownpeakFS/helpers/resourceLocator.ts`
- Create: `tests/resourceLocator.test.ts`

- [ ] **Step 1: Write resource locator tests**

Create `tests/resourceLocator.test.ts`:

```ts
import { getLocatorValue } from '../nodes/CrownpeakFS/helpers/resourceLocator';

describe('resource locator helper', () => {
	it('returns scalar values unchanged', () => {
		expect(getLocatorValue('123')).toBe('123');
	});

	it('returns value from n8n resource locator objects', () => {
		expect(getLocatorValue({ mode: 'list', value: 'project-1' })).toBe('project-1');
	});

	it('returns an empty string for empty values', () => {
		expect(getLocatorValue(undefined)).toBe('');
		expect(getLocatorValue(null)).toBe('');
	});

	it('stringifies numeric values', () => {
		expect(getLocatorValue(42)).toBe('42');
	});
});
```

- [ ] **Step 2: Implement `resourceLocator.ts`**

```ts
import { NodeParameterValueType } from 'n8n-workflow';

interface LocatorLike {
	value?: NodeParameterValueType;
}

export function getLocatorValue(value: unknown): string {
	if (value === undefined || value === null) {
		return '';
	}

	if (typeof value === 'object' && 'value' in value) {
		const locatorValue = (value as LocatorLike).value;
		return locatorValue === undefined || locatorValue === null ? '' : String(locatorValue);
	}

	return String(value);
}
```

- [ ] **Step 3: Run verification**

Run: `npm test -- tests/resourceLocator.test.ts`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add nodes/CrownpeakFS/helpers/resourceLocator.ts tests/resourceLocator.test.ts
git commit -m "feat: add resource locator value helper"
```

## Task 4: Add Option Normalization Helper

**Files:**
- Create: `nodes/CrownpeakFS/helpers/options.ts`
- Create: `tests/options.test.ts`

- [ ] **Step 1: Write option normalization tests**

Create `tests/options.test.ts`:

```ts
import { toNameValueOptions } from '../nodes/CrownpeakFS/helpers/options';

describe('option helpers', () => {
	it('maps id and name fields to sorted n8n options', () => {
		const options = toNameValueOptions(
			[
				{ id: 2, name: 'Zeta' },
				{ id: 1, name: 'Alpha' },
			],
			['name', 'displayName', 'uid', 'id'],
			['id', 'uid', 'name'],
		);

		expect(options).toEqual([
			{ name: 'Alpha', value: '1' },
			{ name: 'Zeta', value: '2' },
		]);
	});

	it('falls back to uid when name is missing', () => {
		expect(toNameValueOptions([{ uid: 'page-home' }], ['name', 'uid'], ['uid'])).toEqual([
			{ name: 'page-home', value: 'page-home' },
		]);
	});
});
```

- [ ] **Step 2: Implement `options.ts`**

```ts
import { IDataObject, INodePropertyOptions } from 'n8n-workflow';

function readFirstString(source: IDataObject, keys: string[]): string {
	for (const key of keys) {
		const value = source[key];
		if (value !== undefined && value !== null && String(value).trim() !== '') {
			return String(value);
		}
	}

	return '';
}

export function toNameValueOptions(
	items: IDataObject[],
	nameKeys: string[],
	valueKeys: string[],
): INodePropertyOptions[] {
	return items
		.map((item) => {
			const name = readFirstString(item, nameKeys);
			const value = readFirstString(item, valueKeys);

			if (!name || !value) {
				return undefined;
			}

			return { name, value };
		})
		.filter((option): option is INodePropertyOptions => option !== undefined)
		.sort((a, b) => a.name.localeCompare(b.name));
}
```

- [ ] **Step 3: Run verification**

Run: `npm test -- tests/options.test.ts`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add nodes/CrownpeakFS/helpers/options.ts tests/options.test.ts
git commit -m "feat: normalize dynamic selector options"
```

## Task 5: Add Authenticated Request Helper

**Files:**
- Create: `nodes/CrownpeakFS/helpers/request.ts`
- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts`

- [ ] **Step 1: Implement request helper**

Create `nodes/CrownpeakFS/helpers/request.ts`:

```ts
import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

interface CrownpeakCredentials {
	username: string;
	password: string;
	baseUrl: string;
}

export async function getCrownpeakCredentials(
	context: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<CrownpeakCredentials> {
	return (await context.getCredentials('crownpeakFSApi')) as CrownpeakCredentials;
}

export function joinUrl(baseUrl: string, path: string): string {
	return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export async function crownpeakApiRequest<T = IDataObject | IDataObject[] | string | Buffer>(
	context: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	path: string,
	options: {
		body?: IDataObject | Buffer | string;
		headers?: IDataObject;
		json?: boolean;
		encoding?: 'arraybuffer';
		returnFullResponse?: boolean;
	} = {},
): Promise<T> {
	const { username, password, baseUrl } = await getCrownpeakCredentials(context);

	try {
		return (await context.helpers.httpRequest({
			method,
			url: joinUrl(baseUrl, path),
			headers: {
				Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
				Accept: 'application/json',
				...options.headers,
			},
			body: options.body,
			json: options.json ?? true,
			encoding: options.encoding,
			returnFullResponse: options.returnFullResponse,
		})) as T;
	} catch (error) {
		throw new NodeApiError(context.getNode(), error as JsonObject, {
			message: 'FirstSpirit REST API request failed',
			description: 'Check the base URL, credentials, and FirstSpirit REST API availability.',
		});
	}
}
```

- [ ] **Step 2: Use helper in one safe operation first**

In `CrownpeakFS.node.ts`, replace only the `listProjects` execution branch with `crownpeakApiRequest` first to verify the helper pattern.

Add import:

```ts
import { crownpeakApiRequest } from './helpers/request';
```

Inside `case 'listProjects':` set:

```ts
items[i].json = await crownpeakApiRequest(this, 'GET', '/v1/projects/');
continue;
```

- [ ] **Step 3: Run verification**

Run:

```bash
npm run lint
npm test
npm run build
```

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add nodes/CrownpeakFS/helpers/request.ts nodes/CrownpeakFS/CrownpeakFS.node.ts
git commit -m "refactor: add FirstSpirit API request helper"
```

## Task 6: Add Project Resource Locator and Load Options

**Files:**
- Create: `nodes/CrownpeakFS/methods/loadOptions.ts`
- Create: `nodes/CrownpeakFS/descriptions/locators.ts`
- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts`
- Modify: `tests/CrownpeakFS.test.ts`

- [ ] **Step 1: Add locator description**

Create `nodes/CrownpeakFS/descriptions/locators.ts`:

```ts
import { INodeProperties } from 'n8n-workflow';

export const projectLocator: INodeProperties = {
	displayName: 'Project',
	name: 'projectId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	description: 'FirstSpirit project to use for this operation.',
	displayOptions: {
		show: {
			resource: ['project', 'search', 'page', 'template', 'script', 'media', 'pageReference'],
		},
		hide: {
			operation: ['listProjects'],
		},
	},
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			typeOptions: {
				searchListMethod: 'searchProjects',
				searchable: true,
			},
		},
		{
			displayName: 'By ID',
			name: 'id',
			type: 'string',
			placeholder: '12345',
		},
	],
};
```

- [ ] **Step 2: Add project search method**

Create `nodes/CrownpeakFS/methods/loadOptions.ts`:

```ts
import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeListSearchResult,
} from 'n8n-workflow';
import { crownpeakApiRequest } from '../helpers/request';
import { toNameValueOptions } from '../helpers/options';

function asArray(response: unknown): IDataObject[] {
	if (Array.isArray(response)) {
		return response as IDataObject[];
	}

	if (response && typeof response === 'object') {
		const objectResponse = response as IDataObject;
		for (const key of ['items', 'data', 'projects', 'results']) {
			if (Array.isArray(objectResponse[key])) {
				return objectResponse[key] as IDataObject[];
			}
		}
	}

	return [];
}

export const loadOptions = {
	async searchProjects(
		this: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		const response = await crownpeakApiRequest(this, 'GET', '/v1/projects/');
		const options = toNameValueOptions(asArray(response), ['name', 'displayName', 'uid', 'id'], [
			'id',
			'uid',
			'name',
		]);
		const normalizedFilter = filter?.toLowerCase() ?? '';

		return {
			results: normalizedFilter
				? options.filter((option) => option.name.toLowerCase().includes(normalizedFilter))
				: options,
		};
	},
};
```

- [ ] **Step 3: Register methods and replace project property**

In `CrownpeakFS.node.ts`:

```ts
import { projectLocator } from './descriptions/locators';
import { loadOptions } from './methods/loadOptions';
import { getLocatorValue } from './helpers/resourceLocator';
```

Add to the class:

```ts
methods = {
	listSearch: loadOptions,
};
```

Replace the inline `Project ID` string property with `projectLocator`.

Replace every project ID extraction:

```ts
const id = this.getNodeParameter('projectId', i) as string;
```

with:

```ts
const id = getLocatorValue(this.getNodeParameter('projectId', i));
```

- [ ] **Step 4: Add test assertions**

In `tests/CrownpeakFS.test.ts`, add:

```ts
it('should expose project as a resource locator', () => {
	const project = node.description.properties.find((property) => property.name === 'projectId');

	expect(project?.type).toBe('resourceLocator');
	expect(project?.default).toEqual({ mode: 'list', value: '' });
});

it('should register list search methods', () => {
	expect(node.methods?.listSearch?.searchProjects).toBeDefined();
});
```

- [ ] **Step 5: Run verification**

Run:

```bash
npm test -- tests/CrownpeakFS.test.ts tests/resourceLocator.test.ts tests/options.test.ts
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add nodes/CrownpeakFS/CrownpeakFS.node.ts nodes/CrownpeakFS/descriptions/locators.ts nodes/CrownpeakFS/methods/loadOptions.ts tests/CrownpeakFS.test.ts
git commit -m "feat: select FirstSpirit projects from a resource locator"
```

## Task 7: Add Dependent Resource Locators

**Files:**
- Modify: `nodes/CrownpeakFS/descriptions/locators.ts`
- Modify: `nodes/CrownpeakFS/methods/loadOptions.ts`
- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts`
- Modify: `tests/CrownpeakFS.test.ts`

- [ ] **Step 1: Add locator properties**

Add locators for:

- `pageUid` with list search method `searchPages`.
- `pageReferenceUid` with list search method `searchPageReferences`.
- `mediumUid` with list search method `searchMedia`.
- `scriptName` with list search method `searchScripts`.
- `bodyName` with list search method `searchBodies`.
- `sectionName` with list search method `searchSections`.

Each locator must use:

```ts
type: 'resourceLocator',
default: { mode: 'list', value: '' },
modes: [
	{
		displayName: 'From List',
		name: 'list',
		type: 'list',
		typeOptions: {
			searchListMethod: '<methodName>',
			searchable: true,
		},
	},
	{
		displayName: 'By ID',
		name: 'id',
		type: 'string',
	},
],
```

Use `By Name` instead of `By ID` for `scriptName`, `bodyName`, and `sectionName`.

- [ ] **Step 2: Add load-options methods**

Add methods using these endpoints:

- `searchPages`: `/v1/projects/${projectId}/pages/`
- `searchPageReferences`: `/v1/projects/${projectId}/page-references/`
- `searchScripts`: `/v1/projects/${projectId}/scripts/`
- `searchBodies`: `/v1/projects/${projectId}/pages/${pageUid}/bodies`

For `searchMedia`, use project search if the media list endpoint is not available:

```ts
const response = await crownpeakApiRequest(this, 'GET', `/v1/projects/${projectId}/search?q=${encodeURIComponent(filter ?? '')}&page=0&size=20`);
```

For `searchSections`, call the selected body endpoint:

```ts
const response = await crownpeakApiRequest(this, 'GET', `/v1/projects/${projectId}/pages/${pageUid}/bodies/${bodyName}`);
```

Normalize arrays from common response keys using the existing `asArray` helper. If a response does not expose a reliable array, return `{ results: [] }`.

- [ ] **Step 3: Use locator helper in execution**

Wrap all reads of these parameters with `getLocatorValue(...)`:

- `pageReferenceUid`
- `mediumUid`
- `pageUid`
- `bodyName`
- `sectionName`
- `scriptName`

- [ ] **Step 4: Add tests**

Extend `tests/CrownpeakFS.test.ts` with a table assertion:

```ts
it.each([
	'pageUid',
	'pageReferenceUid',
	'mediumUid',
	'scriptName',
	'bodyName',
	'sectionName',
])('should expose %s as a resource locator', (parameterName) => {
	const property = node.description.properties.find((candidate) => candidate.name === parameterName);

	expect(property?.type).toBe('resourceLocator');
});
```

- [ ] **Step 5: Run verification**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add nodes/CrownpeakFS/CrownpeakFS.node.ts nodes/CrownpeakFS/descriptions/locators.ts nodes/CrownpeakFS/methods/loadOptions.ts tests/CrownpeakFS.test.ts
git commit -m "feat: add dependent FirstSpirit resource locators"
```

## Task 8: Improve Helper Descriptions and Operation Labels

**Files:**
- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts`
- Modify: `tests/CrownpeakFS.test.ts`

- [ ] **Step 1: Add description coverage test**

Add this test:

```ts
it('should provide descriptions for all visible user input fields', () => {
	const fieldsWithoutDescriptions = node.description.properties
		.filter((property) => !['resource', 'operation'].includes(property.name))
		.filter((property) => property.type !== 'notice')
		.filter((property) => !property.description || property.description.trim().length < 12)
		.map((property) => property.name);

	expect(fieldsWithoutDescriptions).toEqual([]);
});
```

- [ ] **Step 2: Update descriptions**

Use these descriptions:

- `projectId`: `FirstSpirit project to use for this operation.`
- `pageReferenceUid`: `Page reference to read or update within the selected project.`
- `mediumUid`: `Media item to read or upload binary data to.`
- `searchQuery`: `Search terms to send to the FirstSpirit project search endpoint.`
- `pageNumber`: `Zero-based page number to request when return-all pagination is disabled.`
- `pageSize`: `Number of search results to request per page.`
- `editorName`: `Technical input component name from the page or section form.`
- `pageUid`: `Page to read, update, or use as the parent for body and section operations.`
- `bodyName`: `Page body that contains the target section.`
- `sectionName`: `Section within the selected page body.`
- `scriptName`: `FirstSpirit script to execute.`
- `binaryPropertyName`: `Name of the input binary property that contains the file to upload.`
- `content`: `JSON request body to send to the FirstSpirit REST API for this operation.`

- [ ] **Step 3: Normalize operation labels without changing values**

Keep operation `value` fields stable. Adjust `name` and `action` fields toward n8n style while preserving meaning. Example:

```ts
{
	name: 'Get',
	value: 'getProject',
	action: 'Get project',
}
```

For resources that have multiple target entities, include the entity in the operation name:

```ts
{
	name: 'Get Form Input',
	value: 'getInputElementOfForm',
	action: 'Get page form input',
}
```

- [ ] **Step 4: Run verification**

Run:

```bash
npm test -- tests/CrownpeakFS.test.ts
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add nodes/CrownpeakFS/CrownpeakFS.node.ts tests/CrownpeakFS.test.ts
git commit -m "feat: improve node labels and helper descriptions"
```

## Task 9: Add Pagination Controls for Search and List Operations

**Files:**
- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts`
- Modify: `tests/CrownpeakFS.test.ts`

- [ ] **Step 1: Add pagination parameters**

For list and search operations, add:

```ts
{
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			operation: ['searchProject'],
		},
	},
	description: 'Whether to return all matching results instead of only one page.',
}
```

Add `Limit`:

```ts
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 50,
	typeOptions: {
		minValue: 1,
	},
	displayOptions: {
		show: {
			operation: ['searchProject'],
			returnAll: [true],
		},
	},
	description: 'Maximum number of results to return.',
}
```

Keep `Page Number` and `Page Size` visible when `returnAll` is false.

- [ ] **Step 2: Implement return-all for search**

For `searchProject`, when `returnAll` is true, loop pages until the number of returned results reaches `limit` or a response page contains fewer than `pageSize` items. Normalize the returned shape defensively:

```ts
const collected: IDataObject[] = [];
let page = 0;
const size = Math.min(limit, 100);

while (collected.length < limit) {
	const searchParams = new URLSearchParams({ q, page: String(page), size: String(size) });
	const response = await crownpeakApiRequest<IDataObject>(this, 'GET', `/v1/projects/${id}/search?${searchParams.toString()}`);
	const pageItems = Array.isArray(response.items) ? (response.items as IDataObject[]) : [];
	collected.push(...pageItems);

	if (pageItems.length < size) {
		break;
	}

	page += 1;
}

items[i].json = { items: collected.slice(0, limit) };
continue;
```

- [ ] **Step 3: Add tests**

Add assertions that `returnAll` and `limit` properties exist and include descriptions.

- [ ] **Step 4: Run verification**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add nodes/CrownpeakFS/CrownpeakFS.node.ts tests/CrownpeakFS.test.ts
git commit -m "feat: add pagination controls for search"
```

## Task 10: Update Documentation and Migration Notes

**Files:**
- Modify: `README.md`
- Modify: `docs/development.md`
- Modify: `docs/community-verification.md`

- [ ] **Step 1: Document resource selectors**

In `README.md`, add:

```md
## Resource Selection

Where the FirstSpirit REST API exposes list or search endpoints, the node lets you select resources from n8n resource locators. Each locator keeps a manual ID or name mode for expressions and advanced workflows.
```

- [ ] **Step 2: Document binary upload migration**

Add:

```md
## Media Uploads

Media uploads use n8n binary input data. Provide an incoming binary property, then set `Binary Property` to that property name. Local file path uploads are not supported because verified community nodes must not read files from the n8n host filesystem.
```

- [ ] **Step 3: Update verification doc**

In `docs/community-verification.md`, mark the filesystem upload blocker as resolved after static tests pass:

```md
Runtime filesystem upload behavior has been replaced with n8n binary data. Static tests guard against reintroducing `node:fs`, `node:path`, or `form-data` in runtime node code.
```

- [ ] **Step 4: Run verification**

Run:

```bash
rg -n "File Path|local file path uploads are supported|FIXME|XXX" README.md docs nodes/CrownpeakFS
npm run lint
npm test
npm run build
```

Expected:

- The `rg` command only finds intentional migration text that states local file path uploads are not supported.
- Lint passes.
- Tests pass.
- Build passes.

- [ ] **Step 5: Commit**

```bash
git add README.md docs/development.md docs/community-verification.md
git commit -m "docs: document selectors and binary upload migration"
```

## Task 11: Final UX Verification

**Files:**
- Modify only if verification finds a concrete issue.

- [ ] **Step 1: Run full verification**

Run:

```bash
npm run lint
npm test
npm run build
rg -n "from 'node:fs'|from \"node:fs\"|from 'form-data'|from \"form-data\"|File Path" nodes tests package.json
```

Expected:

- Lint passes.
- Tests pass.
- Build passes.
- `rg` finds no runtime `node:fs`, runtime `form-data`, or `File Path` parameter references.

- [ ] **Step 2: Manually test in local n8n**

Run:

```bash
npm run build
npm link
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm link n8n-nodes-crownpeak-fs
npx n8n
```

Expected:

- The node appears as `FirstSpirit REST API`.
- Project selector loads after valid credentials are configured.
- Manual project ID mode remains available.
- Media upload uses `Binary Property`, not `File Path`.

- [ ] **Step 3: Prepare pull request summary**

Use this PR summary:

```md
## Summary

Improves the FirstSpirit REST API node UX with resource locators, dynamic selectors, clearer helper text, n8n binary-data uploads, and verified-compatible runtime constraints.

## Verification

- `npm run lint`
- `npm test`
- `npm run build`
- Local n8n smoke test

## Migration Notes

Media uploads now use n8n binary input data. Workflows that used the previous `File Path` parameter must provide binary input and set `Binary Property`.
```

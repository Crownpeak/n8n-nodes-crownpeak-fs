# Node UX Polish Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unified `Content` JSON field with typed fields plus an `Additional Properties` escape hatch, shorten operation labels, and ship the smoke-test and live-API-validation runbooks needed before Community-Node submission.

**Architecture:** Add a `buildRequestBody(typed, additional?)` merge helper in `helpers/options.ts`. Split per-operation typed-field property arrays into `descriptions/createUpdateFields.ts`. Add two new load-options methods (`searchSectionTemplates`, `searchPageTemplates`) and a `descriptions/sharedOptions.ts` for reusable dropdowns. Wire the new fields into the existing `execute()` switch by replacing each `JSON.parse(content)` call with `buildRequestBody(...)`. Keep all operation `value` strings unchanged.

**Tech Stack:** TypeScript, n8n-workflow node APIs, Jest, ESLint.

---

## File Plan

- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts` — rename `displayName`s, remove the shared `content` property, import per-operation field arrays, replace `JSON.parse(content)` with `buildRequestBody(...)`, add template locator usage to `createPage` and `addSectionToBody`.
- Create: `nodes/CrownpeakFS/descriptions/createUpdateFields.ts` — one exported `INodeProperties[]` constant per Group A/B/C operation.
- Create: `nodes/CrownpeakFS/descriptions/sharedOptions.ts` — `mediumTypeOptions`, `editorTypeOptions`, `pageReferenceActionOptions`, `dependentReleaseTypeOptions`, `templateLocator`, `sectionTemplateLocator`.
- Modify: `nodes/CrownpeakFS/helpers/options.ts` — add `buildRequestBody(typed, additional)` with filter-undefined + parse + merge semantics.
- Modify: `nodes/CrownpeakFS/methods/loadOptions.ts` — add `searchSectionTemplates` and `searchPageTemplates`.
- Delete: `nodes/CrownpeakFS/descriptions/CrownpeakFS.node.options.ts` — unused legacy file.
- Create: `tests/buildRequestBody.test.ts`
- Create: `tests/operationLabels.test.ts`
- Create: `tests/createUpdateFields.test.ts`
- Create: `tests/loadOptionsTemplates.test.ts`
- Modify: `tests/CrownpeakFS.test.ts` — keep in sync with property tree.
- Create: `docs/smoke-tests.md`
- Create: `docs/live-api-validation.md`
- Create: `docs/fixtures/live-api-validation-workflow.json`
- Modify: `docs/community-verification.md` — reference both new docs.
- Modify: `README.md` — note the `Content` → typed + `Additional Properties` change with a short migration paragraph.

---

## Task 1: Add Label and Legacy-File Static Tests

**Files:**
- Create: `tests/operationLabels.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/operationLabels.test.ts`:

```ts
import fs from 'node:fs';
import path from 'node:path';
import { CrownpeakFS } from '../nodes/CrownpeakFS/CrownpeakFS.node';

const legacyOptionsPath = path.join(
	__dirname,
	'..',
	'nodes',
	'CrownpeakFS',
	'descriptions',
	'CrownpeakFS.node.options.ts',
);

function findOperationByValue(description: any, resource: string, value: string) {
	const operationGroups = description.properties.filter(
		(p: any) =>
			p.name === 'operation' &&
			(p.displayOptions?.show?.resource ?? []).includes(resource),
	);
	for (const group of operationGroups) {
		const op = (group.options as any[]).find((o) => o.value === value);
		if (op) return op;
	}
	return undefined;
}

describe('operation labels', () => {
	const node = new CrownpeakFS();
	const description = node.description as any;

	it('removes the legacy unused options file', () => {
		expect(fs.existsSync(legacyOptionsPath)).toBe(false);
	});

	it.each([
		['media', 'getBinaryDataOfMedium', 'Download Binary'],
		['media', 'uploadBinaryDataToMedium', 'Upload Binary'],
		['media', 'createMedium', 'Create'],
		['media', 'getMedium', 'Get'],
		['project', 'listProjects', 'Get Many'],
		['project', 'getProject', 'Get'],
		['search', 'searchProject', 'Search'],
		['pageReference', 'listPageReferences', 'Get Many'],
		['pageReference', 'createPageReference', 'Create'],
		['pageReference', 'getPageReferenceByUid', 'Get'],
		['pageReference', 'executeActionsOnPage', 'Execute Action'],
		['template', 'listSectionTemplates', 'Get Many Section Templates'],
		['template', 'createSectionTemplate', 'Create Section Template'],
		['template', 'listPageTemplates', 'Get Many Page Templates'],
		['template', 'createPageTemplate', 'Create Page Template'],
		['page', 'listPages', 'Get Many'],
		['page', 'createPage', 'Create'],
		['page', 'getPage', 'Get'],
		['page', 'addSectionToBody', 'Add Section to Body'],
		['page', 'getBodiesOfPage', 'Get Bodies'],
		['page', 'getBodyOfPageByName', 'Get Body'],
		['page', 'getInputElementOfForm', 'Get Page Input Element'],
		['page', 'updateInputElementOfForm', 'Update Page Input Element'],
		['page', 'getInputElementOfSectionForm', 'Get Section Input Element'],
		['page', 'updateInputElementOfSectionForm', 'Update Section Input Element'],
		['page', 'getInputElementsOfFormFromPage', 'Get Page Form'],
		['page', 'getInputElementsOfSectionFormFromPage', 'Get Section Form'],
		['script', 'listScripts', 'Get Many'],
		['script', 'executeScript', 'Execute'],
	])('renames %s operation %s to "%s"', (resource, value, displayName) => {
		const op = findOperationByValue(description, resource, value);
		expect(op).toBeDefined();
		expect(op.name).toBe(displayName);
	});
});
```

- [ ] **Step 2: Run the tests and confirm failure**

Run: `npm test -- tests/operationLabels.test.ts`

Expected: FAIL. The legacy file still exists and current labels do not match the new names.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/operationLabels.test.ts
git commit -m "test: add failing operation-label and legacy-file tests"
```

---

## Task 2: Rename Operation Labels and Remove Legacy File

**Files:**
- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts:119-351` — change every `name:` inside an operation `options[]` entry to the new label from the table below. Do not change `value:` strings.
- Delete: `nodes/CrownpeakFS/descriptions/CrownpeakFS.node.options.ts`

- [ ] **Step 1: Apply the renames**

Replace each operation-options entry's `name` field. Concrete pairs (old → new):

```
'Get Binary Data Of Medium'               -> 'Download Binary'
'Upload Binary Data To Medium'            -> 'Upload Binary'
'Create Medium'                            -> 'Create'
'Get Medium'                               -> 'Get'
'List Projects'                            -> 'Get Many'
'Get Project'                              -> 'Get'
'Search Project'                           -> 'Search'
'List Page References'                     -> 'Get Many'
'Create Page Reference'                    -> 'Create'
'Get Page Reference By UID'                -> 'Get'
'Execute Actions On Page'                  -> 'Execute Action'
'List Section Templates'                   -> 'Get Many Section Templates'
'Create Section Template'                  -> 'Create Section Template'
'List Page Templates'                      -> 'Get Many Page Templates'
'Create Page Template'                     -> 'Create Page Template'
'List Pages'                               -> 'Get Many'
'Create Page'                              -> 'Create'
'Get Page'                                 -> 'Get'
'Add Section To Body'                      -> 'Add Section to Body'
'Get Bodies Of Page'                       -> 'Get Bodies'
'Get Body Of Page By Name'                 -> 'Get Body'
'Get Input Element Of Form'                -> 'Get Page Input Element'
'Update Input Element Of Form'             -> 'Update Page Input Element'
'Get Input Element Of Section Form'        -> 'Get Section Input Element'
'Update Input Element Of Section Form'     -> 'Update Section Input Element'
'Get Input Elements Of Form From Page'     -> 'Get Page Form'
'Get Bodies Of Page'                       -> 'Get Bodies'
'Get Input Elements Of Section Form From Page' -> 'Get Section Form'
'List Scripts'                             -> 'Get Many'
'Execute Script'                           -> 'Execute'
```

- [ ] **Step 2: Delete the legacy options file**

```bash
git rm nodes/CrownpeakFS/descriptions/CrownpeakFS.node.options.ts
```

- [ ] **Step 3: Run the label tests**

Run: `npm test -- tests/operationLabels.test.ts`

Expected: PASS.

- [ ] **Step 4: Run the full test suite to catch regressions**

Run: `npm test`

Expected: PASS. If `tests/CrownpeakFS.test.ts` snapshots property text, update the snapshot. Investigate any other failures before continuing.

- [ ] **Step 5: Commit**

```bash
git add nodes/CrownpeakFS/CrownpeakFS.node.ts tests
git commit -m "feat: rename operation labels to short verb form and remove legacy options file"
```

---

## Task 3: Add buildRequestBody Helper

**Files:**
- Create: `tests/buildRequestBody.test.ts`
- Modify: `nodes/CrownpeakFS/helpers/options.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/buildRequestBody.test.ts`:

```ts
import { buildRequestBody } from '../nodes/CrownpeakFS/helpers/options';

describe('buildRequestBody', () => {
	it('returns the typed object when no additional is given', () => {
		expect(buildRequestBody({ uid: 'home', templateUid: 'page' })).toEqual({
			uid: 'home',
			templateUid: 'page',
		});
	});

	it('drops undefined and empty-string values from typed', () => {
		expect(
			buildRequestBody({ uid: 'home', description: '', count: undefined as any, flag: false }),
		).toEqual({ uid: 'home', flag: false });
	});

	it('returns the typed object when additional is an empty string', () => {
		expect(buildRequestBody({ uid: 'home' }, '')).toEqual({ uid: 'home' });
	});

	it('returns the typed object when additional is "{}"', () => {
		expect(buildRequestBody({ uid: 'home' }, '{}')).toEqual({ uid: 'home' });
	});

	it('merges additional into typed, with typed winning on collision', () => {
		expect(
			buildRequestBody({ uid: 'home' }, '{"description":"Home page","uid":"ignored"}'),
		).toEqual({ uid: 'home', description: 'Home page' });
	});

	it('lets additional fill in keys that typed left undefined', () => {
		expect(
			buildRequestBody({ uid: 'home', type: undefined as any }, '{"type":"PICTURE"}'),
		).toEqual({ uid: 'home', type: 'PICTURE' });
	});

	it('throws on invalid JSON', () => {
		expect(() => buildRequestBody({}, 'not json')).toThrow(/Additional Properties must be valid JSON/);
	});

	it('throws when additional parses to non-object', () => {
		expect(() => buildRequestBody({}, '"a string"')).toThrow(
			/Additional Properties must be a JSON object/,
		);
		expect(() => buildRequestBody({}, '[1, 2]')).toThrow(
			/Additional Properties must be a JSON object/,
		);
		expect(() => buildRequestBody({}, 'null')).toThrow(
			/Additional Properties must be a JSON object/,
		);
	});
});
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `npm test -- tests/buildRequestBody.test.ts`

Expected: FAIL — function not exported.

- [ ] **Step 3: Implement the helper**

Append to `nodes/CrownpeakFS/helpers/options.ts`:

```ts
import { IDataObject } from 'n8n-workflow';

export function buildRequestBody(typed: IDataObject, additional?: string): IDataObject {
	const filtered: IDataObject = {};
	for (const [key, value] of Object.entries(typed)) {
		if (value === undefined) continue;
		if (typeof value === 'string' && value === '') continue;
		filtered[key] = value;
	}

	if (additional === undefined || additional === '' || additional === '{}') {
		return filtered;
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(additional);
	} catch {
		throw new Error('Additional Properties must be valid JSON');
	}

	if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('Additional Properties must be a JSON object');
	}

	return { ...(parsed as IDataObject), ...filtered };
}
```

If `nodes/CrownpeakFS/helpers/options.ts` does not already import `IDataObject`, keep the existing imports and add the import line shown above.

- [ ] **Step 4: Run the tests**

Run: `npm test -- tests/buildRequestBody.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add nodes/CrownpeakFS/helpers/options.ts tests/buildRequestBody.test.ts
git commit -m "feat: add buildRequestBody helper with Additional Properties merge"
```

---

## Task 4: Add Template Load-Options Methods

**Files:**
- Create: `tests/loadOptionsTemplates.test.ts`
- Modify: `nodes/CrownpeakFS/methods/loadOptions.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/loadOptionsTemplates.test.ts`:

```ts
import { loadOptions } from '../nodes/CrownpeakFS/methods/loadOptions';

function buildContext(response: unknown, projectId = '42') {
	return {
		getCurrentNodeParameter: jest.fn().mockReturnValue(projectId),
		helpers: {
			httpRequestWithAuthentication: jest.fn().mockResolvedValue(response),
		},
		getCredentials: jest.fn().mockResolvedValue({
			username: 'u',
			password: 'p',
			baseUrl: 'https://fs.example.com',
		}),
	};
}

describe('loadOptions templates', () => {
	it('lists section templates for the current project', async () => {
		const context = buildContext([
			{ uid: 'text', displayName: 'Text', id: 1 },
			{ uid: 'image', displayName: 'Image', id: 2 },
		]);
		const result = await loadOptions.searchSectionTemplates.call(context as any);
		expect(result.results).toEqual([
			{ name: 'Text', value: 'text' },
			{ name: 'Image', value: 'image' },
		]);
	});

	it('filters section templates by lowercase substring', async () => {
		const context = buildContext([
			{ uid: 'text', displayName: 'Text Section', id: 1 },
			{ uid: 'image', displayName: 'Image Section', id: 2 },
		]);
		const result = await loadOptions.searchSectionTemplates.call(context as any, 'IMAGE');
		expect(result.results).toEqual([{ name: 'Image Section', value: 'image' }]);
	});

	it('lists page templates for the current project', async () => {
		const context = buildContext([{ uid: 'standard', displayName: 'Standard', id: 7 }]);
		const result = await loadOptions.searchPageTemplates.call(context as any);
		expect(result.results).toEqual([{ name: 'Standard', value: 'standard' }]);
	});
});
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `npm test -- tests/loadOptionsTemplates.test.ts`

Expected: FAIL — methods do not exist.

- [ ] **Step 3: Add the methods**

In `nodes/CrownpeakFS/methods/loadOptions.ts`, add inside the `loadOptions` object, before the closing brace:

```ts
	async searchSectionTemplates(
		this: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		const projectId = currentLocatorValue(this, 'projectId');
		const response = await crownpeakApiRequest(
			this,
			'GET',
			`/v1/projects/${projectId}/section-templates/`,
		);
		const options = toNameValueOptions(asArray(response), ['name', 'displayName', 'uid', 'id'], [
			'uid',
			'id',
			'name',
		]);

		return {
			results: filterOptions(options, filter),
		};
	},

	async searchPageTemplates(
		this: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		const projectId = currentLocatorValue(this, 'projectId');
		const response = await crownpeakApiRequest(
			this,
			'GET',
			`/v1/projects/${projectId}/page-templates/`,
		);
		const options = toNameValueOptions(asArray(response), ['name', 'displayName', 'uid', 'id'], [
			'uid',
			'id',
			'name',
		]);

		return {
			results: filterOptions(options, filter),
		};
	},
```

If the existing tests in `tests/options.test.ts` mock `httpRequestWithAuthentication` via `crownpeakApiRequest`, mirror that mocking shape. If they mock at a different layer, adjust the test context in step 1 to use the same shape — but keep the assertions unchanged.

- [ ] **Step 4: Run the tests**

Run: `npm test -- tests/loadOptionsTemplates.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add nodes/CrownpeakFS/methods/loadOptions.ts tests/loadOptionsTemplates.test.ts
git commit -m "feat: add section-template and page-template load options"
```

---

## Task 5: Add sharedOptions Module

**Files:**
- Create: `nodes/CrownpeakFS/descriptions/sharedOptions.ts`

- [ ] **Step 1: Create the module**

Create `nodes/CrownpeakFS/descriptions/sharedOptions.ts`:

```ts
import { INodePropertyOptions, INodeProperties } from 'n8n-workflow';

export const mediumTypeOptions: INodePropertyOptions[] = [
	{ name: 'Picture', value: 'PICTURE' },
	{ name: 'File', value: 'FILE' },
];

export const pageReferenceActionOptions: INodePropertyOptions[] = [
	{ name: 'Copy', value: 'copy' },
	{ name: 'Release', value: 'release' },
];

export const dependentReleaseTypeOptions: INodePropertyOptions[] = [
	{ name: 'No Dependent Release', value: 'NO_DEPENDENT_RELEASE' },
	{ name: 'Dependent Release', value: 'DEPENDENT_RELEASE' },
	{ name: 'Dependent Release (New Only)', value: 'DEPENDENT_RELEASE_NEW_ONLY' },
];

export const editorTypeOptions: INodePropertyOptions[] = [
	{ name: 'Text', value: 'CMS_INPUT_TEXT' },
	{ name: 'Text Area', value: 'CMS_INPUT_TEXTAREA' },
	{ name: 'Number', value: 'CMS_INPUT_NUMBER' },
	{ name: 'Date', value: 'CMS_INPUT_DATE' },
	{ name: 'DOM (Rich Text)', value: 'CMS_INPUT_DOM' },
	{ name: 'DOM Table', value: 'CMS_INPUT_DOMTABLE' },
	{ name: 'Toggle', value: 'CMS_INPUT_TOGGLE' },
	{ name: 'Checkbox', value: 'CMS_INPUT_CHECKBOX' },
	{ name: 'Combobox', value: 'CMS_INPUT_COMBOBOX' },
	{ name: 'List', value: 'CMS_INPUT_LIST' },
	{ name: 'Radio Button', value: 'CMS_INPUT_RADIOBUTTON' },
	{ name: 'Link', value: 'CMS_INPUT_LINK' },
	{ name: 'Image Map', value: 'CMS_INPUT_IMAGEMAP' },
	{ name: 'Reference', value: 'FS_REFERENCE' },
	{ name: 'Catalog', value: 'FS_CATALOG' },
	{ name: 'Dataset', value: 'FS_DATASET' },
	{ name: 'Index', value: 'FS_INDEX' },
];

export const pageTemplateLocator: INodeProperties = {
	displayName: 'Page Template',
	name: 'templateUid',
	type: 'resourceLocator',
	required: true,
	default: { mode: 'list', value: '' },
	description: 'The page template the new page is based on',
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			typeOptions: {
				searchListMethod: 'searchPageTemplates',
				searchable: true,
			},
		},
		{
			displayName: 'By UID',
			name: 'uid',
			type: 'string',
			placeholder: 'standard',
		},
	],
};

export const sectionTemplateLocator: INodeProperties = {
	displayName: 'Section Template',
	name: 'sectionTemplateUid',
	type: 'resourceLocator',
	required: true,
	default: { mode: 'list', value: '' },
	description: 'The section template to use for the new section',
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			typeOptions: {
				searchListMethod: 'searchSectionTemplates',
				searchable: true,
			},
		},
		{
			displayName: 'By UID',
			name: 'uid',
			type: 'string',
			placeholder: 'text',
		},
	],
};
```

If `descriptions/locators.ts` already defines a locator with an identical shape, prefer using that and remove the duplicate from this file. The two locators above are added here because there is currently no template-related locator in `descriptions/locators.ts` — verify by reading that file before creating duplicates.

- [ ] **Step 2: Compile to catch type errors**

Run: `npx tsc --noEmit`

Expected: PASS. Fix any type errors in `sharedOptions.ts` before continuing.

- [ ] **Step 3: Commit**

```bash
git add nodes/CrownpeakFS/descriptions/sharedOptions.ts
git commit -m "feat: add shared option arrays and template resource locators"
```

---

## Task 6: Add createUpdateFields Descriptions

**Files:**
- Create: `nodes/CrownpeakFS/descriptions/createUpdateFields.ts`
- Create: `tests/createUpdateFields.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/createUpdateFields.test.ts`:

```ts
import {
	createMediumFields,
	createPageFields,
	createPageReferenceFields,
	createPageTemplateFields,
	createSectionTemplateFields,
	addSectionToBodyFields,
	executeActionsOnPageFields,
	updateInputElementFields,
	updateInputElementOfSectionFields,
} from '../nodes/CrownpeakFS/descriptions/createUpdateFields';

function names(properties: any[]) {
	return properties.map((p) => p.name);
}

describe('createUpdateFields property arrays', () => {
	it('createMedium has uid, filename, type, additionalProperties', () => {
		expect(names(createMediumFields)).toEqual([
			'uid',
			'filename',
			'type',
			'additionalProperties',
		]);
	});

	it('createPage has uid, templateUid, additionalProperties', () => {
		expect(names(createPageFields)).toEqual(['uid', 'templateUid', 'additionalProperties']);
	});

	it('createPageReference has uid, pageId, location, additionalProperties', () => {
		expect(names(createPageReferenceFields)).toEqual([
			'uid',
			'pageId',
			'location',
			'additionalProperties',
		]);
	});

	it('createPageTemplate has uid, name, description, bodies, additionalProperties', () => {
		expect(names(createPageTemplateFields)).toEqual([
			'uid',
			'name',
			'description',
			'bodies',
			'additionalProperties',
		]);
	});

	it('createSectionTemplate has uid, name, description, additionalProperties', () => {
		expect(names(createSectionTemplateFields)).toEqual([
			'uid',
			'name',
			'description',
			'additionalProperties',
		]);
	});

	it('addSectionToBody has only sectionTemplateUid (no additionalProperties)', () => {
		expect(names(addSectionToBodyFields)).toEqual(['sectionTemplateUid']);
	});

	it('executeActionsOnPage has action and releaseOptions', () => {
		expect(names(executeActionsOnPageFields)).toEqual(['action', 'releaseOptions']);
	});

	it('updateInputElementFields has the FormEditorDTO surface', () => {
		expect(names(updateInputElementFields)).toEqual([
			'inputElementName',
			'inputElementType',
			'language',
			'inputElementDescription',
			'inputElementConfiguration',
			'inputElementContent',
		]);
	});

	it('updateInputElementOfSectionFields mirrors updateInputElementFields', () => {
		expect(names(updateInputElementOfSectionFields)).toEqual(
			names(updateInputElementFields),
		);
	});

	it('all required-marked fields have required:true', () => {
		const expectedRequired: Record<string, string[]> = {
			createMedium: ['uid', 'filename', 'type'],
			createPage: ['uid', 'templateUid'],
			createPageReference: ['uid', 'pageId', 'location'],
			createPageTemplate: ['uid', 'name'],
			createSectionTemplate: ['uid', 'name'],
		};
		const sources: Record<string, any[]> = {
			createMedium: createMediumFields,
			createPage: createPageFields,
			createPageReference: createPageReferenceFields,
			createPageTemplate: createPageTemplateFields,
			createSectionTemplate: createSectionTemplateFields,
		};
		for (const op of Object.keys(expectedRequired)) {
			for (const required of expectedRequired[op]) {
				const field = sources[op].find((f) => f.name === required);
				expect(field?.required).toBe(true);
			}
		}
	});
});
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `npm test -- tests/createUpdateFields.test.ts`

Expected: FAIL — module does not exist.

- [ ] **Step 3: Create the descriptions module**

Create `nodes/CrownpeakFS/descriptions/createUpdateFields.ts`:

```ts
import { INodeProperties } from 'n8n-workflow';
import {
	mediumTypeOptions,
	pageReferenceActionOptions,
	dependentReleaseTypeOptions,
	editorTypeOptions,
	pageTemplateLocator,
	sectionTemplateLocator,
} from './sharedOptions';

const additionalPropertiesField: INodeProperties = {
	displayName: 'Additional Properties',
	name: 'additionalProperties',
	type: 'json',
	default: '{}',
	typeOptions: { alwaysOpenEditWindow: true },
	description:
		'Optional JSON object merged into the request body. Typed fields above win on key collision; use this field to add keys the typed UI does not cover yet.',
};

export const createMediumFields: INodeProperties[] = [
	{
		displayName: 'UID',
		name: 'uid',
		type: 'string',
		required: true,
		default: '',
		description: 'Unique identifier for the medium',
	},
	{
		displayName: 'Filename',
		name: 'filename',
		type: 'string',
		required: true,
		default: '',
		description: 'Filename of the medium without extension',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		default: 'PICTURE',
		options: mediumTypeOptions,
		description: 'Whether the medium holds a picture or a generic file',
	},
	additionalPropertiesField,
];

export const createPageFields: INodeProperties[] = [
	{
		displayName: 'UID',
		name: 'uid',
		type: 'string',
		required: true,
		default: '',
		description: 'Unique identifier for the page',
	},
	pageTemplateLocator,
	additionalPropertiesField,
];

export const createPageReferenceFields: INodeProperties[] = [
	{
		displayName: 'UID',
		name: 'uid',
		type: 'string',
		required: true,
		default: '',
		description: 'Unique identifier for the page reference',
	},
	{
		displayName: 'Page ID',
		name: 'pageId',
		type: 'number',
		required: true,
		default: 0,
		description: 'Numeric ID of the page being referenced',
	},
	{
		displayName: 'Location',
		name: 'location',
		type: 'string',
		required: true,
		default: '/',
		placeholder: '/products/',
		description: 'Path in the page-reference folder structure',
	},
	additionalPropertiesField,
];

export const createPageTemplateFields: INodeProperties[] = [
	{
		displayName: 'UID',
		name: 'uid',
		type: 'string',
		required: true,
		default: '',
		description: 'Unique identifier for the page template',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Display name for the page template',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description of the page template',
	},
	{
		displayName: 'Bodies',
		name: 'bodies',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		placeholder: 'Add Body',
		description: 'Body slots defined by this page template',
		options: [
			{
				name: 'body',
				displayName: 'Body',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Technical body name (e.g. "content")',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description shown to editors',
					},
				],
			},
		],
	},
	additionalPropertiesField,
];

export const createSectionTemplateFields: INodeProperties[] = [
	{
		displayName: 'UID',
		name: 'uid',
		type: 'string',
		required: true,
		default: '',
		description: 'Unique identifier for the section template',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Display name for the section template',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description of the section template',
	},
	additionalPropertiesField,
];

export const addSectionToBodyFields: INodeProperties[] = [sectionTemplateLocator];

export const executeActionsOnPageFields: INodeProperties[] = [
	{
		displayName: 'Action',
		name: 'action',
		type: 'options',
		required: true,
		default: 'copy',
		options: pageReferenceActionOptions,
		description: 'The action to perform on the page reference',
	},
	{
		displayName: 'Release Options',
		name: 'releaseOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add Option',
		displayOptions: { show: { action: ['release'] } },
		options: [
			{
				displayName: 'Check Only',
				name: 'checkOnly',
				type: 'boolean',
				default: false,
				description: 'Whether to validate the release without performing it',
			},
			{
				displayName: 'Dependent Release Type',
				name: 'dependentReleaseType',
				type: 'options',
				default: 'NO_DEPENDENT_RELEASE',
				options: dependentReleaseTypeOptions,
				description: 'How dependent objects are handled during release',
			},
			{
				displayName: 'Ensure Accessibility',
				name: 'ensureAccessibility',
				type: 'boolean',
				default: false,
				description: 'Whether to ensure accessibility prerequisites are met',
			},
			{
				displayName: 'Recursive',
				name: 'recursive',
				type: 'boolean',
				default: false,
				description: 'Whether to recurse into child elements',
			},
		],
	},
];

const inputElementCommonFields: INodeProperties[] = [
	{
		displayName: 'Input Element Name',
		name: 'inputElementName',
		type: 'string',
		required: true,
		default: '',
		description: 'Technical name of the input element to update',
	},
	{
		displayName: 'Input Element Type',
		name: 'inputElementType',
		type: 'options',
		required: true,
		default: 'CMS_INPUT_TEXT',
		options: editorTypeOptions,
		description: 'Editor type of the input element',
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: '',
		description: 'Language abbreviation (e.g. "en"). Empty means language-independent.',
	},
	{
		displayName: 'Description',
		name: 'inputElementDescription',
		type: 'string',
		default: '',
		description: 'Description of the input element',
	},
	{
		displayName: 'Configuration',
		name: 'inputElementConfiguration',
		type: 'json',
		default: '{}',
		typeOptions: { alwaysOpenEditWindow: true },
		description: 'Configuration map (keys depend on the editor type)',
	},
	{
		displayName: 'Content',
		name: 'inputElementContent',
		type: 'json',
		default: '""',
		typeOptions: { alwaysOpenEditWindow: true },
		description:
			'Content value. Shape depends on type: TEXT/TEXTAREA/NUMBER/DATE/DOM -> string; TOGGLE -> boolean; CHECKBOX/COMBOBOX/LIST/RADIO -> OptionDTO; LINK -> LinkDTO; FS_INDEX -> string[]; FS_CATALOG -> CardDTO[].',
	},
];

export const updateInputElementFields: INodeProperties[] = inputElementCommonFields;
export const updateInputElementOfSectionFields: INodeProperties[] = inputElementCommonFields;
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- tests/createUpdateFields.test.ts`

Expected: PASS.

- [ ] **Step 5: Compile**

Run: `npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add nodes/CrownpeakFS/descriptions/createUpdateFields.ts tests/createUpdateFields.test.ts
git commit -m "feat: add per-operation typed field descriptions"
```

---

## Task 7: Wire Typed Fields Into the Node

**Files:**
- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts`

This task wires the descriptions module into the node and replaces the unified `Content` field, then updates the `execute()` switch to read typed parameters via `buildRequestBody`.

- [ ] **Step 1: Import descriptions and helpers**

Near the top of `CrownpeakFS.node.ts`, add:

```ts
import {
	createMediumFields,
	createPageFields,
	createPageReferenceFields,
	createPageTemplateFields,
	createSectionTemplateFields,
	addSectionToBodyFields,
	executeActionsOnPageFields,
	updateInputElementFields,
	updateInputElementOfSectionFields,
} from './descriptions/createUpdateFields';
import { buildRequestBody } from './helpers/options';
```

- [ ] **Step 2: Remove the unified `Content` property**

Delete the entire property object beginning with `displayName: 'Content'` at `CrownpeakFS.node.ts:472-499` (the property that targets `createMedium`, `addSectionToBody`, `executeActionsOnPage`, `updateInputElementOfForm`, `updateInputElementOfSectionForm`, `createPage`, `createPageReference`, `executeScript`, `createSectionTemplate`, `createPageTemplate`).

In its place, insert wrapped property definitions for each operation. The pattern: take each entry in the per-operation field list and add a `displayOptions.show.{resource, operation}` wrapper around it. Add this just before the closing `]` of `properties: [...]`.

Helper: define a local function near the top of the file (outside the class):

```ts
function withDisplayOptions(
	properties: INodeProperties[],
	resource: string,
	operation: string,
): INodeProperties[] {
	return properties.map((property) => ({
		...property,
		displayOptions: {
			...(property.displayOptions ?? {}),
			show: {
				...(property.displayOptions?.show ?? {}),
				resource: [resource],
				operation: [operation],
			},
		},
	}));
}
```

Then add the import `INodeProperties` from `n8n-workflow` if not already present.

Spread the wrapped arrays into `properties`:

```ts
properties: [
	// ...existing properties (resource, operation groups, locators, search params, editorName, binary, etc.)
	...withDisplayOptions(createMediumFields, 'media', 'createMedium'),
	...withDisplayOptions(createPageFields, 'page', 'createPage'),
	...withDisplayOptions(createPageReferenceFields, 'pageReference', 'createPageReference'),
	...withDisplayOptions(createPageTemplateFields, 'template', 'createPageTemplate'),
	...withDisplayOptions(createSectionTemplateFields, 'template', 'createSectionTemplate'),
	...withDisplayOptions(addSectionToBodyFields, 'page', 'addSectionToBody'),
	...withDisplayOptions(executeActionsOnPageFields, 'pageReference', 'executeActionsOnPage'),
	...withDisplayOptions(updateInputElementFields, 'page', 'updateInputElementOfForm'),
	...withDisplayOptions(
		updateInputElementOfSectionFields,
		'page',
		'updateInputElementOfSectionForm',
	),
	// executeScript keeps a JSON content field — see step 3 below
],
```

- [ ] **Step 3: Add the executeScript-only JSON Parameters field**

After the `withDisplayOptions(...)` spreads, add:

```ts
{
	displayName: 'Script Parameters',
	name: 'scriptParameters',
	type: 'json',
	default: '{}',
	typeOptions: { alwaysOpenEditWindow: true },
	displayOptions: {
		show: {
			resource: ['script'],
			operation: ['executeScript'],
		},
	},
	description:
		'Parameters passed to the script as a JSON object. Structure depends on the script’s expected inputs.',
},
```

- [ ] **Step 4: Rewrite each affected switch branch to use buildRequestBody**

In `execute()`, replace these branches:

```ts
case 'createMedium': {
	const id = getLocatorValue(this.getNodeParameter('projectId', i));
	const typed = {
		uid: this.getNodeParameter('uid', i, '') as string,
		filename: this.getNodeParameter('filename', i, '') as string,
		type: this.getNodeParameter('type', i, '') as string,
	};
	const additional = this.getNodeParameter('additionalProperties', i, '{}') as string;
	url = `${baseUrl}/v1/projects/${id}/media`;
	body = buildRequestBody(typed, additional);
	method = 'POST';
	break;
}

case 'createPage': {
	const id = getLocatorValue(this.getNodeParameter('projectId', i));
	const typed = {
		uid: this.getNodeParameter('uid', i, '') as string,
		templateUid: getLocatorValue(this.getNodeParameter('templateUid', i)),
	};
	const additional = this.getNodeParameter('additionalProperties', i, '{}') as string;
	url = `${baseUrl}/v1/projects/${id}/pages`;
	body = buildRequestBody(typed, additional);
	method = 'POST';
	break;
}

case 'createPageReference': {
	const id = getLocatorValue(this.getNodeParameter('projectId', i));
	const typed = {
		uid: this.getNodeParameter('uid', i, '') as string,
		pageId: this.getNodeParameter('pageId', i, 0) as number,
		location: this.getNodeParameter('location', i, '') as string,
	};
	const additional = this.getNodeParameter('additionalProperties', i, '{}') as string;
	url = `${baseUrl}/v1/projects/${id}/page-references`;
	body = buildRequestBody(typed, additional);
	method = 'POST';
	break;
}

case 'createPageTemplate': {
	const id = getLocatorValue(this.getNodeParameter('projectId', i));
	const bodiesParam = this.getNodeParameter('bodies', i, {}) as {
		body?: Array<{ name: string; description?: string }>;
	};
	const bodies = (bodiesParam.body ?? []).map((b) => ({
		name: b.name,
		description: b.description ?? null,
	}));
	const typed = {
		uid: this.getNodeParameter('uid', i, '') as string,
		name: this.getNodeParameter('name', i, '') as string,
		description: this.getNodeParameter('description', i, '') as string,
		bodies: bodies.length > 0 ? bodies : undefined,
	};
	const additional = this.getNodeParameter('additionalProperties', i, '{}') as string;
	url = `${baseUrl}/v1/projects/${id}/page-templates`;
	body = buildRequestBody(typed as IDataObject, additional);
	method = 'POST';
	break;
}

case 'createSectionTemplate': {
	const id = getLocatorValue(this.getNodeParameter('projectId', i));
	const typed = {
		uid: this.getNodeParameter('uid', i, '') as string,
		name: this.getNodeParameter('name', i, '') as string,
		description: this.getNodeParameter('description', i, '') as string,
	};
	const additional = this.getNodeParameter('additionalProperties', i, '{}') as string;
	url = `${baseUrl}/v1/projects/${id}/section-templates`;
	body = buildRequestBody(typed, additional);
	method = 'POST';
	break;
}

case 'addSectionToBody': {
	const id = getLocatorValue(this.getNodeParameter('projectId', i));
	const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
	const bodyName = getLocatorValue(this.getNodeParameter('bodyName', i));
	const sectionName = getLocatorValue(this.getNodeParameter('sectionName', i));
	const templateUid = getLocatorValue(this.getNodeParameter('sectionTemplateUid', i));
	url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/${bodyName}/sections/${sectionName}`;
	body = { templateUid };
	method = 'PUT';
	break;
}

case 'executeActionsOnPage': {
	const id = getLocatorValue(this.getNodeParameter('projectId', i));
	const pageReferenceUid = getLocatorValue(this.getNodeParameter('pageReferenceUid', i));
	const action = this.getNodeParameter('action', i, 'copy') as string;
	const releaseOptions =
		action === 'release'
			? (this.getNodeParameter('releaseOptions', i, {}) as IDataObject)
			: undefined;
	url = `${baseUrl}/v1/projects/${id}/page-references/${pageReferenceUid}/actions`;
	body =
		action === 'release' && releaseOptions && Object.keys(releaseOptions).length > 0
			? { action, options: releaseOptions }
			: { action };
	method = 'POST';
	break;
}

case 'updateInputElementOfForm': {
	const id = getLocatorValue(this.getNodeParameter('projectId', i));
	const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
	const editorName = this.getNodeParameter('inputElementName', i, '') as string;
	const language = this.getNodeParameter('language', i, '') as string;
	const typed = {
		name: editorName,
		type: this.getNodeParameter('inputElementType', i, '') as string,
		language: language === '' ? null : language,
		description: this.getNodeParameter('inputElementDescription', i, '') as string,
		configuration: JSON.parse(
			this.getNodeParameter('inputElementConfiguration', i, '{}') as string,
		),
		content: JSON.parse(this.getNodeParameter('inputElementContent', i, '""') as string),
	};
	url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/form/${editorName}${
		language ? `/${language}` : ''
	}`;
	body = typed as IDataObject;
	method = 'PATCH';
	break;
}

case 'updateInputElementOfSectionForm': {
	const id = getLocatorValue(this.getNodeParameter('projectId', i));
	const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
	const bodyName = getLocatorValue(this.getNodeParameter('bodyName', i));
	const sectionName = getLocatorValue(this.getNodeParameter('sectionName', i));
	const editorName = this.getNodeParameter('inputElementName', i, '') as string;
	const language = this.getNodeParameter('language', i, '') as string;
	const typed = {
		name: editorName,
		type: this.getNodeParameter('inputElementType', i, '') as string,
		language: language === '' ? null : language,
		description: this.getNodeParameter('inputElementDescription', i, '') as string,
		configuration: JSON.parse(
			this.getNodeParameter('inputElementConfiguration', i, '{}') as string,
		),
		content: JSON.parse(this.getNodeParameter('inputElementContent', i, '""') as string),
	};
	url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/${bodyName}/sections/${sectionName}/form/${editorName}${
		language ? `/${language}` : ''
	}`;
	body = typed as IDataObject;
	method = 'PATCH';
	break;
}

case 'executeScript': {
	const id = getLocatorValue(this.getNodeParameter('projectId', i));
	const scriptName = getLocatorValue(this.getNodeParameter('scriptName', i));
	const params = this.getNodeParameter('scriptParameters', i, '{}') as string;
	url = `${baseUrl}/v1/projects/${id}/scripts/${scriptName}/execute`;
	body = buildRequestBody({}, params);
	method = 'POST';
	break;
}
```

Notes:
- `addSectionToBody` does not use `buildRequestBody` because there is no `Additional Properties` field for it — the backend rejects extra keys.
- The previous switch branch for `updateInputElementOfForm` may have read a top-level `editorName` parameter (the legacy text field at `CrownpeakFS.node.ts:432-453`). Remove that legacy `editorName` property from `properties: [...]` since the new `inputElementName` typed field replaces it.
- The same applies to `updateInputElementOfSectionForm`.
- Keep the existing read-side `getInputElementOfForm` and `getInputElementOfSectionForm` branches intact; those still need an editor-name parameter. Decide between (a) keeping the legacy `editorName` text field for those two read operations only, or (b) introducing a read-only `inputElementName` field on those two operations. Use approach (a) for minimal change: restrict the legacy `editorName` property's `displayOptions.show.operation` to only the two read operations.

- [ ] **Step 5: Restrict legacy editorName property**

Modify the property at `CrownpeakFS.node.ts:432-453` so its `displayOptions.show.operation` only contains `['getInputElementOfForm', 'getInputElementOfSectionForm']`. Remove `updateInputElementOfForm` and `updateInputElementOfSectionForm` from that list.

- [ ] **Step 6: Compile and test**

Run: `npx tsc --noEmit && npm test`

Expected: PASS. If `tests/CrownpeakFS.test.ts` makes assertions about the unified `content` property or about the legacy `editorName` covering update operations, update those assertions.

- [ ] **Step 7: Commit**

```bash
git add nodes/CrownpeakFS/CrownpeakFS.node.ts tests
git commit -m "feat: replace unified Content field with per-operation typed fields"
```

---

## Task 8: Update executeScript Helper Text

**Files:**
- Modify: `nodes/CrownpeakFS/CrownpeakFS.node.ts` — adjust the description of the new `scriptParameters` property added in Task 7.

This step is bundled with Task 7. If the description was not yet "Parameters passed to the script as a JSON object. Structure depends on the script's expected inputs.", correct it now and amend with a separate commit:

- [ ] **Step 1: Verify description**

Open `CrownpeakFS.node.ts`, find the `scriptParameters` property. The description must read:

> Parameters passed to the script as a JSON object. Structure depends on the script's expected inputs.

- [ ] **Step 2: Commit if changed**

```bash
git add nodes/CrownpeakFS/CrownpeakFS.node.ts
git commit -m "docs: clarify Script Parameters helper text"
```

If no change was needed, skip the commit.

---

## Task 9: Write Smoke-Test Doc

**Files:**
- Create: `docs/smoke-tests.md`

- [ ] **Step 1: Create the doc**

Create `docs/smoke-tests.md` with this content (full text — no placeholders):

```markdown
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
- [ ] Execute Action — choose `Copy`. Output is the copy result.
- [ ] Execute Action — choose `Release`, expand Release Options (set Check Only=true). Output is a release report.

## Page

- [ ] Get Many — array.
- [ ] Create — provide UID, pick Page Template from the locator. Output is the new page.
- [ ] Get — output is a page object.
- [ ] Get Bodies — output is an array of body objects.
- [ ] Get Body — output is one body object.
- [ ] Add Section to Body — section template picked from the locator. Output is the updated body.
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/smoke-tests.md
git commit -m "docs: add UI smoke-test checklist"
```

---

## Task 10: Write Live-API Validation Runbook

**Files:**
- Create: `docs/live-api-validation.md`
- Create: `docs/fixtures/live-api-validation-workflow.json`

- [ ] **Step 1: Create the runbook**

Create `docs/live-api-validation.md`:

```markdown
# Live FirstSpirit REST API Validation Runbook

Manual procedure to validate the resource-locator load-options against a real FirstSpirit REST server. Not wired into CI.

## Setup

1. Build the node (`npm run build`) and have it loaded in an n8n instance (see `docs/smoke-tests.md`).
2. Use a non-production FS server and credentials.
3. Use a test project with pages, bodies, sections, templates, scripts, and media.
4. Import `docs/fixtures/live-api-validation-workflow.json` into n8n.

## Per-Locator Validation Blocks

Run each block, then fill in the Findings table at the bottom of this document.

Locators to validate:

- `searchProjects`
- `searchPages`
- `searchPageReferences`
- `searchMedia`
- `searchScripts`
- `searchBodies`
- `searchSections`
- `searchSectionTemplates`
- `searchPageTemplates`

For each locator:

- [ ] **Empty state** — open the locator without a filter; at least one entry appears.
- [ ] **Filter works** — typing narrows the list.
- [ ] **Format parsing** — open the browser DevTools network tab while opening the locator; confirm the response is either an array or wraps the array in `items`, `data`, `projects`, or `results`. If a new wrapper appears, extend `asArray` in `methods/loadOptions.ts`.
- [ ] **Missing upstream parameter** — for dependent locators (Body without Page, Section without Body, etc.) confirm a readable error appears instead of an empty list crash.
- [ ] **Value identity** — pick an entry, save the workflow, reopen; the stored value is the expected identifier (UID preferred, ID fallback).

## Findings Table

| Locator | Status | Wrapper key observed | Notes |
| --- | --- | --- | --- |
| searchProjects |  |  |  |
| searchPages |  |  |  |
| searchPageReferences |  |  |  |
| searchMedia |  |  |  |
| searchScripts |  |  |  |
| searchBodies |  |  |  |
| searchSections |  |  |  |
| searchSectionTemplates |  |  |  |
| searchPageTemplates |  |  |  |

Status values: `OK`, `Issue`, `Bug`.

Copy this table into the PR body when submitting the batch.

## Triage

- Locator returns 0 entries while the API has data → wrapper key missing; extend `asArray`.
- 401/403 → credentials misconfigured.
- 500 → upstream backend issue; file in `fs-rest-webapp` and mark the locator as skipped here with the issue link.

## Bruno Cross-Check (Optional)

The `bruno/` collection inside `fs-rest-webapp/` can hit the same endpoints directly to separate node-side parsing issues from backend issues.
```

- [ ] **Step 2: Create the fixture workflow**

Create `docs/fixtures/live-api-validation-workflow.json`:

```json
{
	"name": "FirstSpirit Live Locator Validation",
	"nodes": [
		{
			"parameters": {},
			"id": "manualTrigger",
			"name": "Manual Trigger",
			"type": "n8n-nodes-base.manualTrigger",
			"typeVersion": 1,
			"position": [240, 300]
		},
		{
			"parameters": {
				"resource": "project",
				"operation": "listProjects"
			},
			"id": "fsNode",
			"name": "FirstSpirit",
			"type": "@crownpeak/n8n-nodes-crownpeak-fs.crownpeakFs",
			"typeVersion": 1,
			"position": [480, 300],
			"credentials": {
				"crownpeakFSApi": {
					"id": "REPLACE_ME",
					"name": "FirstSpirit REST API"
				}
			}
		}
	],
	"connections": {
		"Manual Trigger": {
			"main": [
				[
					{ "node": "FirstSpirit", "type": "main", "index": 0 }
				]
			]
		}
	},
	"settings": {}
}
```

- [ ] **Step 3: Commit**

```bash
git add docs/live-api-validation.md docs/fixtures/live-api-validation-workflow.json
git commit -m "docs: add live-API validation runbook and fixture workflow"
```

---

## Task 11: Update Top-Level Docs

**Files:**
- Modify: `docs/community-verification.md` — add references to both new docs.
- Modify: `README.md` — add a short migration paragraph.

- [ ] **Step 1: Reference smoke tests and validation runbook**

In `docs/community-verification.md`, add a new section near the end:

```markdown
## Pre-Submission Verification

Before submitting this node to the verified Community Nodes review:

1. Run the manual UI checklist at [docs/smoke-tests.md](smoke-tests.md).
2. Run the live-API validation runbook at [docs/live-api-validation.md](live-api-validation.md) against a real FirstSpirit REST server, and paste the findings table into the PR body.
```

- [ ] **Step 2: Add README migration paragraph**

In `README.md`, add a section after the credentials section:

```markdown
## Migration: Typed Body Fields

Earlier versions exposed a single `Content` JSON field on the Create, Update, Add, and Execute operations. That field is now replaced with typed inputs (UID, Filename, Template UID, etc.). An optional `Additional Properties` JSON field is available on most Create operations as a forward-compatible escape hatch — keys defined as typed fields always win on collision.

To migrate a workflow built against an older version:

1. Open the workflow node.
2. Copy the values from the old `Content` JSON into the new typed fields.
3. Place any remaining keys into `Additional Properties`.
```

- [ ] **Step 3: Commit**

```bash
git add docs/community-verification.md README.md
git commit -m "docs: reference smoke tests and document migration to typed fields"
```

---

## Task 12: Full Verification

- [ ] **Step 1: Run all checks**

```bash
npx tsc --noEmit
npm test
npm run lint
npm run build
```

Expected: all four pass. Investigate any failure before declaring the plan complete.

- [ ] **Step 2: Manual UI sanity check**

Follow `docs/smoke-tests.md` for at least one operation per group: `createMedium`, `executeActionsOnPage`, `updateInputElementOfForm`, `executeScript`. Confirm fields render and at least one execution succeeds.

- [ ] **Step 3: Live-API validation**

Maintainer runs `docs/live-api-validation.md` end-to-end against the Cloud FirstSpirit server. Paste the findings table into the PR body.

---

## Self-Review

- Spec section 1 (structured fields) → Tasks 3, 5, 6, 7.
- Spec section 2 (label refactor) → Tasks 1, 2.
- Spec section 3 (smoke-test checklist) → Task 9.
- Spec section 4 (live-API runbook) → Task 10.
- File-plan deletions, modifications, and creates all covered by Tasks 2, 4, 5, 6, 7, 9, 10, 11.
- Tests cover merge semantics (Task 3), label renames (Task 1), property arrays (Task 6), template load options (Task 4).
- Risks called out in the spec: workflow migration → covered by README migration paragraph (Task 11) and smoke-test migration section (Task 9). Enum drift → mitigated via `Additional Properties` for Group A and called out in the live-API runbook (Task 10).

import { CrownpeakFS } from '../nodes/CrownpeakFS/CrownpeakFS.node';
import { CrownpeakFSApi } from '../nodes/CrownpeakFS/credentials/CrownpeakFSApi.credentials';
import { INodePropertyOptions } from 'n8n-workflow';

describe('CrownpeakFS Node', () => {
	const node = new CrownpeakFS();

	it('should be defined', () => {
		expect(node).toBeDefined();
	});

	it('should contain correct node metadata', () => {
		expect(node.description.name).toBe('crownpeakFs');
		expect(node.description.displayName).toBe('FirstSpirit REST API');
		expect(Array.isArray(node.description.properties)).toBe(true);
		expect(node.description.credentials?.[0].name).toBe('crownpeakFSApi');
	});

	it('should define credential documentation URL', () => {
		const credentials = new CrownpeakFSApi();

		expect(credentials.documentationUrl).toBe(
			'https://github.com/Crownpeak/n8n-nodes-crownpeak-fs#credentials',
		);
	});

	it('should expose project as a resource locator', () => {
		const project = node.description.properties.find((property) => property.name === 'projectId');

		expect(project?.type).toBe('resourceLocator');
		expect(project?.default).toEqual({ mode: 'list', value: '' });
		expect(project?.modes?.map((mode) => mode.name)).toEqual(['list', 'id']);
	});

	it('should register list search methods', () => {
		expect((node as any).methods?.listSearch?.searchProjects).toBeDefined();
	});

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

	it('should define all expected operations for each resource', () => {
		function getOperationValues(resource: string) {
			const opProp = node.description.properties.find(
				(prop: any) =>
					prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes(resource),
			);
			if (!opProp || !Array.isArray(opProp.options)) return [];
			return opProp.options
				.filter(
					(o: any): o is INodePropertyOptions =>
						typeof o === 'object' && o !== null && 'value' in o,
				)
				.map((o) => o.value);
		}

		expect(getOperationValues('media')).toEqual(
			expect.arrayContaining([
				'getBinaryDataOfMedium',
				'uploadBinaryDataToMedium',
				'createMedium',
				'getMedium',
			]),
		);

		expect(getOperationValues('search')).toEqual(expect.arrayContaining(['searchProject']));

		expect(getOperationValues('pageReference')).toEqual(
			expect.arrayContaining([
				'listPageReferences',
				'createPageReference',
				'getPageReferenceByUid',
			]),
		);

		expect(getOperationValues('template')).toEqual(
			expect.arrayContaining([
				'listSectionTemplates',
				'createSectionTemplate',
				'listPageTemplates',
				'createPageTemplate',
			]),
		);

		expect(getOperationValues('page')).toEqual(
			expect.arrayContaining([
				'addSectionToBody',
				'executeActionsOnPage',
				'listPages',
				'createPage',
				'getInputElementOfForm',
				'updateInputElementOfForm',
				'getInputElementOfSectionForm',
				'updateInputElementOfSectionForm',
				'getPage',
				'getInputElementsOfFormFromPage',
				'getBodiesOfPage',
				'getBodyOfPageByName',
				'getInputElementsOfSectionFormFromPage',
			]),
		);

		expect(getOperationValues('script')).toEqual(
			expect.arrayContaining(['listScripts', 'executeScript']),
		);

		expect(getOperationValues('project')).toEqual(
			expect.arrayContaining(['listProjects', 'getProject']),
		);
	});
});

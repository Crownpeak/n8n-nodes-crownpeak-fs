import { CrownpeakFS } from '../nodes/CrownpeakFS/CrownpeakFS.node';
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

import { CrownpeakFS } from '../nodes/CrownpeakFS/CrownpeakFS.node';

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
		['page', 'executeActionsOnPage', 'Execute Action'],
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

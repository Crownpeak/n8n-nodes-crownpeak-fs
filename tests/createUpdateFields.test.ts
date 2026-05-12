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

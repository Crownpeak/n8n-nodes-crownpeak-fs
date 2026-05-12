import { INodeProperties } from 'n8n-workflow';

function createResourceLocator(options: {
	displayName: string;
	name: string;
	description: string;
	searchListMethod: string;
	manualModeName?: string;
	manualDisplayName?: string;
	placeholder?: string;
	displayOptions: INodeProperties['displayOptions'];
}): INodeProperties {
	return {
		displayName: options.displayName,
		name: options.name,
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: options.description,
		displayOptions: options.displayOptions,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: options.searchListMethod,
					searchable: true,
				},
			},
			{
				displayName: options.manualDisplayName ?? 'By ID',
				name: options.manualModeName ?? 'id',
				type: 'string',
				placeholder: options.placeholder,
			},
		],
	};
}

export const projectLocator: INodeProperties = {
	displayName: 'Project',
	name: 'projectId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	description: 'FirstSpirit project to use for this operation',
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

export const pageReferenceLocator = createResourceLocator({
	displayName: 'Page Reference',
	name: 'pageReferenceUid',
	description: 'Page reference to read or update within the selected project.',
	searchListMethod: 'searchPageReferences',
	placeholder: 'homepage',
	displayOptions: {
		show: {
			resource: ['pageReference'],
			operation: ['getPageReferenceByUid'],
		},
	},
});

export const mediumLocator = createResourceLocator({
	displayName: 'Medium',
	name: 'mediumUid',
	description: 'Media item to read or upload binary data to.',
	searchListMethod: 'searchMedia',
	placeholder: 'image-header',
	displayOptions: {
		show: {
			resource: ['media'],
		},
		hide: {
			operation: ['createMedium'],
		},
	},
});

export const pageLocator = createResourceLocator({
	displayName: 'Page',
	name: 'pageUid',
	description: 'Page to read, update, or use as the parent for body and section operations.',
	searchListMethod: 'searchPages',
	placeholder: 'homepage',
	displayOptions: {
		show: {
			resource: ['page'],
		},
		hide: {
			operation: ['listPages', 'createPage'],
		},
	},
});

export const bodyLocator = createResourceLocator({
	displayName: 'Body',
	name: 'bodyName',
	description: 'Page body that contains the target section.',
	searchListMethod: 'searchBodies',
	manualModeName: 'name',
	manualDisplayName: 'By Name',
	placeholder: 'content',
	displayOptions: {
		show: {
			resource: ['page'],
			operation: [
				'addSectionToBody',
				'updateInputElementOfSectionForm',
				'getInputElementOfSectionForm',
				'updateInputElementOfSectionForm',
				'getBodyOfPageByName',
				'getInputElementsOfSectionFormFromPage',
			],
		},
	},
});

export const sectionLocator = createResourceLocator({
	displayName: 'Section',
	name: 'sectionName',
	description: 'Section within the selected page body.',
	searchListMethod: 'searchSections',
	manualModeName: 'name',
	manualDisplayName: 'By Name',
	placeholder: 'section_1',
	displayOptions: {
		show: {
			resource: ['page'],
			operation: [
				'addSectionToBody',
				'updateInputElementOfSectionForm',
				'getInputElementOfSectionForm',
				'updateInputElementOfSectionForm',
				'getInputElementsOfSectionFormFromPage',
			],
		},
	},
});

export const scriptLocator = createResourceLocator({
	displayName: 'Script',
	name: 'scriptName',
	description: 'FirstSpirit script to execute.',
	searchListMethod: 'searchScripts',
	manualModeName: 'name',
	manualDisplayName: 'By Name',
	placeholder: 'scriptName',
	displayOptions: {
		show: {
			resource: ['script'],
			operation: ['executeScript'],
		},
	},
});

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

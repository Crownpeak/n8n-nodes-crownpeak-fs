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
		description: 'Whether to duplicate the page (copy) or publish it to the live state (release)',
		options: pageReferenceActionOptions,
	},
	{
		displayName: 'Release Options',
		name: 'releaseOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add Option',
		displayOptions: { show: { action: ['release'] } },
		description: 'Additional options that control how the release action is performed',
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

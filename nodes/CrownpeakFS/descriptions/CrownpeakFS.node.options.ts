import { INodeProperties } from 'n8n-workflow';

export const crownpeakFSOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get Binary Data Of Medium',
				value: 'getBinaryDataOfMedium',
				action: 'Get binary data of medium',
			},
			{
				name: 'Get Binary Data Of Medium By Language',
				value: 'getBinaryDataOfMediumByLanguage',
				action: 'Get binary data of medium by language',
			},
			{
				name: 'Upload Binary Data To Medium',
				value: 'uploadBinaryDataToMedium',
				action: 'Upload binary data to medium',
			},
			{
				name: 'Upload Binary Data To Medium By Language',
				value: 'uploadBinaryDataToMediumByLanguage',
				action: 'Upload binary data to medium by language',
			},
			{
				name: 'Create Medium',
				value: 'createMedium',
				action: 'Create medium',
			},
			{
				name: 'Get Medium',
				value: 'getMedium',
				action: 'Get medium',
			},
			{
				name: 'Delete Medium',
				value: 'deleteMedium',
				action: 'Delete medium',
			},
			{
				name: 'Rename Medium',
				value: 'renameMedium',
				action: 'Rename medium',
			},
			{
				name: 'Execute Actions On Medium',
				value: 'executeActionsOnMedium',
				action: 'Execute actions on medium',
			},
			{
				name: 'Get Medium Usages',
				value: 'getMediumUsages',
				action: 'Get usages of medium',
			},
			{
				name: 'Get Medium Revisions',
				value: 'getMediumRevisions',
				action: 'Get all revisions of medium',
			},
			{
				name: 'Get Medium Revision By ID',
				value: 'getMediumRevisionById',
				action: 'Get single revision of medium',
			},
			{
				name: 'Get Medium Binary Data By Resolution',
				value: 'getMediumBinaryDataByResolution',
				action: 'Get binary data of medium for a specific resolution',
			},
			{
				name: 'Get Medium Binary Data By Resolution And Language',
				value: 'getMediumBinaryDataByResolutionAndLanguage',
				action: 'Get binary data of medium for a specific resolution and language',
			},
			{
				name: 'Search in FirstSpirit Project',
				value: 'searchProject',
				action: 'Search in FirstSpirit project',
			},
			{
				name: 'List FirstSpirit Page References',
				value: 'listPageReferences',
				action: 'List FirstSpirit page references',
			},
			{
				name: 'Create FirstSpirit Page Reference',
				value: 'createPageReference',
				action: 'Create FirstSpirit page reference',
			},
			{
				name: 'Get FirstSpirit Page Reference By UID',
				value: 'getPageReferenceByUid',
				action: 'Get FirstSpirit page reference by UID',
			},
			{
				name: 'Delete FirstSpirit Page Reference',
				value: 'deletePageReference',
				action: 'Delete FirstSpirit page reference',
			},
			{
				name: 'Rename FirstSpirit Page Reference',
				value: 'renamePageReference',
				action: 'Rename FirstSpirit page reference',
			},
			{
				name: 'Execute Actions On Page Reference',
				value: 'executeActionsOnPageReference',
				action: 'Execute actions on page reference',
			},
			{
				name: 'Get Page Reference Settings',
				value: 'getPageReferenceSettings',
				action: 'Get settings for page reference',
			},
			{
				name: 'Update Page Reference Settings',
				value: 'updatePageReferenceSettings',
				action: 'Update settings for page reference',
			},
			{
				name: 'Get Page Reference Revisions',
				value: 'getPageReferenceRevisions',
				action: 'Get all revisions of page reference',
			},
			{
				name: 'Get Page Reference Revision By ID',
				value: 'getPageReferenceRevisionById',
				action: 'Get single revision of page reference',
			},
			{
				name: 'List Document Groups',
				value: 'listDocumentGroups',
				action: 'List document groups in project',
			},
			{
				name: 'Create Document Group',
				value: 'createDocumentGroup',
				action: 'Create document group',
			},
			{
				name: 'Delete Document Group',
				value: 'deleteDocumentGroup',
				action: 'Delete document group',
			},
			{
				name: 'List FirstSpirit Section Templates',
				value: 'listSectionTemplates',
				action: 'List FirstSpirit section templates',
			},
			{
				name: 'Create FirstSpirit Section Template',
				value: 'createSectionTemplate',
				action: 'Create FirstSpirit section template',
			},
			{
				name: 'Get FirstSpirit Section Template',
				value: 'getSectionTemplate',
				action: 'Get a specific FirstSpirit section template',
			},
			{
				name: 'Delete FirstSpirit Section Template',
				value: 'deleteSectionTemplate',
				action: 'Delete FirstSpirit section template',
			},
			{
				name: 'Get Section Template Form',
				value: 'getSectionTemplateForm',
				action: 'Get the form of a FirstSpirit section template',
			},
			{
				name: 'Get Section Template GOM',
				value: 'getSectionTemplateGom',
				action: 'Get the GOM definition of a FirstSpirit section template',
			},
			{
				name: 'Set Section Template GOM',
				value: 'setSectionTemplateGom',
				action: 'Set the GOM definition of a FirstSpirit section template',
			},
			{
				name: 'Get Section Template Rules',
				value: 'getSectionTemplateRules',
				action: 'Get the ruleset definition of a FirstSpirit section template',
			},
			{
				name: 'Set Section Template Rules',
				value: 'setSectionTemplateRules',
				action: 'Set the ruleset definition of a FirstSpirit section template',
			},
			{
				name: 'List Section Template Channel Sources',
				value: 'listSectionTemplateChannelSources',
				action: 'List all channel sources of a FirstSpirit section template',
			},
			{
				name: 'Get Section Template Channel Source',
				value: 'getSectionTemplateChannelSource',
				action: 'Get a specific channel source of a FirstSpirit section template',
			},
			{
				name: 'Set Section Template Channel Source',
				value: 'setSectionTemplateChannelSource',
				action: 'Set a specific channel source of a FirstSpirit section template',
			},
			{
				name: 'List FirstSpirit Page Templates',
				value: 'listPageTemplates',
				action: 'List FirstSpirit page templates',
			},
			{
				name: 'Create FirstSpirit Page Template',
				value: 'createPageTemplate',
				action: 'Create FirstSpirit page template',
			},
			{
				name: 'Get FirstSpirit Page Template',
				value: 'getPageTemplate',
				action: 'Get a specific FirstSpirit page template',
			},
			{
				name: 'Delete FirstSpirit Page Template',
				value: 'deletePageTemplate',
				action: 'Delete FirstSpirit page template',
			},
			{
				name: 'Get Page Template Form',
				value: 'getPageTemplateForm',
				action: 'Get the form of a FirstSpirit page template',
			},
			{
				name: 'Get Page Template GOM',
				value: 'getPageTemplateGom',
				action: 'Get the GOM definition of a FirstSpirit page template',
			},
			{
				name: 'Set Page Template GOM',
				value: 'setPageTemplateGom',
				action: 'Set the GOM definition of a FirstSpirit page template',
			},
			{
				name: 'Get Page Template Rules',
				value: 'getPageTemplateRules',
				action: 'Get the ruleset definition of a FirstSpirit page template',
			},
			{
				name: 'Set Page Template Rules',
				value: 'setPageTemplateRules',
				action: 'Set the ruleset definition of a FirstSpirit page template',
			},
			{
				name: 'List Page Template Channel Sources',
				value: 'listPageTemplateChannelSources',
				action: 'List all channel sources of a FirstSpirit page template',
			},
			{
				name: 'Get Page Template Channel Source',
				value: 'getPageTemplateChannelSource',
				action: 'Get a specific channel source of a FirstSpirit page template',
			},
			{
				name: 'Set Page Template Channel Source',
				value: 'setPageTemplateChannelSource',
				action: 'Set a specific channel source of a FirstSpirit page template',
			},
			{
				name: 'List FirstSpirit Link Templates',
				value: 'listLinkTemplates',
				action: 'List FirstSpirit link templates',
			},
			{
				name: 'Create FirstSpirit Link Template',
				value: 'createLinkTemplate',
				action: 'Create FirstSpirit link template',
			},
			{
				name: 'Get FirstSpirit Link Template',
				value: 'getLinkTemplate',
				action: 'Get a specific FirstSpirit link template',
			},
			{
				name: 'Delete FirstSpirit Link Template',
				value: 'deleteLinkTemplate',
				action: 'Delete FirstSpirit link template',
			},
			{
				name: 'Get Link Template GOM',
				value: 'getLinkTemplateGom',
				action: 'Get the GOM definition of a FirstSpirit link template',
			},
			{
				name: 'Set Link Template GOM',
				value: 'setLinkTemplateGom',
				action: 'Set the GOM definition of a FirstSpirit link template',
			},
			{
				name: 'Get Link Template Rules',
				value: 'getLinkTemplateRules',
				action: 'Get the ruleset definition of a FirstSpirit link template',
			},
			{
				name: 'Set Link Template Rules',
				value: 'setLinkTemplateRules',
				action: 'Set the ruleset definition of a FirstSpirit link template',
			},
			{
				name: 'List Link Template Channel Sources',
				value: 'listLinkTemplateChannelSources',
				action: 'List all channel sources of a FirstSpirit link template',
			},
			{
				name: 'Get Link Template Channel Source',
				value: 'getLinkTemplateChannelSource',
				action: 'Get a specific channel source of a FirstSpirit link template',
			},
			{
				name: 'Set Link Template Channel Source',
				value: 'setLinkTemplateChannelSource',
				action: 'Set a specific channel source of a FirstSpirit link template',
			},
			{
				name: 'List FirstSpirit Format Templates',
				value: 'listFormatTemplates',
				action: 'List FirstSpirit format templates',
			},
			{
				name: 'Create FirstSpirit Format Template',
				value: 'createFormatTemplate',
				action: 'Create FirstSpirit format template',
			},
			{
				name: 'Get FirstSpirit Format Template',
				value: 'getFormatTemplate',
				action: 'Get a specific FirstSpirit format template',
			},
			{
				name: 'Delete FirstSpirit Format Template',
				value: 'deleteFormatTemplate',
				action: 'Delete FirstSpirit format template',
			},
			{
				name: 'List Format Template Channel Sources',
				value: 'listFormatTemplateChannelSources',
				action: 'List all channel sources of a FirstSpirit format template',
			},
			{
				name: 'Get Format Template Channel Source',
				value: 'getFormatTemplateChannelSource',
				action: 'Get a specific channel source of a FirstSpirit format template',
			},
			{
				name: 'Set Format Template Channel Source',
				value: 'setFormatTemplateChannelSource',
				action: 'Set a specific channel source of a FirstSpirit format template',
			},
			{
				name: 'List FirstSpirit Database Schemas',
				value: 'listSchemas',
				action: 'List FirstSpirit database schemas',
			},
			{
				name: 'Get FirstSpirit Database Schema',
				value: 'getSchema',
				action: 'Get a specific FirstSpirit database schema',
			},
			{
				name: 'Add Section To Body',
				value: 'addSectionToBody',
				action: 'Add section to body',
			},
			{
				name: 'Execute Actions On Page',
				value: 'executeActionsOnPage',
				action: 'Execute actions on page',
			},
			{
				name: 'List FirstSpirit Pages',
				value: 'listPages',
				action: 'List FirstSpirit pages',
			},
			{
				name: 'Create FirstSpirit Page',
				value: 'createPage',
				action: 'Create FirstSpirit page',
			},
			{
				name: 'Get Input Element Of Form',
				value: 'getInputElementOfForm',
				action: 'Get input element of form',
			},
			{
				name: 'Update Input Element Of Form',
				value: 'updateInputElementOfForm',
				action: 'Update input element of form',
			},
			{
				name: 'Get Input Element Of Section Form',
				value: 'getInputElementOfSectionForm',
				action: 'Get input element of section form',
			},
			{
				name: 'Update Input Element Of Section Form',
				value: 'updateInputElementOfSectionForm',
				action: 'Update input element of section form',
			},
			{
				name: 'Get FirstSpirit Page',
				value: 'getPage',
				action: 'Get FirstSpirit page',
			},
			{
				name: 'Get Input Elements Of Form From FirstSpirit Page',
				value: 'getInputElementsOfFormFromPage',
				action: 'Get input elements of form from FirstSpirit page',
			},
			{
				name: 'Get Bodies Of FirstSpirit Page',
				value: 'getBodiesOfPage',
				action: 'Get bodies of FirstSpirit page',
			},
			{
				name: 'Get Body Of FirstSpirit Page By Name',
				value: 'getBodyOfPageByName',
				action: 'Get bodies of FirstSpirit page by name',
			},
			{
				name: 'Get Input Elements Of Section Form From FirstSpirit Page',
				value: 'getInputElementsOfSectionFormFromPage',
				action: 'Get input elements of section form from FirstSpirit page',
			},
			{
				name: 'List FirstSpirit Scripts',
				value: 'listScripts',
				action: 'List FirstSpirit scripts',
			},
			{
				name: 'Execute FirstSpirit Script',
				value: 'executeScript',
				action: 'Execute a FirstSpirit script',
			},
			{
				name: 'List FirstSpirit Projects',
				value: 'listProjects',
				action: 'List FirstSpirit projects',
			},
			{
				name: 'Get FirstSpirit Project',
				value: 'getProject',
				action: 'Get a FirstSpirit project',
			},
			{
				name: 'Get Project Resolutions',
				value: 'getProjectResolutions',
				action: 'Get resolutions of a FirstSpirit project',
			},
		],
		default: 'listProjects',
	},
];
export const defaults = { name: 'FirstSpirit REST API Node' };
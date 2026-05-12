import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IExecuteFunctions,
	IHttpRequestMethods,
	NodeOperationError,
} from 'n8n-workflow';
import FormData from 'form-data';

export class CrownpeakFS implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FirstSpirit REST API',
		name: 'crownpeakFs',
		icon: 'file:crownpeak.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with FirstSpirit REST API',
		defaults: {
			name: 'FirstSpirit REST API',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'crownpeakFSApi',
				required: true,
			},
		],
		requestDefaults: {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Media',
						value: 'media',
					},
					{
						name: 'Page Reference',
						value: 'pageReference',
					},
					{
						name: 'Search',
						value: 'search',
					},
					{
						name: 'Template',
						value: 'template',
					},
					{
						name: 'Page',
						value: 'page',
					},
					{
						name: 'Script',
						value: 'script',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Module',
						value: 'module',
					},
					{
						name: 'Data Source',
						value: 'dataSource',
					},
					{
						name: 'Global Content',
						value: 'globalContent',
					},
				],
				default: 'project',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['media'],
					},
				},
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
				],
				default: 'getMedium',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				options: [
					{
						name: 'List Projects',
						value: 'listProjects',
						action: 'List projects',
					},
					{
						name: 'Get Project',
						value: 'getProject',
						action: 'Get project',
					},
					{
						name: 'Get Project Resolutions',
						value: 'getProjectResolutions',
						action: 'Get project resolutions',
					},
				],
				default: 'listProjects',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['pageReference'],
					},
				},
				options: [
					{
						name: 'List Page References',
						value: 'listPageReferences',
						action: 'List page references',
					},
					{
						name: 'Create Page Reference',
						value: 'createPageReference',
						action: 'Create page reference',
					},
					{
						name: 'Get Page Reference By UID',
						value: 'getPageReferenceByUid',
						action: 'Get page reference by UID',
					},
					{
						name: 'Delete Page Reference',
						value: 'deletePageReference',
						action: 'Delete page reference',
					},
					{
						name: 'Rename Page Reference',
						value: 'renamePageReference',
						action: 'Rename page reference',
					},
					{
						name: 'Execute Actions On Page Reference',
						value: 'executeActionsOnPageReference',
						action: 'Execute actions on page reference',
					},
					{
						name: 'Get Page Reference Settings',
						value: 'getPageReferenceSettings',
						action: 'Get page reference settings',
					},
					{
						name: 'Update Page Reference Settings',
						value: 'updatePageReferenceSettings',
						action: 'Update page reference settings',
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
						action: 'List document groups',
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
				],
				default: 'listPageReferences',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['page'],
					},
				},
				options: [
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
						name: 'List Pages',
						value: 'listPages',
						action: 'List pages',
					},
					{
						name: 'Create Page',
						value: 'createPage',
						action: 'Create page',
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
						name: 'Get Page',
						value: 'getPage',
						action: 'Get page',
					},
					{
						name: 'Get Input Elements Of Form From Page',
						value: 'getInputElementsOfFormFromPage',
						action: 'Get input elements of form from page',
					},
					{
						name: 'Get Bodies Of Page',
						value: 'getBodiesOfPage',
						action: 'Get bodies of page',
					},
					{
						name: 'Get Body Of Page By Name',
						value: 'getBodyOfPageByName',
						action: 'Get bodies of page by name',
					},
					{
						name: 'Get Input Elements Of Section Form From Page',
						value: 'getInputElementsOfSectionFormFromPage',
						action: 'Get input elements of section form from page',
					},
				],
				default: 'listPages',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['search'],
					},
				},
				options: [
					{
						name: 'Search Project',
						value: 'searchProject',
						action: 'Search project',
					},
					{
						name: 'Search For Invalid References',
						value: 'searchInvalidReferences',
						action: 'Search for invalid (broken) references in project',
					},
					{
						name: 'Search For External References',
						value: 'searchExternalReferences',
						action: 'Search for external references in project',
					},
					{
						name: 'Search By Element UID',
						value: 'searchByUid',
						action: 'Search for an element by its UID',
					},
					{
						name: 'Search By Element ID',
						value: 'searchByElementId',
						action: 'Search for an element by its ID',
					},
				],
				default: 'searchProject',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['script'],
					},
				},
				options: [
					{
						name: 'List Scripts',
						value: 'listScripts',
						action: 'List scripts',
					},
					{
						name: 'Execute Script',
						value: 'executeScript',
						action: 'Execute script',
					},
				],
				default: 'listScripts',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['module'],
					},
				},
				options: [
					{
						name: 'List Installed Modules',
						value: 'listModules',
						action: 'Get all installed FirstSpirit modules',
					},
					{
						name: 'Install Module',
						value: 'installModule',
						action: 'Install a FirstSpirit module',
					},
					{
						name: 'Get Module',
						value: 'getModule',
						action: 'Get a single installed FirstSpirit module',
					},
					{
						name: 'Uninstall Module',
						value: 'uninstallModule',
						action: 'Uninstall a FirstSpirit module',
					},
				],
				default: 'listModules',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['dataSource'],
					},
				},
				options: [
					{
						name: 'List Data Sources',
						value: 'listDataSources',
						action: 'List all data sources in a project',
					},
					{
						name: 'Create Data Source',
						value: 'createDataSource',
						action: 'Create a new data source',
					},
					{
						name: 'Get Data Source',
						value: 'getDataSource',
						action: 'Get data source details',
					},
					{
						name: 'Get All Datasets',
						value: 'getAllDatasets',
						action: 'Get all datasets of a data source',
					},
					{
						name: 'Create Dataset',
						value: 'createDataset',
						action: 'Create a new dataset',
					},
					{
						name: 'Get Dataset By GID',
						value: 'getDatasetByGid',
						action: 'Get a dataset by its GID',
					},
					{
						name: 'Delete Dataset',
						value: 'deleteDataset',
						action: 'Delete a dataset',
					},
					{
						name: 'Get Dataset Entity',
						value: 'getDatasetEntity',
						action: 'Get the entity of a dataset',
					},
					{
						name: 'Update Dataset Entity',
						value: 'updateDatasetEntity',
						action: 'Update the entity of a dataset',
					},
					{
						name: 'Get Dataset Revisions',
						value: 'getDatasetRevisions',
						action: 'Get all revisions of a dataset',
					},
					{
						name: 'Get Dataset Revision By ID',
						value: 'getDatasetRevisionById',
						action: 'Get a single revision of a dataset',
					},
				],
				default: 'listDataSources',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['globalContent'],
					},
				},
				options: [
					{
						name: 'List Global Content Elements',
						value: 'listGlobalContentElements',
						action: 'List all global content elements in a project',
					},
					{
						name: 'Get Project Properties',
						value: 'getProjectProperties',
						action: 'Get project properties from global content',
					},
				],
				default: 'listGlobalContentElements',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['template'],
					},
				},
				options: [
					{
						name: 'List Section Templates',
						value: 'listSectionTemplates',
						action: 'List section templates',
					},
					{
						name: 'Create Section Template',
						value: 'createSectionTemplate',
						action: 'Create section template',
					},
					{
						name: 'Get Section Template',
						value: 'getSectionTemplate',
						action: 'Get a specific section template',
					},
					{
						name: 'Delete Section Template',
						value: 'deleteSectionTemplate',
						action: 'Delete section template',
					},
					{
						name: 'Get Section Template Form',
						value: 'getSectionTemplateForm',
						action: 'Get the form of a section template',
					},
					{
						name: 'Get Section Template GOM',
						value: 'getSectionTemplateGom',
						action: 'Get the GOM definition of a section template',
					},
					{
						name: 'Set Section Template GOM',
						value: 'setSectionTemplateGom',
						action: 'Set the GOM definition of a section template',
					},
					{
						name: 'Get Section Template Rules',
						value: 'getSectionTemplateRules',
						action: 'Get the ruleset definition of a section template',
					},
					{
						name: 'Set Section Template Rules',
						value: 'setSectionTemplateRules',
						action: 'Set the ruleset definition of a section template',
					},
					{
						name: 'List Section Template Channel Sources',
						value: 'listSectionTemplateChannelSources',
						action: 'List all channel sources of a section template',
					},
					{
						name: 'Get Section Template Channel Source',
						value: 'getSectionTemplateChannelSource',
						action: 'Get a specific channel source of a section template',
					},
					{
						name: 'Set Section Template Channel Source',
						value: 'setSectionTemplateChannelSource',
						action: 'Set a specific channel source of a section template',
					},
					{
						name: 'List Page Templates',
						value: 'listPageTemplates',
						action: 'List page templates',
					},
					{
						name: 'Create Page Template',
						value: 'createPageTemplate',
						action: 'Create page template',
					},
					{
						name: 'Get Page Template',
						value: 'getPageTemplate',
						action: 'Get a specific page template',
					},
					{
						name: 'Delete Page Template',
						value: 'deletePageTemplate',
						action: 'Delete page template',
					},
					{
						name: 'Get Page Template Form',
						value: 'getPageTemplateForm',
						action: 'Get the form of a page template',
					},
					{
						name: 'Get Page Template GOM',
						value: 'getPageTemplateGom',
						action: 'Get the GOM definition of a page template',
					},
					{
						name: 'Set Page Template GOM',
						value: 'setPageTemplateGom',
						action: 'Set the GOM definition of a page template',
					},
					{
						name: 'Get Page Template Rules',
						value: 'getPageTemplateRules',
						action: 'Get the ruleset definition of a page template',
					},
					{
						name: 'Set Page Template Rules',
						value: 'setPageTemplateRules',
						action: 'Set the ruleset definition of a page template',
					},
					{
						name: 'List Page Template Channel Sources',
						value: 'listPageTemplateChannelSources',
						action: 'List all channel sources of a page template',
					},
					{
						name: 'Get Page Template Channel Source',
						value: 'getPageTemplateChannelSource',
						action: 'Get a specific channel source of a page template',
					},
					{
						name: 'Set Page Template Channel Source',
						value: 'setPageTemplateChannelSource',
						action: 'Set a specific channel source of a page template',
					},
					{
						name: 'List Link Templates',
						value: 'listLinkTemplates',
						action: 'List link templates',
					},
					{
						name: 'Create Link Template',
						value: 'createLinkTemplate',
						action: 'Create link template',
					},
					{
						name: 'Get Link Template',
						value: 'getLinkTemplate',
						action: 'Get a specific link template',
					},
					{
						name: 'Delete Link Template',
						value: 'deleteLinkTemplate',
						action: 'Delete link template',
					},
					{
						name: 'Get Link Template GOM',
						value: 'getLinkTemplateGom',
						action: 'Get the GOM definition of a link template',
					},
					{
						name: 'Set Link Template GOM',
						value: 'setLinkTemplateGom',
						action: 'Set the GOM definition of a link template',
					},
					{
						name: 'Get Link Template Rules',
						value: 'getLinkTemplateRules',
						action: 'Get the ruleset definition of a link template',
					},
					{
						name: 'Set Link Template Rules',
						value: 'setLinkTemplateRules',
						action: 'Set the ruleset definition of a link template',
					},
					{
						name: 'List Link Template Channel Sources',
						value: 'listLinkTemplateChannelSources',
						action: 'List all channel sources of a link template',
					},
					{
						name: 'Get Link Template Channel Source',
						value: 'getLinkTemplateChannelSource',
						action: 'Get a specific channel source of a link template',
					},
					{
						name: 'Set Link Template Channel Source',
						value: 'setLinkTemplateChannelSource',
						action: 'Set a specific channel source of a link template',
					},
					{
						name: 'List Format Templates',
						value: 'listFormatTemplates',
						action: 'List format templates',
					},
					{
						name: 'Create Format Template',
						value: 'createFormatTemplate',
						action: 'Create format template',
					},
					{
						name: 'Get Format Template',
						value: 'getFormatTemplate',
						action: 'Get a specific format template',
					},
					{
						name: 'Delete Format Template',
						value: 'deleteFormatTemplate',
						action: 'Delete format template',
					},
					{
						name: 'List Format Template Channel Sources',
						value: 'listFormatTemplateChannelSources',
						action: 'List all channel sources of a format template',
					},
					{
						name: 'Get Format Template Channel Source',
						value: 'getFormatTemplateChannelSource',
						action: 'Get a specific channel source of a format template',
					},
					{
						name: 'Set Format Template Channel Source',
						value: 'setFormatTemplateChannelSource',
						action: 'Set a specific channel source of a format template',
					},
					{
						name: 'Get Format Template GOM Form',
						value: 'getFormatTemplateGomForm',
						action: 'Get the GOM form definition of a format template',
					},
					{
						name: 'List Database Schemas',
						value: 'listSchemas',
						action: 'List database schemas',
					},
					{
						name: 'Get Database Schema',
						value: 'getSchema',
						action: 'Get a specific database schema',
					},
				],
				default: 'listSectionTemplates',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['project', 'search', 'page', 'template', 'script', 'media', 'pageReference', 'dataSource', 'globalContent'],
					},
					hide: {
						operation: ['listProjects', 'listDataSources'],
					},
				},
				placeholder: 'Enter the project ID',
				description: 'The ID of the project',
			},
			{
				displayName: 'Page Reference UID',
				name: 'pageReferenceUid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['pageReference'],
						operation: [
							'getPageReferenceByUid',
							'deletePageReference',
							'renamePageReference',
							'executeActionsOnPageReference',
							'getPageReferenceSettings',
							'updatePageReferenceSettings',
							'getPageReferenceRevisions',
							'getPageReferenceRevisionById',
						],
					},
				},
				placeholder: 'Enter the page reference UID',
				description: 'The UID of the page reference',
			},
			{
				displayName: 'Page Reference Revision ID',
				name: 'pageReferenceRevisionId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['pageReference'],
						operation: ['getPageReferenceRevisionById'],
					},
				},
				placeholder: 'Enter the revision ID',
				description: 'The ID of the revision to retrieve',
			},
			{
				displayName: 'Document Group UID',
				name: 'documentGroupUid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['pageReference'],
						operation: ['deleteDocumentGroup'],
					},
				},
				placeholder: 'Enter the document group UID',
				description: 'The UID of the document group to delete',
			},
			{
				displayName: 'Medium UID',
				name: 'mediumUid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['media'],
					},
					hide: {
						operation: ['createMedium'],
					},
				},
				placeholder: 'Enter the medium UID',
				description: 'The UID of the medium',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['searchProject'],
					},
				},
				placeholder: 'Enter the search query',
				description: 'The query string for the search',
			},
			{
				displayName: 'Page Number',
				name: 'pageNumber',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['searchProject'],
					},
				},
				description: 'The page of results to retrieve',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: 20,
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['searchProject'],
					},
				},
				description: 'The number of items to retrieve per page',
			},
			{
				displayName: 'Editor Name',
				name: 'editorName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['page'],
						operation: [
							'updateInputElementOfForm',
							'updateInputElementOfSectionForm',
							'getInputElementOfForm',
							'getInputElementOfSectionForm',
						],
					},
				},
				placeholder: 'Enter the editor name',
				description: 'The technical identifier of an input component',
			},
			{
				displayName: 'Page UID',
				name: 'pageUid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['page'],
					},
					hide: {
						operation: ['listPages', 'createPage'],
					},
				},
				placeholder: 'Enter the page UID',
				description: 'The UID of the page',
			},
			{
				displayName: 'Body Name',
				name: 'bodyName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['page'],
						operation: [
							'addSectionToBody',
							'updateInputElementOfSectionForm',
							'getInputElementOfSectionForm',
							'getBodyOfPageByName',
							'getInputElementsOfSectionFormFromPage',
						],
					},
				},
				placeholder: 'Enter the body name',
				description: 'The name of the body on a page',
			},
			{
				displayName: 'Section Name',
				name: 'sectionName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['page'],
						operation: [
							'addSectionToBody',
							'updateInputElementOfSectionForm',
							'getInputElementOfSectionForm',
							'getInputElementsOfSectionFormFromPage',
						],
					},
				},
				placeholder: 'Enter the section name',
				description: 'The name of the section on a page',
			},
			{
				displayName: 'Script Name',
				name: 'scriptName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['script'],
						operation: ['executeScript'],
					},
				},
				placeholder: 'Enter the script name',
				description: 'The name of the script to execute',
			},

			{
				displayName: 'Section Template UID',
				name: 'sectionTemplateUid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['template'],
						operation: [
							'getSectionTemplate',
							'deleteSectionTemplate',
							'getSectionTemplateForm',
							'getSectionTemplateGom',
							'setSectionTemplateGom',
							'getSectionTemplateRules',
							'setSectionTemplateRules',
							'listSectionTemplateChannelSources',
							'getSectionTemplateChannelSource',
							'setSectionTemplateChannelSource',
						],
					},
				},
				placeholder: 'Enter the section template UID',
				description: 'The UID of the section template',
			},

			{
				displayName: 'Page Template UID',
				name: 'pageTemplateUid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['template'],
						operation: [
							'getPageTemplate',
							'deletePageTemplate',
							'getPageTemplateForm',
							'getPageTemplateGom',
							'setPageTemplateGom',
							'getPageTemplateRules',
							'setPageTemplateRules',
							'listPageTemplateChannelSources',
							'getPageTemplateChannelSource',
							'setPageTemplateChannelSource',
						],
					},
				},
				placeholder: 'Enter the page template UID',
				description: 'The UID of the page template',
			},

			{
				displayName: 'Link Template UID',
				name: 'linkTemplateUid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['template'],
						operation: [
							'getLinkTemplate',
							'deleteLinkTemplate',
							'getLinkTemplateGom',
							'setLinkTemplateGom',
							'getLinkTemplateRules',
							'setLinkTemplateRules',
							'listLinkTemplateChannelSources',
							'getLinkTemplateChannelSource',
							'setLinkTemplateChannelSource',
						],
					},
				},
				placeholder: 'Enter the link template UID',
				description: 'The UID of the link template',
			},

			{
				displayName: 'Format Template UID',
				name: 'formatTemplateUid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['template'],
						operation: [
							'getFormatTemplate',
							'deleteFormatTemplate',
							'listFormatTemplateChannelSources',
							'getFormatTemplateChannelSource',
							'setFormatTemplateChannelSource',
							'getFormatTemplateGomForm',
						],
					},
				},
				placeholder: 'Enter the format template UID',
				description: 'The UID of the format template',
			},

			{
				displayName: 'Template Set UID',
				name: 'templateSetUid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['template'],
						operation: [
							'getSectionTemplateChannelSource',
							'setSectionTemplateChannelSource',
							'getPageTemplateChannelSource',
							'setPageTemplateChannelSource',
							'getLinkTemplateChannelSource',
							'setLinkTemplateChannelSource',
							'getFormatTemplateChannelSource',
							'setFormatTemplateChannelSource',
						],
					},
				},
				placeholder: 'Enter the template set UID',
				description: 'The UID of the template set (channel)',
			},

			{
				displayName: 'Schema UID',
				name: 'schemaUid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['getSchema'],
					},
				},
				placeholder: 'Enter the schema UID',
				description: 'The UID of the database schema',
			},

			{
				displayName: 'Input Binary Field',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['uploadBinaryDataToMedium', 'uploadBinaryDataToMediumByLanguage'],
					},
				},
				placeholder: 'data',
				description: 'Name of the binary property in the input item that contains the file to upload',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['getBinaryDataOfMediumByLanguage', 'uploadBinaryDataToMediumByLanguage', 'getMediumBinaryDataByResolutionAndLanguage'],
					},
				},
				placeholder: 'e.g. EN',
				description: 'The language abbreviation for the binary data',
			},
			{
				displayName: 'Resolution UID',
				name: 'resolutionUid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['getMediumBinaryDataByResolution', 'getMediumBinaryDataByResolutionAndLanguage'],
					},
				},
				placeholder: 'Enter the resolution UID',
				description: 'The UID of the resolution to use for the binary data',
			},
			{
				displayName: 'Revision ID',
				name: 'revisionId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['getMediumRevisionById'],
					},
				},
				placeholder: 'Enter the revision ID',
				description: 'The ID of the revision to retrieve',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'json',
				required: true,
				default: `{}`,
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				displayOptions: {
					show: {
						resource: ['page', 'pageReference', 'script', 'template', 'media'],
						operation: [
							'createMedium',
							'executeActionsOnMedium',
							'renameMedium',
							'addSectionToBody',
							'executeActionsOnPage',
							'updateInputElementOfForm',
							'updateInputElementOfSectionForm',
							'createPage',
							'createPageReference',
							'executeActionsOnPageReference',
							'renamePageReference',
							'updatePageReferenceSettings',
							'createDocumentGroup',
							'executeScript',
							'createSectionTemplate',
							'setSectionTemplateGom',
							'setSectionTemplateRules',
							'setSectionTemplateChannelSource',
							'createPageTemplate',
							'setPageTemplateGom',
							'setPageTemplateRules',
							'setPageTemplateChannelSource',
							'createLinkTemplate',
							'setLinkTemplateGom',
							'setLinkTemplateRules',
							'setLinkTemplateChannelSource',
							'createFormatTemplate',
							'setFormatTemplateChannelSource',
						],
					},
				},
				description: 'Raw JSON for the request body',
			},
			{
				displayName: 'Element UID',
				name: 'elementUid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['searchByUid'],
					},
				},
				placeholder: 'Enter the element UID',
				description: 'The UID of the element to search for',
			},
			{
				displayName: 'Element ID',
				name: 'elementId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['searchByElementId'],
					},
				},
				placeholder: 'Enter the element ID',
				description: 'The numeric ID of the element to search for',
			},
			{
				displayName: 'Module Name',
				name: 'moduleName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['module'],
						operation: ['getModule', 'uninstallModule'],
					},
				},
				placeholder: 'Enter the module name',
				description: 'The name of the FirstSpirit module (FSM)',
			},
			{
				displayName: 'Module Binary Field',
				name: 'moduleBinaryField',
				type: 'string',
				required: true,
				default: 'data',
				displayOptions: {
					show: {
						resource: ['module'],
						operation: ['installModule'],
					},
				},
				placeholder: 'data',
				description: 'Name of the binary property in the input item that contains the FSM file to install',
			},
			{
				displayName: 'Datasource Name',
				name: 'datasource',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['dataSource'],
						operation: [
							'getDataSource',
							'getAllDatasets',
							'createDataset',
							'getDatasetByGid',
							'deleteDataset',
							'getDatasetEntity',
							'updateDatasetEntity',
							'getDatasetRevisions',
							'getDatasetRevisionById',
						],
					},
				},
				placeholder: 'Enter the datasource name',
				description: 'The name/identifier of the data source',
			},
			{
				displayName: 'Dataset GID',
				name: 'datasetGid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['dataSource'],
						operation: [
							'getDatasetByGid',
							'deleteDataset',
							'getDatasetEntity',
							'updateDatasetEntity',
							'getDatasetRevisions',
							'getDatasetRevisionById',
						],
					},
				},
				placeholder: 'Enter the dataset GID',
				description: 'The global identifier (GID) of the dataset',
			},
			{
				displayName: 'Dataset Revision ID',
				name: 'datasetRevisionId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['dataSource'],
						operation: ['getDatasetRevisionById'],
					},
				},
				placeholder: 'Enter the revision ID',
				description: 'The ID of the dataset revision to retrieve',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'json',
				required: true,
				default: `{}`,
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				displayOptions: {
					show: {
						resource: ['dataSource'],
						operation: ['createDataSource', 'createDataset', 'updateDatasetEntity'],
					},
				},
				description: 'Raw JSON for the request body',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			const { username, password, baseUrl } = (await this.getCredentials('crownpeakFSApi')) as {
				username: string;
				password: string;
				baseUrl: string;
			};

			let method: IHttpRequestMethods;
			let url = '';
			let headers: IDataObject = {};
			let body: FormData | IDataObject | string | undefined;

			const isBinaryEndpoint = [
				'getBinaryDataOfMedium',
				'getBinaryDataOfMediumByLanguage',
				'getMediumBinaryDataByResolution',
				'getMediumBinaryDataByResolutionAndLanguage',
			].includes(operation);

			switch (operation) {
				case 'getBinaryDataOfMedium': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/data`;
					method = 'GET';
					headers.Accept = '*/*';
					break;
				}
				case 'uploadBinaryDataToMedium': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					const fileName = binaryData.fileName ?? 'upload';

					const formData = new FormData();
					formData.append('file', fileBuffer, fileName);

					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/data`;
					body = formData;
					method = 'PUT';
					break;
				}
				case 'createMedium': {
					const id = this.getNodeParameter('projectId', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/media/`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'getBinaryDataOfMediumByLanguage': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					const language = this.getNodeParameter('language', i) as string;
					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/data/${language}`;
					method = 'GET';
					headers.Accept = '*/*';
					break;
				}
				case 'uploadBinaryDataToMediumByLanguage': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					const language = this.getNodeParameter('language', i) as string;
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					const fileName = binaryData.fileName ?? 'upload';

					const formData = new FormData();
					formData.append('file', fileBuffer, fileName);

					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/data/${language}`;
					body = formData;
					method = 'PUT';
					break;
				}
				case 'getMedium': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}`;
					method = 'GET';
					break;
				}
				case 'deleteMedium': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}`;
					method = 'DELETE';
					break;
				}
				case 'renameMedium': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/rename`;
					body = JSON.parse(content);
					method = 'PATCH';
					break;
				}
				case 'executeActionsOnMedium': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/actions`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'getMediumUsages': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/usages`;
					method = 'GET';
					break;
				}
				case 'getMediumRevisions': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/revisions/`;
					method = 'GET';
					break;
				}
				case 'getMediumRevisionById': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					const revisionId = this.getNodeParameter('revisionId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/revisions/${revisionId}`;
					method = 'GET';
					break;
				}
				case 'getMediumBinaryDataByResolution': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					const resolutionUid = this.getNodeParameter('resolutionUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/data/resolution/${resolutionUid}`;
					method = 'GET';
					headers.Accept = '*/*';
					break;
				}
				case 'getMediumBinaryDataByResolutionAndLanguage': {
					const id = this.getNodeParameter('projectId', i) as string;
					const mediumUid = this.getNodeParameter('mediumUid', i) as string;
					const resolutionUid = this.getNodeParameter('resolutionUid', i) as string;
					const language = this.getNodeParameter('language', i) as string;
					url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/data/resolution/${resolutionUid}/${language}`;
					method = 'GET';
					headers.Accept = '*/*';
					break;
				}
				case 'searchProject': {
					const id = this.getNodeParameter('projectId', i) as string;
					const q = this.getNodeParameter('searchQuery', i) as string;
					const page = this.getNodeParameter('pageNumber', i) as string;
					const size = this.getNodeParameter('pageSize', i) as string;
					const searchParams = new URLSearchParams({ q, page, size });
					url = `${baseUrl}/v1/projects/${id}/search?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'searchInvalidReferences': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/search/invalid-references`;
					method = 'GET';
					break;
				}
				case 'searchExternalReferences': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/search/external-references`;
					method = 'GET';
					break;
				}
				case 'searchByUid': {
					const id = this.getNodeParameter('projectId', i) as string;
					const uid = this.getNodeParameter('elementUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/search/by-uid?uid=${encodeURIComponent(uid)}`;
					method = 'GET';
					break;
				}
				case 'searchByElementId': {
					const id = this.getNodeParameter('projectId', i) as string;
					const elementId = this.getNodeParameter('elementId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/search/by-id/${encodeURIComponent(elementId)}`;
					method = 'GET';
					break;
				}
				case 'listPageReferences': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/`;
					method = 'GET';
					break;
				}
				case 'createPageReference': {
					const id = this.getNodeParameter('projectId', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'getPageReferenceByUid': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageReferenceUid = this.getNodeParameter('pageReferenceUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/${pageReferenceUid}`;
					method = 'GET';
					break;
				}
				case 'deletePageReference': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageReferenceUid = this.getNodeParameter('pageReferenceUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/${pageReferenceUid}`;
					method = 'DELETE';
					break;
				}
				case 'renamePageReference': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageReferenceUid = this.getNodeParameter('pageReferenceUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/${pageReferenceUid}/rename`;
					body = JSON.parse(content);
					method = 'PATCH';
					break;
				}
				case 'executeActionsOnPageReference': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageReferenceUid = this.getNodeParameter('pageReferenceUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/${pageReferenceUid}/actions`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'getPageReferenceSettings': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageReferenceUid = this.getNodeParameter('pageReferenceUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/${pageReferenceUid}/settings`;
					method = 'GET';
					break;
				}
				case 'updatePageReferenceSettings': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageReferenceUid = this.getNodeParameter('pageReferenceUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/${pageReferenceUid}/settings`;
					body = JSON.parse(content);
					method = 'PATCH';
					break;
				}
				case 'getPageReferenceRevisions': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageReferenceUid = this.getNodeParameter('pageReferenceUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/${pageReferenceUid}/revisions/`;
					method = 'GET';
					break;
				}
				case 'getPageReferenceRevisionById': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageReferenceUid = this.getNodeParameter('pageReferenceUid', i) as string;
					const revisionId = this.getNodeParameter('pageReferenceRevisionId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/${pageReferenceUid}/revisions/${revisionId}`;
					method = 'GET';
					break;
				}
				case 'listDocumentGroups': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/document-groups/`;
					method = 'GET';
					break;
				}
				case 'createDocumentGroup': {
					const id = this.getNodeParameter('projectId', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/document-groups/`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'deleteDocumentGroup': {
					const id = this.getNodeParameter('projectId', i) as string;
					const documentGroupUid = this.getNodeParameter('documentGroupUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/page-references/document-groups/${documentGroupUid}`;
					method = 'DELETE';
					break;
				}
				case 'listSectionTemplates': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/section-templates/`;
					method = 'GET';
					break;
				}
				case 'createSectionTemplate': {
					const id = this.getNodeParameter('projectId', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/section-templates/`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'getSectionTemplate': {
					const id = this.getNodeParameter('projectId', i) as string;
					const sectionTemplateUid = this.getNodeParameter('sectionTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/section-templates/${sectionTemplateUid}`;
					method = 'GET';
					break;
				}
				case 'deleteSectionTemplate': {
					const id = this.getNodeParameter('projectId', i) as string;
					const sectionTemplateUid = this.getNodeParameter('sectionTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/section-templates/${sectionTemplateUid}`;
					method = 'DELETE';
					break;
				}
				case 'getSectionTemplateForm': {
					const id = this.getNodeParameter('projectId', i) as string;
					const sectionTemplateUid = this.getNodeParameter('sectionTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/section-templates/${sectionTemplateUid}/gom/form`;
					method = 'GET';
					break;
				}
				case 'getSectionTemplateGom': {
					const id = this.getNodeParameter('projectId', i) as string;
					const sectionTemplateUid = this.getNodeParameter('sectionTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/section-templates/${sectionTemplateUid}/gom`;
					method = 'GET';
					break;
				}
				case 'setSectionTemplateGom': {
					const id = this.getNodeParameter('projectId', i) as string;
					const sectionTemplateUid = this.getNodeParameter('sectionTemplateUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/section-templates/${sectionTemplateUid}/gom`;
					body = JSON.parse(content);
					method = 'PUT';
					break;
				}
				case 'getSectionTemplateRules': {
					const id = this.getNodeParameter('projectId', i) as string;
					const sectionTemplateUid = this.getNodeParameter('sectionTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/section-templates/${sectionTemplateUid}/rules`;
					method = 'GET';
					break;
				}
				case 'setSectionTemplateRules': {
					const id = this.getNodeParameter('projectId', i) as string;
					const sectionTemplateUid = this.getNodeParameter('sectionTemplateUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/section-templates/${sectionTemplateUid}/rules`;
					body = JSON.parse(content);
					method = 'PUT';
					break;
				}
				case 'listSectionTemplateChannelSources': {
					const id = this.getNodeParameter('projectId', i) as string;
					const sectionTemplateUid = this.getNodeParameter('sectionTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/section-templates/${sectionTemplateUid}/channel-sources/`;
					method = 'GET';
					break;
				}
				case 'getSectionTemplateChannelSource': {
					const id = this.getNodeParameter('projectId', i) as string;
					const sectionTemplateUid = this.getNodeParameter('sectionTemplateUid', i) as string;
					const templateSetUid = this.getNodeParameter('templateSetUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/section-templates/${sectionTemplateUid}/channel-sources/${templateSetUid}`;
					method = 'GET';
					break;
				}
				case 'setSectionTemplateChannelSource': {
					const id = this.getNodeParameter('projectId', i) as string;
					const sectionTemplateUid = this.getNodeParameter('sectionTemplateUid', i) as string;
					const templateSetUid = this.getNodeParameter('templateSetUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/section-templates/${sectionTemplateUid}/channel-sources/${templateSetUid}`;
					body = JSON.parse(content);
					method = 'PUT';
					break;
				}

				case 'listPageTemplates': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/page-templates/`;
					method = 'GET';
					break;
				}
				case 'createPageTemplate': {
					const id = this.getNodeParameter('projectId', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/page-templates/`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'getPageTemplate': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageTemplateUid = this.getNodeParameter('pageTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/page-templates/${pageTemplateUid}`;
					method = 'GET';
					break;
				}
				case 'deletePageTemplate': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageTemplateUid = this.getNodeParameter('pageTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/page-templates/${pageTemplateUid}`;
					method = 'DELETE';
					break;
				}
				case 'getPageTemplateForm': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageTemplateUid = this.getNodeParameter('pageTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/page-templates/${pageTemplateUid}/gom/form`;
					method = 'GET';
					break;
				}
				case 'getPageTemplateGom': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageTemplateUid = this.getNodeParameter('pageTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/page-templates/${pageTemplateUid}/gom`;
					method = 'GET';
					break;
				}
				case 'setPageTemplateGom': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageTemplateUid = this.getNodeParameter('pageTemplateUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/page-templates/${pageTemplateUid}/gom`;
					body = JSON.parse(content);
					method = 'PUT';
					break;
				}
				case 'getPageTemplateRules': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageTemplateUid = this.getNodeParameter('pageTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/page-templates/${pageTemplateUid}/rules`;
					method = 'GET';
					break;
				}
				case 'setPageTemplateRules': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageTemplateUid = this.getNodeParameter('pageTemplateUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/page-templates/${pageTemplateUid}/rules`;
					body = JSON.parse(content);
					method = 'PUT';
					break;
				}
				case 'listPageTemplateChannelSources': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageTemplateUid = this.getNodeParameter('pageTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/page-templates/${pageTemplateUid}/channel-sources/`;
					method = 'GET';
					break;
				}
				case 'getPageTemplateChannelSource': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageTemplateUid = this.getNodeParameter('pageTemplateUid', i) as string;
					const templateSetUid = this.getNodeParameter('templateSetUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/page-templates/${pageTemplateUid}/channel-sources/${templateSetUid}`;
					method = 'GET';
					break;
				}
				case 'setPageTemplateChannelSource': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageTemplateUid = this.getNodeParameter('pageTemplateUid', i) as string;
					const templateSetUid = this.getNodeParameter('templateSetUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/page-templates/${pageTemplateUid}/channel-sources/${templateSetUid}`;
					body = JSON.parse(content);
					method = 'PUT';
					break;
				}

				case 'listLinkTemplates': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/link-templates/`;
					method = 'GET';
					break;
				}
				case 'createLinkTemplate': {
					const id = this.getNodeParameter('projectId', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/link-templates/`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'getLinkTemplate': {
					const id = this.getNodeParameter('projectId', i) as string;
					const linkTemplateUid = this.getNodeParameter('linkTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/link-templates/${linkTemplateUid}`;
					method = 'GET';
					break;
				}
				case 'deleteLinkTemplate': {
					const id = this.getNodeParameter('projectId', i) as string;
					const linkTemplateUid = this.getNodeParameter('linkTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/link-templates/${linkTemplateUid}`;
					method = 'DELETE';
					break;
				}
				case 'getLinkTemplateGom': {
					const id = this.getNodeParameter('projectId', i) as string;
					const linkTemplateUid = this.getNodeParameter('linkTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/link-templates/${linkTemplateUid}/gom`;
					method = 'GET';
					break;
				}
				case 'setLinkTemplateGom': {
					const id = this.getNodeParameter('projectId', i) as string;
					const linkTemplateUid = this.getNodeParameter('linkTemplateUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/link-templates/${linkTemplateUid}/gom`;
					body = JSON.parse(content);
					method = 'PUT';
					break;
				}
				case 'getLinkTemplateRules': {
					const id = this.getNodeParameter('projectId', i) as string;
					const linkTemplateUid = this.getNodeParameter('linkTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/link-templates/${linkTemplateUid}/rules`;
					method = 'GET';
					break;
				}
				case 'setLinkTemplateRules': {
					const id = this.getNodeParameter('projectId', i) as string;
					const linkTemplateUid = this.getNodeParameter('linkTemplateUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/link-templates/${linkTemplateUid}/rules`;
					body = JSON.parse(content);
					method = 'PUT';
					break;
				}
				case 'listLinkTemplateChannelSources': {
					const id = this.getNodeParameter('projectId', i) as string;
					const linkTemplateUid = this.getNodeParameter('linkTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/link-templates/${linkTemplateUid}/channel-sources/`;
					method = 'GET';
					break;
				}
				case 'getLinkTemplateChannelSource': {
					const id = this.getNodeParameter('projectId', i) as string;
					const linkTemplateUid = this.getNodeParameter('linkTemplateUid', i) as string;
					const templateSetUid = this.getNodeParameter('templateSetUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/link-templates/${linkTemplateUid}/channel-sources/${templateSetUid}`;
					method = 'GET';
					break;
				}
				case 'setLinkTemplateChannelSource': {
					const id = this.getNodeParameter('projectId', i) as string;
					const linkTemplateUid = this.getNodeParameter('linkTemplateUid', i) as string;
					const templateSetUid = this.getNodeParameter('templateSetUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/link-templates/${linkTemplateUid}/channel-sources/${templateSetUid}`;
					body = JSON.parse(content);
					method = 'PUT';
					break;
				}

				case 'listFormatTemplates': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/format-templates/`;
					method = 'GET';
					break;
				}
				case 'createFormatTemplate': {
					const id = this.getNodeParameter('projectId', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/format-templates/`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'getFormatTemplate': {
					const id = this.getNodeParameter('projectId', i) as string;
					const formatTemplateUid = this.getNodeParameter('formatTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/format-templates/${formatTemplateUid}`;
					method = 'GET';
					break;
				}
				case 'deleteFormatTemplate': {
					const id = this.getNodeParameter('projectId', i) as string;
					const formatTemplateUid = this.getNodeParameter('formatTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/format-templates/${formatTemplateUid}`;
					method = 'DELETE';
					break;
				}
				case 'listFormatTemplateChannelSources': {
					const id = this.getNodeParameter('projectId', i) as string;
					const formatTemplateUid = this.getNodeParameter('formatTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/format-templates/${formatTemplateUid}/channel-sources/`;
					method = 'GET';
					break;
				}
				case 'getFormatTemplateChannelSource': {
					const id = this.getNodeParameter('projectId', i) as string;
					const formatTemplateUid = this.getNodeParameter('formatTemplateUid', i) as string;
					const templateSetUid = this.getNodeParameter('templateSetUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/format-templates/${formatTemplateUid}/channel-sources/${templateSetUid}`;
					method = 'GET';
					break;
				}
				case 'setFormatTemplateChannelSource': {
					const id = this.getNodeParameter('projectId', i) as string;
					const formatTemplateUid = this.getNodeParameter('formatTemplateUid', i) as string;
					const templateSetUid = this.getNodeParameter('templateSetUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/format-templates/${formatTemplateUid}/channel-sources/${templateSetUid}`;
					body = JSON.parse(content);
					method = 'PUT';
					break;
				}
				case 'getFormatTemplateGomForm': {
					const id = this.getNodeParameter('projectId', i) as string;
					const formatTemplateUid = this.getNodeParameter('formatTemplateUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/format-templates/${formatTemplateUid}/gom/form`;
					method = 'GET';
					break;
				}

				case 'listSchemas': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/schemas/`;
					method = 'GET';
					break;
				}
				case 'getSchema': {
					const id = this.getNodeParameter('projectId', i) as string;
					const schemaUid = this.getNodeParameter('schemaUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/templates/schemas/${schemaUid}`;
					method = 'GET';
					break;
				}

				case 'addSectionToBody': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageUid = this.getNodeParameter('pageUid', i) as string;
					const bodyName = this.getNodeParameter('bodyName', i) as string;
					const sectionName = this.getNodeParameter('sectionName', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/${bodyName}/sections/${sectionName}`;
					body = JSON.parse(content);
					method = 'PUT';
					break;
				}
				case 'executeActionsOnPage': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageUid = this.getNodeParameter('pageUid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/actions`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'listPages': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/pages/`;
					method = 'GET';
					break;
				}
				case 'createPage': {
					const id = this.getNodeParameter('projectId', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/pages/`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'getInputElementOfForm': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageUid = this.getNodeParameter('pageUid', i) as string;
					const editorName = this.getNodeParameter('editorName', i) as string;
					url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/form/${editorName}`;
					method = 'GET';
					break;
				}
				case 'updateInputElementOfForm': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageUid = this.getNodeParameter('pageUid', i) as string;
					const editorName = this.getNodeParameter('editorName', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
					const formUrl = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/form/${editorName}`;

					const currentEditor = await this.helpers.httpRequest({
						method: 'GET',
						url: formUrl,
						headers: { Authorization: authHeader, Accept: 'application/json' },
						json: true,
					});

					const patchBody = {
						name: currentEditor.name,
						type: currentEditor.type,
						...JSON.parse(content),
					};

					const patchResponse = await this.helpers.httpRequest({
						method: 'PATCH',
						url: formUrl,
						headers: {
							Authorization: authHeader,
							'Content-Type': 'application/json',
							Accept: 'application/json',
						},
						body: patchBody,
						json: true,
					});

					items[i].json = patchResponse;
					continue;
				}
				case 'getInputElementOfSectionForm': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageUid = this.getNodeParameter('pageUid', i) as string;
					const bodyName = this.getNodeParameter('bodyName', i) as string;
					const sectionName = this.getNodeParameter('sectionName', i) as string;
					const editorName = this.getNodeParameter('editorName', i) as string;
					url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/${bodyName}/sections/${sectionName}/form/${editorName}`;
					method = 'GET';
					break;
				}
				case 'updateInputElementOfSectionForm': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageUid = this.getNodeParameter('pageUid', i) as string;
					const bodyName = this.getNodeParameter('bodyName', i) as string;
					const sectionName = this.getNodeParameter('sectionName', i) as string;
					const editorName = this.getNodeParameter('editorName', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
					const sectionFormUrl = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/${bodyName}/sections/${sectionName}/form/${editorName}`;

					const currentSectionEditor = await this.helpers.httpRequest({
						method: 'GET',
						url: sectionFormUrl,
						headers: { Authorization: authHeader, Accept: 'application/json' },
						json: true,
					});

					const sectionPatchBody = {
						name: currentSectionEditor.name,
						type: currentSectionEditor.type,
						...JSON.parse(content),
					};

					const sectionPatchResponse = await this.helpers.httpRequest({
						method: 'PATCH',
						url: sectionFormUrl,
						headers: {
							Authorization: authHeader,
							'Content-Type': 'application/json',
							Accept: 'application/json',
						},
						body: sectionPatchBody,
						json: true,
					});

					items[i].json = sectionPatchResponse;
					continue;
				}
				case 'getPage': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageUid = this.getNodeParameter('pageUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}`;
					method = 'GET';
					break;
				}
				case 'getInputElementsOfFormFromPage': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageUid = this.getNodeParameter('pageUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/form`;
					method = 'GET';
					break;
				}
				case 'getBodiesOfPage': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageUid = this.getNodeParameter('pageUid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/`;
					method = 'GET';
					break;
				}
				case 'getBodyOfPageByName': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageUid = this.getNodeParameter('pageUid', i) as string;
					const bodyName = this.getNodeParameter('bodyName', i) as string;
					url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/${bodyName}`;
					method = 'GET';
					break;
				}
				case 'getInputElementsOfSectionFormFromPage': {
					const id = this.getNodeParameter('projectId', i) as string;
					const pageUid = this.getNodeParameter('pageUid', i) as string;
					const bodyName = this.getNodeParameter('bodyName', i) as string;
					const sectionName = this.getNodeParameter('sectionName', i) as string;
					url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/${bodyName}/sections/${sectionName}/form`;
					method = 'GET';
					break;
				}
				case 'listScripts': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/scripts/`;
					method = 'GET';
					break;
				}
				case 'executeScript': {
					const id = this.getNodeParameter('projectId', i) as string;
					const scriptName = this.getNodeParameter('scriptName', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/scripts/${scriptName}/execute`;
					body = JSON.parse(content);
					method = 'POST';
					headers.Accept = 'text/plain';
					break;
				}
				case 'listProjects': {
					url = `${baseUrl}/v1/projects/`;
					method = 'GET';
					break;
				}
				case 'getProject': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}`;
					method = 'GET';
					break;
				}
				case 'getProjectResolutions': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/resolutions`;
					method = 'GET';
					break;
				}
				case 'listModules': {
					url = `${baseUrl}/v1/modules/`;
					method = 'GET';
					break;
				}
				case 'getModule': {
					const moduleName = this.getNodeParameter('moduleName', i) as string;
					url = `${baseUrl}/v1/modules/${encodeURIComponent(moduleName)}`;
					method = 'GET';
					break;
				}
				case 'uninstallModule': {
					const moduleName = this.getNodeParameter('moduleName', i) as string;
					url = `${baseUrl}/v1/modules/${encodeURIComponent(moduleName)}`;
					method = 'DELETE';
					break;
				}
				case 'installModule': {
					const moduleBinaryField = this.getNodeParameter('moduleBinaryField', i) as string;
					const binaryData = this.helpers.assertBinaryData(i, moduleBinaryField);
					const fileBuffer = await this.helpers.getBinaryDataBuffer(i, moduleBinaryField);
					const fileName = binaryData.fileName ?? 'module.fsm';

					const formData = new FormData();
					formData.append('file', fileBuffer, fileName);

					url = `${baseUrl}/v1/modules/`;
					body = formData;
					method = 'POST';
					break;
				}

				case 'listDataSources': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/data-sources/`;
					method = 'GET';
					break;
				}
				case 'createDataSource': {
					const id = this.getNodeParameter('projectId', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/data-sources/`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'getDataSource': {
					const id = this.getNodeParameter('projectId', i) as string;
					const datasource = this.getNodeParameter('datasource', i) as string;
					url = `${baseUrl}/v1/projects/${id}/data-sources/${encodeURIComponent(datasource)}`;
					method = 'GET';
					break;
				}
				case 'getAllDatasets': {
					const id = this.getNodeParameter('projectId', i) as string;
					const datasource = this.getNodeParameter('datasource', i) as string;
					url = `${baseUrl}/v1/projects/${id}/data-sources/${encodeURIComponent(datasource)}/datasets/`;
					method = 'GET';
					break;
				}
				case 'createDataset': {
					const id = this.getNodeParameter('projectId', i) as string;
					const datasource = this.getNodeParameter('datasource', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/data-sources/${encodeURIComponent(datasource)}/datasets/`;
					body = JSON.parse(content);
					method = 'POST';
					break;
				}
				case 'getDatasetByGid': {
					const id = this.getNodeParameter('projectId', i) as string;
					const datasource = this.getNodeParameter('datasource', i) as string;
					const datasetGid = this.getNodeParameter('datasetGid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/data-sources/${encodeURIComponent(datasource)}/datasets/${encodeURIComponent(datasetGid)}`;
					method = 'GET';
					break;
				}
				case 'deleteDataset': {
					const id = this.getNodeParameter('projectId', i) as string;
					const datasource = this.getNodeParameter('datasource', i) as string;
					const datasetGid = this.getNodeParameter('datasetGid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/data-sources/${encodeURIComponent(datasource)}/datasets/${encodeURIComponent(datasetGid)}`;
					method = 'DELETE';
					break;
				}
				case 'getDatasetEntity': {
					const id = this.getNodeParameter('projectId', i) as string;
					const datasource = this.getNodeParameter('datasource', i) as string;
					const datasetGid = this.getNodeParameter('datasetGid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/data-sources/${encodeURIComponent(datasource)}/datasets/${encodeURIComponent(datasetGid)}/entity`;
					method = 'GET';
					break;
				}
				case 'updateDatasetEntity': {
					const id = this.getNodeParameter('projectId', i) as string;
					const datasource = this.getNodeParameter('datasource', i) as string;
					const datasetGid = this.getNodeParameter('datasetGid', i) as string;
					const content = this.getNodeParameter('content', i) as string;
					url = `${baseUrl}/v1/projects/${id}/data-sources/${encodeURIComponent(datasource)}/datasets/${encodeURIComponent(datasetGid)}/entity`;
					body = JSON.parse(content);
					method = 'PATCH';
					break;
				}
				case 'getDatasetRevisions': {
					const id = this.getNodeParameter('projectId', i) as string;
					const datasource = this.getNodeParameter('datasource', i) as string;
					const datasetGid = this.getNodeParameter('datasetGid', i) as string;
					url = `${baseUrl}/v1/projects/${id}/data-sources/${encodeURIComponent(datasource)}/datasets/${encodeURIComponent(datasetGid)}/revisions/`;
					method = 'GET';
					break;
				}
				case 'getDatasetRevisionById': {
					const id = this.getNodeParameter('projectId', i) as string;
					const datasource = this.getNodeParameter('datasource', i) as string;
					const datasetGid = this.getNodeParameter('datasetGid', i) as string;
					const datasetRevisionId = this.getNodeParameter('datasetRevisionId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/data-sources/${encodeURIComponent(datasource)}/datasets/${encodeURIComponent(datasetGid)}/revisions/${encodeURIComponent(datasetRevisionId)}`;
					method = 'GET';
					break;
				}

				case 'listGlobalContentElements': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/global-content/`;
					method = 'GET';
					break;
				}
				case 'getProjectProperties': {
					const id = this.getNodeParameter('projectId', i) as string;
					url = `${baseUrl}/v1/projects/${id}/global-content/project-properties`;
					method = 'GET';
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
			}

			const response = await this.helpers.httpRequest({
				method,
				url,
				headers: {
					Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
					...(body instanceof FormData
						? body.getHeaders()
						: { 'Content-Type': 'application/json' }),
					Accept: headers.Accept ?? (isBinaryEndpoint ? '*/*' : 'application/json'),
				},
				body,
				json: !isBinaryEndpoint && !(body instanceof FormData),
				encoding: isBinaryEndpoint ? 'arraybuffer' : undefined,
				returnFullResponse: isBinaryEndpoint ? true : undefined,
			});

			if (isBinaryEndpoint) {
				const fileName =
					response.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') ||
					'file';
				items[i].binary = {
					data: await this.helpers.prepareBinaryData(response.body, fileName),
				};
			} else if (String(headers.Accept ?? '').includes('text/plain')) {

				items[i].json = { result: response };
			} else {
				items[i].json = response;
			}
		}
		return [items];
	}
}
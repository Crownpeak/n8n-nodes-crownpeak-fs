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
						name: 'List Page Templates',
						value: 'listPageTemplates',
						action: 'List page templates',
					},
					{
						name: 'Create Page Template',
						value: 'createPageTemplate',
						action: 'Create page template',
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
						resource: ['project', 'search', 'page', 'template', 'script', 'media', 'pageReference'],
					},
					hide: {
						operation: ['listProjects'],
					},
				},
				placeholder: 'Enter the project ID',
				description: 'The ID of the project to retrieve',
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
						operation: ['getPageReferenceByUid'],
					},
				},
				placeholder: 'Enter the page reference UID',
				description: 'The UID of the page reference to retrieve',
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
				description: 'The UID of the medium to retrieve',
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
							'updateInputElementOfForm',
							'getInputElementOfSectionForm',
							'updateInputElementOfSectionForm',
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
				description: 'The UID of the page to retrieve',
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
							'updateInputElementOfSectionForm',
							'getBodyOfPageByName',
							'getInputElementsOfSectionFormFromPage',
						],
					},
				},
				placeholder: 'Enter the body name',
				description: 'The name of the body to retrieve from a page',
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
							'updateInputElementOfSectionForm',
							'getInputElementsOfSectionFormFromPage',
						],
					},
				},
				placeholder: 'Enter the section name',
				description: 'The name of the section to retrieve from a page',
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
							'executeScript',
							'createSectionTemplate',
							'createPageTemplate',
						],
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

			let isBinaryEndpoint = [
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
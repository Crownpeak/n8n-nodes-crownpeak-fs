import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IExecuteFunctions,
	IHttpRequestMethods,
	NodeOperationError,
	INodeProperties,
} from 'n8n-workflow';
import { getBinaryUpload } from './helpers/binary';
import {
	bodyLocator,
	mediumLocator,
	pageLocator,
	pageReferenceLocator,
	pageReferenceLocatorForActions,
	projectLocator,
	scriptLocator,
	sectionLocator,
} from './descriptions/locators';
import { getLocatorValue } from './helpers/resourceLocator';
import { loadOptions } from './methods/loadOptions';
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
} from './descriptions/createUpdateFields';
import { buildRequestBody } from './helpers/options';
import { extractItems, pushResponse } from './helpers/output';

function withDisplayOptions(
	properties: INodeProperties[],
	resource: string,
	operation: string,
): INodeProperties[] {
	return properties.map((property) => ({
		...property,
		displayOptions: {
			...(property.displayOptions ?? {}),
			show: {
				...(property.displayOptions?.show ?? {}),
				resource: [resource],
				operation: [operation],
			},
		},
	}));
}

export class CrownpeakFS implements INodeType {
	methods = {
		listSearch: loadOptions,
	};

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
						name: 'Download Binary',
						value: 'getBinaryDataOfMedium',
						action: 'download binary',
					},
					{
						name: 'Upload Binary',
						value: 'uploadBinaryDataToMedium',
						action: 'upload binary',
					},
					{
						name: 'Create',
						value: 'createMedium',
						action: 'Create medium',
					},
					{
						name: 'Get',
						value: 'getMedium',
						action: 'Get medium',
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
						name: 'Get Many',
						value: 'listProjects',
						action: 'List projects',
					},
					{
						name: 'Get',
						value: 'getProject',
						action: 'Get project',
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
						name: 'Get Many',
						value: 'listPageReferences',
						action: 'List page references',
					},
					{
						name: 'Create',
						value: 'createPageReference',
						action: 'Create page reference',
					},
					{
						name: 'Get',
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
						name: 'Add Section to Body',
						value: 'addSectionToBody',
						action: 'Add section to body',
					},
					{
						name: 'Execute Action',
						value: 'executeActionsOnPage',
						action: 'Execute actions on page',
					},
					{
						name: 'Get Many',
						value: 'listPages',
						action: 'List pages',
					},
					{
						name: 'Create',
						value: 'createPage',
						action: 'Create page',
					},
					{
						name: 'Get Page Input Element',
						value: 'getInputElementOfForm',
						action: 'Get input element of form',
					},
					{
						name: 'Update Page Input Element',
						value: 'updateInputElementOfForm',
						action: 'Update input element of form',
					},
					{
						name: 'Get Section Input Element',
						value: 'getInputElementOfSectionForm',
						action: 'Get input element of section form',
					},
					{
						name: 'Update Section Input Element',
						value: 'updateInputElementOfSectionForm',
						action: 'Update input element of section form',
					},
					{
						name: 'Get',
						value: 'getPage',
						action: 'Get page',
					},
					{
						name: 'Get Page Form',
						value: 'getInputElementsOfFormFromPage',
						action: 'Get input elements of form from page',
					},
					{
						name: 'Get Bodies',
						value: 'getBodiesOfPage',
						action: 'Get bodies of page',
					},
					{
						name: 'Get Body',
						value: 'getBodyOfPageByName',
						action: 'Get bodies of page by name',
					},
					{
						name: 'Get Section Form',
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
						name: 'Search',
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
						name: 'Get Many',
						value: 'listScripts',
						action: 'List scripts',
					},
					{
						name: 'Execute',
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
						name: 'Get Many Section Templates',
						value: 'listSectionTemplates',
						action: 'List section templates',
					},
					{
						name: 'Create Section Template',
						value: 'createSectionTemplate',
						action: 'Create section template',
					},
					{
						name: 'Get Many Page Templates',
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
			projectLocator,
			pageReferenceLocator,
			pageReferenceLocatorForActions,
			mediumLocator,
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
					hide: {
						returnAll: [true],
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
					hide: {
						returnAll: [true],
					},
				},
				description: 'The number of items to retrieve per page',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['searchProject'],
					},
				},
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				typeOptions: {
					minValue: 1,
				},
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['searchProject'],
						returnAll: [true],
					},
				},
				description: 'Max number of results to return',
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
							'getInputElementOfForm',
							'getInputElementOfSectionForm',
						],
					},
				},
				placeholder: 'Enter the editor name',
				description: 'The technical identifier of an input component',
			},
			pageLocator,
			bodyLocator,
			sectionLocator,
			scriptLocator,
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['uploadBinaryDataToMedium'],
					},
				},
				description: 'Name of the input binary property that contains the file to upload',
			},
			...withDisplayOptions(createMediumFields, 'media', 'createMedium'),
			...withDisplayOptions(createPageFields, 'page', 'createPage'),
			...withDisplayOptions(createPageReferenceFields, 'pageReference', 'createPageReference'),
			...withDisplayOptions(createPageTemplateFields, 'template', 'createPageTemplate'),
			...withDisplayOptions(createSectionTemplateFields, 'template', 'createSectionTemplate'),
			...withDisplayOptions(addSectionToBodyFields, 'page', 'addSectionToBody'),
			...withDisplayOptions(executeActionsOnPageFields, 'page', 'executeActionsOnPage'),
			...withDisplayOptions(updateInputElementFields, 'page', 'updateInputElementOfForm'),
			...withDisplayOptions(
				updateInputElementOfSectionFields,
				'page',
				'updateInputElementOfSectionForm',
			),
			{
				displayName: 'Script Parameters',
				name: 'scriptParameters',
				type: 'json',
				default: '{}',
				typeOptions: { alwaysOpenEditWindow: true },
				displayOptions: {
					show: {
						resource: ['script'],
						operation: ['executeScript'],
					},
				},
				description:
					"Parameters passed to the script as a JSON object. Structure depends on the script's expected inputs.",
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const { username, password, baseUrl } = (await this.getCredentials('crownpeakFSApi')) as {
					username: string;
					password: string;
					baseUrl: string;
				};

				let method: IHttpRequestMethods;
				let url = '';
				let headers: IDataObject = {};
				let body: Buffer | IDataObject | string | undefined;

				const isBinaryEndpoint = operation === 'getBinaryDataOfMedium';

				switch (operation) {
					case 'getBinaryDataOfMedium': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const mediumUid = getLocatorValue(this.getNodeParameter('mediumUid', i));
						url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/data`;
						method = 'GET';
						headers.Accept = '*/*';
						break;
					}
					case 'uploadBinaryDataToMedium': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const mediumUid = getLocatorValue(this.getNodeParameter('mediumUid', i));
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const upload = await getBinaryUpload(this, items[i], i, binaryPropertyName);

						url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}/data`;
						body = upload.buffer;
						method = 'PUT';
						headers['Content-Type'] = upload.mimeType;
						break;
					}
					case 'createMedium': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const typed = {
							uid: this.getNodeParameter('uid', i, '') as string,
							filename: this.getNodeParameter('filename', i, '') as string,
							type: this.getNodeParameter('type', i, '') as string,
						};
						const additional = this.getNodeParameter('additionalProperties', i, '{}') as string;
						url = `${baseUrl}/v1/projects/${id}/media`;
						body = buildRequestBody(typed, additional);
						method = 'POST';
						break;
					}
					case 'getMedium': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const mediumUid = getLocatorValue(this.getNodeParameter('mediumUid', i));
						url = `${baseUrl}/v1/projects/${id}/media/${mediumUid}`;
						method = 'GET';
						break;
					}
					case 'searchProject': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const q = this.getNodeParameter('searchQuery', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							const limit = this.getNodeParameter('limit', i) as number;
							const collected: IDataObject[] = [];
							let page = 0;
							const size = Math.min(limit, 100);

							while (collected.length < limit) {
								const searchParams = new URLSearchParams({
									q,
									page: String(page),
									size: String(size),
								});
								const response = await this.helpers.httpRequest({
									method: 'GET',
									url: `${baseUrl}/v1/projects/${id}/search?${searchParams.toString()}`,
									headers: {
										Authorization:
											'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
										Accept: 'application/json',
									},
									json: true,
								});
								const pageItems = extractItems(response);
								collected.push(...pageItems);

								if (pageItems.length < size) {
									break;
								}

								page += 1;
							}

							pushResponse(returnData, collected.slice(0, limit), i);
							continue;
						}
						const page = this.getNodeParameter('pageNumber', i) as string;
						const size = this.getNodeParameter('pageSize', i) as string;
						const searchParams = new URLSearchParams({ q, page, size });
						url = `${baseUrl}/v1/projects/${id}/search?${searchParams.toString()}`;
						method = 'GET';
						break;
					}
					case 'listPageReferences': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						url = `${baseUrl}/v1/projects/${id}/page-references/`;
						method = 'GET';
						break;
					}
					case 'createPageReference': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const typed = {
							uid: this.getNodeParameter('uid', i, '') as string,
							pageId: this.getNodeParameter('pageId', i, 0) as number,
							location: this.getNodeParameter('location', i, '') as string,
						};
						const additional = this.getNodeParameter('additionalProperties', i, '{}') as string;
						url = `${baseUrl}/v1/projects/${id}/page-references`;
						body = buildRequestBody(typed, additional);
						method = 'POST';
						break;
					}
					case 'getPageReferenceByUid': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const pageReferenceUid = getLocatorValue(this.getNodeParameter('pageReferenceUid', i));
						url = `${baseUrl}/v1/projects/${id}/page-references/${pageReferenceUid}`;
						method = 'GET';
						break;
					}
					case 'listSectionTemplates': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						url = `${baseUrl}/v1/projects/${id}/templates/section-templates`;
						method = 'GET';
						break;
					}
					case 'createSectionTemplate': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const typed = {
							uid: this.getNodeParameter('uid', i, '') as string,
							name: this.getNodeParameter('name', i, '') as string,
							description: this.getNodeParameter('description', i, '') as string,
						};
						const additional = this.getNodeParameter('additionalProperties', i, '{}') as string;
						url = `${baseUrl}/v1/projects/${id}/templates/section-templates`;
						body = buildRequestBody(typed, additional);
						method = 'POST';
						break;
					}
					case 'listPageTemplates': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						url = `${baseUrl}/v1/projects/${id}/templates/page-templates`;
						method = 'GET';
						break;
					}
					case 'createPageTemplate': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const bodiesParam = this.getNodeParameter('bodies', i, {}) as {
							body?: Array<{ name: string; description?: string }>;
						};
						const bodies = (bodiesParam.body ?? []).map((b) => ({
							name: b.name,
							description: b.description ?? null,
						}));
						const typed = {
							uid: this.getNodeParameter('uid', i, '') as string,
							name: this.getNodeParameter('name', i, '') as string,
							description: this.getNodeParameter('description', i, '') as string,
							bodies: bodies.length > 0 ? bodies : undefined,
						};
						const additional = this.getNodeParameter('additionalProperties', i, '{}') as string;
						url = `${baseUrl}/v1/projects/${id}/templates/page-templates`;
						body = buildRequestBody(typed as IDataObject, additional);
						method = 'POST';
						break;
					}
					case 'addSectionToBody': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
						const bodyName = getLocatorValue(this.getNodeParameter('bodyName', i));
						const sectionName = getLocatorValue(this.getNodeParameter('sectionName', i));
						const templateUid = getLocatorValue(this.getNodeParameter('sectionTemplateUid', i));
						url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/${bodyName}/sections/${sectionName}`;
						body = { templateUid };
						method = 'PUT';
						break;
					}
					case 'executeActionsOnPage': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const pageReferenceUid = getLocatorValue(
							this.getNodeParameter('pageReferenceUid', i),
						);
						const action = this.getNodeParameter('action', i, 'copy') as string;
						const releaseOptions =
							action === 'release'
								? (this.getNodeParameter('releaseOptions', i, {}) as IDataObject)
								: undefined;
						url = `${baseUrl}/v1/projects/${id}/page-references/${pageReferenceUid}/actions`;
						body =
							action === 'release' && releaseOptions && Object.keys(releaseOptions).length > 0
								? { action, options: releaseOptions }
								: { action };
						method = 'POST';
						break;
					}
					case 'listPages': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						url = `${baseUrl}/v1/projects/${id}/pages/`;
						method = 'GET';
						break;
					}
					case 'createPage': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const typed = {
							uid: this.getNodeParameter('uid', i, '') as string,
							templateUid: getLocatorValue(this.getNodeParameter('templateUid', i)),
						};
						const additional = this.getNodeParameter('additionalProperties', i, '{}') as string;
						url = `${baseUrl}/v1/projects/${id}/pages`;
						body = buildRequestBody(typed, additional);
						method = 'POST';
						break;
					}
					case 'getInputElementOfForm': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
						const editorName = this.getNodeParameter('editorName', i) as string;
						url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/form/${editorName}`;
						method = 'GET';
						break;
					}
					case 'updateInputElementOfForm': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
						const editorName = this.getNodeParameter('inputElementName', i, '') as string;
						const language = this.getNodeParameter('language', i, '') as string;
						const typed = {
							name: editorName,
							type: this.getNodeParameter('inputElementType', i, '') as string,
							language: language === '' ? null : language,
							description: this.getNodeParameter('inputElementDescription', i, '') as string,
							configuration: JSON.parse(
								this.getNodeParameter('inputElementConfiguration', i, '{}') as string,
							),
							content: JSON.parse(this.getNodeParameter('inputElementContent', i, '""') as string),
						};
						url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/form/${editorName}${
							language ? `/${language}` : ''
						}`;
						body = typed as IDataObject;
						method = 'PATCH';
						break;
					}
					case 'getInputElementOfSectionForm': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
						const bodyName = getLocatorValue(this.getNodeParameter('bodyName', i));
						const sectionName = getLocatorValue(this.getNodeParameter('sectionName', i));
						const editorName = this.getNodeParameter('editorName', i) as string;
						url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/${bodyName}/sections/${sectionName}/form/${editorName}`;
						method = 'GET';
						break;
					}
					case 'updateInputElementOfSectionForm': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
						const bodyName = getLocatorValue(this.getNodeParameter('bodyName', i));
						const sectionName = getLocatorValue(this.getNodeParameter('sectionName', i));
						const editorName = this.getNodeParameter('inputElementName', i, '') as string;
						const language = this.getNodeParameter('language', i, '') as string;
						const typed = {
							name: editorName,
							type: this.getNodeParameter('inputElementType', i, '') as string,
							language: language === '' ? null : language,
							description: this.getNodeParameter('inputElementDescription', i, '') as string,
							configuration: JSON.parse(
								this.getNodeParameter('inputElementConfiguration', i, '{}') as string,
							),
							content: JSON.parse(this.getNodeParameter('inputElementContent', i, '""') as string),
						};
						url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/${bodyName}/sections/${sectionName}/form/${editorName}${
							language ? `/${language}` : ''
						}`;
						body = typed as IDataObject;
						method = 'PATCH';
						break;
					}
					case 'getPage': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
						url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}`;
						method = 'GET';
						break;
					}
					case 'getInputElementsOfFormFromPage': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
						url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/form`;
						method = 'GET';
						break;
					}
					case 'getBodiesOfPage': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
						url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies`;
						method = 'GET';
						break;
					}
					case 'getBodyOfPageByName': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
						const bodyName = getLocatorValue(this.getNodeParameter('bodyName', i));
						url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/${bodyName}`;
						method = 'GET';
						break;
					}
					case 'getInputElementsOfSectionFormFromPage': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const pageUid = getLocatorValue(this.getNodeParameter('pageUid', i));
						const bodyName = getLocatorValue(this.getNodeParameter('bodyName', i));
						const sectionName = getLocatorValue(this.getNodeParameter('sectionName', i));
						url = `${baseUrl}/v1/projects/${id}/pages/${pageUid}/bodies/${bodyName}/sections/${sectionName}/form`;
						method = 'GET';
						break;
					}
					case 'listScripts': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						url = `${baseUrl}/v1/projects/${id}/scripts/`;
						method = 'GET';
						break;
					}
					case 'executeScript': {
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						const scriptName = getLocatorValue(this.getNodeParameter('scriptName', i));
						const params = this.getNodeParameter('scriptParameters', i, '{}') as string;
						url = `${baseUrl}/v1/projects/${id}/scripts/${scriptName}/execute`;
						body = buildRequestBody({}, params);
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
						const id = getLocatorValue(this.getNodeParameter('projectId', i));
						url = `${baseUrl}/v1/projects/${id}`;
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
						'Content-Type': headers['Content-Type'] ?? 'application/json',
						Accept: headers.Accept ?? (isBinaryEndpoint ? '*/*' : 'application/json'),
					},
					body,
					json:
						!isBinaryEndpoint &&
						!Buffer.isBuffer(body) &&
						String(headers.Accept ?? 'application/json')
							.toLowerCase()
							.includes('json'),
					encoding: isBinaryEndpoint ? 'arraybuffer' : undefined,
					returnFullResponse: isBinaryEndpoint ? true : undefined,
				});

				if (isBinaryEndpoint) {
					const fileName =
						response.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') ||
						'file';
					const binaryData = await this.helpers.prepareBinaryData(response.body, fileName);
					returnData.push({
						json: { fileName: binaryData.fileName, mimeType: binaryData.mimeType },
						binary: { data: binaryData },
						pairedItem: { item: i },
					});
				} else {
					pushResponse(returnData, response, i);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error instanceof Error ? error.message : String(error) },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

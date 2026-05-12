import { IDataObject, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { crownpeakApiRequest } from '../helpers/request';
import { toNameValueOptions } from '../helpers/options';
import { getLocatorValue } from '../helpers/resourceLocator';

export function asArray(response: unknown): IDataObject[] {
	if (Array.isArray(response)) {
		return response as IDataObject[];
	}

	if (response && typeof response === 'object') {
		const objectResponse = response as IDataObject;
		for (const key of ['items', 'data', 'projects', 'results']) {
			if (Array.isArray(objectResponse[key])) {
				return objectResponse[key] as IDataObject[];
			}
		}
	}

	return [];
}

function filterOptions(options: ReturnType<typeof toNameValueOptions>, filter?: string) {
	const normalizedFilter = filter?.toLowerCase() ?? '';

	return normalizedFilter
		? options.filter((option) => option.name.toLowerCase().includes(normalizedFilter))
		: options;
}

function currentLocatorValue(context: ILoadOptionsFunctions, parameterName: string): string {
	return getLocatorValue(context.getCurrentNodeParameter(parameterName));
}

export const loadOptions = {
	async searchProjects(
		this: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		const response = await crownpeakApiRequest(this, 'GET', '/v1/projects/');
		const options = toNameValueOptions(asArray(response), ['name', 'displayName', 'uid', 'id'], [
			'id',
			'uid',
			'name',
		]);

		return {
			results: filterOptions(options, filter),
		};
	},

	async searchPages(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		const projectId = currentLocatorValue(this, 'projectId');
		const response = await crownpeakApiRequest(this, 'GET', `/v1/projects/${projectId}/pages/`);
		const options = toNameValueOptions(asArray(response), ['name', 'displayName', 'uid', 'id'], [
			'uid',
			'id',
			'name',
		]);

		return {
			results: filterOptions(options, filter),
		};
	},

	async searchPageReferences(
		this: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		const projectId = currentLocatorValue(this, 'projectId');
		const response = await crownpeakApiRequest(
			this,
			'GET',
			`/v1/projects/${projectId}/page-references/`,
		);
		const options = toNameValueOptions(asArray(response), ['name', 'displayName', 'uid', 'id'], [
			'uid',
			'id',
			'name',
		]);

		return {
			results: filterOptions(options, filter),
		};
	},

	async searchMedia(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		const projectId = currentLocatorValue(this, 'projectId');
		const searchParams = new URLSearchParams({
			q: filter ?? '',
			page: '0',
			size: '20',
		});
		const response = await crownpeakApiRequest(
			this,
			'GET',
			`/v1/projects/${projectId}/search?${searchParams.toString()}`,
		);
		const options = toNameValueOptions(asArray(response), ['name', 'displayName', 'uid', 'id'], [
			'uid',
			'id',
			'name',
		]);

		return {
			results: filterOptions(options, filter),
		};
	},

	async searchScripts(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		const projectId = currentLocatorValue(this, 'projectId');
		const response = await crownpeakApiRequest(this, 'GET', `/v1/projects/${projectId}/scripts/`);
		const options = toNameValueOptions(asArray(response), ['name', 'displayName', 'uid', 'id'], [
			'name',
			'uid',
			'id',
		]);

		return {
			results: filterOptions(options, filter),
		};
	},

	async searchBodies(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		const projectId = currentLocatorValue(this, 'projectId');
		const pageUid = currentLocatorValue(this, 'pageUid');
		const response = await crownpeakApiRequest(
			this,
			'GET',
			`/v1/projects/${projectId}/pages/${pageUid}/bodies`,
		);
		const options = toNameValueOptions(asArray(response), ['name', 'displayName', 'uid', 'id'], [
			'name',
			'uid',
			'id',
		]);

		return {
			results: filterOptions(options, filter),
		};
	},

	async searchSections(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		const projectId = currentLocatorValue(this, 'projectId');
		const pageUid = currentLocatorValue(this, 'pageUid');
		const bodyName = currentLocatorValue(this, 'bodyName');
		const response = await crownpeakApiRequest(
			this,
			'GET',
			`/v1/projects/${projectId}/pages/${pageUid}/bodies/${bodyName}`,
		);
		const options = toNameValueOptions(asArray(response), ['name', 'displayName', 'uid', 'id'], [
			'name',
			'uid',
			'id',
		]);

		return {
			results: filterOptions(options, filter),
		};
	},

	async searchSectionTemplates(
		this: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		const projectId = currentLocatorValue(this, 'projectId');
		const response = await crownpeakApiRequest(
			this,
			'GET',
			`/v1/projects/${projectId}/templates/section-templates/`,
		);
		const options = toNameValueOptions(asArray(response), ['name', 'displayName', 'uid', 'id'], [
			'uid',
			'id',
			'name',
		]);

		return {
			results: filterOptions(options, filter),
		};
	},

	async searchPageTemplates(
		this: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		const projectId = currentLocatorValue(this, 'projectId');
		const response = await crownpeakApiRequest(
			this,
			'GET',
			`/v1/projects/${projectId}/templates/page-templates/`,
		);
		const options = toNameValueOptions(asArray(response), ['name', 'displayName', 'uid', 'id'], [
			'uid',
			'id',
			'name',
		]);

		return {
			results: filterOptions(options, filter),
		};
	},
};

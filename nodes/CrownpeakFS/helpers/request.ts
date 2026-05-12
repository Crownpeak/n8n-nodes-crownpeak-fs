import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

interface CrownpeakCredentials {
	username: string;
	password: string;
	baseUrl: string;
}

export async function getCrownpeakCredentials(
	context: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<CrownpeakCredentials> {
	return (await context.getCredentials('crownpeakFSApi')) as CrownpeakCredentials;
}

export function joinUrl(baseUrl: string, path: string): string {
	return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export async function crownpeakApiRequest<T = IDataObject | IDataObject[] | string | Buffer>(
	context: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	path: string,
	options: {
		body?: IDataObject | Buffer | string;
		headers?: IDataObject;
		json?: boolean;
		encoding?: 'arraybuffer';
		returnFullResponse?: boolean;
	} = {},
): Promise<T> {
	const { username, password, baseUrl } = await getCrownpeakCredentials(context);

	try {
		return (await context.helpers.httpRequest({
			method,
			url: joinUrl(baseUrl, path),
			headers: {
				Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
				Accept: 'application/json',
				...options.headers,
			},
			body: options.body,
			json: options.json ?? true,
			encoding: options.encoding,
			returnFullResponse: options.returnFullResponse,
		})) as T;
	} catch (error) {
		throw new NodeApiError(context.getNode(), error as JsonObject, {
			message: 'FirstSpirit REST API request failed',
			description: 'Check the base URL, credentials, and FirstSpirit REST API availability.',
		});
	}
}

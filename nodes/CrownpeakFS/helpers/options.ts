import { IDataObject, INodePropertyOptions } from 'n8n-workflow';

function readFirstString(source: IDataObject, keys: string[]): string {
	for (const key of keys) {
		const value = source[key];
		if (value !== undefined && value !== null && String(value).trim() !== '') {
			return String(value);
		}
	}

	return '';
}

export function toNameValueOptions(
	items: IDataObject[],
	nameKeys: string[],
	valueKeys: string[],
): INodePropertyOptions[] {
	const options: INodePropertyOptions[] = [];

	for (const item of items) {
		const name = readFirstString(item, nameKeys);
		const value = readFirstString(item, valueKeys);

		if (name && value) {
			options.push({ name, value });
		}
	}

	return options.sort((a, b) => a.name.localeCompare(b.name));
}

export function buildRequestBody(typed: IDataObject, additional?: string): IDataObject {
	const filtered: IDataObject = {};
	for (const [key, value] of Object.entries(typed)) {
		if (value === undefined) continue;
		if (typeof value === 'string' && value === '') continue;
		filtered[key] = value;
	}

	if (additional === undefined || additional === '' || additional === '{}') {
		return filtered;
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(additional);
	} catch {
		throw new Error('Additional Properties must be valid JSON');
	}

	if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('Additional Properties must be a JSON object');
	}

	return { ...(parsed as IDataObject), ...filtered };
}

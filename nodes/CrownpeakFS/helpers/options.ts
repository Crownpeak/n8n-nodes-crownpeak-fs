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

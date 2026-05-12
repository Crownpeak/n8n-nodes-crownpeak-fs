import { IDataObject, INodeExecutionData } from 'n8n-workflow';

// Order defines priority: when multiple keys carry arrays, the first match wins.
const WRAPPER_KEYS = ['items', 'data', 'results', 'projects'] as const;

export function extractItems(response: unknown): IDataObject[] {
	if (Array.isArray(response)) {
		return response as IDataObject[];
	}

	if (response && typeof response === 'object') {
		const wrapperKey = WRAPPER_KEYS.find((key) =>
			Array.isArray((response as IDataObject)[key]),
		);
		if (wrapperKey) {
			return (response as IDataObject)[wrapperKey] as IDataObject[];
		}
	}

	return [];
}

export function pushResponse(
	returnData: INodeExecutionData[],
	response: unknown,
	inputIndex: number,
): void {
	const pairedItem = { item: inputIndex };

	if (Array.isArray(response)) {
		for (const entry of response) {
			returnData.push({ json: toJsonObject(entry), pairedItem });
		}
		return;
	}

	if (response && typeof response === 'object') {
		const wrapperKey = WRAPPER_KEYS.find((key) =>
			Array.isArray((response as IDataObject)[key]),
		);
		if (wrapperKey) {
			for (const entry of (response as IDataObject)[wrapperKey] as unknown[]) {
				returnData.push({ json: toJsonObject(entry), pairedItem });
			}
			return;
		}
		returnData.push({ json: response as IDataObject, pairedItem });
		return;
	}

	returnData.push({ json: { data: response } as IDataObject, pairedItem });
}

function toJsonObject(value: unknown): IDataObject {
	if (value && typeof value === 'object') {
		return value as IDataObject;
	}
	return { value: value as IDataObject[string] };
}

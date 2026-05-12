import { NodeParameterValueType } from 'n8n-workflow';

interface LocatorLike {
	value?: NodeParameterValueType;
}

export function getLocatorValue(value: unknown): string {
	if (value === undefined || value === null) {
		return '';
	}

	if (typeof value === 'object' && 'value' in value) {
		const locatorValue = (value as LocatorLike).value;
		return locatorValue === undefined || locatorValue === null ? '' : String(locatorValue);
	}

	return String(value);
}

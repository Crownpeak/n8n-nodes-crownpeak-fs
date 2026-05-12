import { getLocatorValue } from '../nodes/CrownpeakFS/helpers/resourceLocator';

describe('resource locator helper', () => {
	it('returns scalar values unchanged', () => {
		expect(getLocatorValue('123')).toBe('123');
	});

	it('returns value from n8n resource locator objects', () => {
		expect(getLocatorValue({ mode: 'list', value: 'project-1' })).toBe('project-1');
	});

	it('returns an empty string for empty values', () => {
		expect(getLocatorValue(undefined)).toBe('');
		expect(getLocatorValue(null)).toBe('');
	});

	it('stringifies numeric values', () => {
		expect(getLocatorValue(42)).toBe('42');
	});
});

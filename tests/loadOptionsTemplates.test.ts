import { loadOptions } from '../nodes/CrownpeakFS/methods/loadOptions';

function buildContext(response: unknown, projectId = '42') {
	return {
		getCurrentNodeParameter: jest.fn().mockReturnValue(projectId),
		helpers: {
			httpRequest: jest.fn().mockResolvedValue(response),
		},
		getCredentials: jest.fn().mockResolvedValue({
			username: 'u',
			password: 'p',
			baseUrl: 'https://fs.example.com',
		}),
		getNode: jest.fn().mockReturnValue({ name: 'FirstSpirit REST API' }),
	};
}

describe('loadOptions templates', () => {
	it('lists section templates for the current project', async () => {
		const context = buildContext([
			{ uid: 'text', displayName: 'Text', id: 1 },
			{ uid: 'image', displayName: 'Image', id: 2 },
		]);
		const result = await loadOptions.searchSectionTemplates.call(context as any);
		expect(result.results).toEqual([
			{ name: 'Image', value: 'image' },
			{ name: 'Text', value: 'text' },
		]);
	});

	it('filters section templates by lowercase substring', async () => {
		const context = buildContext([
			{ uid: 'text', displayName: 'Text Section', id: 1 },
			{ uid: 'image', displayName: 'Image Section', id: 2 },
		]);
		const result = await loadOptions.searchSectionTemplates.call(context as any, 'IMAGE');
		expect(result.results).toEqual([{ name: 'Image Section', value: 'image' }]);
	});

	it('lists page templates for the current project', async () => {
		const context = buildContext([{ uid: 'standard', displayName: 'Standard', id: 7 }]);
		const result = await loadOptions.searchPageTemplates.call(context as any);
		expect(result.results).toEqual([{ name: 'Standard', value: 'standard' }]);
	});
});

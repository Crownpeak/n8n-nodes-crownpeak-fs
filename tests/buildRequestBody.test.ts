import { buildRequestBody } from '../nodes/CrownpeakFS/helpers/options';

describe('buildRequestBody', () => {
	it('returns the typed object when no additional is given', () => {
		expect(buildRequestBody({ uid: 'home', templateUid: 'page' })).toEqual({
			uid: 'home',
			templateUid: 'page',
		});
	});

	it('drops undefined and empty-string values from typed', () => {
		expect(
			buildRequestBody({ uid: 'home', description: '', count: undefined as any, flag: false }),
		).toEqual({ uid: 'home', flag: false });
	});

	it('returns the typed object when additional is an empty string', () => {
		expect(buildRequestBody({ uid: 'home' }, '')).toEqual({ uid: 'home' });
	});

	it('returns the typed object when additional is "{}"', () => {
		expect(buildRequestBody({ uid: 'home' }, '{}')).toEqual({ uid: 'home' });
	});

	it('merges additional into typed, with typed winning on collision', () => {
		expect(
			buildRequestBody({ uid: 'home' }, '{"description":"Home page","uid":"ignored"}'),
		).toEqual({ uid: 'home', description: 'Home page' });
	});

	it('lets additional fill in keys that typed left undefined', () => {
		expect(
			buildRequestBody({ uid: 'home', type: undefined as any }, '{"type":"PICTURE"}'),
		).toEqual({ uid: 'home', type: 'PICTURE' });
	});

	it('throws on invalid JSON', () => {
		expect(() => buildRequestBody({}, 'not json')).toThrow(/Additional Properties must be valid JSON/);
	});

	it('throws when additional parses to non-object', () => {
		expect(() => buildRequestBody({}, '"a string"')).toThrow(
			/Additional Properties must be a JSON object/,
		);
		expect(() => buildRequestBody({}, '[1, 2]')).toThrow(
			/Additional Properties must be a JSON object/,
		);
		expect(() => buildRequestBody({}, 'null')).toThrow(
			/Additional Properties must be a JSON object/,
		);
	});
});

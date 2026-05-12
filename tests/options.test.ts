import { toNameValueOptions } from '../nodes/CrownpeakFS/helpers/options';

describe('option helpers', () => {
	it('maps id and name fields to sorted n8n options', () => {
		const options = toNameValueOptions(
			[
				{ id: 2, name: 'Zeta' },
				{ id: 1, name: 'Alpha' },
			],
			['name', 'displayName', 'uid', 'id'],
			['id', 'uid', 'name'],
		);

		expect(options).toEqual([
			{ name: 'Alpha', value: '1' },
			{ name: 'Zeta', value: '2' },
		]);
	});

	it('falls back to uid when name is missing', () => {
		expect(toNameValueOptions([{ uid: 'page-home' }], ['name', 'uid'], ['uid'])).toEqual([
			{ name: 'page-home', value: 'page-home' },
		]);
	});
});

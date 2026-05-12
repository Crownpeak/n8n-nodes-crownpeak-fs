import { extractItems, pushResponse } from '../nodes/CrownpeakFS/helpers/output';
import { INodeExecutionData } from 'n8n-workflow';

describe('pushResponse', () => {
	let returnData: INodeExecutionData[];

	beforeEach(() => {
		returnData = [];
	});

	it('emits one item per element for a bare array response', () => {
		pushResponse(returnData, [{ id: 1 }, { id: 2 }], 0);
		expect(returnData).toEqual([
			{ json: { id: 1 }, pairedItem: { item: 0 } },
			{ json: { id: 2 }, pairedItem: { item: 0 } },
		]);
	});

	it('emits nothing for an empty array', () => {
		pushResponse(returnData, [], 0);
		expect(returnData).toEqual([]);
	});

	it('unwraps an `items` wrapper and emits one item per element', () => {
		pushResponse(returnData, { items: [{ uid: 'a' }, { uid: 'b' }], total: 2 }, 3);
		expect(returnData).toEqual([
			{ json: { uid: 'a' }, pairedItem: { item: 3 } },
			{ json: { uid: 'b' }, pairedItem: { item: 3 } },
		]);
	});

	it('unwraps a `data` wrapper', () => {
		pushResponse(returnData, { data: [{ x: 1 }] }, 0);
		expect(returnData).toEqual([{ json: { x: 1 }, pairedItem: { item: 0 } }]);
	});

	it('unwraps a `results` wrapper', () => {
		pushResponse(returnData, { results: [{ y: 2 }] }, 0);
		expect(returnData).toEqual([{ json: { y: 2 }, pairedItem: { item: 0 } }]);
	});

	it('unwraps a `projects` wrapper', () => {
		pushResponse(returnData, { projects: [{ id: 9 }] }, 0);
		expect(returnData).toEqual([{ json: { id: 9 }, pairedItem: { item: 0 } }]);
	});

	it('stops at the first matching wrapper key (items wins over data)', () => {
		pushResponse(
			returnData,
			{ items: [{ a: 1 }], data: [{ should: 'not appear' }] },
			0,
		);
		expect(returnData).toEqual([{ json: { a: 1 }, pairedItem: { item: 0 } }]);
	});

	it('emits a single item for a plain object response', () => {
		pushResponse(returnData, { uid: 'home', displayName: 'Home' }, 1);
		expect(returnData).toEqual([
			{ json: { uid: 'home', displayName: 'Home' }, pairedItem: { item: 1 } },
		]);
	});

	it('does not unwrap when a wrapper key is present but not an array', () => {
		pushResponse(returnData, { items: 'not an array', uid: 'x' }, 0);
		expect(returnData).toEqual([
			{ json: { items: 'not an array', uid: 'x' }, pairedItem: { item: 0 } },
		]);
	});

	it('wraps primitive responses under a `data` key', () => {
		pushResponse(returnData, 'plain string', 0);
		expect(returnData).toEqual([{ json: { data: 'plain string' }, pairedItem: { item: 0 } }]);
	});

	it('wraps null under a `data` key', () => {
		pushResponse(returnData, null, 2);
		expect(returnData).toEqual([{ json: { data: null }, pairedItem: { item: 2 } }]);
	});

	it('boxes non-object array entries under a `value` key', () => {
		pushResponse(returnData, ['a', 'b'], 0);
		expect(returnData).toEqual([
			{ json: { value: 'a' }, pairedItem: { item: 0 } },
			{ json: { value: 'b' }, pairedItem: { item: 0 } },
		]);
	});

	it('boxes a null array entry under a `value` key', () => {
		pushResponse(returnData, [null, { ok: true }], 0);
		expect(returnData).toEqual([
			{ json: { value: null }, pairedItem: { item: 0 } },
			{ json: { ok: true }, pairedItem: { item: 0 } },
		]);
	});

	it('propagates the inputIndex to every emitted pairedItem', () => {
		pushResponse(returnData, [{ a: 1 }, { b: 2 }], 7);
		expect(returnData.every((d) => (d.pairedItem as { item: number }).item === 7)).toBe(true);
	});
});

describe('extractItems', () => {
	it('returns a bare array unchanged', () => {
		expect(extractItems([{ a: 1 }, { b: 2 }])).toEqual([{ a: 1 }, { b: 2 }]);
	});

	it('unwraps each known wrapper key in priority order', () => {
		expect(extractItems({ items: [{ a: 1 }] })).toEqual([{ a: 1 }]);
		expect(extractItems({ data: [{ b: 2 }] })).toEqual([{ b: 2 }]);
		expect(extractItems({ results: [{ c: 3 }] })).toEqual([{ c: 3 }]);
		expect(extractItems({ projects: [{ d: 4 }] })).toEqual([{ d: 4 }]);
	});

	it('returns an empty array for objects with no recognised wrapper', () => {
		expect(extractItems({ uid: 'x' })).toEqual([]);
	});

	it('returns an empty array for primitives and null', () => {
		expect(extractItems('a string')).toEqual([]);
		expect(extractItems(null)).toEqual([]);
		expect(extractItems(42)).toEqual([]);
	});
});
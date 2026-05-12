import { NodeOperationError } from 'n8n-workflow';
import { getBinaryUpload } from '../nodes/CrownpeakFS/helpers/binary';

describe('binary upload helper', () => {
	it('returns buffer, file name, and MIME type for a selected binary property', async () => {
		const helpers = {
			getBinaryDataBuffer: jest.fn().mockResolvedValue(Buffer.from('file-content')),
		};

		const context = {
			getNode: jest.fn().mockReturnValue({ name: 'FirstSpirit REST API' }),
			helpers,
		};

		const item = {
			json: {},
			binary: {
				data: {
					data: 'ignored-by-helper',
					fileName: 'hero.png',
					mimeType: 'image/png',
				},
			},
		};

		await expect(getBinaryUpload(context as any, item as any, 0, 'data')).resolves.toEqual({
			buffer: Buffer.from('file-content'),
			fileName: 'hero.png',
			mimeType: 'image/png',
		});
		expect(helpers.getBinaryDataBuffer).toHaveBeenCalledWith(0, 'data');
	});

	it('throws a node operation error when the selected binary property is missing', async () => {
		const context = {
			getNode: jest.fn().mockReturnValue({ name: 'FirstSpirit REST API' }),
			helpers: {
				getBinaryDataBuffer: jest.fn(),
			},
		};

		await expect(
			getBinaryUpload(context as any, { json: {} } as any, 0, 'data'),
		).rejects.toBeInstanceOf(NodeOperationError);
	});
});

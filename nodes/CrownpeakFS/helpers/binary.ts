import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

export interface BinaryUpload {
	buffer: Buffer;
	fileName: string;
	mimeType: string;
}

export async function getBinaryUpload(
	context: IExecuteFunctions,
	item: INodeExecutionData,
	itemIndex: number,
	binaryPropertyName: string,
): Promise<BinaryUpload> {
	const binaryData = item.binary?.[binaryPropertyName];

	if (!binaryData) {
		throw new NodeOperationError(
			context.getNode(),
			`No binary data found in property "${binaryPropertyName}"`,
			{ itemIndex },
		);
	}

	const buffer = await context.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	return {
		buffer,
		fileName: binaryData.fileName ?? 'file',
		mimeType: binaryData.mimeType ?? 'application/octet-stream',
	};
}

import {
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';

export const SpeechOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['speech'],
			},
		},
		options: [
			{
				name: 'Text to Speech',
				value: 'text-to-speech',
				action: 'Generate speech from text',
				description: 'Generate speech from text',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/tts',
					},
					send: {
						preSend: [preSendTTS],
					},
					output: {
						postReceive: [returnBinary],
					},
				},
			},
		],
		default: 'text-to-speech',
	},
	{
		displayName: 'Text',
		description: 'The text to transform into speech',
		required: true,
		name: 'text',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['text-to-speech'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['text-to-speech'],
			},
		},
		options: [
			{
				displayName: 'Reference ID',
				name: 'reference_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Chunk Length',
				name: 'chunk_length',
				type: 'number',
				default: 200,
			},
			{
				displayName: 'Normalize',
				name: 'normalize',
				type: 'boolean',
				default: true,
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{
						name: 'WAV',
						value: 'wav',
					},
					{
						name: 'MP3',
						value: 'mp3',
					},
					{
						name: 'Opus',
						value: 'opus',
					},
				],
				default: 'wav',
			},
			{
				displayName: 'MP3 Bitrate',
				name: 'mp3_bitrate',
				type: 'number',
				default: 64,
				displayOptions: {
					show: {
						format: ['mp3'],
					},
				},
			},
			{
				displayName: 'Opus Bitrate',
				name: 'opus_bitrate',
				type: 'number',
				default: -1000,
				displayOptions: {
					show: {
						format: ['opus'],
					},
				},
			},
			{
				displayName: 'Latency',
				name: 'latency',
				type: 'options',
				options: [
					{
						name: 'Normal',
						value: 'normal',
					},
					{
						name: 'Low',
						value: 'low',
					},
				],
				default: 'normal',
			},
		],
	},
];

async function preSendTTS(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const text = this.getNodeParameter('text') as string;
	const additionalFields = this.getNodeParameter('additionalFields', {}) as IDataObject;

	const data: IDataObject = {
		text,
		...additionalFields,
	};

	// Remove undefined or null values
	Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

	requestOptions.body = JSON.stringify(data);
	return requestOptions;
}

async function returnBinary(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	responseData: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const binaryName = this.getNodeParameter('additionalFields.binary_name', 'audio') as string;
	const fileName = this.getNodeParameter('additionalFields.file_name', 'audio') as string;
	const mimeType = responseData.headers['content-type'] || 'audio/mpeg';

	const binaryData = await this.helpers.prepareBinaryData(
		responseData.body as Buffer,
		fileName,
		mimeType as string,
	);

	return items.map(() => ({
		json: { success: true },
		binary: { [binaryName]: binaryData },
	}));
}

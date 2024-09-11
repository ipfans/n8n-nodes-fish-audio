import {
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import FormData from 'form-data';

export const ModelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['model'],
			},
		},
		options: [
			{
				name: 'Get List',
				value: 'getList',
				action: 'Get a list of models',
				description: 'Retrieve a list of all models',
				routing: {
					request: {
						method: 'GET',
						url: '/model',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a new model',
				description: 'Create a new model',
				routing: {
					request: {
						method: 'POST',
						url: '/model',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					},
					send: {
						preSend: [preSendCreateModel],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a model',
				description: 'Get details of a specific model',
				routing: {
					request: {
						method: 'GET',
						url: '=/model/{{$parameter.modelId}}',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a model',
				description: 'Delete a specific model',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/model/{{$parameter.modelId}}',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a model',
				description: 'Update a specific model',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/model/{{$parameter.modelId}}',
					},
					send: {
						preSend: [preSendUpdateModel],
					},
				},
			},
		],
		default: 'getList',
	},
	{
		displayName: 'Model ID',
		name: 'modelId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['model'],
				operation: ['get', 'delete', 'update'],
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
				resource: ['model'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Visibility',
				name: 'visibility',
				type: 'options',
				options: [
					{
						name: 'Public',
						value: 'public',
					},
					{
						name: 'Private',
						value: 'private',
					},
				],
				default: 'public',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: 'tts',
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Train Mode',
				name: 'train_mode',
				type: 'string',
				default: 'fast',
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Enhance Audio Quality',
				name: 'enhance_audio_quality',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
			},
		],
	},
];

async function preSendCreateModel(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const formData = new FormData();
	const additionalFields = this.getNodeParameter('additionalFields') as IDataObject;

	for (const [key, value] of Object.entries(additionalFields)) {
		formData.append(key, value as string);
	}

	requestOptions.body = formData;
	return requestOptions;
}

async function preSendUpdateModel(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const additionalFields = this.getNodeParameter('additionalFields') as IDataObject;
	requestOptions.body = JSON.stringify(additionalFields);
	return requestOptions;
}

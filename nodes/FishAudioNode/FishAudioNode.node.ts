import { INodeType, INodeTypeDescription } from 'n8n-workflow';

import { SpeechOperations } from './speech';
import { ModelOperations } from './model';

export class FishAudioNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fish Audio',
		name: 'fishAudioNode',
		icon: 'file:fishaudio.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Fish Audio API Usage',
		defaults: {
			name: 'Fish Audio',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'fishAudioAPI',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.fish.audio',
			headers: {
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Speech',
						value: 'speech',
					},
					{
						name: 'Model',
						value: 'model',
					},
				],
				default: 'speech',
			},

			...ModelOperations,
			...SpeechOperations,
		],
	};
}

import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FishAudioApi implements ICredentialType {
	name = 'fishAudioAPI';
	displayName = 'Fish Audio API';
	documentationUrl = 'https://fish.audio/go-api/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				accept: 'application/json',
			},
		},
	};
	test?: ICredentialTestRequest | undefined = {
		request: {
			baseURL: 'https://api.fish.audio',
			url: '/model',
		},
	};
}

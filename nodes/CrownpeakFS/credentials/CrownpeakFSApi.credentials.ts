import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class CrownpeakFSApi implements ICredentialType {
	name = 'crownpeakFSApi';
	displayName = 'FirstSpirit REST API';
	documentationUrl = 'https://github.com/Crownpeak/n8n-nodes-crownpeak-fs#credentials';
	properties: INodeProperties[] = [
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			placeholder: 'Enter your username',
			description: 'The username for basic authentication',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: 'Enter your password',
			description: 'The password for basic authentication',
			required: true,
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'Enter your base url for basic authentication',
			description: 'The Base URL for the FirstSpirit REST API',
			required: true,
		},
	];
}

import typegoose, { mongoose } from '@typegoose/typegoose';
import { Ref } from '@typegoose/typegoose';

import { ClientSecretModel } from './client-secret.model.js';

const { modelOptions, prop } = typegoose;

@modelOptions({
	schemaOptions: {
		collection: 'Client',
		_id: false,
		id: false
	}
})
export class ClientModel {
	@prop({ unique: true, required: true })
	clientId!: string;

	@prop({ unique: true })
	name: string;

	@prop({ default: [], type: String })
	grantTypes?: string[];

	@prop({ default: [], type: String })
	responseTypes?: string[];

	@prop({ default: [], type: String })
	scopes?: string[];

	@prop({ default: [], type: String })
	redirectUris?: string[];

	@prop({ default: false })
	requiresClientSecret?: boolean;

	@prop({
		ref: 'ClientSecretModel',
		localField: '_id',
		foreignField: 'client'
	})
	clientSecrets: Array<Ref<ClientSecretModel>>;
	constructor(options?: {
		grantTypes?: string[];
		responseTypes?: string[];
		scopes?: string[];
		redirectUris?: string[];
	}) {
		this.grantTypes = options?.grantTypes ? options.grantTypes : [];
		this.redirectUris = options?.redirectUris ? options.redirectUris : [];
		this.responseTypes = options?.responseTypes ? options.responseTypes : [];
		this.scopes = options?.scopes ? options.scopes : [];
	}
}

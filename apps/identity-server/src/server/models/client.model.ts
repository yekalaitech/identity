import typegoose from "@typegoose/typegoose";
import { Ref } from "@typegoose/typegoose";

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

	@prop({ default: [] })
	grantTypes?: Array<string>;

	@prop({ default: [] })
	responseTypes?: Array<string>;

	@prop({ default: [] })
	scopes?: Array<string>;

	@prop({ default: [] })
	redirectUris?: Array<string>;

	@prop({ default: false })
	requiresClientSecret?: boolean;

	@prop({
		ref: 'ClientSecretModel',
		localField: '_id',
		foreignField: 'client'
	})
	clientSecrets: Array<Ref<ClientSecretModel>>;
}

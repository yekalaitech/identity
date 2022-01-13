import typegoose from '@typegoose/typegoose';
import { Ref } from '@typegoose/typegoose';
import { EncryptDecrypt } from '@yekalaitech/identity-security';

import { ClientModel } from './client.model.js';

const { modelOptions, pre, prop } = typegoose;

@modelOptions({
	schemaOptions: {
		collection: 'ClientSecret'
	}
})
@pre<ClientSecretModel>('save', async function (next: () => void) {
	if (this.clientSecret) {
		this.clientSecret = await EncryptDecrypt.encrpt(this.clientSecret);
	} else {
		next();
	}
})
export class ClientSecretModel {
	@prop({ ref: 'ClientModel', required: true })
	client: Ref<ClientModel>;

	@prop()
	clientSecret: string;
}

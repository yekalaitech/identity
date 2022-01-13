import type { ReturnModelType } from '@typegoose/typegoose';
import type { Model } from 'mongoose';
import type { Adapter, AdapterPayload } from 'oidc-provider';

import type { ClientModel, ClientSecretModel } from '../models/index.js';

export class OidcModelAdapter implements Adapter {
	private readonly model: Model<any>;
	private static __models: {
		[key: string]: Model<any>;
	} = {};
	constructor(private readonly name: string) {
		this.model = OidcModelAdapter.__models[this.name];
		if (!this.model) {
			console.log('***Model not found***', this.name);
		}
	}
	async upsert(id: string, payload: AdapterPayload, expiresIn: number): Promise<void> {
		try {
			const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined;
			await this.model.updateOne(
				{ id },
				{ $set: { payload, ...(expiresAt ? { expiresAt } : undefined) } },
				{ upsert: true }
			);
		} catch (err) {
			console.log(err, this.name);
			throw err;
		}
	}
	async find(id: string): Promise<void | AdapterPayload> {
		try {
			if (this.name === 'Client') {
				return this.getClientByClientId(id);
			}
			const result = await this.model.findOne({ id }, { payload: 1 }).lean();
			return result ? result.payload : undefined;
		} catch (err) {
			console.log(err, this.name);
			throw err;
		}
	}
	async findByUserCode(userCode: string): Promise<void | AdapterPayload> {
		try {
			const result = await this.model.findOne({ 'payload.userCode': userCode }, { payload: 1 }).lean();
			return result ? result.payload : undefined;
		} catch (err) {
			console.log(err, this.name);
			throw err;
		}
	}
	async findByUid(uid: string): Promise<void | AdapterPayload> {
		try {
			const result = await this.model.findOne({ 'payload.uid': uid }, { payload: 1 }).lean();
			return result ? result.payload : undefined;
		} catch (err) {
			console.log(err, this.name);
			throw err;
		}
	}
	async consume(id: string): Promise<void> {
		try {
			await this.model.findOneAndUpdate(
				{ id },
				{ $set: { 'payload.consumed': Math.floor(Date.now() / 1000) } }
			);
		} catch (err) {
			console.log(err, this.name);
			throw err;
		}
	}
	async destroy(id: string): Promise<void> {
		try {
			await this.model.deleteOne({ id });
		} catch (err) {
			console.log(err, this.name);
			throw err;
		}
	}
	async revokeByGrantId(grantId: string): Promise<void> {
		try {
			await this.model.deleteMany({ 'payload.grantId': grantId });
		} catch (err) {
			console.log(err, this.name);
			throw err;
		}
	}

	async getClientByClientId(clientId: string) {
		try {
			const client = await (this.model as ReturnModelType<typeof ClientModel>)
				.findOne({ clientId })
				.populate({ path: 'clientSecrets', model: 'ClientSecretModel' })
				.lean();

			if (client) {
				const result: any = {
					client_id: client.clientId,
					name: client.name,
					grant_types: client.grantTypes,
					response_types: client.responseTypes as any,
					scopes: client.scopes,
					redirect_uris: client.redirectUris,
					client_secret:
						client.clientSecrets && client.clientSecrets.length
							? client.clientSecrets.map((data: ClientSecretModel) => data.clientSecret)[0]
							: undefined
				};
				if (!client.requiresClientSecret) {
					result.token_endpoint_auth_method = 'none';
				}
				return result;
			}
		} catch (err) {
			console.log('Error getting client', err);
			throw err;
		}
		return undefined;
	}

	static setModels(models: Model<any>[]) {
		for (const model of models) {
			OidcModelAdapter.__models[model.collection.name] = model;
		}
	}
}

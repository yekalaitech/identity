import type { OnApplicationBootstrap } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import type { Model } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';

import {
	AccessTokenModel,
	AuthorizationCodeModel,
	BackchannelAuthenticationRequestModel,
	ClientModel,
	ClientSecretModel,
	DeviceCodeModel,
	GrantModel,
	InitialAccessTokenModel,
	InteractionModel,
	PushedAuthorizationRequestModel,
	RefreshTokenModel,
	RegistrationAccessTokenModel,
	RelayDetectionModel,
	SessionModel
} from '../models/index.js';

import { OidcModelAdapter } from './oidc-model-adapter.js';

export class OidcModelAdapterProvider implements OnApplicationBootstrap {
  private readonly oidcModels: Model<any>[];
	constructor(
		@InjectModel(AccessTokenModel)
		private readonly accessTokenModel: ReturnModelType<typeof AccessTokenModel>,
		@InjectModel(AuthorizationCodeModel)
		private readonly authorizationCodeModel: ReturnModelType<typeof AuthorizationCodeModel>,
		@InjectModel(BackchannelAuthenticationRequestModel)
		private readonly backchannelAuthenticationRequestModel: ReturnModelType<
			typeof BackchannelAuthenticationRequestModel
		>,
		@InjectModel(ClientModel)
		private readonly clientModel: ReturnModelType<
			typeof ClientModel
		>,		
		@InjectModel(ClientSecretModel)
		private readonly clientSecretModel: ReturnModelType<
			typeof ClientSecretModel
		>,				
		@InjectModel(DeviceCodeModel)
		private readonly deviceCodeModel: ReturnModelType<typeof DeviceCodeModel>,
		@InjectModel(GrantModel)
		private readonly grantModel: ReturnModelType<typeof GrantModel>,
		@InjectModel(InitialAccessTokenModel)
		private readonly initialAccessTokenModel: ReturnModelType<typeof InitialAccessTokenModel>,
		@InjectModel(InteractionModel)
		private readonly interactionModel: ReturnModelType<typeof InteractionModel>,
		@InjectModel(PushedAuthorizationRequestModel)
		private readonly pushedAuthorizationRequestModel: ReturnModelType<
			typeof PushedAuthorizationRequestModel
		>,
		@InjectModel(RefreshTokenModel)
		private readonly refreshTokenModel: ReturnModelType<typeof RefreshTokenModel>,
		@InjectModel(RegistrationAccessTokenModel)
		private readonly registrationAccessTokenModel: ReturnModelType<
			typeof RegistrationAccessTokenModel
		>,
		@InjectModel(RelayDetectionModel)
		private readonly relayDetectionModel: ReturnModelType<typeof RelayDetectionModel>,
		@InjectModel(SessionModel)
		private readonly sessionModel: ReturnModelType<typeof SessionModel>
	) {
    this.oidcModels = [
			this.accessTokenModel,
			this.authorizationCodeModel,
			this.backchannelAuthenticationRequestModel,
			this.clientModel,
			this.deviceCodeModel,
			this.grantModel,
			this.initialAccessTokenModel,
			this.interactionModel,
			this.pushedAuthorizationRequestModel,
			this.refreshTokenModel,
			this.registrationAccessTokenModel,
			this.relayDetectionModel,
			this.sessionModel
		];
  }

	async onApplicationBootstrap() {
		// const clinetToInsert = new ClientModel();
		// clinetToInsert.clientId = 'identity-admin';
		// clinetToInsert.name = 'Identity Admin UI';
		// clinetToInsert.redirectUris = ['https://localhost:3011/callback'];
		// clinetToInsert.grantTypes = ["authorization_code"];
		// clinetToInsert.responseTypes = ["code"]

		// clinetToInsert.scopes = ["profile"] as any;
		
		// const client = await this.clientModel.create(clinetToInsert);
		
		// const clientSecretToInsert = new ClientSecretModel();
		// clientSecretToInsert.client = client._id;
		// clientSecretToInsert.clientSecret = 'abc';
		// await this.clientSecretModel.create(clientSecretToInsert);
	}

	getModels(): Model<any>[] {
		return this.oidcModels;
	}

  getAdapter(collectionName: string) {
    const match = this.oidcModels.find(model => model.collection.name === collectionName);
    if (match) {
      return new OidcModelAdapter(collectionName);
    }
    throw new Error('Invalid model provided for oidc');
  }

}

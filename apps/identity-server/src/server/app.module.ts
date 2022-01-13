import './_config.js'

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypegooseModule } from 'nestjs-typegoose';

import { InteractionApiController } from './controllers/interaction-api.controller.js';
import { InteractionController } from './controllers/interaction.controller.js';
import { OIDCController } from './controllers/oidc.controller.js';
import { UIController } from './controllers/ui.controller.js';
import * as models from './models/index.js';
import { BootstrapService } from './services/bootstrap.service.js';
import { OidcModelAdapterProvider } from './services/oidc-model-adapter-provider.js';
import { OidcProviderFactory } from './services/oidc-provider.factory.js';
import { RendererService } from './services/renderer.service.js';
import { UserService } from './services/user.service.js';
/* eslint-disable @typescript-eslint/ban-ts-comment*/
// @ts-ignore
import { UIApp } from './ui-app.js' // this file will be available as part of svelte build
/* eslint-enable @typescript-eslint/ban-ts-comment*/


const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(__dirname);

function oidcProviderFactory(factory: OidcProviderFactory) {
	return factory.getProvider();
}

@Module({
	imports: [
		ServeStaticModule.forRoot(
			{
				rootPath: join(__dirname, '/client')
			},
			{
				rootPath: join(__dirname, '/prerendered')
			},
			{
				rootPath: join(__dirname, '/static')
			}			
		),
		TypegooseModule.forFeature([
			models.ClientModel,
			models.ApiResourceModel,
			models.IdentityResourceModel,
			models.UserModel,
			models.AccessTokenModel,
			models.AuthorizationCodeModel,
			models.BackchannelAuthenticationRequestModel,
			models.ClientSecretModel,
			models.DeviceCodeModel,
			models.GrantModel,
			models.InitialAccessTokenModel,
			models.InteractionModel,
			models.PushedAuthorizationRequestModel,
			models.RefreshTokenModel,
			models.RegistrationAccessTokenModel,
			models.RelayDetectionModel,
			models.SessionModel
		]),
		TypegooseModule.forRoot(process.env.IDENTITY_DB_CONNECTION_STRING)
	],
	controllers: [OIDCController, InteractionController, InteractionApiController, UIController],
	providers: [
		RendererService,
		UserService,
		OidcModelAdapterProvider,
		OidcProviderFactory,
		BootstrapService,
		{
			provide: 'OIDC_PROVIDER',
			useFactory: (factory) => oidcProviderFactory(factory),
			inject: [OidcProviderFactory]
		},
		{
			provide: 'CLIENT_APP',
			useValue: UIApp.getInstance()
		}
	]
})
export class AppModule {}

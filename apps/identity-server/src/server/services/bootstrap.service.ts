import { existsSync, readFileSync } from 'fs';

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import type { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { ClientModel, UserModel } from '../models/index.js';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
	constructor(
		@InjectModel(UserModel)
		private readonly userModel: ReturnModelType<typeof UserModel>,
		@InjectModel(ClientModel) private readonly clientModel: ReturnModelType<typeof ClientModel>
	) {}

	async onApplicationBootstrap() {
		if (process.env.SEED_DATA_PATH && process.env.RUN_SEED === 'true') {
			const filePath = process.env.SEED_DATA_PATH;
			if (existsSync(filePath)) {
				const fileData = readFileSync(filePath, 'utf8');
				try {
					const data: {
						users: {
							userName: string;
							password: string;
							email: string;
						}[];
						clients: {
							clientId: string;
							name: string;
							grantTypes: string[];
							responseTypes: string[];
							scopes: string[];
							redirectUris: string[];
							requiresClientSecret?: boolean;
						}[];
					} = JSON.parse(fileData);
					if (data.users && Array.isArray(data.users)) {
						for (const user of data.users) {
							try {
								const userModel = new UserModel();
								userModel.email = user.email;
								userModel.userName = user.userName;
								userModel.password = user.password;
								const existingUser = await this.userModel.findOne({ userName: user.userName });
								if (!existingUser) {
									await this.userModel.create(userModel);
								}
							} catch (err) {
								console.log(`Error creating user ${err}`);
							}
						}
					}
					if (data.clients && Array.isArray(data.clients)) {
						for (const client of data.clients) {
							try {
								const clientModel = new ClientModel({
									grantTypes: client.grantTypes,
									redirectUris: client.redirectUris,
									responseTypes: client.responseTypes,
									scopes: client.scopes
								});
								clientModel.clientId = client.clientId;
								clientModel.name = client.name;
								clientModel.requiresClientSecret = client.requiresClientSecret;
								const existingClient = await this.clientModel.findOne({
									clientId: client.clientId
								});
								if (existingClient) {
									await this.clientModel.updateOne({ clientId: client.clientId }, clientModel);
								} else {
									await this.clientModel.create(clientModel);
								}
							} catch (err) {
								console.log(`Error creating client ${err}`);
							}
						}
					}
				} catch (err) {
					// no op
					console.log('Error running seed data', err);
				}
			}
		}
	}
}

import typegoose, { mongoose, Severity } from '@typegoose/typegoose';

const { Schema } = mongoose;
const { modelOptions, prop } = typegoose;

@modelOptions({
	options: {
		allowMixed: Severity.ALLOW
	}
})
export class AccessTokenPayLoad {
	@prop({ required: true })
	iat!: number;
	@prop({ required: true })
	exp!: number;
	@prop({ required: true })
	accountId!: string;
	@prop({ required: true })
	expiresWithSession!: boolean;
	@prop({ required: true, unique: true })
	grantId!: string;
	@prop({ required: true })
	gty!: string;
	@prop({ required: true })
	sessionUid!: string;
	@prop({ required: true })
	kind!: string;
	@prop({ required: true })
	jti!: string;
	@prop({ required: true })
	clientId!: string;
	@prop({ required: true })
	scope!: string;
	@prop({ type: Schema.Types.Mixed })
	extra?: Map<string, any>;
}

@modelOptions({
	schemaOptions: {
		collection: 'AccessToken',
		id: false,
		_id: false
	},
	options: {
		allowMixed: Severity.ALLOW
	}
})
export class AccessTokenModel {
	@prop()
	expiresAt?: Date;

	@prop()
	consumedAt?: Date;

	@prop({ unique: true, required: true })
	id!: string;

	@prop({ _id: false, type: () => AccessTokenPayLoad })
	payload: AccessTokenPayLoad;
}

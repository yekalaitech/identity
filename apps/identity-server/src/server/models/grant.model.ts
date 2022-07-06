import typegoose, { mongoose, Severity } from '@typegoose/typegoose';

const { Schema } = mongoose;
const { modelOptions, prop } = typegoose;

export class OpenIdModel {
	@prop()
	scope!: string;
	@prop({ type: String })
	claims!: string[];
}

export class GrantPayLoad {
	@prop({ required: true })
	iat!: number;
	@prop({ required: true })
	exp!: number;
	@prop({ required: true })
	accountId!: string;
	@prop({ required: true })
	clientId!: string;
	@prop({ required: true })
	kind!: string;
	@prop({ required: true })
	jti!: string;
	@prop({ _id: false })
	openid!: OpenIdModel;
}

@modelOptions({
	schemaOptions: {
		collection: 'Grant'
	},
	options: {
		allowMixed: Severity.ALLOW
	}
})
export class GrantModel {
	@prop({ type: Schema.Types.Mixed })
	data?: Map<string, any>;

	@prop()
	expiresAt?: Date;

	@prop()
	consumedAt?: Date;

	@prop({ unique: true, required: true })
	id: string;

	@prop({ _id: false })
	payload: GrantPayLoad;
}

import typegoose, { mongoose, Severity } from '@typegoose/typegoose';

const { modelOptions, prop } = typegoose;

@modelOptions({
	schemaOptions: {
		collection: 'DeviceCode'
	}, 	options: {
		allowMixed: Severity.ALLOW
	}
})
export class DeviceCodeModel {
	@prop({ index: true })
	grantId: string;

	@prop({ index: true })
	userCode: string;

	@prop({ type: mongoose.Schema.Types.Mixed })
	data?: Map<string, any>;

	@prop()
	expiresAt?: Date;

	@prop()
	consumedAt?: Date;
}

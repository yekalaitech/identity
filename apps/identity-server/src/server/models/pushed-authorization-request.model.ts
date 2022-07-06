import typegoose, { mongoose, Severity } from '@typegoose/typegoose';

const { Schema } = mongoose;
const { modelOptions, prop } = typegoose;

@modelOptions({
	schemaOptions: {
		collection: 'PushedAuthorizationRequest'
	},
  options: {
		allowMixed: Severity.ALLOW
	}
})
export class PushedAuthorizationRequestModel {
	@prop({ type: Schema.Types.Mixed })
	data?: Map<string, any>;

	@prop()
	expiresAt?: Date;

	@prop()
	consumedAt?: Date;
}

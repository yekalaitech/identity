import typegoose, { mongoose, Severity } from "@typegoose/typegoose";
const { Schema } = mongoose;

const { modelOptions, prop } = typegoose; 

@modelOptions({
  schemaOptions: {
    collection: 'BackchannelAuthenticationRequest'
  },
  options: {
		allowMixed: Severity.ALLOW
	}
})
export class BackchannelAuthenticationRequestModel {
  @prop({index: true})
  grantId: string;

  @prop({type: Schema.Types.Mixed})
  data?: Map<string, any>;

  @prop()
  expiresAt?: Date;

  @prop()
  consumedAt?: Date;
}
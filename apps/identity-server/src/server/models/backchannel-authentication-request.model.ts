import typegoose from "@typegoose/typegoose";

const { modelOptions, prop } = typegoose; 

@modelOptions({
  schemaOptions: {
    collection: 'BackchannelAuthenticationRequest'
  }
})
export class BackchannelAuthenticationRequestModel {
  @prop({index: true})
  grantId: string;

  @prop()
  data?: any;

  @prop()
  expiresAt?: Date;

  @prop()
  consumedAt?: Date;
}
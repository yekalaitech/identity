import typegoose from '@typegoose/typegoose';

const { modelOptions, prop } = typegoose;

@modelOptions({
  schemaOptions: {
    collection: 'RegistrationAccessToken'
  }
})
export class RegistrationAccessTokenModel {
  @prop()
  data?: any;

  @prop()
  expiresAt?: Date;

  @prop()
  consumedAt?: Date;
}
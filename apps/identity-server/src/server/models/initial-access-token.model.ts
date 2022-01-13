import typegoose from '@typegoose/typegoose';

const { modelOptions, prop } = typegoose;

@modelOptions({
  schemaOptions: {
    collection: 'InitialAccessToken'
  }
})
export class InitialAccessTokenModel {
  @prop()
  data?: any;

  @prop()
  expiresAt?: Date;

  @prop()
  consumedAt?: Date;
}
import typegoose from '@typegoose/typegoose';

const { modelOptions, prop } = typegoose;

@modelOptions({
  schemaOptions: {
    collection: 'RefreshToken'
  }
})
export class RefreshTokenModel {
  @prop({index: true})
  grantId: string;

  @prop()
  data?: any;

  @prop()
  expiresAt?: Date;

  @prop()
  consumedAt?: Date;
}
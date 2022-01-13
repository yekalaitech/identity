import typegoose from "@typegoose/typegoose";

const { modelOptions, prop } = typegoose;

export class AccessTokenPayLoad {
  @prop({required: true})
  iat!: number;
  @prop({required: true})
  exp!: number;
  @prop({required: true})
  accountId!: string;
  @prop({required: true})
  expiresWithSession!: boolean;
  @prop({required: true, unique: true})
  grantId!: string;
  @prop({required: true})
  gty!: string;
  @prop({required: true})
  sessionUid!: string;
  @prop({required: true})
  kind!: string;
  @prop({required: true})
  jti!: string;
  @prop({required: true})
  clientId!: string;
  @prop({required: true})
  scope!: string;
  @prop()
  extra?: any;
}

@modelOptions({
  schemaOptions: {
    collection: 'AccessToken',
    id: false,
    _id: false
  }
})
export class AccessTokenModel {

  @prop()
  expiresAt?: Date;

  @prop()
  consumedAt?: Date;

  @prop({unique: true, required: true})
  id!: string;

  @prop({ _id: false })
  payload: AccessTokenPayLoad;
}
import typegoose from '@typegoose/typegoose';

const { modelOptions, prop } = typegoose;

export class GrantPayLoad {
  @prop({required: true})
  iat!: number;
  @prop({required: true})
  exp!: number;
  @prop({required: true})
  accountId!: string;
  @prop({required: true})
  clientId!: string;
  @prop({required: true})
  kind!: string;
  @prop({required: true})
  jti!: string;
  @prop({required: true})
  openId!: Map<string, string>
}

@modelOptions({
  schemaOptions: {
    collection: 'Grant'
  }
})
export class GrantModel {
  @prop()
  data?: any;

  @prop()
  expiresAt?: Date;

  @prop()
  consumedAt?: Date;

  @prop({unique: true, required: true})
  id: string;

  @prop({_id: false})
  payload: GrantPayLoad;
}
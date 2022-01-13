import typegoose from '@typegoose/typegoose';

const { modelOptions, prop } = typegoose;


@modelOptions({
  schemaOptions: {
    collection: 'DeviceCode'
  }
})
export class DeviceCodeModel {
  @prop({index: true})
  grantId: string;

  @prop({index: true})
  userCode: string;

  @prop()
  data?: any;

  @prop()
  expiresAt?: Date;

  @prop()
  consumedAt?: Date;
}
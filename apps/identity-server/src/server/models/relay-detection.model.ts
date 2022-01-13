import typegoose from '@typegoose/typegoose';

const { modelOptions, prop } = typegoose;

@modelOptions({
  schemaOptions: {
    collection: 'RelayDetection'
  }
})
export class RelayDetectionModel {
  @prop()
  data?: any;

  @prop()
  expiresAt?: Date;

  @prop()
  consumedAt?: Date;
}
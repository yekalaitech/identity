import typegoose from '@typegoose/typegoose';

const { modelOptions, prop } = typegoose;

@modelOptions({
  schemaOptions: {
    collection: 'RelayDetection'
  }
})
export class RelayDetectionModel {
  @prop()
  jti?: string;
  @prop()
  exp!: number;
  @prop()
  iat!: number;
  @prop()
  kind!: string;

  @prop()
  expiresAt?: Date;

  @prop()
  consumedAt?: Date;
}
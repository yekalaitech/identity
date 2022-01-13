import typegoose from '@typegoose/typegoose';

const { modelOptions, prop } = typegoose;

@modelOptions({
  schemaOptions: {
    collection: 'Interaction'
  }
})
export class InteractionModel {
  @prop({unique: true, required: true})
  id: string;
  
  @prop()
  data?: any;

  @prop()
  expiresAt?: Date;

  @prop()
  consumedAt?: Date;

  @prop()
  payload: any;
}
import typegoose from "@typegoose/typegoose";
import mongoose from 'mongoose';

const { modelOptions, prop } = typegoose; 

@modelOptions({
  schemaOptions: {
    collection: "ApiResource"
  }
})
export class ApiResourceModel {
  @prop({unique: true, required: true})
  name!: string;

  @prop({default: []})
  claims?: mongoose.Types.Array<string>
}
import typegoose from '@typegoose/typegoose';
import mongoose from 'mongoose';

const { modelOptions, prop } = typegoose;

@modelOptions({
	schemaOptions: {
		collection: 'IdentityResource'
	}
})
export class IdentityResourceModel {
	@prop({ unique: true, required: true })
	name!: string;

	@prop({ default: [] })
	claims?: mongoose.Types.Array<string>;
}

import typegoose, { mongoose } from '@typegoose/typegoose';

const { modelOptions, prop } = typegoose;

@modelOptions({
	schemaOptions: {
		collection: 'IdentityResource'
	}
})
export class IdentityResourceModel {
	@prop({ unique: true, required: true })
	name!: string;

	@prop({ default: [], type: String })
	claims?: string[];
}

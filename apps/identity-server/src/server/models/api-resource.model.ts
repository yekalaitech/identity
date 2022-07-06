import typegoose, { mongoose } from '@typegoose/typegoose';

const { modelOptions, prop } = typegoose;

@modelOptions({
	schemaOptions: {
		collection: 'ApiResource'
	}
})
export class ApiResourceModel {
	@prop({ unique: true, required: true })
	name!: string;

	@prop({ default: [], type: String })
	claims?: string[];
}

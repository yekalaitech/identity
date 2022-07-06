import typegoose from '@typegoose/typegoose';

const { modelOptions, prop } = typegoose;

export class SessionAuthorization {
	@prop({ required: true })
	sid!: string;
	@prop({ required: true })
	grantId: string;
}

export class SessionPayload {
	@prop({ required: true })
	iat!: number;
	@prop({ required: true })
	exp!: number;
	@prop({ required: true })
	uid: string;
	@prop({ required: true })
	accountId!: string;
	@prop({ required: true })
	loginTs!: number;
	@prop({ required: true })
	kind!: string;
	@prop({ required: true })
	jti!: string;
	@prop({ _id: false, type: () => SessionAuthorization })
	authorizations: Map<string, SessionAuthorization>;
}

@modelOptions({
	schemaOptions: {
		collection: 'Session'
	}
})
export class SessionModel {
	@prop({ unique: true, required: true })
	id: string;

	@prop()
	uid: string;

	@prop()
	expiresAt?: Date;

	@prop()
	consumedAt?: Date;

	@prop({ _id: false })
	payload: SessionPayload;
}

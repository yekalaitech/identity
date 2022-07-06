import typegoose, { mongoose, Severity } from '@typegoose/typegoose';

const { Schema } = mongoose;
const { modelOptions, prop } = typegoose;

export class InteractionSession {
	@prop()
	uid: string;
	@prop()
	cookie: string;
	@prop()
	acr: string;
	@prop({ type: String })
	amr: string[];
	@prop()
	accountId: string;
}
export class InteractionPromptDetail {
	@prop({ type: String })
	missingOIDCScope: string[];
	@prop({ type: String })
	missingOIDCClaims: string[];
	@prop({ type: String })
	missingResourceScopes: string[];
}
export class InteractionPrompt {
	@prop()
	name: string;
	@prop({ type: String })
	reason: string[];
	@prop({ _id: false, type: InteractionPromptDetail })
	details: InteractionPromptDetail;
}
export class InteractionTermsAndCondition {
	@prop()
	accepted?: Date;
}
export class InteractionConsent {
	@prop()
	required?: boolean;
}
export class InteractionLastSubmission {
	@prop({ _id: false, type: InteractionTermsAndCondition, required: false })
	termsAndConditions?: InteractionTermsAndCondition;
	@prop({ _id: false, type: InteractionConsent, required: false })
	consent?: InteractionConsent;
}
export class InteractionParams {
	@prop()
	client_id: string;
	@prop()
	code_challenge: string;
	@prop()
	code_challenge_method: string;
	@prop()
	redirect_uri: string;
	@prop()
	response_mode: string;
	@prop()
	response_type: string;
	@prop()
	scope: string;
	@prop()
	state: string;
}
@modelOptions({
	options: {
		allowMixed: Severity.ALLOW
	}
})
export class InteractionPayload {
	@prop()
	jti!: string;
	@prop()
	kind!: string;
	@prop()
	exp!: number;
	@prop()
	iat!: number;
	@prop()
	returnTo?: string;
	@prop()
	deviceCode?: string;
	@prop({ _id: false, type: InteractionParams })
	params?: InteractionParams;
	@prop({ _id: false, type: InteractionLastSubmission })
	lastSubmission?: InteractionLastSubmission;
	@prop({ type: String })
	trusted?: string[];
	@prop({ _id: false, type: Schema.Types.Mixed })
	result: Map<string, any>;
	@prop()
	grantId: string;
	@prop({ _id: false, type: InteractionSession })
	session: InteractionSession;
	@prop({ _id: false, type: InteractionPrompt })
	prompt: InteractionPrompt;
}

@modelOptions({
	schemaOptions: {
		collection: 'Interaction'
	},
	options: {
		allowMixed: Severity.ALLOW
	}
})
export class InteractionModel {
	@prop({ unique: true, required: true })
	id: string;

	@prop({ type: mongoose.Schema.Types.Mixed })
	data?: Map<string, any>;

	@prop()
	expiresAt?: Date;

	@prop()
	consumedAt?: Date;

	@prop({ _id: false, type: InteractionPayload })
	payload: InteractionPayload;
}

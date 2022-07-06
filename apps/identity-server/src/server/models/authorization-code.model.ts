import typegoose from "@typegoose/typegoose";

const { modelOptions, prop } = typegoose; 

export class AuthorizationCodePayLoad {
  @prop({required: true})
  iat!: number;
  @prop({required: true})
  exp!: number;
  @prop({required: true})
  accountId!: string;
  @prop({required: true})
  authTime!: number;
  @prop({required: true})
  codeChallenge!: string;
  @prop({required: true})
  codeChallengeMethod!: string;
  @prop({required: true, unique: true})
  grantId!: string;
  @prop({required: false})
  redirectUri?: string;
  @prop({required: true})
  sessionUid!: string;
  @prop({required: true})
  kind!: string;
  @prop({required: true})
  jti!: string;
  @prop({required: true})
  clientId!: string;
  @prop({required: true})
  expiresWithSession!: boolean;
  @prop()
  consumed?: number;
  @prop()
  scope: string;
}

@modelOptions({
  schemaOptions: {
    collection: 'AuthorizationCode'
  }
})
export class AuthorizationCodeModel {

  @prop()
  expiresAt?: Date;

  @prop()
  consumedAt?: Date;

  @prop({unique: true, required: true})
  id: string;

  @prop({_id: false})
  payload: AuthorizationCodePayLoad;
}
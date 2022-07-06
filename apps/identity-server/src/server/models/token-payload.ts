import typegoose from "@typegoose/typegoose";

const { prop } = typegoose;

export class TokenPayLoad {
  @prop({required: true})
  jti!: string;
  @prop({required: true})
  kind!: string;
  @prop({required: true})
  exp!: number;
  @prop({required: true})
  iat!: number;
  @prop({required: true})
  accountId!: string;
  @prop({required: true})
  clientId!: string;
  @prop()
  aud: string;
  @prop()
  authTime: number;
  @prop()
  claims: any;
  @prop()
  extra?: any;
  @prop()
  codeChallenge: string;
  @prop()
  codeChallengeMethod: string;
  @prop({required: true})
  sessionUid!: string;
  @prop({required: true})
  expiresWithSession!: boolean;
  @prop({required: true, unique: true})
  grantId!: string;
  @prop()
  nonce: string;
  @prop()
  redirectUri: string;
  
  @prop({required: true})
  gty!: string;




  @prop({required: true})
  scope!: string;

}
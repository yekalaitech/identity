import typegoose from "@typegoose/typegoose";
import { EncryptDecrypt } from '@yekalaitech/identity-security'

const { modelOptions, pre, prop } = typegoose;

@modelOptions({
  schemaOptions: {
    collection: "User"
  }
})
@pre<UserModel>('save', async function(next: () => void ) {
  if (this.password) {
    this.password = await EncryptDecrypt.encrpt(this.password);
  } else {
    next()
  }
})
export class UserModel {
  @prop({unique: true, required: true})
  userName!: string;

  @prop({lowercase: true, required: true})
  email!: string;

  @prop()
  emailConfirmed?: boolean;

  @prop({required: true})
  password!: string;

  @prop()
  phoneNumber?: string;

  @prop()
  twoFactorEnabled?: boolean;
}

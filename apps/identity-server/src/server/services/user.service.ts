import { Injectable } from "@nestjs/common";
import type { ReturnModelType } from "@typegoose/typegoose";
import { EncryptDecrypt } from '@yekalaitech/identity-security'
import { InjectModel } from "nestjs-typegoose";

import { UserModel } from "../models/index.js";

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel)
  private readonly userModel: ReturnModelType<typeof UserModel>){}

  async getUser(userName: string, password: string) {
    const user = await this.userModel.findOne({userName}).lean();
    const decrypted = await EncryptDecrypt.decrypt(user.password);
    if (password === decrypted) {
      return user;
    }
    return undefined;
  }
}
import { existsSync, readFileSync } from 'fs';

import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import type { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";

import { UserModel } from "../models/index.js";

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(@InjectModel(UserModel)
  private readonly userModel: ReturnModelType<typeof UserModel>) {}

  async onApplicationBootstrap() {
    if (process.env.SEED_DATA_PATH && process.env.RUN_SEED === "true") {
      const filePath = process.env.SEED_DATA_PATH;
      if (existsSync(filePath)) {
        const fileData = readFileSync(filePath, 'utf8');
        try {
          const data: {
            users: {
              userName: string;
              password: string;
              email: string;
            }[]
          } = JSON.parse(fileData);
          if (data.users && Array.isArray(data.users)) {
            for (const user of data.users) {
              const userModel = new UserModel();
              userModel.email = user.email;
              userModel.userName = user.userName;
              userModel.password = user.password;

              await this.userModel.create(userModel);
            }
          }
        } catch (err) {
          // no op
          console.log('Error running seed data', err);
        }
      }
    }
  }
}
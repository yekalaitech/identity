
import { All, Body, Controller, Get, Inject, Next, Post, Req, Res } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import type { Provider } from 'oidc-provider';

import type { LoginRequest } from '../requests/login.request.js';
import { UserService } from '../services/user.service.js';

@Controller('/oidc')
export class OIDCController {
	constructor(
		@Inject('OIDC_PROVIDER') private readonly provider: Provider,
		private readonly userService: UserService
	) {}

	// @Get('/me')
	// async post(
	// 	@Req() req: Request,
	// 	@Res() res: Response,
	// 	@Next() next: NextFunction
	// ) {
	// 	// req.headers.cookie =
	// 	// 	req.headers.cookie || req.headers['set-cookie'] ? req.headers['set-cookie'].join(':') : '';
	// 	const user = await this.userService.getUser(body.userName, body.password);
	// 	await this.provider.interactionFinished(req, res, {
	// 		login: {
	// 			accountId: user._id.toString()
	// 		}
	// 	}, { mergeWithLastSubmission: false });

	// }

	@All('/*')
	async renderUI(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
		req.url = req.originalUrl.replace('/oidc', '');
		return this.provider.callback()(req, res);
	}
}

import { strict } from 'assert';

import { Body, Controller, Get, Inject, Next, Param, Post, Req, Res } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import type { Provider } from 'oidc-provider';

import type { LoginRequest } from '../requests/login.request.js';
import { UserService } from '../services/user.service.js';

@Controller('interaction')
export class InteractionController {
	constructor(
		@Inject('OIDC_PROVIDER') private readonly provider: Provider,
		private readonly userService: UserService
	) {}


	@Post('/:interactionId/login')
	async login(
		@Param('interactionId') interactionId: string,
		@Body() body: LoginRequest,
		@Req() req: Request,
		@Res() res: Response,
		@Next() next: NextFunction
	) {
		const interactionDetails = await this.provider.interactionDetails(req, res);
		strict.equal(interactionDetails.prompt.name, 'login');
		const user = await this.userService.getUser(body.userName, body.password);
		await this.provider.interactionFinished(
			req,
			res,
			{
				login: {
					accountId: user._id.toString()
				}
			},
			{ mergeWithLastSubmission: false }
		);
	}
	@Post('/:interactionId/terms-and-conditions')
	async termsAndConditions(
		@Param('interactionId') interactionId: string,
		@Body() body: LoginRequest,
		@Req() req: Request,
		@Res() res: Response,
		@Next() next: NextFunction
	) {
		const interactionDetails = await this.provider.interactionDetails(req, res);
		strict.equal(interactionDetails.prompt.name, 'consent');
		await this.provider.interactionFinished(
			req,
			res,
			{
				termsAndConditions: {
					accepted: new Date()
				}
			},
			{ mergeWithLastSubmission: true }
		);
	}
	@Post('/:interactionId/consent')
	async consent(
		@Param('interactionId') interactionId: string,
		@Body() body: LoginRequest,
		@Req() req: Request,
		@Res() res: Response,
		@Next() next: NextFunction
	) {
		const interactionDetails = await this.provider.interactionDetails(req, res);
		strict.equal(interactionDetails.prompt.name, 'consent');

		const { session, params, prompt: { name, details } } = interactionDetails;
		let { grantId } = interactionDetails;
		const grant = grantId ? await this.provider.Grant.find(grantId) : new this.provider.Grant({
			accountId: session.accountId,
			clientId: params.client_id as any
		});
		if (details.missingOIDCScope) {
			grant.addOIDCScope((details as any).missingOIDCScope.join(' '));
		}
		if (details.missingOIDCClaims) {
			grant.addOIDCClaims((details as any).missingOIDCClaims);
		}
		if (details.missingResourceScopes) {
			for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
				grant.addResourceScope(indicator, scopes.join(' '));
			}
		}
		grantId = await grant.save();
		const consent: {grantId?: string} = {};
		if (!interactionDetails.grantId) {
			// we don't have to pass grantId to consent, we're just modifying existing one
			consent.grantId = grantId;
		}

		const result = { consent };
		await this.provider.interactionFinished(req, res, result, { mergeWithLastSubmission: true });		
	}
}

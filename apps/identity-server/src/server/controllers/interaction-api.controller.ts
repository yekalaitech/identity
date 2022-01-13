import { Controller, Get, Inject, Next, Param, Req, Res } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import type { Provider } from 'oidc-provider';

@Controller('api/interaction')
export class InteractionApiController {
	constructor(@Inject('OIDC_PROVIDER') private readonly provider: Provider) {}

	@Get('/:interactionId')
	async getInteraction(
		@Param('interactionId') interactionId: string,
		@Req() req: Request,
		@Res() res: Response,
		@Next() next: NextFunction
	) {
		if (req.headers['set-cookie']) {
			const setCookies = req.headers['set-cookie'].join(';');
			req.headers.cookie = req.headers.cookie ? `${req.headers.cookie};${setCookies}` : setCookies;
		}

		const interaction = await this.provider.interactionDetails(req, res);
		const { uid, prompt, params } = interaction;
		if (uid !== interactionId) {
			throw new Error('Invalid interaction');
		}
		const data = {
			prompt:
				prompt.name === 'consent' &&
				(!interaction.lastSubmission ||
					!interaction.lastSubmission.termsAndConditions ||
					!(interaction.lastSubmission.termsAndConditions as any).accepted)
					? 'termsAndConditions'
					: prompt.name,
			details: prompt.details,
			uid,
			params
		};
		res.send(data);
	}
}

import { All, Controller, Next, Req, Res } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { RendererService } from '../services/renderer.service.js';

@Controller()
export class UIController {
	constructor(private readonly renderService: RendererService) {}

	@All('*')
	async renderUI(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
		const rendered = await this.renderService.renderRequest(req);
		if (rendered) {
			res.writeHead(rendered.status, rendered.headers);
			if (rendered.body) {
				res.write(rendered.body);
			}
			res.end();
			return rendered.body;
		}
		next();
	}
}

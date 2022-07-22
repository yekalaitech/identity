import { IncomingMessage, ServerResponse } from 'http';

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { RenderResult, UIApp } from '@yekalaitech/svelte-adapter-node';

@Injectable()
export class RendererService {
	constructor(@Inject('CLIENT_APP') private readonly uiApp: UIApp) {}
	async renderData(incomingMessage: IncomingMessage, path: string) {
		try {
			const result = await this.uiApp.renderData(incomingMessage, path);
			if (result.status !== 404) {
				return result;
			}
		} catch (err) {
			// no op
			console.log(err);
		}

		return undefined;
	}

	async renderRequest(req: IncomingMessage): Promise<RenderResult> {
		try {
			const result = await this.uiApp.renderRequest(req);
			if (result.status !== 404) {
				return result;
			}
		} catch (err) {
			if (err.code === 'BAD_REQUEST') {
				throw new BadRequestException();
			}
			throw err;
		}
	}
}

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { RenderData, UIApp } from '@yekalaitech/svelte-adapter-node';
import { Request } from 'express';

@Injectable()
export class RendererService {
	constructor(@Inject('CLIENT_APP') private readonly uiApp: UIApp) {}
	async renderData(data: RenderData) {
		try {
			const result = await this.uiApp.renderData(data);
			if (result.status !== 404) {
				return result;
			}
		} catch (err) {
			// no op
			console.log(err);
		}

		return undefined;
	}

	async renderRequest(req: Request) {
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

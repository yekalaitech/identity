/* eslint-disable @typescript-eslint/ban-ts-comment*/
import type { App as AppType } from '@sveltejs/kit';
// @ts-ignore
import { getRawBody } from '@sveltejs/kit/node';
// @ts-ignore
import { App as SvelteApp } from 'APP'; // this will be replaced svelte build check index.ts
// @ts-ignore
import { manifest } from 'MANIFEST'; // this will be replaced svelte build check index.ts
/* eslint-enable @typescript-eslint/ban-ts-comment*/
import { Request } from 'express';

import { UIError } from './error.js';
import { RenderData, UIApp as UIAppType } from './interfaces.js';

export class UIApp implements UIAppType {
	private readonly svelteApp: AppType;
	private static __instance: UIApp;
	constructor(svelteApp?: AppType) {
		if (svelteApp) {
			this.svelteApp = svelteApp;
		} else {
			this.svelteApp = new SvelteApp(manifest);
		}
	}
	public static getInstance() {
		if (!UIApp.__instance) {
			UIApp.__instance = new UIApp();
		}
		return UIApp.__instance;
	}
	async renderRequest(req: Request) {
		const parsed = new URL(req.originalUrl || '', `${req.protocol}://${req.headers.host}`);

		let body: any;
		try {
			body = await getRawBody(req);
		} catch (err) {
			throw new UIError('BAD_REQUEST', err as Error);
		}
		return this.svelteApp.render({
			method: req.method,
			headers: req.headers as any, // TODO: what about repeated headers, i.e. string[]
			url: parsed.pathname,
			rawBody: body
		});
	}

	async renderData(renderData: RenderData) {
		return this.svelteApp.render({
			method: renderData.method,
			headers: renderData.headers as any, // TODO: what about repeated headers, i.e. string[]
			url: renderData.path,
			rawBody: renderData.rawBody
		});
	}
}

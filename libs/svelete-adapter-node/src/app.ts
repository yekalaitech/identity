import { IncomingMessage } from 'http';

import { getRequest } from '@sveltejs/kit/node';
/* eslint-disable @typescript-eslint/ban-ts-comment*/
// @ts-ignore
import { manifest } from 'MANIFEST'; // this will be replaced svelte build check index.ts
import { Server as SvelteApp } from 'SERVER'; // this will be replaced svelte build check index.ts

import { env } from './env.js';
import { UIError } from './error.js';
import { RenderResult, UIApp as UIAppType } from './interfaces.js';
// @ts-ignore
const envPrefix = ENV_PREFIX;
/* eslint-enable @typescript-eslint/ban-ts-comment*/

const origin = env('ORIGIN', undefined);
const xff_depth = parseInt(env('XFF_DEPTH', '1') || '');

const address_header = env('ADDRESS_HEADER', '')?.toLowerCase();
const protocol_header = env('PROTOCOL_HEADER', '')?.toLowerCase();
const host_header = env('HOST_HEADER', 'host')?.toLowerCase() || '';

export class UIApp implements UIAppType {
	private readonly server: SvelteApp;
	private static __instance: UIApp;
	constructor() {
		this.server = new SvelteApp(manifest);
	}
	public static getInstance() {
		if (!UIApp.__instance) {
			UIApp.__instance = new UIApp();
		}
		return UIApp.__instance;
	}
	async renderRequest(req: IncomingMessage): Promise<RenderResult> {
		let request;

		try {
			request = await getRequest(origin || get_origin(req.headers), req);
		} catch (err) {
			throw new UIError('BAD_REQUEST', err as Error);
		}

		if (address_header && !(address_header in req.headers)) {
			throw new Error(
				`Address header was specified with ${
					envPrefix + 'ADDRESS_HEADER'
				}=${address_header} but is absent from request`
			);
		}

		return this.parseRenderedResponse(
			await this.server.respond(request, this.getRequestOptions(req))
		);
	}
	getRequestOptions(req: IncomingMessage) {
		return {
			getClientAddress: () => {
				if (address_header) {
					const value = /** @type {string} */ req.headers[address_header] || '';

					if (address_header === 'x-forwarded-for') {
						const addresses = typeof value === 'string' ? value.split(',') : value;

						if (xff_depth < 1) {
							throw new Error(`${envPrefix + 'XFF_DEPTH'} must be a positive integer`);
						}

						if (xff_depth > addresses.length) {
							throw new Error(
								`${envPrefix + 'XFF_DEPTH'} is ${xff_depth}, but only found ${
									addresses.length
								} addresses`
							);
						}
						return addresses[addresses.length - xff_depth].trim();
					}

					return value;
				}

				return (
					req.connection?.remoteAddress ||
					// @ts-expect-error connection may or may not be there
					req.connection?.socket?.remoteAddress ||
					req.socket?.remoteAddress ||
					// @ts-expect-error info may or may not be there
					req.info?.remoteAddress
				);
			}
		};
	}
	async renderData(incomingMessage: IncomingMessage, path: string) {
		const req = new Request(path);
		return this.parseRenderedResponse(
			await this.server.respond(req, this.getRequestOptions(incomingMessage))
		);
	}
	async parseRenderedResponse(response: Response) {
		const headers: { [key: string]: string } = {};
		if (response.headers) {
			response.headers.forEach((value, key) => {
				headers[key] = value;
			});
		}
		const result: RenderResult = {
			status: response.status,
			headers: response.headers,
			body: ''
		};
		if (!response.body) {
			return result;
		}
		const readable = response.body.getReader();

		const processText = async (input: ReadableStreamDefaultReadResult<Uint8Array>) => {
			if (!input.done) {
				result.body += new TextDecoder('utf-8').decode(input.value);
			} else {
				processText(await readable.read());
			}
		};
		await processText(await readable.read());
		return result;
	}
}

function get_origin(headers: { [key: string]: any }) {
	const protocol = (protocol_header && headers[protocol_header]) || 'https';
	const host = headers[host_header];
	return `${protocol}://${host}`;
}

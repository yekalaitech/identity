/* eslint-disable @typescript-eslint/no-explicit-any */

import type { IncomingHttpHeaders } from 'http';

import type { BuildOptions } from 'esbuild';
import type { Request, RequestHandler } from 'express';

export type EnvOptions = {
	readonly path?: string;
	readonly host?: string;
	readonly port?: string;
};
export type AdapterBase = {
	readonly out?: string;
	readonly precompress?: boolean;
	readonly env?: EnvOptions;
};

export type AdapterOptions = AdapterBase & {
	readonly esbuild?: (options: BuildOptions) => Promise<BuildOptions> | BuildOptions;
};

export type svelteStaticMiddlewaresFunction = (paths: {
	readonly assets: string;
	readonly prerendered: string;
	readonly appDir: string;
}) => RequestHandler[];

export type RenderData = {
	method: string;
	headers: IncomingHttpHeaders | IncomingHttpHeaders[];
	path: string;
	query: any;
	rawBody?: any;
};

export type RenderResult = {
	status: number;
	headers: any;
	body?: any;
};

export type RenderFunction = (data: RenderData) => Promise<RenderResult>;

export type UIApp = {
	renderRequest: (req: Request) => Promise<RenderResult>;
	renderData: (data: RenderData) => Promise<RenderResult>;
};

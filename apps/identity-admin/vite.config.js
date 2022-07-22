import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

import { readFileSync } from 'fs';

import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		target: '#svelte',
		open: true,
		port: 3011,
		https: {
			key: readFileSync(process.env.TLS_KEY_PATH),
			cert: readFileSync(process.env.TLS_CERT_PATH)
		}
	}	
};
export default config;
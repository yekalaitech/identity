import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

import { readFileSync } from 'fs';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess({
        "postcss": true
    })],

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			server: {
				open: true,
				port: 3011,
				https: {
					key: readFileSync(process.env.TLS_KEY_PATH),
					cert: readFileSync(process.env.TLS_CERT_PATH)
				}
			}
		}				
	}
};

export default config;

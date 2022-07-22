
/* eslint-disable @typescript-eslint/ban-ts-comment*/
// @ts-ignore
const envPrefix = ENV_PREFIX;
/* eslint-enable @typescript-eslint/ban-ts-comment*/

const expected = new Set([
	'SOCKET_PATH',
	'HOST',
	'PORT',
	'ORIGIN',
	'XFF_DEPTH',
	'ADDRESS_HEADER',
	'PROTOCOL_HEADER',
	'HOST_HEADER'
]);

if (envPrefix) {
	for (const name in process.env) {
		if (name.startsWith(envPrefix)) {
			const unprefixed = name.slice(envPrefix.length);
			if (!expected.has(unprefixed)) {
				throw new Error(
					`You should change envPrefix (${envPrefix}) to avoid conflicts with existing environment variables — unexpectedly saw ${name}`
				);
			}
		}
	}
}

/**
 * @param {string} name
 * @param {any} fallback
 */
export function env(name: string, fallback: string | undefined) {
	const prefixed = envPrefix + name;
	return prefixed in process.env ? process.env[prefixed] : fallback;
}
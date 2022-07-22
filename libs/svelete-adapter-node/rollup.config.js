import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [
	{
		input: {
			"app": 'build/app.js'
		},
		output: {
			dir: 'build/files',
			format: 'esm'
		},
		plugins: [nodeResolve(), commonjs(), json()],
		external: ['SERVER', 'MANIFEST', 'ENV_PREFIX', ...require('module').builtinModules]
	},
	{
		input: 'src/shims.js',
		output: {
			file: 'build/files/shims.js',
			format: 'esm'
		},
		external: ['module']
	}	
];
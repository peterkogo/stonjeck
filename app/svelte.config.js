import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		experimental: {
			remoteFunctions: true
		},
		alias: {
			'@/*': './lib/*'
		}
		// TODO: possible optimization for fewer requests
		// output: {
		// 	bundleStrategy: 'single'
		// }
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;

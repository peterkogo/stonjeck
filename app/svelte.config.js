import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			'@/*': './lib/*'
		}
		// TODO: possible optimization for fewer requests
		// output: {
		// 	bundleStrategy: 'single'
		// }
	}
};

export default config;

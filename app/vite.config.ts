import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/** @type {import('vite').UserConfig} */
export default defineConfig({
	plugins: [
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['cookie', 'preferredLanguage', 'url', 'baseLocale']
		}),
		tailwindcss(),
		sveltekit()
	],
	// Map compiled JS/CSS back to .svelte sources in DevTools (Performance, CSS selector stats)
	css: {
		devSourcemap: true
	},
	build: {
		sourcemap: false
	}
});

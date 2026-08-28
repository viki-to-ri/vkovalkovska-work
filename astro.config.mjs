// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://vkovalkovska.com",
	// Every route prerenders; nothing ships client-side JS.
	output: "static",
	integrations: [mdx(), sitemap()],
	adapter: cloudflare({
		// Run sharp at build time — the Workers runtime has no sharp.
		imageService: "compile",
		platformProxy: {
			enabled: true,
		},
	}),
});

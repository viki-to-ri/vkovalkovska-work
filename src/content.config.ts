import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const projects = defineCollection({
	// Load Markdown and MDX files in the `src/content/projects/` directory.
	loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		role: z.string(),
		pubDate: z.coerce.date(),
		endDate: z.coerce.date().optional(),
		tools: z.array(z.string()).default([]),
		link: z.string().url().optional(),
		heroImage: z.string().optional(),
		order: z.number().default(0),
	}),
});

export const collections = { projects };

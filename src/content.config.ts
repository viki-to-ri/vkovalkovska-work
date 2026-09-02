import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

/**
 * Case studies. Every case renders through the same template, so the whole page
 * lives in frontmatter — the Markdown body is unused.
 */
const projects = defineCollection({
	loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(), // "Verizon Sideview"
			order: z.number(), // 1..n — drives index order and the next-case loop

			// Index row on the home page.
			tag: z.string(), // mono line under the title
			description: z.string(), // the one outcome-line
			years: z.string(), // "2024–25"

			// Case header.
			premise: z.string(),
			meta: z.array(z.string()), // role · dates · tools, rendered dot-separated
			cover: image().optional(),
			coverAlt: z.string().optional(),
			coverPlaceholder: z.string().default("cover image"),

			// Overview: an optional metrics grid above the summary paragraph.
			metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
			summary: z.string(),

			// "The details" — one <details> per entry, collapsed by default.
			details: z.array(
				z.object({
					label: z.string(),
					body: z.string().optional(),
					bullets: z.array(z.string()).default([]),
				}),
			),

			// "Selected screens" — captions stand in until the real images land.
			screens: z.array(z.object({ caption: z.string() })).default([]),

			draft: z.boolean().default(false),
		}),
});

export const collections = { projects };

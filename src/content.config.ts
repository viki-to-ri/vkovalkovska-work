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
			title: z.string(), // "Verizon SideView"
			order: z.number(), // 1..n — drives index order and the next-case loop

			// Index row on the home page.
			tag: z.string(), // mono line under the title
			description: z.string(), // the one outcome-line
			years: z.string(), // "2024–25"

			// Case header. With `cover` the image renders at 5:3; without it, the
			// 16:9 hatch placeholder does. Nothing else keys off that difference.
			premise: z.string(),
			meta: z.array(z.string()), // role · dates · tools, rendered dot-separated
			cover: image().optional(),
			coverAlt: z.string().optional(),
			coverPlaceholder: z.string().default("cover image"),

			// Overview: an optional metrics grid above the summary paragraph.
			metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
			summary: z.string(),

			// "The details" — one <details> per entry, collapsed by default. `body` is
			// one paragraph or a list of them; either way the layout gets an array of
			// `{ text, note? }`. A `note` renders as its own "→ …" metadata line under
			// its paragraph — the prototype parsed that phrase back out of the prose
			// with a regex, which the handoff asks a real CMS to replace with a field.
			details: z.array(
				z.object({
					label: z.string(),
					body: z
						.union([
							z.string(),
							z.array(
								z.union([
									z.string(),
									z.object({ text: z.string(), note: z.string().optional() }),
								]),
							),
						])
						.default([])
						.transform((body) =>
							(Array.isArray(body) ? body : [body]).map((paragraph) =>
								typeof paragraph === "string" ? { text: paragraph } : paragraph,
							),
						),
					bullets: z.array(z.string()).default([]),
				}),
			),

			// "Selected screens". Two shapes, picked by what the case supplies:
			//
			//   `pageFigure` + `figures` — the real figure layout: one sticky-caption
			//   split for a full-page shot, then a stacked list of captioned figures.
			//   `screens` — the 4:3 placeholder grid, for cases with no imagery yet.
			//
			// `pageFigure.title` and `figures[].title` are carried but deliberately
			// not rendered; the handoff removed both title lines on purpose.
			pageFigure: z
				.object({
					title: z.string().optional(),
					caption: z.string(),
					alt: z.string(),
					src: image(),
				})
				.optional(),
			figures: z
				.array(
					z.object({
						kicker: z.string(),
						title: z.string().optional(),
						caption: z.string(),
						alt: z.string(),
						src: image(),
					}),
				)
				.default([]),
			screens: z.array(z.object({ caption: z.string() })).default([]),

			draft: z.boolean().default(false),
		}),
});

export const collections = { projects };

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

			// Case header. With `cover` the image renders at `coverRatio` (5:3 unless
			// the case says otherwise — Verizon's 16:9 source would lose the tops of
			// its phones at 5:3); without it, the 16:9 hatch placeholder does.
			premise: z.string(),
			meta: z.array(z.string()), // role · dates · tools, rendered dot-separated
			cover: image().optional(),
			coverAlt: z.string().optional(),
			coverRatio: z.string().default("5 / 3"), // a CSS aspect-ratio
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
			//   `figures` — the real figure layout: a list of captioned figures,
			//   led by an optional sticky-caption split for a full-page shot
			//   (`pageFigure`, komoot only).
			//   `screens` — the 4:3 placeholder grid, for cases with no imagery yet.
			//
			// A figure is one `src`/`alt` or several `imgs` under the same kicker;
			// either way the layout gets `imgs`. Several sit side by side unless
			// `stacked` puts them in one column.
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
					z
						.object({
							kicker: z.string(),
							title: z.string().optional(),
							caption: z.string(),
							alt: z.string().optional(),
							src: image().optional(),
							imgs: z.array(z.object({ src: image(), alt: z.string() })).default([]),
							stacked: z.boolean().default(false),
						})
						.refine((figure) => (figure.src ? figure.alt !== undefined : figure.imgs.length > 0), {
							message: "A figure needs `src` with `alt`, or at least one entry in `imgs`.",
						})
						.transform(({ src, alt, imgs, ...figure }) => ({
							...figure,
							imgs: src ? [{ src, alt: alt ?? "" }, ...imgs] : imgs,
						})),
				)
				.default([]),
			screens: z.array(z.object({ caption: z.string() })).default([]),

			draft: z.boolean().default(false),
		}),
});

export const collections = { projects };

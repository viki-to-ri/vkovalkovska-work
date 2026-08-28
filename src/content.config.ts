import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const projects = defineCollection({
	loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(), // "Verizon Sideview"
			order: z.number(), // 1..n — controls index order and next/prev, not date
			year: z.string(), // display string, e.g. "2020–21"
			subline: z.string().max(70), // one line for the index row
			standfirst: z.string(), // 1–2 sentences at the top of the case study

			// Covers are 3:2, min 1600px wide. Optional so the site ships before the
			// image set lands; every cover-dependent block degrades cleanly without one.
			cover: image().optional(),
			coverAlt: z.string().optional(),

			role: z.string(), // "Sole product designer"
			when: z.string(), // "Sep 2020 – May 2021"
			tools: z.string(), // "Sketch, InVision"

			// Big-figure row, rendered directly after the cover. Metric projects only.
			figures: z
				.array(z.object({ value: z.string(), caption: z.string() }))
				.max(3)
				.default([]),

			// The ledger rows, in order. Bodies accept **bold** and [text](url).
			ledger: z.array(
				z.object({
					label: z.string(), // "CONTEXT", "GOAL", "WHAT I DID", ...
					body: z.string(),
					highlight: z.boolean().optional(), // true = lilac field (once, on OUTCOME)
				}),
			),

			links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
			gated: z.boolean().default(false), // NDA'd — row becomes a mailto, year reads ON REQUEST
			draft: z.boolean().default(false),
		}),
});

export const collections = { projects };

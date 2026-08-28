import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Single source of truth for project ordering. Index order and next/previous
 * navigation both derive from `order`; drafts are filtered out in production.
 */
export async function getProjects(): Promise<CollectionEntry<"projects">[]> {
	const projects = await getCollection("projects", ({ data }) =>
		import.meta.env.PROD ? !data.draft : true,
	);
	return projects.sort((a, b) => a.data.order - b.data.order);
}

/** The next project in `order`, cycling from the last back to the first. */
export function nextProject(
	projects: CollectionEntry<"projects">[],
	current: CollectionEntry<"projects">,
): CollectionEntry<"projects"> | undefined {
	if (projects.length < 2) return undefined;
	const index = projects.findIndex((p) => p.id === current.id);
	return projects[(index + 1) % projects.length];
}

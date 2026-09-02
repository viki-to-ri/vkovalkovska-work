/** Books, most recent first. Rows link out to a Goodreads search. */
export const books = [
	{ title: "The Shortest History of Germany", author: "James Hawes" },
	{
		title: "The Art of Color: The Subjective Experience and Objective Rationale of Color",
		author: "Johannes Itten",
	},
	{ title: "Politics of Design", author: "Ruben Pater" },
	{ title: "Sapiens", author: "Yuval Noah Harari" },
	{ title: "One Simple Thing: A New Look at the Science of Yoga", author: "Eddie Stern" },
	{ title: "The Culture Map", author: "Erin Meyer" },
	{ title: "Radical Candor", author: "Kim Scott" },
	{ title: "Just Enough Research", author: "Erika Hall" },
	{
		title: "The Anatomy of Color: The Story of Heritage Paints and Pigments",
		author: "Patrick Baty",
	},
];

export const PLAYLIST_UPDATED = "last updated august 2026";

export function goodreadsSearch(title: string, author: string): string {
	return `https://www.goodreads.com/search?q=${encodeURIComponent(`${title} ${author}`)}`;
}

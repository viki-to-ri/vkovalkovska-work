/**
 * Markdown-lite renderer for ledger bodies: **bold** and [text](url) only.
 *
 * Ledger copy lives in frontmatter rather than the Markdown body, so it never
 * passes through the Markdown pipeline. This runs at build time; nothing ships
 * to the client. Input is escaped first, so the output is safe for `set:html`.
 */

const ESCAPES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
};

function escapeHtml(value: string): string {
	return value.replace(/[&<>"]/g, (char) => ESCAPES[char]);
}

export function inlineMarkdown(source: string): string {
	let out = escapeHtml(source);

	// [text](https://…) — external links open in a new tab.
	out = out.replace(
		/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
		(_match, text: string, href: string) =>
			`<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`,
	);

	// **bold**
	out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

	return out;
}

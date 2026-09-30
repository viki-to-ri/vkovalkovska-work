/**
 * Widths, `sizes` and quality for every image drawn at the full column: case
 * covers, the home slider's cards and the figures. The slider, the case cover
 * and the cover preloader must all ask for the same srcset (quality included —
 * it changes the file name), or the preload warms files nobody requests.
 *
 * The widths are the column's real rendered width, not the 760px page: 760 less
 * the 2×32px padding is 696px on desktop, and 390 less 2×20px is 350px on a
 * phone. Candidates at exactly 1× and 2× of 696 (and ~3× of 350) mean the
 * browser never rescales by an odd fraction, which is what softened thin lines
 * and small UI text.
 */
export const COLUMN_SIZES =
	"(max-width: 600px) calc(100vw - 40px), (max-width: 760px) calc(100vw - 64px), 696px";
export const COLUMN_WIDTHS = [696, 1050, 1392, 2088];

/* The komoot guide-page split: the 1.4fr column of a 1fr/1.4fr grid with a 32px
   gap inside 696px is ≈387px; full column width once it stacks on mobile. */
export const SPLIT_SIZES = "(max-width: 600px) calc(100vw - 40px), 388px";
export const SPLIT_WIDTHS = [388, 776, 1164];

/* The sources are already-compressed WebP, so every derivative is a second
   lossy pass. sharp's default (80) visibly smeared diagram lines and small text;
   90 keeps them clean for roughly a third more bytes. */
export const IMAGE_QUALITY = 90;

/** Only the widths a source can supply, so nothing is upscaled. */
export function widthsFor(image: ImageMetadata, widths = COLUMN_WIDTHS): number[] {
	const out = widths.filter((width) => width <= image.width);
	return out.length ? out : [image.width];
}

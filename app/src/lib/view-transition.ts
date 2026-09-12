/** Tracks the in-flight SPA view transition.
 *  Prefer this over `document.activeViewTransition` — Firefox (and some Safari
 *  builds) support `startViewTransition` but not that property yet. */

let current: ViewTransition | null = null;

export function setActiveViewTransition(transition: ViewTransition | null) {
	current = transition;
}

export function getActiveViewTransition(): ViewTransition | null {
	return (
		current ??
		(document as Document & { activeViewTransition?: ViewTransition | null }).activeViewTransition ??
		null
	);
}

export async function whenViewTransitionFinished() {
	const vt = getActiveViewTransition();
	if (!vt) return;

	try {
		await vt.finished;
	} catch {
		// transition aborted / skipped
	}
}

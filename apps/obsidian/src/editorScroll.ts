import type { Editor } from "obsidian";

interface Cm5ScrollInfo {
	top: number;
	height: number;
	clientHeight: number;
}

type ScrollCapableEditor = Editor & {
	cm?: { scrollDOM?: HTMLElement };
	scrollDOM?: HTMLElement;
	getScrollInfo?: () => Cm5ScrollInfo | { top: number; left: number };
	scrollTo?: (x: number | null, y: number) => void;
};

function asScrollEditor(editor: Editor): ScrollCapableEditor {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- CM6 scrollDOM is not on the public Editor type
	return editor as ScrollCapableEditor;
}

function getCm5ScrollInfo(editor: Editor): Cm5ScrollInfo | null {
	const scrollEditor = asScrollEditor(editor);
	if (typeof scrollEditor.getScrollInfo !== "function") {
		return null;
	}
	const info = scrollEditor.getScrollInfo();
	if (
		typeof info !== "object" ||
		info === null ||
		!("height" in info) ||
		!("clientHeight" in info) ||
		typeof info.height !== "number" ||
		typeof info.clientHeight !== "number" ||
		typeof info.top !== "number"
	) {
		return null;
	}
	return {
		top: info.top,
		height: info.height,
		clientHeight: info.clientHeight,
	};
}

export function getEditorScrollDOM(editor: Editor): HTMLElement | null {
	const scrollEditor = asScrollEditor(editor);
	return scrollEditor.cm?.scrollDOM ?? scrollEditor.scrollDOM ?? null;
}

export function getEditorScrollRatio(editor: Editor): number | null {
	const scrollDOM = getEditorScrollDOM(editor);
	if (scrollDOM) {
		const total = scrollDOM.scrollHeight - scrollDOM.clientHeight;
		if (total <= 0) return null;
		return scrollDOM.scrollTop / total;
	}

	const info = getCm5ScrollInfo(editor);
	if (!info) return null;
	const total = info.height - info.clientHeight;
	if (total <= 0) return null;
	return info.top / total;
}

export function setEditorScrollRatio(editor: Editor, ratio: number): void {
	const scrollDOM = getEditorScrollDOM(editor);
	if (scrollDOM) {
		const total = scrollDOM.scrollHeight - scrollDOM.clientHeight;
		if (total <= 0) return;
		const newScrollTop = ratio * total;
		if (Math.abs(scrollDOM.scrollTop - newScrollTop) > 1) {
			scrollDOM.scrollTop = newScrollTop;
		}
		return;
	}

	const scrollEditor = asScrollEditor(editor);
	const info = getCm5ScrollInfo(editor);
	if (!info || typeof scrollEditor.scrollTo !== "function") {
		return;
	}
	const total = info.height - info.clientHeight;
	if (total <= 0) return;
	scrollEditor.scrollTo(null, ratio * total);
}

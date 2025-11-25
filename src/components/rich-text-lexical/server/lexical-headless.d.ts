/**
 * Type declaration for @lexical/headless module
 * This module provides headless editor functionality for server-side Lexical usage
 */
declare module '@lexical/headless' {
	import type { LexicalEditor, EditorThemeClasses, Klass, LexicalNode } from 'lexical';

	export type CreateEditorArgs = {
		namespace?: string;
		editorState?: string;
		theme?: EditorThemeClasses;
		parentEditor?: LexicalEditor;
		nodes?: ReadonlyArray<Klass<LexicalNode>>;
		onError: (error: Error) => void;
		disableEvents?: boolean;
		readOnly?: boolean;
	};

	export function createHeadlessEditor(
		editorConfig?: CreateEditorArgs,
	): LexicalEditor;
}


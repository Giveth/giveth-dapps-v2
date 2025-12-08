/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const DEFAULT_SETTINGS = {
	disableBeforeInput: false,
	emptyEditor: false,
	hasLinkAttributes: false,
	isAutocomplete: false,
	isCharLimit: false,
	isCharLimitUtf8: false,
	isCodeHighlighted: true,
	isCodeShiki: false,
	isCollab: false,
	isMaxLength: false,
	isRichText: true,
	listStrictIndent: false,
	measureTypingPerf: false,
	selectionAlwaysOnDisplay: false,
	shouldAllowHighlightingWithBrackets: false,
	shouldPreserveNewLinesInMarkdown: false,
	shouldUseLexicalContextMenu: false,
	showNestedEditorTreeView: false,
	showTableOfContents: false,
	showTreeView: false,
	tableCellBackgroundColor: true,
	tableCellMerge: true,
	tableHorizontalScroll: true,
} as const;

// These are mutated in setupEnv
export const INITIAL_SETTINGS: Record<SettingName, boolean> = {
	...DEFAULT_SETTINGS,
};

export type SettingName = keyof typeof DEFAULT_SETTINGS;

export type Settings = typeof INITIAL_SETTINGS;

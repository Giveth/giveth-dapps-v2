/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styles from './PlaygroundEditorTheme.module.css';

import type { EditorThemeClasses } from 'lexical';

const theme: EditorThemeClasses = {
	autocomplete: styles.PlaygroundEditorTheme__autocomplete,
	blockCursor: styles.PlaygroundEditorTheme__blockCursor,
	characterLimit: styles.PlaygroundEditorTheme__characterLimit,
	code: styles.PlaygroundEditorTheme__code,
	codeHighlight: {
		atrule: styles.PlaygroundEditorTheme__tokenAttr,
		attr: styles.PlaygroundEditorTheme__tokenAttr,
		boolean: styles.PlaygroundEditorTheme__tokenProperty,
		builtin: styles.PlaygroundEditorTheme__tokenSelector,
		cdata: styles.PlaygroundEditorTheme__tokenComment,
		char: styles.PlaygroundEditorTheme__tokenSelector,
		class: styles.PlaygroundEditorTheme__tokenFunction,
		'class-name': styles.PlaygroundEditorTheme__tokenFunction,
		comment: styles.PlaygroundEditorTheme__tokenComment,
		constant: styles.PlaygroundEditorTheme__tokenProperty,
		deleted: styles.PlaygroundEditorTheme__tokenDeleted,
		doctype: styles.PlaygroundEditorTheme__tokenComment,
		entity: styles.PlaygroundEditorTheme__tokenOperator,
		function: styles.PlaygroundEditorTheme__tokenFunction,
		important: styles.PlaygroundEditorTheme__tokenVariable,
		inserted: styles.PlaygroundEditorTheme__tokenInserted,
		keyword: styles.PlaygroundEditorTheme__tokenAttr,
		namespace: styles.PlaygroundEditorTheme__tokenVariable,
		number: styles.PlaygroundEditorTheme__tokenProperty,
		operator: styles.PlaygroundEditorTheme__tokenOperator,
		prolog: styles.PlaygroundEditorTheme__tokenComment,
		property: styles.PlaygroundEditorTheme__tokenProperty,
		punctuation: styles.PlaygroundEditorTheme__tokenPunctuation,
		regex: styles.PlaygroundEditorTheme__tokenVariable,
		selector: styles.PlaygroundEditorTheme__tokenSelector,
		string: styles.PlaygroundEditorTheme__tokenSelector,
		symbol: styles.PlaygroundEditorTheme__tokenProperty,
		tag: styles.PlaygroundEditorTheme__tokenProperty,
		unchanged: styles.PlaygroundEditorTheme__tokenUnchanged,
		url: styles.PlaygroundEditorTheme__tokenOperator,
		variable: styles.PlaygroundEditorTheme__tokenVariable,
	},
	embedBlock: {
		base: styles.PlaygroundEditorTheme__embedBlock,
		focus: styles.PlaygroundEditorTheme__embedBlockFocus,
	},
	hashtag: styles.PlaygroundEditorTheme__hashtag,
	heading: {
		h1: styles.PlaygroundEditorTheme__h1,
		h2: styles.PlaygroundEditorTheme__h2,
		h3: styles.PlaygroundEditorTheme__h3,
		h4: styles.PlaygroundEditorTheme__h4,
		h5: styles.PlaygroundEditorTheme__h5,
		h6: styles.PlaygroundEditorTheme__h6,
	},
	hr: styles.PlaygroundEditorTheme__hr,
	hrSelected: styles.PlaygroundEditorTheme__hrSelected,
	image: styles['editor-image'],
	indent: styles.PlaygroundEditorTheme__indent,
	inlineImage: styles['inline-editor-image'],
	layoutContainer: styles.PlaygroundEditorTheme__layoutContainer,
	layoutItem: styles.PlaygroundEditorTheme__layoutItem,
	link: styles.PlaygroundEditorTheme__link,
	list: {
		checklist: styles.PlaygroundEditorTheme__checklist,
		listitem: styles.PlaygroundEditorTheme__listItem,
		listitemChecked: styles.PlaygroundEditorTheme__listItemChecked,
		listitemUnchecked: styles.PlaygroundEditorTheme__listItemUnchecked,
		nested: {
			listitem: styles.PlaygroundEditorTheme__nestedListItem,
		},
		olDepth: [
			styles.PlaygroundEditorTheme__ol1,
			styles.PlaygroundEditorTheme__ol2,
			styles.PlaygroundEditorTheme__ol3,
			styles.PlaygroundEditorTheme__ol4,
			styles.PlaygroundEditorTheme__ol5,
		],
		ul: styles.PlaygroundEditorTheme__ul,
	},
	ltr: styles.PlaygroundEditorTheme__ltr,
	mark: styles.PlaygroundEditorTheme__mark,
	markOverlap: styles.PlaygroundEditorTheme__markOverlap,
	paragraph: styles.PlaygroundEditorTheme__paragraph,
	quote: styles.PlaygroundEditorTheme__quote,
	rtl: styles.PlaygroundEditorTheme__rtl,
	specialText: styles.PlaygroundEditorTheme__specialText,
	tab: styles.PlaygroundEditorTheme__tabNode,
	table: styles.PlaygroundEditorTheme__table,
	tableAddColumns: styles.PlaygroundEditorTheme__tableAddColumns,
	tableAddRows: styles.PlaygroundEditorTheme__tableAddRows,
	tableAlignment: {
		center: styles.PlaygroundEditorTheme__tableAlignmentCenter,
		right: styles.PlaygroundEditorTheme__tableAlignmentRight,
	},
	tableCell: styles.PlaygroundEditorTheme__tableCell,
	tableCellActionButton: styles.PlaygroundEditorTheme__tableCellActionButton,
	tableCellActionButtonContainer:
		styles.PlaygroundEditorTheme__tableCellActionButtonContainer,
	tableCellHeader: styles.PlaygroundEditorTheme__tableCellHeader,
	tableCellResizer: styles.PlaygroundEditorTheme__tableCellResizer,
	tableCellSelected: styles.PlaygroundEditorTheme__tableCellSelected,
	tableFrozenColumn: styles.PlaygroundEditorTheme__tableFrozenColumn,
	tableFrozenRow: styles.PlaygroundEditorTheme__tableFrozenRow,
	tableRowStriping: styles.PlaygroundEditorTheme__tableRowStriping,
	tableScrollableWrapper:
		styles.PlaygroundEditorTheme__tableScrollableWrapper,
	tableSelected: styles.PlaygroundEditorTheme__tableSelected,
	tableSelection: styles.PlaygroundEditorTheme__tableSelection,
	text: {
		bold: styles.PlaygroundEditorTheme__textBold,
		capitalize: styles.PlaygroundEditorTheme__textCapitalize,
		code: styles.PlaygroundEditorTheme__textCode,
		highlight: styles.PlaygroundEditorTheme__textHighlight,
		italic: styles.PlaygroundEditorTheme__textItalic,
		lowercase: styles.PlaygroundEditorTheme__textLowercase,
		strikethrough: styles.PlaygroundEditorTheme__textStrikethrough,
		subscript: styles.PlaygroundEditorTheme__textSubscript,
		superscript: styles.PlaygroundEditorTheme__textSuperscript,
		underline: styles.PlaygroundEditorTheme__textUnderline,
		underlineStrikethrough:
			styles.PlaygroundEditorTheme__textUnderlineStrikethrough,
		uppercase: styles.PlaygroundEditorTheme__textUppercase,
	},
};

export default theme;

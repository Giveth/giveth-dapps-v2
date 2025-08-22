import { $getRoot, $getSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { useEffect } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode } from '@lexical/rich-text';
import { QuoteNode } from '@lexical/rich-text';
import { ListNode } from '@lexical/list';
import { ListItemNode } from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { CodeHighlightNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { AutoLinkNode } from '@lexical/link';
import { TableNode } from '@lexical/table';
import { TableCellNode } from '@lexical/table';
import { TableRowNode } from '@lexical/table';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
// import {
// 	brandColors,
// 	semanticColors,
// 	neutralColors,
// } from '@giveth/ui-design-system';
// import styled from 'styled-components';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import ToolbarPlugin from './ToolbarPlugin';
// import { Shadow } from '@/components/styled-components/Shadow';

const theme = {
	ltr: 'ltr',
	rtl: 'rtl',
	placeholder: 'editor-placeholder',
	paragraph: 'editor-paragraph',
	quote: 'editor-quote',
	heading: {
		h1: 'editor-heading-h1',
		h2: 'editor-heading-h2',
		h3: 'editor-heading-h3',
		h4: 'editor-heading-h4',
		h5: 'editor-heading-h5',
	},
	list: {
		nested: {
			listitem: 'editor-nested-listitem',
		},
		ol: 'editor-list-ol',
		ul: 'editor-list-ul',
		listitem: 'editor-listitem',
	},
	image: 'editor-image',
	link: 'editor-link',
	text: {
		bold: 'editor-text-bold',
		italic: 'editor-text-italic',
		overflowed: 'editor-text-overflowed',
		hashtag: 'editor-text-hashtag',
		underline: 'editor-text-underline',
		strikethrough: 'editor-text-strikethrough',
		underlineStrikethrough: 'editor-text-underlineStrikethrough',
		code: 'editor-text-code',
	},
	code: 'editor-code',
	codeHighlight: {
		atrule: 'editor-tokenAttr',
		attr: 'editor-tokenAttr',
		boolean: 'editor-tokenProperty',
		builtin: 'editor-tokenSelector',
		cdata: 'editor-tokenComment',
		char: 'editor-tokenSelector',
		class: 'editor-tokenFunction',
		'class-name': 'editor-tokenFunction',
		comment: 'editor-tokenComment',
		constant: 'editor-tokenProperty',
		deleted: 'editor-tokenProperty',
		doctype: 'editor-tokenComment',
		entity: 'editor-tokenOperator',
		function: 'editor-tokenFunction',
		important: 'editor-tokenVariable',
		inserted: 'editor-tokenSelector',
		keyword: 'editor-tokenAttr',
		namespace: 'editor-tokenVariable',
		number: 'editor-tokenProperty',
		operator: 'editor-tokenOperator',
		prolog: 'editor-tokenComment',
		property: 'editor-tokenProperty',
		punctuation: 'editor-tokenPunctuation',
		regex: 'editor-tokenVariable',
		selector: 'editor-tokenSelector',
		string: 'editor-tokenSelector',
		symbol: 'editor-tokenProperty',
		tag: 'editor-tokenProperty',
		url: 'editor-tokenOperator',
		variable: 'editor-tokenVariable',
	},
};

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState) {
	editorState.read(() => {
		// Read the contents of the EditorState here.
		const root = $getRoot();
		const selection = $getSelection();

		console.log(root, selection);
	});
}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		// Focus the editor when the effect fires!
		editor.focus();
	}, [editor]);

	return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
	console.error('Lexical error:', error);
}

const LexicalTextInput = ({
	style,
	noShadow,
	hasError,
	placeholder,
	minLimit,
	maxLimit,
	value,
	setValue,
	setHasLimitError,
	error,
}: {
	style?: React.CSSProperties;
	noShadow?: boolean;
	hasError?: boolean;
	placeholder?: string;
	minLimit?: number;
	maxLimit?: number;
	value: string;
	setValue: (value: string) => void;
	setHasLimitError: (hasLimitError: boolean) => void;
	error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}) => {
	const initialConfig = {
		namespace: 'MyEditor',
		theme,
		onError,
		nodes: [
			HeadingNode,
			QuoteNode,
			ListNode,
			ListItemNode,
			CodeNode,
			CodeHighlightNode,
			LinkNode,
			AutoLinkNode,
			TableNode,
			TableCellNode,
			TableRowNode,
			HorizontalRuleNode,
		],
	};

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<ToolbarPlugin />
			<PlainTextPlugin
				contentEditable={
					<ContentEditable
						aria-placeholder={'Enter some text...'}
						style={{
							minHeight: '300px',
							padding: '12px',
							border: '1px solid #ccc',
							borderRadius: '8px',
							fontSize: '16px',
							lineHeight: '1.5',
						}}
						placeholder={<div>Enter some text...</div>}
					/>
				}
				ErrorBoundary={LexicalErrorBoundary}
			/>
			<OnChangePlugin onChange={onChange} />
			<HistoryPlugin />
			<MyCustomAutoFocusPlugin />
		</LexicalComposer>
	);
};

export default LexicalTextInput;

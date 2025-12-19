import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
	$createParagraphNode,
	$createTextNode,
	$getRoot,
	$isTextNode,
	DOMConversionMap,
	TextNode,
	LexicalNode,
	ParagraphNode,
	LexicalEditor,
} from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import { parseAllowedColor } from './ui/ColorPicker';
import { parseAllowedFontSize } from './plugins/ToolbarPlugin/fontSize';
import { EditorShell } from '@/components/rich-text-lexical/mainStyles';

function getExtraStyles(element: HTMLElement): string {
	let extraStyles = '';
	const fontSize = parseAllowedFontSize(element.style.fontSize);
	const backgroundColor = parseAllowedColor(element.style.backgroundColor);
	const color = parseAllowedColor(element.style.color);
	if (fontSize !== '' && fontSize !== '15px') {
		extraStyles += `font-size: ${fontSize};`;
	}
	if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
		extraStyles += `background-color: ${backgroundColor};`;
	}
	if (color !== '' && color !== 'rgb(0, 0, 0)') {
		extraStyles += `color: ${color};`;
	}
	return extraStyles;
}

function buildImportMap(): DOMConversionMap {
	const importMap: DOMConversionMap = {};

	for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
		importMap[tag] = importNode => {
			const importer = fn(importNode);
			if (!importer) {
				return null;
			}
			return {
				...importer,
				conversion: element => {
					const output = importer.conversion(element);
					if (
						output === null ||
						output.forChild === undefined ||
						output.after !== undefined ||
						output.node !== null
					) {
						return output;
					}
					const extraStyles = getExtraStyles(element);
					if (extraStyles) {
						const { forChild } = output;
						return {
							...output,
							forChild: (child, parent) => {
								const textNode = forChild(child, parent);
								if ($isTextNode(textNode)) {
									textNode.setStyle(
										textNode.getStyle() + extraStyles,
									);
								}
								return textNode;
							},
						};
					}
					return output;
				},
			};
		};
	}

	return importMap;
}

function parseHtmlToLexicalNodes(editor: LexicalEditor, html: string) {
	const cleanedHtml = html
		.replace(/""/g, '"')
		.replace(/<p[^>]*><span[^>]*>([^<]*)<\/span><\/p>/g, '<p>$1</p>')
		.replace(
			/<span[^>]*class=["']image-uploading["'][^>]*>\s*(<img[^>]+>)\s*<\/span>/gi,
			'<p>$1</p>',
		)
		.replace(
			/<span[^>]*class=["']image-uploading["'][^>]*>(?!<img)[^<]*(?:<br\s*\/?>)*<\/span>/gi,
			'',
		)
		.replace(/<span[^>]*>\s*(<img[^>]+>)\s*<\/span>/gi, '<p>$1</p>');

	const parser = new DOMParser();
	const dom = parser.parseFromString(cleanedHtml, 'text/html');
	const nodes = $generateNodesFromDOM(editor, dom);

	const fixedNodes: (LexicalNode | ParagraphNode)[] = [];
	let buffer: LexicalNode[] = [];

	const flushBuffer = () => {
		if (buffer.length > 0) {
			const p = $createParagraphNode();
			buffer.forEach(n => p.append(n));
			fixedNodes.push(p);
			buffer = [];
		}
	};

	nodes.forEach(node => {
		const type = node.getType?.();
		if (type === 'text' || type === 'linebreak' || type === 'link') {
			buffer.push(node);
		} else {
			flushBuffer();
			fixedNodes.push(node);
		}
	});

	flushBuffer();
	return fixedNodes;
}

function ContentInitializer({ html }: { html?: string }) {
	const [editor] = useLexicalComposerContext();
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		if (!html || isInitialized) return;

		editor.update(() => {
			const root = $getRoot();
			root.clear();

			try {
				const fixedNodes = parseHtmlToLexicalNodes(editor, html);
				root.append(...fixedNodes);
			} catch (err) {
				console.error('Error parsing HTML content:', err);
				const paragraph = $createParagraphNode();
				paragraph.append($createTextNode(html || ''));
				root.append(paragraph);
			}
		});

		setIsInitialized(true);
	}, [editor, html, isInitialized]);

	return null;
}

export default function RichTextLexicalViewer({
	content,
}: {
	content?: string;
}) {
	if (!content) {
		return null;
	}

	const initialConfig = {
		namespace: 'RichTextViewer',
		nodes: [...PlaygroundNodes],
		editable: false, // Read-only mode
		onError: (error: Error) => {
			console.error('Lexical viewer error:', error);
		},
		theme: PlaygroundEditorTheme,
		html: { import: buildImportMap() },
	};

	return (
		<ViewerWrapper>
			<LexicalComposer initialConfig={initialConfig}>
				<EditorShell className='editor-shell viewer-mode'>
					<RichTextPlugin
						contentEditable={
							<StyledContentEditable aria-readonly={true} />
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
				</EditorShell>
				<ContentInitializer html={content} />
			</LexicalComposer>
		</ViewerWrapper>
	);
}

const ViewerWrapper = styled.div`
	.editor-shell {
		border: none;
		box-shadow: none;
		background: transparent;
	}
`;

const StyledContentEditable = styled(ContentEditable)`
	outline: none;
	border: none;
	padding: 0;
	min-height: auto;

	/* Ensure links are clickable in view mode */
	a {
		pointer-events: auto;
	}
`;

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
	$createParagraphNode,
	$createTextNode,
	$getRoot,
	$isTextNode,
	DOMConversionMap,
	TextNode,
	EditorState,
	LexicalNode,
	ParagraphNode,
	// LexicalEditor,
} from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useEffect, useState } from 'react';
import { GLink, semanticColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';
import { useSettings } from './context/SettingsContext';
import Editor from './Editor';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import { TableContext } from './plugins/TablePlugin';
import { ToolbarContext } from './context/ToolbarContext';
import { FlashMessageContext } from './context/FlashMessageContext';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import { parseAllowedColor } from './ui/ColorPicker';
import { parseAllowedFontSize } from './plugins/ToolbarPlugin/fontSize';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';
import { EditorShell } from '@/components/rich-text-lexical/mainStyles';
import RichTextCounter from '@/components/rich-text-lexical/RichTextCounter';

function getExtraStyles(element: HTMLElement): string {
	// Parse styles from pasted input, but only if they match exactly the
	// sort of styles that would be produced by exportDOM
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

	// Wrap all TextNode importers with a function that also imports
	// the custom styles implemented by the playground
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

// Component to handle onChange events
// End here is what data is being saved
function OnChangeHandler({ onChange }: { onChange?: (html: string) => void }) {
	const [editor] = useLexicalComposerContext();

	const handleChange = (editorState: EditorState) => {
		if (onChange) {
			editorState.read(() => {
				const htmlString = $generateHtmlFromNodes(editor);
				onChange(htmlString);
			});
		}
	};

	return onChange ? <OnChangePlugin onChange={handleChange} /> : null;
}

// End here is what data is being loaded
function parseHtmlToLexicalNodes(editor: any, html: string) {
	// Clean up problematic input
	const cleanedHtml = html
		.replace(/""/g, '"')
		.replace(/<p[^>]*><span[^>]*>([^<])<\/span><\/p>/g, '<p>$1</p>')
		// .replace(/style="[^"]*white-space:\s*pre-wrap[^"]*"/g, '')
		// Unwrap image-uploading spans that contain images (keep the image)
		.replace(
			/<span[^>]*class=["']image-uploading["'][^>]*>\s*(<img[^>]+>)\s*<\/span>/gi,
			'<p>$1</p>',
		)
		// Remove image-uploading spans with text/br content (no images)
		.replace(
			/<span[^>]*class=["']image-uploading["'][^>]*>(?!<img)[^<]*(?:<br\s*\/?>)*<\/span>/gi,
			'',
		)
		// Unwrap other spans containing only images
		.replace(/<span[^>]*>\s*(<img[^>]+>)\s*<\/span>/gi, '<p>$1</p>');

	const parser = new DOMParser();
	const dom = parser.parseFromString(cleanedHtml, 'text/html');
	const nodes = $generateNodesFromDOM(editor, dom);

	// 🛠 Fix orphan text nodes being directly at root level
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

// Function to create initial editor state from HTML or text
function createInitialEditorState(content?: string) {
	return (editor: any) => {
		const root = $getRoot();
		if (!content || root.getFirstChild() !== null) return;

		try {
			const fixedNodes = parseHtmlToLexicalNodes(editor, content);

			root.clear();
			root.append(...fixedNodes);
		} catch (err) {
			console.error('Error parsing HTML content:', err);
			// Fallback to plain text paragraph
			const paragraph = $createParagraphNode();
			paragraph.append($createTextNode(content || ''));
			root.append(paragraph);
		}
	};
}

function EditorInitializer({ html }: { html?: string }) {
	const [editor] = useLexicalComposerContext();
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		// Only run once on initial load, not on every content change
		if (!html || isInitialized) return;

		editor.update(() => {
			const root = $getRoot();
			root.clear();

			const fixedNodes = parseHtmlToLexicalNodes(editor, html);

			root.clear();
			root.append(...fixedNodes);
		});

		setIsInitialized(true);
	}, [editor, html, isInitialized]);

	return null;
}

export default function RichTextLexicalEditor({
	initialValue,
	onChange,
	projectId,
	maxLength,
	setHasLimitError,
	error,
}: {
	initialValue?: string;
	onChange?: (html: string) => void;
	projectId?: string;
	maxLength?: number;
	setHasLimitError?: (hasLimitError: boolean) => void;
	error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
} = {}) {
	const [currentValue, setCurrentValue] = useState(initialValue || '');

	const {
		settings: { isCollab, emptyEditor, measureTypingPerf },
	} = useSettings();

	// Wrapper to track current value for the counter
	const handleChange = (html: string) => {
		setCurrentValue(html);
		onChange?.(html);
	};

	const initialConfig = {
		editorState: isCollab ? null : createInitialEditorState(initialValue),
		html: { import: buildImportMap() },
		namespace: 'Playground',
		nodes: [...PlaygroundNodes],
		onError: (error: Error) => {
			throw error;
		},
		theme: PlaygroundEditorTheme,
	};

	return (
		<FlashMessageContext>
			<LexicalComposer initialConfig={initialConfig}>
				<SharedHistoryContext>
					<TableContext>
						<ToolbarContext>
							<EditorShell className='editor-shell'>
								<Editor projectId={projectId} />
								{maxLength && (
									<RichTextCounter
										minLimit={maxLength}
										value={currentValue}
										setHasLimitError={setHasLimitError}
									/>
								)}
							</EditorShell>
							<EditorInitializer html={initialValue} />
							<OnChangeHandler onChange={handleChange} />
							{measureTypingPerf ? <TypingPerfPlugin /> : null}
							{error && <Error>{error as string}</Error>}
						</ToolbarContext>
					</TableContext>
				</SharedHistoryContext>
			</LexicalComposer>
		</FlashMessageContext>
	);
}

const Error = styled(GLink)`
	color: ${semanticColors.punch[500]};
	margin-top: 4px;
`;

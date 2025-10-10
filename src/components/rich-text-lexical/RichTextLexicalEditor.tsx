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
	// LexicalEditor,
} from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $createListNode, $createListItemNode } from '@lexical/list';
import { $createLinkNode } from '@lexical/link';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { useEffect, useState } from 'react';
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

function $prepopulatedRichText() {
	const root = $getRoot();
	if (root.getFirstChild() === null) {
		const heading = $createHeadingNode('h1');
		heading.append($createTextNode('Welcome to the playground'));
		root.append(heading);
		const quote = $createQuoteNode();
		quote.append(
			$createTextNode(
				`In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. ` +
					`You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.`,
			),
		);
		root.append(quote);
		const paragraph = $createParagraphNode();
		paragraph.append(
			$createTextNode('The playground is a demo environment built with '),
			$createTextNode('@lexical/react').toggleFormat('code'),
			$createTextNode('.'),
			$createTextNode(' Try typing in '),
			$createTextNode('some text').toggleFormat('bold'),
			$createTextNode(' with '),
			$createTextNode('different').toggleFormat('italic'),
			$createTextNode(' formats.'),
		);
		root.append(paragraph);
		const paragraph2 = $createParagraphNode();
		paragraph2.append(
			$createTextNode(
				'Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!',
			),
		);
		root.append(paragraph2);
		const paragraph3 = $createParagraphNode();
		paragraph3.append(
			$createTextNode(
				`If you'd like to find out more about Lexical, you can:`,
			),
		);
		root.append(paragraph3);
		const list = $createListNode('bullet');
		list.append(
			$createListItemNode().append(
				$createTextNode(`Visit the `),
				$createLinkNode('https://lexical.dev/').append(
					$createTextNode('Lexical website'),
				),
				$createTextNode(` for documentation and more information.`),
			),
			$createListItemNode().append(
				$createTextNode(`Check out the code on our `),
				$createLinkNode('https://github.com/facebook/lexical').append(
					$createTextNode('GitHub repository'),
				),
				$createTextNode(`.`),
			),
			$createListItemNode().append(
				$createTextNode(`Playground code can be found `),
				$createLinkNode(
					'https://github.com/facebook/lexical/tree/main/packages/lexical-playground',
				).append($createTextNode('here')),
				$createTextNode(`.`),
			),
			$createListItemNode().append(
				$createTextNode(`Join our `),
				$createLinkNode('https://discord.com/invite/KmG4wQnnD9').append(
					$createTextNode('Discord Server'),
				),
				$createTextNode(` and chat with the team.`),
			),
		);
		root.append(list);
		const paragraph4 = $createParagraphNode();
		paragraph4.append(
			$createTextNode(
				`Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance :).`,
			),
		);
		root.append(paragraph4);
	}
}

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

// Function to create initial editor state from HTML or text
function createInitialEditorState(content?: string) {
	return (editor: any) => {
		const root = $getRoot();
		if (!content || root.getFirstChild() !== null) return;

		try {
			// Clean up problematic HTML patterns before parsing
			const cleanedContent = content
				.replace(/<p[^>]*><span[^>]*>([^<])<\/span><\/p>/g, '<p>$1</p>') // Single character spans
				.replace(/style="[^"]*white-space:\s*pre-wrap[^"]*"/g, ''); // Remove problematic styles

			const parser = new DOMParser();
			const dom = parser.parseFromString(cleanedContent, 'text/html');
			const nodes = $generateNodesFromDOM(editor, dom);

			root.clear();
			root.append(...nodes);
		} catch (err) {
			console.error('Error parsing HTML content:', err);
			// Fallback to plain text paragraph
			const paragraph = $createParagraphNode();
			paragraph.append($createTextNode(content || ''));
			root.append(paragraph);
		}
	};

	// return () => {
	// 	const root = $getRoot();
	// 	if (root.getFirstChild() === null) {
	// 		if (content && content.trim() !== '') {
	// 			// Check if content looks like HTML
	// 			if (content.includes('<') && content.includes('>')) {
	// 				try {
	// 					// Split content by paragraph tags and create separate paragraphs
	// 					const paragraphs = content
	// 						.split(/<\/p>\s*<p[^>]*>/)
	// 						.map(p =>
	// 							p
	// 								.replace(/<\/?p[^>]*>/g, '')
	// 								.replace(/<br\s*\/?>/gi, '')
	// 								.trim(),
	// 						)
	// 						.filter(p => p.length > 0);

	// 					if (paragraphs.length > 0) {
	// 						paragraphs.forEach(paragraphText => {
	// 							const paragraph = $createParagraphNode();
	// 							paragraph.append(
	// 								$createTextNode(paragraphText),
	// 							);
	// 							root.append(paragraph);
	// 						});
	// 					} else {
	// 						// Fallback: strip all HTML and create single paragraph
	// 						const textContent = content
	// 							.replace(/<[^>]*>/g, '')
	// 							.trim();
	// 						if (textContent) {
	// 							const paragraph = $createParagraphNode();
	// 							paragraph.append($createTextNode(textContent));
	// 							root.append(paragraph);
	// 						}
	// 					}
	// 				} catch (error) {
	// 					// Fallback to plain text if HTML parsing fails
	// 					const paragraph = $createParagraphNode();
	// 					paragraph.append($createTextNode(content));
	// 					root.append(paragraph);
	// 				}
	// 			} else {
	// 				// Plain text content
	// 				const paragraph = $createParagraphNode();
	// 				paragraph.append($createTextNode(content));
	// 				root.append(paragraph);
	// 			}
	// 		} else {
	// 			// Add empty paragraph if no content
	// 			const paragraph = $createParagraphNode();
	// 			root.append(paragraph);
	// 		}
	// 	}
	// };
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

			// Clean up problematic HTML patterns before parsing
			const cleanedHtml = html
				.replace(/<p[^>]*><span[^>]*>([^<])<\/span><\/p>/g, '<p>$1</p>') // Single character spans
				.replace(/style="[^"]*white-space:\s*pre-wrap[^"]*"/g, ''); // Remove problematic styles

			const parser = new DOMParser();
			const dom = parser.parseFromString(cleanedHtml, 'text/html');
			const nodes = $generateNodesFromDOM(editor, dom);

			root.append(...nodes);
		});

		setIsInitialized(true);
	}, [editor, html, isInitialized]);

	return null;
}

export default function RichTextLexicalEditor({
	initialValue,
	onChange,
}: {
	initialValue?: string;
	onChange?: (html: string) => void;
} = {}) {
	// Debug: Log the initial value
	console.log('RichTextLexicalEditor initialValue:', initialValue);

	const {
		settings: { isCollab, emptyEditor, measureTypingPerf },
	} = useSettings();

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
								<Editor />
							</EditorShell>
							<EditorInitializer html={initialValue} />
							<OnChangeHandler onChange={onChange} />
							{measureTypingPerf ? <TypingPerfPlugin /> : null}
						</ToolbarContext>
					</TableContext>
				</SharedHistoryContext>
			</LexicalComposer>
		</FlashMessageContext>
	);
}

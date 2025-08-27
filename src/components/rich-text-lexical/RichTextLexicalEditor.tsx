import { LexicalComposer } from '@lexical/react/LexicalComposer';
import {
	$createParagraphNode,
	$createTextNode,
	$getRoot,
	$isTextNode,
	DOMConversionMap,
	TextNode,
} from 'lexical';
import { $createListNode, $createListItemNode } from '@lexical/list';
import { $createLinkNode } from '@lexical/link';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
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

export default function RichTextLexicalEditor() {
	const {
		settings: { isCollab, emptyEditor, measureTypingPerf },
	} = useSettings();

	const initialConfig = {
		editorState: isCollab
			? null
			: emptyEditor
				? undefined
				: $prepopulatedRichText,
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
							<div className='editor-shell'>
								<Editor />
							</div>
							{measureTypingPerf ? <TypingPerfPlugin /> : null}
						</ToolbarContext>
					</TableContext>
				</SharedHistoryContext>
			</LexicalComposer>
		</FlashMessageContext>
	);
}

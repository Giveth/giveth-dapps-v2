/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
	$isCodeNode,
	getCodeLanguageOptions as getCodeLanguageOptionsPrism,
	normalizeCodeLanguage as normalizeCodeLanguagePrism,
} from '@lexical/code';
import {
	getCodeLanguageOptions as getCodeLanguageOptionsShiki,
	getCodeThemeOptions as getCodeThemeOptionsShiki,
	normalizeCodeLanguage as normalizeCodeLanguageShiki,
} from '@lexical/code-shiki';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $isHeadingNode } from '@lexical/rich-text';
import {
	$getSelectionStyleValueForProperty,
	$isParentElementRTL,
	$patchStyleText,
} from '@lexical/selection';
import { $isTableNode, $isTableSelection } from '@lexical/table';
import {
	$findMatchingParent,
	$getNearestNodeOfType,
	$isEditorIsNestedEditor,
	IS_APPLE,
	mergeRegister,
} from '@lexical/utils';
import {
	$getNodeByKey,
	$getRoot,
	$getSelection,
	$isElementNode,
	$isNodeSelection,
	$isRangeSelection,
	$isRootOrShadowRoot,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	ElementFormatType,
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
	HISTORIC_TAG,
	INDENT_CONTENT_COMMAND,
	LexicalEditor,
	LexicalNode,
	NodeKey,
	OUTDENT_CONTENT_COMMAND,
	REDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	UNDO_COMMAND,
} from 'lexical';
import { Dispatch, useCallback, useEffect, useState } from 'react';

import styles from '../../index.module.css';

import { useSettings } from '../../context/SettingsContext';
import {
	blockTypeToBlockName,
	useToolbarState,
} from '../../context/ToolbarContext';
import useModal from '../../hooks/useModal';
import catTypingGif from '../../images/cat-typing.gif';
import { $createStickyNode } from '../../nodes/StickyNode';
import DropDown, { DropDownItem } from '../../ui/DropDown';
import DropdownColorPicker from '../../ui/DropdownColorPicker';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { sanitizeUrl } from '../../utils/url';
import { EmbedConfigs } from '../AutoEmbedPlugin';
import { INSERT_COLLAPSIBLE_COMMAND } from '../CollapsiblePlugin';
import { INSERT_DATETIME_COMMAND } from '../DateTimePlugin';
import { InsertEquationDialog } from '../EquationsPlugin';
import { INSERT_EXCALIDRAW_COMMAND } from '../ExcalidrawPlugin';
import {
	INSERT_IMAGE_COMMAND,
	InsertImageDialog,
	InsertImagePayload,
} from '../ImagesPlugin';
import { InsertInlineImageDialog } from '../InlineImagePlugin';
import InsertLayoutDialog from '../LayoutPlugin/InsertLayoutDialog';
import { INSERT_PAGE_BREAK } from '../PageBreakPlugin';
import { InsertPollDialog } from '../PollPlugin';
import { SHORTCUTS } from '../ShortcutsPlugin/shortcuts';
import { InsertTableDialog } from '../TablePlugin';
import FontSize, { parseFontSizeForToolbar } from './fontSize';
import {
	clearFormatting,
	formatBulletList,
	formatCheckList,
	formatCode,
	formatHeading,
	formatNumberedList,
	formatParagraph,
	formatQuote,
} from './utils';
import type { JSX } from 'react';

const rootTypeToRootName = {
	root: 'Root',
	table: 'Table',
};

const CODE_LANGUAGE_OPTIONS_PRISM: [string, string][] =
	getCodeLanguageOptionsPrism().filter(option =>
		[
			'c',
			'clike',
			'cpp',
			'css',
			'html',
			'java',
			'js',
			'javascript',
			'markdown',
			'objc',
			'objective-c',
			'plain',
			'powershell',
			'py',
			'python',
			'rust',
			'sql',
			'swift',
			'typescript',
			'xml',
		].includes(option[0]),
	);

const CODE_LANGUAGE_OPTIONS_SHIKI: [string, string][] =
	getCodeLanguageOptionsShiki().filter(option =>
		[
			'c',
			'clike',
			'cpp',
			'css',
			'html',
			'java',
			'js',
			'javascript',
			'markdown',
			'objc',
			'objective-c',
			'plain',
			'powershell',
			'py',
			'python',
			'rust',
			'sql',
			'typescript',
			'xml',
		].includes(option[0]),
	);

const CODE_THEME_OPTIONS_SHIKI: [string, string][] =
	getCodeThemeOptionsShiki().filter(option =>
		[
			'catppuccin-latte',
			'everforest-light',
			'github-light',
			'gruvbox-light-medium',
			'kanagawa-lotus',
			'dark-plus',
			'light-plus',
			'material-theme-lighter',
			'min-light',
			'one-light',
			'rose-pine-dawn',
			'slack-ochin',
			'snazzy-light',
			'solarized-light',
			'vitesse-light',
		].includes(option[0]),
	);

const FONT_FAMILY_OPTIONS: [string, string][] = [
	['Arial', 'Arial'],
	['Courier New', 'Courier New'],
	['Georgia', 'Georgia'],
	['Times New Roman', 'Times New Roman'],
	['Trebuchet MS', 'Trebuchet MS'],
	['Verdana', 'Verdana'],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
	['10px', '10px'],
	['11px', '11px'],
	['12px', '12px'],
	['13px', '13px'],
	['14px', '14px'],
	['15px', '15px'],
	['16px', '16px'],
	['17px', '17px'],
	['18px', '18px'],
	['19px', '19px'],
	['20px', '20px'],
];

const ELEMENT_FORMAT_OPTIONS: {
	[key in Exclude<ElementFormatType, ''>]: {
		icon: string;
		iconRTL: string;
		name: string;
	};
} = {
	center: {
		icon: 'center-align',
		iconRTL: 'center-align',
		name: 'Center Align',
	},
	end: {
		icon: 'right-align',
		iconRTL: 'left-align',
		name: 'End Align',
	},
	justify: {
		icon: 'justify-align',
		iconRTL: 'justify-align',
		name: 'Justify Align',
	},
	left: {
		icon: 'left-align',
		iconRTL: 'left-align',
		name: 'Left Align',
	},
	right: {
		icon: 'right-align',
		iconRTL: 'right-align',
		name: 'Right Align',
	},
	start: {
		icon: 'left-align',
		iconRTL: 'right-align',
		name: 'Start Align',
	},
};

function dropDownActiveClass(active: boolean) {
	if (active) {
		return `${styles['active']} ${styles['dropdown-item-active']}`;
	} else {
		return '';
	}
}

function BlockFormatDropDown({
	editor,
	blockType,
	rootType,
	disabled = false,
}: {
	blockType: keyof typeof blockTypeToBlockName;
	rootType: keyof typeof rootTypeToRootName;
	editor: LexicalEditor;
	disabled?: boolean;
}): JSX.Element {
	return (
		<DropDown
			disabled={disabled}
			buttonClassName={`${styles['toolbar-item']} ${styles['block-controls']}`}
			buttonIconClassName={'icon block-type ' + blockType}
			buttonLabel={blockTypeToBlockName[blockType]}
			buttonAriaLabel='Formatting options for text style'
		>
			<DropDownItem
				className={
					'item wide ' +
					dropDownActiveClass(blockType === 'paragraph')
				}
				onClick={() => formatParagraph(editor)}
			>
				<div className={styles['icon-text-container']}>
					<i className={`${styles['icon']} ${styles['paragraph']}`} />
					<span className={styles['text']}>Normal</span>
				</div>
				<span className='shortcut'>{SHORTCUTS.NORMAL}</span>
			</DropDownItem>
			<DropDownItem
				className={
					'item wide ' + dropDownActiveClass(blockType === 'h1')
				}
				onClick={() => formatHeading(editor, blockType, 'h1')}
			>
				<div className={styles['icon-text-container']}>
					<i className={`${styles['icon']} ${styles['h1']}`} />
					<span className={styles['text']}>Heading 1</span>
				</div>
				<span className='shortcut'>{SHORTCUTS.HEADING1}</span>
			</DropDownItem>
			<DropDownItem
				className={
					'item wide ' + dropDownActiveClass(blockType === 'h2')
				}
				onClick={() => formatHeading(editor, blockType, 'h2')}
			>
				<div className={styles['icon-text-container']}>
					<i className={`${styles['icon']} ${styles['h2']}`} />
					<span className={styles['text']}>Heading 2</span>
				</div>
				<span className='shortcut'>{SHORTCUTS.HEADING2}</span>
			</DropDownItem>
			<DropDownItem
				className={
					'item wide ' + dropDownActiveClass(blockType === 'h3')
				}
				onClick={() => formatHeading(editor, blockType, 'h3')}
			>
				<div className={styles['icon-text-container']}>
					<i className={`${styles['icon']} ${styles['h3']}`} />
					<span className={styles['text']}>Heading 3</span>
				</div>
				<span className='shortcut'>{SHORTCUTS.HEADING3}</span>
			</DropDownItem>
			<DropDownItem
				className={
					'item wide ' + dropDownActiveClass(blockType === 'number')
				}
				onClick={() => formatNumberedList(editor, blockType)}
			>
				<div className={styles['icon-text-container']}>
					<i
						className={`${styles['icon']} ${styles['numbered-list']}`}
					/>
					<span className={styles['text']}>Numbered List</span>
				</div>
				<span className='shortcut'>{SHORTCUTS.NUMBERED_LIST}</span>
			</DropDownItem>
			<DropDownItem
				className={
					'item wide ' + dropDownActiveClass(blockType === 'bullet')
				}
				onClick={() => formatBulletList(editor, blockType)}
			>
				<div className={styles['icon-text-container']}>
					<i
						className={`${styles['icon']} ${styles['bullet-list']}`}
					/>
					<span className={styles['text']}>Bullet List</span>
				</div>
				<span className='shortcut'>{SHORTCUTS.BULLET_LIST}</span>
			</DropDownItem>
			<DropDownItem
				className={
					'item wide ' + dropDownActiveClass(blockType === 'check')
				}
				onClick={() => formatCheckList(editor, blockType)}
			>
				<div className={styles['icon-text-container']}>
					<i
						className={`${styles['icon']} ${styles['check-list']}`}
					/>
					<span className={styles['text']}>Check List</span>
				</div>
				<span className='shortcut'>{SHORTCUTS.CHECK_LIST}</span>
			</DropDownItem>
			<DropDownItem
				className={
					'item wide ' + dropDownActiveClass(blockType === 'quote')
				}
				onClick={() => formatQuote(editor, blockType)}
			>
				<div className={styles['icon-text-container']}>
					<i className={`${styles['icon']} ${styles['quote']}`} />
					<span className={styles['text']}>Quote</span>
				</div>
				<span className='shortcut'>{SHORTCUTS.QUOTE}</span>
			</DropDownItem>
			<DropDownItem
				className={
					'item wide ' + dropDownActiveClass(blockType === 'code')
				}
				onClick={() => formatCode(editor, blockType)}
			>
				<div className={styles['icon-text-container']}>
					<i className={`${styles['icon']} ${styles['code']}`} />
					<span className={styles['text']}>Code Block</span>
				</div>
				<span className={styles['shortcut']}>
					{SHORTCUTS.CODE_BLOCK}
				</span>
			</DropDownItem>
		</DropDown>
	);
}

function Divider(): JSX.Element {
	return <div className={styles['divider']} />;
}

function FontDropDown({
	editor,
	value,
	style,
	disabled = false,
}: {
	editor: LexicalEditor;
	value: string;
	style: string;
	disabled?: boolean;
}): JSX.Element {
	const handleClick = useCallback(
		(option: string) => {
			editor.update(() => {
				const selection = $getSelection();
				if (selection !== null) {
					$patchStyleText(selection, {
						[style]: option,
					});
				}
			});
		},
		[editor, style],
	);

	const buttonAriaLabel =
		style === 'font-family'
			? 'Formatting options for font family'
			: 'Formatting options for font size';

	return (
		<DropDown
			disabled={disabled}
			buttonClassName={'toolbar-item ' + style}
			buttonLabel={value}
			buttonIconClassName={
				style === 'font-family' ? 'icon block-type font-family' : ''
			}
			buttonAriaLabel={buttonAriaLabel}
		>
			{(style === 'font-family'
				? FONT_FAMILY_OPTIONS
				: FONT_SIZE_OPTIONS
			).map(([option, text]) => (
				<DropDownItem
					className={`${styles['item']} ${dropDownActiveClass(
						value === option,
					)} ${style === 'font-size' ? styles['fontsize-item'] : ''}`}
					onClick={() => handleClick(option)}
					key={option}
				>
					<span className={styles['text']}>{text}</span>
				</DropDownItem>
			))}
		</DropDown>
	);
}

function ElementFormatDropdown({
	editor,
	value,
	isRTL,
	disabled = false,
}: {
	editor: LexicalEditor;
	value: ElementFormatType;
	isRTL: boolean;
	disabled: boolean;
}) {
	const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left'];

	return (
		<DropDown
			disabled={disabled}
			buttonLabel={formatOption.name}
			buttonIconClassName={`icon ${
				isRTL ? formatOption.iconRTL : formatOption.icon
			}`}
			buttonClassName={`${styles['toolbar-item']} ${styles['spaced']} ${styles['alignment']}`}
			buttonAriaLabel='Formatting options for text alignment'
		>
			<DropDownItem
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
				}}
				className={`${styles['item']} ${styles['wide']}`}
			>
				<div className={styles['icon-text-container']}>
					<i
						className={`${styles['icon']} ${styles['left-align']}`}
					/>
					<span className={styles['text']}>Left Align</span>
				</div>
				<span className={styles['shortcut']}>
					{SHORTCUTS.LEFT_ALIGN}
				</span>
			</DropDownItem>
			<DropDownItem
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
				}}
				className={`${styles['item']} ${styles['wide']}`}
			>
				<div className={styles['icon-text-container']}>
					<i
						className={`${styles['icon']} ${styles['center-align']}`}
					/>
					<span className={styles['text']}>Center Align</span>
				</div>
				<span className={styles['shortcut']}>
					{SHORTCUTS.CENTER_ALIGN}
				</span>
			</DropDownItem>
			<DropDownItem
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
				}}
				className={`${styles['item']} ${styles['wide']}`}
			>
				<div className={styles['icon-text-container']}>
					<i
						className={`${styles['icon']} ${styles['right-align']}`}
					/>
					<span className={styles['text']}>Right Align</span>
				</div>
				<span className={styles['shortcut']}>
					{SHORTCUTS.RIGHT_ALIGN}
				</span>
			</DropDownItem>
			<DropDownItem
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
				}}
				className={`${styles['item']} ${styles['wide']}`}
			>
				<div className={styles['icon-text-container']}>
					<i
						className={`${styles['icon']} ${styles['justify-align']}`}
					/>
					<span className={styles['text']}>Justify Align</span>
				</div>
				<span className={styles['shortcut']}>
					{SHORTCUTS.JUSTIFY_ALIGN}
				</span>
			</DropDownItem>
			<DropDownItem
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'start');
				}}
				className={`${styles['item']} ${styles['wide']}`}
			>
				<i
					className={`${styles['icon']} ${
						isRTL
							? ELEMENT_FORMAT_OPTIONS.start.iconRTL
							: ELEMENT_FORMAT_OPTIONS.start.icon
					}`}
				/>
				<span className={styles['text']}>Start Align</span>
			</DropDownItem>
			<DropDownItem
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'end');
				}}
				className={`${styles['item']} ${styles['wide']}`}
			>
				<i
					className={`${styles['icon']} ${
						isRTL
							? ELEMENT_FORMAT_OPTIONS.end.iconRTL
							: ELEMENT_FORMAT_OPTIONS.end.icon
					}`}
				/>
				<span className={styles['text']}>End Align</span>
			</DropDownItem>
			<Divider />
			<DropDownItem
				onClick={() => {
					editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
				}}
				className={`${styles['item']} ${styles['wide']}`}
			>
				<div className={styles['icon-text-container']}>
					<i
						className={`${styles['icon']} ${
							isRTL ? styles['indent'] : styles['outdent']
						}`}
					/>
					<span className={styles['text']}>Outdent</span>
				</div>
				<span className={styles['shortcut']}>{SHORTCUTS.OUTDENT}</span>
			</DropDownItem>
			<DropDownItem
				onClick={() => {
					editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
				}}
				className={`${styles['item']} ${styles['wide']}`}
			>
				<div className={styles['icon-text-container']}>
					<i
						className={`${styles['icon']} ${
							isRTL ? styles['outdent'] : styles['indent']
						}`}
					/>
					<span className='text'>Indent</span>
				</div>
				<span className='shortcut'>{SHORTCUTS.INDENT}</span>
			</DropDownItem>
		</DropDown>
	);
}

function $findTopLevelElement(node: LexicalNode) {
	let topLevelElement =
		node.getKey() === 'root'
			? node
			: $findMatchingParent(node, e => {
					const parent = e.getParent();
					return parent !== null && $isRootOrShadowRoot(parent);
				});

	if (topLevelElement === null) {
		topLevelElement = node.getTopLevelElementOrThrow();
	}
	return topLevelElement;
}

export default function ToolbarPlugin({
	editor,
	activeEditor,
	setActiveEditor,
	setIsLinkEditMode,
}: {
	editor: LexicalEditor;
	activeEditor: LexicalEditor;
	setActiveEditor: Dispatch<LexicalEditor>;
	setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
	const [selectedElementKey, setSelectedElementKey] =
		useState<NodeKey | null>(null);
	const [modal, showModal] = useModal();
	const [isEditable, setIsEditable] = useState(() => editor.isEditable());
	const { toolbarState, updateToolbarState } = useToolbarState();

	const $handleHeadingNode = useCallback(
		(selectedElement: LexicalNode) => {
			const type = $isHeadingNode(selectedElement)
				? selectedElement.getTag()
				: selectedElement.getType();

			if (type in blockTypeToBlockName) {
				updateToolbarState(
					'blockType',
					type as keyof typeof blockTypeToBlockName,
				);
			}
		},
		[updateToolbarState],
	);

	const {
		settings: { isCodeHighlighted, isCodeShiki },
	} = useSettings();

	const $handleCodeNode = useCallback(
		(element: LexicalNode) => {
			if ($isCodeNode(element)) {
				const language = element.getLanguage();
				updateToolbarState(
					'codeLanguage',
					language
						? (isCodeHighlighted &&
								(isCodeShiki
									? normalizeCodeLanguageShiki(language)
									: normalizeCodeLanguagePrism(language))) ||
								language
						: '',
				);
				const theme = element.getTheme();
				updateToolbarState('codeTheme', theme || '');
				return;
			}
		},
		[updateToolbarState, isCodeHighlighted, isCodeShiki],
	);

	const $updateToolbar = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			if (
				activeEditor !== editor &&
				$isEditorIsNestedEditor(activeEditor)
			) {
				const rootElement = activeEditor.getRootElement();
				updateToolbarState(
					'isImageCaption',
					!!rootElement?.parentElement?.classList.contains(
						styles['image-caption-container'],
					),
				);
			} else {
				updateToolbarState('isImageCaption', false);
			}

			const anchorNode = selection.anchor.getNode();
			const element = $findTopLevelElement(anchorNode);
			const elementKey = element.getKey();
			const elementDOM = activeEditor.getElementByKey(elementKey);

			updateToolbarState('isRTL', $isParentElementRTL(selection));

			// Update links
			const node = getSelectedNode(selection);
			const parent = node.getParent();
			const isLink = $isLinkNode(parent) || $isLinkNode(node);
			updateToolbarState('isLink', isLink);

			const tableNode = $findMatchingParent(node, $isTableNode);
			if ($isTableNode(tableNode)) {
				updateToolbarState('rootType', 'table');
			} else {
				updateToolbarState('rootType', 'root');
			}

			if (elementDOM !== null) {
				setSelectedElementKey(elementKey);
				if ($isListNode(element)) {
					const parentList = $getNearestNodeOfType<ListNode>(
						anchorNode,
						ListNode,
					);
					const type = parentList
						? parentList.getListType()
						: element.getListType();

					updateToolbarState('blockType', type);
				} else {
					$handleHeadingNode(element);
					$handleCodeNode(element);
				}
			}

			// Handle buttons
			updateToolbarState(
				'fontColor',
				$getSelectionStyleValueForProperty(selection, 'color', '#000'),
			);
			updateToolbarState(
				'bgColor',
				$getSelectionStyleValueForProperty(
					selection,
					'background-color',
					'#fff',
				),
			);
			updateToolbarState(
				'fontFamily',
				$getSelectionStyleValueForProperty(
					selection,
					'font-family',
					'Arial',
				),
			);
			let matchingParent;
			if ($isLinkNode(parent)) {
				// If node is a link, we need to fetch the parent paragraph node to set format
				matchingParent = $findMatchingParent(
					node,
					parentNode =>
						$isElementNode(parentNode) && !parentNode.isInline(),
				);
			}

			// If matchingParent is a valid node, pass it's format type
			updateToolbarState(
				'elementFormat',
				$isElementNode(matchingParent)
					? matchingParent.getFormatType()
					: $isElementNode(node)
						? node.getFormatType()
						: parent?.getFormatType() || 'left',
			);
		}
		if ($isRangeSelection(selection) || $isTableSelection(selection)) {
			// Update text format
			updateToolbarState('isBold', selection.hasFormat('bold'));
			updateToolbarState('isItalic', selection.hasFormat('italic'));
			updateToolbarState('isUnderline', selection.hasFormat('underline'));
			updateToolbarState(
				'isStrikethrough',
				selection.hasFormat('strikethrough'),
			);
			updateToolbarState('isSubscript', selection.hasFormat('subscript'));
			updateToolbarState(
				'isSuperscript',
				selection.hasFormat('superscript'),
			);
			updateToolbarState('isHighlight', selection.hasFormat('highlight'));
			updateToolbarState('isCode', selection.hasFormat('code'));
			updateToolbarState(
				'fontSize',
				$getSelectionStyleValueForProperty(
					selection,
					'font-size',
					'15px',
				),
			);
			updateToolbarState('isLowercase', selection.hasFormat('lowercase'));
			updateToolbarState('isUppercase', selection.hasFormat('uppercase'));
			updateToolbarState(
				'isCapitalize',
				selection.hasFormat('capitalize'),
			);
		}
		if ($isNodeSelection(selection)) {
			const nodes = selection.getNodes();
			for (const selectedNode of nodes) {
				const parentList = $getNearestNodeOfType<ListNode>(
					selectedNode,
					ListNode,
				);
				if (parentList) {
					const type = parentList.getListType();
					updateToolbarState('blockType', type);
				} else {
					const selectedElement = $findTopLevelElement(selectedNode);
					$handleHeadingNode(selectedElement);
					$handleCodeNode(selectedElement);
					// Update elementFormat for node selection (e.g., images)
					if ($isElementNode(selectedElement)) {
						updateToolbarState(
							'elementFormat',
							selectedElement.getFormatType(),
						);
					}
				}
			}
		}
	}, [
		activeEditor,
		editor,
		updateToolbarState,
		$handleHeadingNode,
		$handleCodeNode,
	]);

	useEffect(() => {
		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			(_payload, newEditor) => {
				setActiveEditor(newEditor);
				$updateToolbar();
				return false;
			},
			COMMAND_PRIORITY_CRITICAL,
		);
	}, [editor, $updateToolbar, setActiveEditor]);

	useEffect(() => {
		activeEditor.getEditorState().read(
			() => {
				$updateToolbar();
			},
			{ editor: activeEditor },
		);
	}, [activeEditor, $updateToolbar]);

	useEffect(() => {
		return mergeRegister(
			editor.registerEditableListener(editable => {
				setIsEditable(editable);
			}),
			activeEditor.registerUpdateListener(({ editorState }) => {
				editorState.read(
					() => {
						$updateToolbar();
					},
					{ editor: activeEditor },
				);
			}),
			activeEditor.registerCommand<boolean>(
				CAN_UNDO_COMMAND,
				payload => {
					updateToolbarState('canUndo', payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL,
			),
			activeEditor.registerCommand<boolean>(
				CAN_REDO_COMMAND,
				payload => {
					updateToolbarState('canRedo', payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL,
			),
		);
	}, [$updateToolbar, activeEditor, editor, updateToolbarState]);

	const applyStyleText = useCallback(
		(styles: Record<string, string>, skipHistoryStack?: boolean) => {
			activeEditor.update(
				() => {
					const selection = $getSelection();
					if (selection !== null) {
						$patchStyleText(selection, styles);
					}
				},
				skipHistoryStack ? { tag: HISTORIC_TAG } : {},
			);
		},
		[activeEditor],
	);

	const onFontColorSelect = useCallback(
		(value: string, skipHistoryStack: boolean) => {
			applyStyleText({ color: value }, skipHistoryStack);
		},
		[applyStyleText],
	);

	const onBgColorSelect = useCallback(
		(value: string, skipHistoryStack: boolean) => {
			applyStyleText({ 'background-color': value }, skipHistoryStack);
		},
		[applyStyleText],
	);

	const insertLink = useCallback(() => {
		if (!toolbarState.isLink) {
			setIsLinkEditMode(true);
			activeEditor.dispatchCommand(
				TOGGLE_LINK_COMMAND,
				sanitizeUrl('https://'),
			);
		} else {
			setIsLinkEditMode(false);
			activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	}, [activeEditor, setIsLinkEditMode, toolbarState.isLink]);

	const onCodeLanguageSelect = useCallback(
		(value: string) => {
			activeEditor.update(() => {
				if (selectedElementKey !== null) {
					const node = $getNodeByKey(selectedElementKey);
					if ($isCodeNode(node)) {
						node.setLanguage(value);
					}
				}
			});
		},
		[activeEditor, selectedElementKey],
	);
	const onCodeThemeSelect = useCallback(
		(value: string) => {
			activeEditor.update(() => {
				if (selectedElementKey !== null) {
					const node = $getNodeByKey(selectedElementKey);
					if ($isCodeNode(node)) {
						node.setTheme(value);
					}
				}
			});
		},
		[activeEditor, selectedElementKey],
	);
	const insertGifOnClick = (payload: InsertImagePayload) => {
		activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
	};

	const canViewerSeeInsertDropdown = !toolbarState.isImageCaption;
	const canViewerSeeInsertCodeButton = !toolbarState.isImageCaption;

	return (
		<div className={`${styles['toolbar']}`}>
			<button
				disabled={!toolbarState.canUndo || !isEditable}
				onClick={() => {
					activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
				}}
				title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
				type='button'
				className={`${styles['toolbar-item']} ${styles['spaced']}`}
				aria-label='Undo'
			>
				<i className={`${styles['format']} ${styles['undo']}`} />
			</button>
			<button
				disabled={!toolbarState.canRedo || !isEditable}
				onClick={() => {
					activeEditor.dispatchCommand(REDO_COMMAND, undefined);
				}}
				title={IS_APPLE ? 'Redo (⇧⌘Z)' : 'Redo (Ctrl+Y)'}
				type='button'
				className={`${styles['toolbar-item']}`}
				aria-label='Redo'
			>
				<i className={`${styles['format']} ${styles['redo']}`} />
			</button>
			<Divider />
			{toolbarState.blockType in blockTypeToBlockName &&
				activeEditor === editor && (
					<>
						<BlockFormatDropDown
							disabled={!isEditable}
							blockType={toolbarState.blockType}
							rootType={toolbarState.rootType}
							editor={activeEditor}
						/>
						<Divider />
					</>
				)}
			{toolbarState.blockType === 'code' && isCodeHighlighted ? (
				<>
					{!isCodeShiki && (
						<DropDown
							disabled={!isEditable}
							buttonClassName={`${styles['toolbar-item']} ${styles['code-language']}`}
							buttonLabel={
								(CODE_LANGUAGE_OPTIONS_PRISM.find(
									opt =>
										opt[0] ===
										normalizeCodeLanguagePrism(
											toolbarState.codeLanguage,
										),
								) || ['', ''])[1]
							}
							buttonAriaLabel='Select language'
						>
							{CODE_LANGUAGE_OPTIONS_PRISM.map(
								([value, name]) => {
									return (
										<DropDownItem
											className={`${styles['item']} ${dropDownActiveClass(
												value ===
													toolbarState.codeLanguage,
											)}`}
											onClick={() =>
												onCodeLanguageSelect(value)
											}
											key={value}
										>
											<span className={styles['text']}>
												{name}
											</span>
										</DropDownItem>
									);
								},
							)}
						</DropDown>
					)}
					{isCodeShiki && (
						<>
							<DropDown
								disabled={!isEditable}
								buttonClassName={`${styles['toolbar-item']} ${styles['code-language']}`}
								buttonLabel={
									(CODE_LANGUAGE_OPTIONS_SHIKI.find(
										opt =>
											opt[0] ===
											normalizeCodeLanguageShiki(
												toolbarState.codeLanguage,
											),
									) || ['', ''])[1]
								}
								buttonAriaLabel='Select language'
							>
								{CODE_LANGUAGE_OPTIONS_SHIKI.map(
									([value, name]) => {
										return (
											<DropDownItem
												className={`${styles['item']} ${dropDownActiveClass(
													value ===
														toolbarState.codeLanguage,
												)}`}
												onClick={() =>
													onCodeLanguageSelect(value)
												}
												key={value}
											>
												<span
													className={styles['text']}
												>
													{name}
												</span>
											</DropDownItem>
										);
									},
								)}
							</DropDown>
							<DropDown
								disabled={!isEditable}
								buttonClassName={`${styles['toolbar-item']} ${styles['code-language']}`}
								buttonLabel={
									(CODE_THEME_OPTIONS_SHIKI.find(
										opt =>
											opt[0] === toolbarState.codeTheme,
									) || ['', ''])[1]
								}
								buttonAriaLabel='Select theme'
							>
								{CODE_THEME_OPTIONS_SHIKI.map(
									([value, name]) => {
										return (
											<DropDownItem
												className={`${styles['item']} ${dropDownActiveClass(
													value ===
														toolbarState.codeTheme,
												)}`}
												onClick={() =>
													onCodeThemeSelect(value)
												}
												key={value}
											>
												<span
													className={styles['text']}
												>
													{name}
												</span>
											</DropDownItem>
										);
									},
								)}
							</DropDown>
						</>
					)}
				</>
			) : (
				<>
					<FontDropDown
						disabled={!isEditable}
						style={'font-family'}
						value={toolbarState.fontFamily}
						editor={activeEditor}
					/>
					<Divider />
					<FontSize
						selectionFontSize={parseFontSizeForToolbar(
							toolbarState.fontSize,
						).slice(0, -2)}
						editor={activeEditor}
						disabled={!isEditable}
					/>
					<Divider />
					<button
						disabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'bold',
							);
						}}
						className={`${styles['toolbar-item']} ${styles['spaced']} ${
							toolbarState.isBold ? styles['active'] : ''
						}`}
						title={`Bold (${SHORTCUTS.BOLD})`}
						type='button'
						aria-label={`Format text as bold. Shortcut: ${SHORTCUTS.BOLD}`}
					>
						<i
							className={`${styles['format']} ${styles['bold']}`}
						/>
					</button>
					<button
						disabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'italic',
							);
						}}
						className={`${styles['toolbar-item']} ${styles['spaced']} ${
							toolbarState.isItalic ? styles['active'] : ''
						}`}
						title={`Italic (${SHORTCUTS.ITALIC})`}
						type='button'
						aria-label={`Format text as italics. Shortcut: ${SHORTCUTS.ITALIC}`}
					>
						<i
							className={`${styles['format']} ${styles['italic']}`}
						/>
					</button>
					<button
						disabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'underline',
							);
						}}
						className={`${styles['toolbar-item']} ${styles['spaced']} ${
							toolbarState.isUnderline ? styles['active'] : ''
						}`}
						title={`Underline (${SHORTCUTS.UNDERLINE})`}
						type='button'
						aria-label={`Format text to underlined. Shortcut: ${SHORTCUTS.UNDERLINE}`}
					>
						<i
							className={`${styles['format']} ${styles['underline']}`}
						/>
					</button>
					{canViewerSeeInsertCodeButton && (
						<button
							disabled={!isEditable}
							onClick={() => {
								activeEditor.dispatchCommand(
									FORMAT_TEXT_COMMAND,
									'code',
								);
							}}
							className={`${styles['toolbar-item']} ${styles['spaced']} ${
								toolbarState.isCode ? styles['active'] : ''
							}`}
							title={`Insert code block (${SHORTCUTS.INSERT_CODE_BLOCK})`}
							type='button'
							aria-label='Insert code block'
						>
							<i
								className={`${styles['format']} ${styles['code']}`}
							/>
						</button>
					)}
					<button
						disabled={!isEditable}
						onClick={insertLink}
						className={`${styles['toolbar-item']} ${styles['spaced']} ${
							toolbarState.isLink ? styles['active'] : ''
						}`}
						aria-label='Insert link'
						title={`Insert link (${SHORTCUTS.INSERT_LINK})`}
						type='button'
					>
						<i
							className={`${styles['format']} ${styles['link']}`}
						/>
					</button>
					<DropdownColorPicker
						disabled={!isEditable}
						buttonClassName={`${styles['toolbar-item']} ${styles['color-picker']}`}
						buttonAriaLabel='Formatting text color'
						buttonIconClassName={`${styles['icon']} ${styles['font-color']}`}
						color={toolbarState.fontColor}
						onChange={onFontColorSelect}
						title='text color'
					/>
					<DropdownColorPicker
						disabled={!isEditable}
						buttonClassName={`${styles['toolbar-item']} ${styles['color-picker']}`}
						buttonAriaLabel='Formatting background color'
						buttonIconClassName={`${styles['icon']} ${styles['bg-color']}`}
						color={toolbarState.bgColor}
						onChange={onBgColorSelect}
						title='bg color'
					/>
					<DropDown
						disabled={!isEditable}
						buttonClassName={`${styles['toolbar-item']} ${styles['spaced']}`}
						buttonLabel=''
						buttonAriaLabel='Formatting options for additional text styles'
						buttonIconClassName={`${styles['icon']} ${styles['dropdown-more']}`}
					>
						<DropDownItem
							onClick={() => {
								activeEditor.dispatchCommand(
									FORMAT_TEXT_COMMAND,
									'lowercase',
								);
							}}
							className={`${styles['item']} ${styles['wide']} ${dropDownActiveClass(
								toolbarState.isLowercase,
							)}`}
							title='Lowercase'
							aria-label='Format text to lowercase'
						>
							<div className={styles['icon-text-container']}>
								<i
									className={`${styles['icon']} ${styles['lowercase']}`}
								/>
								<span className={styles['text']}>
									Lowercase
								</span>
							</div>
							<span className={styles['shortcut']}>
								{SHORTCUTS.LOWERCASE}
							</span>
						</DropDownItem>
						<DropDownItem
							onClick={() => {
								activeEditor.dispatchCommand(
									FORMAT_TEXT_COMMAND,
									'uppercase',
								);
							}}
							className={`${styles['item']} ${styles['wide']} ${dropDownActiveClass(
								toolbarState.isUppercase,
							)}`}
							title='Uppercase'
							aria-label='Format text to uppercase'
						>
							<div className={styles['icon-text-container']}>
								<i
									className={`${styles['icon']} ${styles['uppercase']}`}
								/>
								<span className={styles['text']}>
									Uppercase
								</span>
							</div>
							<span className={styles['shortcut']}>
								{SHORTCUTS.UPPERCASE}
							</span>
						</DropDownItem>
						<DropDownItem
							onClick={() => {
								activeEditor.dispatchCommand(
									FORMAT_TEXT_COMMAND,
									'capitalize',
								);
							}}
							className={`${styles['item']} ${styles['wide']} ${dropDownActiveClass(
								toolbarState.isCapitalize,
							)}`}
							title='Capitalize'
							aria-label='Format text to capitalize'
						>
							<div className={styles['icon-text-container']}>
								<i
									className={`${styles['icon']} ${styles['capitalize']}`}
								/>
								<span className={styles['text']}>
									Capitalize
								</span>
							</div>
							<span className={styles['shortcut']}>
								{SHORTCUTS.CAPITALIZE}
							</span>
						</DropDownItem>
						<DropDownItem
							onClick={() => {
								activeEditor.dispatchCommand(
									FORMAT_TEXT_COMMAND,
									'strikethrough',
								);
							}}
							className={`${styles['item']} ${styles['wide']} ${dropDownActiveClass(
								toolbarState.isStrikethrough,
							)}`}
							title='Strikethrough'
							aria-label='Format text with a strikethrough'
						>
							<div className={styles['icon-text-container']}>
								<i
									className={`${styles['icon']} ${styles['strikethrough']}`}
								/>
								<span className={styles['text']}>
									Strikethrough
								</span>
							</div>
							<span className={styles['shortcut']}>
								{SHORTCUTS.STRIKETHROUGH}
							</span>
						</DropDownItem>
						<DropDownItem
							onClick={() => {
								activeEditor.dispatchCommand(
									FORMAT_TEXT_COMMAND,
									'subscript',
								);
							}}
							className={`${styles['item']} ${styles['wide']} ${dropDownActiveClass(
								toolbarState.isSubscript,
							)}`}
							title='Subscript'
							aria-label='Format text with a subscript'
						>
							<div className={styles['icon-text-container']}>
								<i
									className={`${styles['icon']} ${styles['subscript']}`}
								/>
								<span className={styles['text']}>
									Subscript
								</span>
							</div>
							<span className={styles['shortcut']}>
								{SHORTCUTS.SUBSCRIPT}
							</span>
						</DropDownItem>
						<DropDownItem
							onClick={() => {
								activeEditor.dispatchCommand(
									FORMAT_TEXT_COMMAND,
									'superscript',
								);
							}}
							className={`${styles['item']} ${styles['wide']} ${dropDownActiveClass(
								toolbarState.isSuperscript,
							)}`}
							title='Superscript'
							aria-label='Format text with a superscript'
						>
							<div className={styles['icon-text-container']}>
								<i
									className={`${styles['icon']} ${styles['superscript']}`}
								/>
								<span className={styles['text']}>
									Superscript
								</span>
							</div>
							<span className={styles['shortcut']}>
								{SHORTCUTS.SUPERSCRIPT}
							</span>
						</DropDownItem>
						<DropDownItem
							onClick={() => {
								activeEditor.dispatchCommand(
									FORMAT_TEXT_COMMAND,
									'highlight',
								);
							}}
							className={`${styles['item']} ${styles['wide']} ${dropDownActiveClass(
								toolbarState.isHighlight,
							)}`}
							title='Highlight'
							aria-label='Format text with a highlight'
						>
							<div className={styles['icon-text-container']}>
								<i
									className={`${styles['icon']} ${styles['highlight']}`}
								/>
								<span className={styles['text']}>
									Highlight
								</span>
							</div>
						</DropDownItem>
						<DropDownItem
							onClick={() => clearFormatting(activeEditor)}
							className={`${styles['item']} ${styles['wide']}`}
							title='Clear text formatting'
							aria-label='Clear all text formatting'
						>
							<div className={styles['icon-text-container']}>
								<i
									className={`${styles['icon']} ${styles['clear']}`}
								/>
								<span className={styles['text']}>
									Clear Formatting
								</span>
							</div>
							<span className={styles['shortcut']}>
								{SHORTCUTS.CLEAR_FORMATTING}
							</span>
						</DropDownItem>
					</DropDown>
					{canViewerSeeInsertDropdown && (
						<>
							<Divider />
							<DropDown
								disabled={!isEditable}
								buttonClassName={`${styles['toolbar-item']} ${styles['spaced']}`}
								buttonLabel='Insert'
								buttonAriaLabel='Insert specialized editor node'
								buttonIconClassName={`${styles['icon']} ${styles['plus']}`}
							>
								<DropDownItem
									onClick={() => {
										activeEditor.dispatchCommand(
											INSERT_HORIZONTAL_RULE_COMMAND,
											undefined,
										);
									}}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['horizontal-rule']}`}
									/>
									<span className={styles['text']}>
										Horizontal Rule
									</span>
								</DropDownItem>
								<DropDownItem
									onClick={() => {
										activeEditor.dispatchCommand(
											INSERT_PAGE_BREAK,
											undefined,
										);
									}}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['page-break']}`}
									/>
									<span className={styles['text']}>
										Page Break
									</span>
								</DropDownItem>
								<DropDownItem
									onClick={() => {
										showModal('Insert Image', onClose => (
											<InsertImageDialog
												activeEditor={activeEditor}
												onClose={onClose}
											/>
										));
									}}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['image']}`}
									/>
									<span className={styles['text']}>
										Image
									</span>
								</DropDownItem>
								<DropDownItem
									onClick={() => {
										showModal(
											'Insert Inline Image',
											onClose => (
												<InsertInlineImageDialog
													activeEditor={activeEditor}
													onClose={onClose}
												/>
											),
										);
									}}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['image']}`}
									/>
									<span className={styles['text']}>
										Inline Image
									</span>
								</DropDownItem>
								<DropDownItem
									onClick={() =>
										insertGifOnClick({
											altText: 'Cat typing on a laptop',
											src: catTypingGif.src,
										})
									}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['gif']}`}
									/>
									<span className={styles['text']}>GIF</span>
								</DropDownItem>
								<DropDownItem
									onClick={() => {
										activeEditor.dispatchCommand(
											INSERT_EXCALIDRAW_COMMAND,
											undefined,
										);
									}}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['diagram-2']}`}
									/>
									<span className={styles['text']}>
										Excalidraw
									</span>
								</DropDownItem>
								<DropDownItem
									onClick={() => {
										showModal('Insert Table', onClose => (
											<InsertTableDialog
												activeEditor={activeEditor}
												onClose={onClose}
											/>
										));
									}}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['table']}`}
									/>
									<span className={styles['text']}>
										Table
									</span>
								</DropDownItem>
								<DropDownItem
									onClick={() => {
										showModal('Insert Poll', onClose => (
											<InsertPollDialog
												activeEditor={activeEditor}
												onClose={onClose}
											/>
										));
									}}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['poll']}`}
									/>
									<span className={styles['text']}>Poll</span>
								</DropDownItem>
								<DropDownItem
									onClick={() => {
										showModal(
											'Insert Columns Layout',
											onClose => (
												<InsertLayoutDialog
													activeEditor={activeEditor}
													onClose={onClose}
												/>
											),
										);
									}}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['columns']}`}
									/>
									<span className={styles['text']}>
										Columns Layout
									</span>
								</DropDownItem>

								<DropDownItem
									onClick={() => {
										showModal(
											'Insert Equation',
											onClose => (
												<InsertEquationDialog
													activeEditor={activeEditor}
													onClose={onClose}
												/>
											),
										);
									}}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['equation']}`}
									/>
									<span className={styles['text']}>
										Equation
									</span>
								</DropDownItem>
								<DropDownItem
									onClick={() => {
										editor.update(() => {
											const root = $getRoot();
											const stickyNode =
												$createStickyNode(0, 0);
											root.append(stickyNode);
										});
									}}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['sticky']}`}
									/>
									<span className={styles['text']}>
										Sticky Note
									</span>
								</DropDownItem>
								<DropDownItem
									onClick={() => {
										editor.dispatchCommand(
											INSERT_COLLAPSIBLE_COMMAND,
											undefined,
										);
									}}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['caret-right']}`}
									/>
									<span className={styles['text']}>
										Collapsible container
									</span>
								</DropDownItem>
								<DropDownItem
									onClick={() => {
										const dateTime = new Date();
										dateTime.setHours(0, 0, 0, 0);
										activeEditor.dispatchCommand(
											INSERT_DATETIME_COMMAND,
											{
												dateTime,
											},
										);
									}}
									className={`${styles['item']}`}
								>
									<i
										className={`${styles['icon']} ${styles['calendar']}`}
									/>
									<span className={styles['text']}>Date</span>
								</DropDownItem>
								{EmbedConfigs.map(embedConfig => (
									<DropDownItem
										key={embedConfig.type}
										onClick={() => {
											activeEditor.dispatchCommand(
												INSERT_EMBED_COMMAND,
												embedConfig.type,
											);
										}}
										className={`${styles['item']}`}
									>
										{embedConfig.icon}
										<span className='text'>
											{embedConfig.contentName}
										</span>
									</DropDownItem>
								))}
							</DropDown>
						</>
					)}
				</>
			)}
			<Divider />
			<ElementFormatDropdown
				disabled={!isEditable}
				value={toolbarState.elementFormat}
				editor={activeEditor}
				isRTL={toolbarState.isRTL}
			/>

			{modal}
		</div>
	);
}

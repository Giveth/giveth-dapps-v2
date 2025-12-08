/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $isCodeHighlightNode } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
	$getSelection,
	$isParagraphNode,
	$isRangeSelection,
	$isTextNode,
	COMMAND_PRIORITY_LOW,
	FORMAT_TEXT_COMMAND,
	getDOMSelection,
	LexicalEditor,
	SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import styled from 'styled-components';
import { getDOMRangeRect } from '../../utils/getDOMRangeRect';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { setFloatingElemPosition } from '../../utils/setFloatingElemPosition';
import { INSERT_INLINE_COMMAND } from '../CommentPlugin';
import type { JSX } from 'react';

function TextFormatFloatingToolbar({
	editor,
	anchorElem,
	isLink,
	isBold,
	isItalic,
	isUnderline,
	isUppercase,
	isLowercase,
	isCapitalize,
	isCode,
	isStrikethrough,
	isSubscript,
	isSuperscript,
	setIsLinkEditMode,
}: {
	editor: LexicalEditor;
	anchorElem: HTMLElement;
	isBold: boolean;
	isCode: boolean;
	isItalic: boolean;
	isLink: boolean;
	isUppercase: boolean;
	isLowercase: boolean;
	isCapitalize: boolean;
	isStrikethrough: boolean;
	isSubscript: boolean;
	isSuperscript: boolean;
	isUnderline: boolean;
	setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
	const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

	const insertLink = useCallback(() => {
		if (!isLink) {
			setIsLinkEditMode(true);
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
		} else {
			setIsLinkEditMode(false);
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	}, [editor, isLink, setIsLinkEditMode]);

	const insertComment = () => {
		editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
	};

	function mouseMoveListener(e: MouseEvent) {
		if (
			popupCharStylesEditorRef?.current &&
			(e.buttons === 1 || e.buttons === 3)
		) {
			if (
				popupCharStylesEditorRef.current.style.pointerEvents !== 'none'
			) {
				const x = e.clientX;
				const y = e.clientY;
				const elementUnderMouse = document.elementFromPoint(x, y);

				if (
					!popupCharStylesEditorRef.current.contains(
						elementUnderMouse,
					)
				) {
					// Mouse is not over the target element => not a normal click, but probably a drag
					popupCharStylesEditorRef.current.style.pointerEvents =
						'none';
				}
			}
		}
	}
	function mouseUpListener(e: MouseEvent) {
		if (popupCharStylesEditorRef?.current) {
			if (
				popupCharStylesEditorRef.current.style.pointerEvents !== 'auto'
			) {
				popupCharStylesEditorRef.current.style.pointerEvents = 'auto';
			}
		}
	}

	useEffect(() => {
		if (popupCharStylesEditorRef?.current) {
			document.addEventListener('mousemove', mouseMoveListener);
			document.addEventListener('mouseup', mouseUpListener);

			return () => {
				document.removeEventListener('mousemove', mouseMoveListener);
				document.removeEventListener('mouseup', mouseUpListener);
			};
		}
	}, [popupCharStylesEditorRef]);

	const $updateTextFormatFloatingToolbar = useCallback(() => {
		const selection = $getSelection();

		const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
		const nativeSelection = getDOMSelection(editor._window);

		if (popupCharStylesEditorElem === null) {
			return;
		}

		const rootElement = editor.getRootElement();
		if (
			selection !== null &&
			nativeSelection !== null &&
			!nativeSelection.isCollapsed &&
			rootElement !== null &&
			rootElement.contains(nativeSelection.anchorNode)
		) {
			const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

			setFloatingElemPosition(
				rangeRect,
				popupCharStylesEditorElem,
				anchorElem,
				isLink,
			);
		}
	}, [editor, anchorElem, isLink]);

	useEffect(() => {
		const scrollerElem = anchorElem.parentElement;

		const update = () => {
			editor.getEditorState().read(() => {
				$updateTextFormatFloatingToolbar();
			});
		};

		window.addEventListener('resize', update);
		if (scrollerElem) {
			scrollerElem.addEventListener('scroll', update);
		}

		return () => {
			window.removeEventListener('resize', update);
			if (scrollerElem) {
				scrollerElem.removeEventListener('scroll', update);
			}
		};
	}, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

	useEffect(() => {
		editor.getEditorState().read(() => {
			$updateTextFormatFloatingToolbar();
		});
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					$updateTextFormatFloatingToolbar();
				});
			}),

			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					$updateTextFormatFloatingToolbar();
					return false;
				},
				COMMAND_PRIORITY_LOW,
			),
		);
	}, [editor, $updateTextFormatFloatingToolbar]);

	return (
		<FloatingTextFormatPopup ref={popupCharStylesEditorRef}>
			{editor.isEditable() && (
				<>
					<button
						type='button'
						onClick={() => {
							editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
						}}
						className={
							'popup-item spaced ' + (isBold ? 'active' : '')
						}
						title='Bold'
						aria-label='Format text as bold'
					>
						<i className='format bold' />
					</button>
					<button
						type='button'
						onClick={() => {
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'italic',
							);
						}}
						className={
							'popup-item spaced ' + (isItalic ? 'active' : '')
						}
						title='Italic'
						aria-label='Format text as italics'
					>
						<i className='format italic' />
					</button>
					<button
						type='button'
						onClick={() => {
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'underline',
							);
						}}
						className={
							'popup-item spaced ' + (isUnderline ? 'active' : '')
						}
						title='Underline'
						aria-label='Format text to underlined'
					>
						<i className='format underline' />
					</button>
					<button
						type='button'
						onClick={() => {
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'strikethrough',
							);
						}}
						className={
							'popup-item spaced ' +
							(isStrikethrough ? 'active' : '')
						}
						title='Strikethrough'
						aria-label='Format text with a strikethrough'
					>
						<i className='format strikethrough' />
					</button>
					<button
						type='button'
						onClick={() => {
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'subscript',
							);
						}}
						className={
							'popup-item spaced ' + (isSubscript ? 'active' : '')
						}
						title='Subscript'
						aria-label='Format Subscript'
					>
						<i className='format subscript' />
					</button>
					<button
						type='button'
						onClick={() => {
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'superscript',
							);
						}}
						className={
							'popup-item spaced ' +
							(isSuperscript ? 'active' : '')
						}
						title='Superscript'
						aria-label='Format Superscript'
					>
						<i className='format superscript' />
					</button>
					<button
						type='button'
						onClick={() => {
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'uppercase',
							);
						}}
						className={
							'popup-item spaced ' + (isUppercase ? 'active' : '')
						}
						title='Uppercase'
						aria-label='Format text to uppercase'
					>
						<i className='format uppercase' />
					</button>
					<button
						type='button'
						onClick={() => {
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'lowercase',
							);
						}}
						className={
							'popup-item spaced ' + (isLowercase ? 'active' : '')
						}
						title='Lowercase'
						aria-label='Format text to lowercase'
					>
						<i className='format lowercase' />
					</button>
					<button
						type='button'
						onClick={() => {
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'capitalize',
							);
						}}
						className={
							'popup-item spaced ' +
							(isCapitalize ? 'active' : '')
						}
						title='Capitalize'
						aria-label='Format text to capitalize'
					>
						<i className='format capitalize' />
					</button>
					<button
						type='button'
						onClick={() => {
							editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
						}}
						className={
							'popup-item spaced ' + (isCode ? 'active' : '')
						}
						title='Insert code block'
						aria-label='Insert code block'
					>
						<i className='format code' />
					</button>
					<button
						type='button'
						onClick={insertLink}
						className={
							'popup-item spaced ' + (isLink ? 'active' : '')
						}
						title='Insert link'
						aria-label='Insert link'
					>
						<i className='format link' />
					</button>
				</>
			)}
		</FloatingTextFormatPopup>
	);
}

function useFloatingTextFormatToolbar(
	editor: LexicalEditor,
	anchorElem: HTMLElement,
	setIsLinkEditMode: Dispatch<boolean>,
): JSX.Element | null {
	const [isText, setIsText] = useState(false);
	const [isLink, setIsLink] = useState(false);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isUppercase, setIsUppercase] = useState(false);
	const [isLowercase, setIsLowercase] = useState(false);
	const [isCapitalize, setIsCapitalize] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	const [isSubscript, setIsSubscript] = useState(false);
	const [isSuperscript, setIsSuperscript] = useState(false);
	const [isCode, setIsCode] = useState(false);

	const updatePopup = useCallback(() => {
		editor.getEditorState().read(() => {
			// Should not to pop up the floating toolbar when using IME input
			if (editor.isComposing()) {
				return;
			}
			const selection = $getSelection();
			const nativeSelection = getDOMSelection(editor._window);
			const rootElement = editor.getRootElement();

			if (
				nativeSelection !== null &&
				(!$isRangeSelection(selection) ||
					rootElement === null ||
					!rootElement.contains(nativeSelection.anchorNode))
			) {
				setIsText(false);
				return;
			}

			if (!$isRangeSelection(selection)) {
				return;
			}

			const node = getSelectedNode(selection);

			// Update text format
			setIsBold(selection.hasFormat('bold'));
			setIsItalic(selection.hasFormat('italic'));
			setIsUnderline(selection.hasFormat('underline'));
			setIsUppercase(selection.hasFormat('uppercase'));
			setIsLowercase(selection.hasFormat('lowercase'));
			setIsCapitalize(selection.hasFormat('capitalize'));
			setIsStrikethrough(selection.hasFormat('strikethrough'));
			setIsSubscript(selection.hasFormat('subscript'));
			setIsSuperscript(selection.hasFormat('superscript'));
			setIsCode(selection.hasFormat('code'));

			// Update links
			const parent = node.getParent();
			if ($isLinkNode(parent) || $isLinkNode(node)) {
				setIsLink(true);
			} else {
				setIsLink(false);
			}

			if (
				!$isCodeHighlightNode(selection.anchor.getNode()) &&
				selection.getTextContent() !== ''
			) {
				setIsText($isTextNode(node) || $isParagraphNode(node));
			} else {
				setIsText(false);
			}

			const rawTextContent = selection
				.getTextContent()
				.replace(/\n/g, '');
			if (!selection.isCollapsed() && rawTextContent === '') {
				setIsText(false);
				return;
			}
		});
	}, [editor]);

	useEffect(() => {
		document.addEventListener('selectionchange', updatePopup);
		return () => {
			document.removeEventListener('selectionchange', updatePopup);
		};
	}, [updatePopup]);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(() => {
				updatePopup();
			}),
			editor.registerRootListener(() => {
				if (editor.getRootElement() === null) {
					setIsText(false);
				}
			}),
		);
	}, [editor, updatePopup]);

	if (!isText) {
		return null;
	}

	return createPortal(
		<TextFormatFloatingToolbar
			editor={editor}
			anchorElem={anchorElem}
			isLink={isLink}
			isBold={isBold}
			isItalic={isItalic}
			isUppercase={isUppercase}
			isLowercase={isLowercase}
			isCapitalize={isCapitalize}
			isStrikethrough={isStrikethrough}
			isSubscript={isSubscript}
			isSuperscript={isSuperscript}
			isUnderline={isUnderline}
			isCode={isCode}
			setIsLinkEditMode={setIsLinkEditMode}
		/>,
		anchorElem,
	);
}

export default function FloatingTextFormatToolbarPlugin({
	anchorElem = document.body,
	setIsLinkEditMode,
}: {
	anchorElem?: HTMLElement;
	setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element | null {
	const [editor] = useLexicalComposerContext();

	return useFloatingTextFormatToolbar(editor, anchorElem, setIsLinkEditMode);
}

const FloatingTextFormatPopup = styled.div`
	display: flex;
	background: #fff;
	padding: 4px;
	vertical-align: middle;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 10;
	opacity: 0;
	box-shadow: 0 5px 10px #0000004d;
	border-radius: 8px;
	transition: opacity 0.5s;
	height: 35px;
	will-change: transform;

	.popup-item {
		border: 0;
		display: flex;
		background: none;
		border-radius: 10px;
		padding: 8px;
		cursor: pointer;
		vertical-align: middle;
	}

	button.popup-item:disabled {
		cursor: not-allowed;
	}

	button.popup-item.spaced {
		margin-right: 2px;
	}

	button.popup-item i.format {
		background-size: contain;
		height: 18px;
		width: 18px;
		margin-top: -2px;
		vertical-align: -0.25em;
		display: flex;
		opacity: 0.6;
		align-items: center;
		justify-content: center;
	}

	button.popup-item:disabled i.format {
		opacity: 0.2;
	}

	button.popup-item.active {
		background-color: rgba(223, 232, 250, 0.3);
	}

	button.popup-item.active i {
		opacity: 1;
	}

	.popup-item:hover:not([disabled]) {
		background-color: #eee;
	}

	select.popup-item {
		border: 0;
		display: flex;
		background: none;
		border-radius: 10px;
		padding: 8px;
		vertical-align: middle;
		-webkit-appearance: none;
		-moz-appearance: none;
		width: 70px;
		font-size: 14px;
		color: #777;
		text-overflow: ellipsis;
	}

	select.code-language {
		text-transform: capitalize;
		width: 130px;
	}

	.popup-item .text {
		display: flex;
		line-height: 20px;
		vertical-align: middle;
		font-size: 14px;
		color: #777;
		text-overflow: ellipsis;
		width: 70px;
		overflow: hidden;
		height: 20px;
		text-align: left;
	}

	.popup-item .icon {
		display: flex;
		width: 20px;
		height: 20px;
		user-select: none;
		margin-right: 8px;
		line-height: 16px;
		background-size: contain;
	}

	i.chevron-down {
		margin-top: 3px;
		width: 16px;
		height: 16px;
		display: flex;
		user-select: none;
	}

	i.chevron-down.inside {
		width: 16px;
		height: 16px;
		display: flex;
		margin-left: -25px;
		margin-top: 11px;
		margin-right: 10px;
		pointer-events: none;
	}

	.divider {
		width: 1px;
		background-color: #eee;
		margin: 0 4px;
	}

	@media (max-width: 1024px) {
		button.insert-comment {
			display: none;
		}
	}

	i.bold {
		background-image: url(/images/rich-text-lexical/icons/type-bold.svg);
	}

	i.italic {
		background-image: url(/images/rich-text-lexical/icons/type-italic.svg);
	}

	i.underline {
		background-image: url(/images/rich-text-lexical/icons/type-underline.svg);
	}

	i.strikethrough {
		background-image: url(/images/rich-text-lexical/icons/type-strikethrough.svg);
	}

	i.subscript {
		background-image: url(/images/rich-text-lexical/icons/type-subscript.svg);
	}

	i.superscript {
		background-image: url(/images/rich-text-lexical/icons/type-superscript.svg);
	}

	i.uppercase {
		background-image: url(/images/rich-text-lexical/icons/type-uppercase.svg);
	}

	i.lowercase {
		background-image: url(/images/rich-text-lexical/icons/type-lowercase.svg);
	}

	i.capitalize {
		background-image: url(/images/rich-text-lexical/icons/type-capitalize.svg);
	}

	i.code {
		background-image: url(/images/rich-text-lexical/icons/code.svg);
	}

	i.link {
		background-image: url(/images/rich-text-lexical/icons/link.svg);
	}

	i.add-comment {
		background-image: url(/images/rich-text-lexical/icons/chat-left-text.svg);
	}
`;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';
import { $createParagraphNode, $getNearestNodeFromDOMNode } from 'lexical';
import { useRef, useState } from 'react';
import styles from './index.module.css';
import type { JSX } from 'react';

const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';

function isOnMenu(element: HTMLElement): boolean {
	return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export default function DraggableBlockPlugin({
	anchorElem = document.body,
}: {
	anchorElem?: HTMLElement;
}): JSX.Element {
	const [editor] = useLexicalComposerContext();
	const menuRef = useRef<HTMLDivElement>(null);
	const targetLineRef = useRef<HTMLDivElement>(null);
	const [draggableElement, setDraggableElement] =
		useState<HTMLElement | null>(null);

	function insertBlock(e: React.MouseEvent) {
		if (!draggableElement || !editor) {
			return;
		}

		editor.update(() => {
			const node = $getNearestNodeFromDOMNode(draggableElement);
			if (!node) {
				return;
			}

			const pNode = $createParagraphNode();
			if (e.altKey || e.ctrlKey) {
				node.insertBefore(pNode);
			} else {
				node.insertAfter(pNode);
			}
			pNode.select();
		});
	}

	return (
		<DraggableBlockPlugin_EXPERIMENTAL
			anchorElem={anchorElem}
			menuRef={menuRef}
			targetLineRef={targetLineRef}
			menuComponent={
				<div
					ref={menuRef}
					className={`${styles.icon} ${styles['draggable-block-menu']}`}
				>
					<button
						title='Click to add below'
						className={`${styles.icon} ${styles['icon-plus']}`}
						onClick={insertBlock}
						type='button'
					/>
					<div className={styles.icon} />
				</div>
			}
			targetLineComponent={
				<div
					ref={targetLineRef}
					className={styles['draggable-block-target-line']}
				/>
			}
			isOnMenu={isOnMenu}
			onElementChanged={setDraggableElement}
		/>
	);
}

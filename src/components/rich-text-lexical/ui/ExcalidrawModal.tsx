/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Excalidraw } from '@excalidraw/excalidraw';
import { isDOMNode } from 'lexical';
import * as React from 'react';
import {
	ReactPortal,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';

import Button from './Button';
import Modal from './Modal';
import styles from './ExcalidrawModal.module.css';
// Local type definitions for Excalidraw to avoid import issues
type BinaryFiles = Record<string, any>;

interface AppState {
	isLoading?: boolean;
	exportBackground?: boolean;
	exportScale?: number;
	exportWithDarkMode?: boolean;
	isBindingEnabled?: boolean;
	name?: string | null;
	theme?: 'light' | 'dark';
	viewBackgroundColor?: string;
	viewModeEnabled?: boolean;
	zenModeEnabled?: boolean;
	zoom?: any;
	[key: string]: any;
}

interface ExcalidrawImperativeAPI {
	getAppState: () => any;
	updateScene: (scene: any) => void;
	resetScene: () => void;
	getSceneElements: () => any[];
	getFiles: () => any;
	[key: string]: any;
}

type ExcalidrawInitialDataState = {
	elements?: readonly any[];
	appState?: Partial<any>;
	files?: any;
};
import type { JSX } from 'react';

export type ExcalidrawInitialElements = ExcalidrawInitialDataState['elements'];

type Props = {
	closeOnClickOutside?: boolean;
	/**
	 * The initial set of elements to draw into the scene
	 */
	initialElements: ExcalidrawInitialElements;
	/**
	 * The initial set of elements to draw into the scene
	 */
	initialAppState: AppState;
	/**
	 * The initial set of elements to draw into the scene
	 */
	initialFiles: BinaryFiles;
	/**
	 * Controls the visibility of the modal
	 */
	isShown?: boolean;
	/**
	 * Callback when closing and discarding the new changes
	 */
	onClose: () => void;
	/**
	 * Completely remove Excalidraw component
	 */
	onDelete: () => void;
	/**
	 * Callback when the save button is clicked
	 */
	onSave: (
		elements: ExcalidrawInitialElements,
		appState: Partial<AppState>,
		files: BinaryFiles,
	) => void;
};

/**
 * @explorer-desc
 * A component which renders a modal with Excalidraw (a painting app)
 * which can be used to export an editable image
 */
export default function ExcalidrawModal({
	closeOnClickOutside = false,
	onSave,
	initialElements,
	initialAppState,
	initialFiles,
	isShown = false,
	onDelete,
	onClose,
}: Props): ReactPortal | null {
	const excaliDrawModelRef = useRef<HTMLDivElement | null>(null);
	const [excalidrawAPI, setExcalidrawAPI] =
		useState<ExcalidrawImperativeAPI | null>(null);
	const [discardModalOpen, setDiscardModalOpen] = useState(false);
	const [elements, setElements] =
		useState<ExcalidrawInitialElements>(initialElements);
	const [files, setFiles] = useState<BinaryFiles>(initialFiles);

	useEffect(() => {
		excaliDrawModelRef.current?.focus();
	}, []);

	useEffect(() => {
		let modalOverlayElement: HTMLElement | null = null;

		const clickOutsideHandler = (event: MouseEvent) => {
			const target = event.target;
			if (
				excaliDrawModelRef.current !== null &&
				isDOMNode(target) &&
				!excaliDrawModelRef.current.contains(target) &&
				closeOnClickOutside
			) {
				onDelete();
			}
		};

		if (excaliDrawModelRef.current !== null) {
			modalOverlayElement = excaliDrawModelRef.current?.parentElement;
			modalOverlayElement?.addEventListener('click', clickOutsideHandler);
		}

		return () => {
			modalOverlayElement?.removeEventListener(
				'click',
				clickOutsideHandler,
			);
		};
	}, [closeOnClickOutside, onDelete]);

	useLayoutEffect(() => {
		const currentModalRef = excaliDrawModelRef.current;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onDelete();
			}
		};

		currentModalRef?.addEventListener('keydown', onKeyDown);

		return () => {
			currentModalRef?.removeEventListener('keydown', onKeyDown);
		};
	}, [elements, files, onDelete]);

	const save = () => {
		if (elements?.some((el: any) => !el.isDeleted)) {
			const appState = excalidrawAPI?.getAppState();
			// We only need a subset of the state
			const partialState: Partial<AppState> = {
				exportBackground: appState?.exportBackground,
				exportScale: appState?.exportScale,
				exportWithDarkMode: appState?.theme === 'dark',
				isBindingEnabled: appState?.isBindingEnabled,
				isLoading: appState?.isLoading,
				name: appState?.name,
				theme: appState?.theme,
				viewBackgroundColor: appState?.viewBackgroundColor,
				viewModeEnabled: appState?.viewModeEnabled,
				zenModeEnabled: appState?.zenModeEnabled,
				zoom: appState?.zoom,
			};
			onSave(elements, partialState, files);
		} else {
			// delete node if the scene is clear
			onDelete();
		}
	};

	const discard = () => {
		setDiscardModalOpen(true);
	};

	function ShowDiscardDialog(): JSX.Element {
		return (
			<Modal
				title='Discard'
				onClose={() => {
					setDiscardModalOpen(false);
				}}
				closeOnClickOutside={false}
			>
				Are you sure you want to discard the changes?
				<div className={styles['ExcalidrawModal__discardModal']}>
					<Button
						onClick={() => {
							setDiscardModalOpen(false);
							onClose();
						}}
					>
						Discard
					</Button>{' '}
					<Button
						onClick={() => {
							setDiscardModalOpen(false);
						}}
					>
						Cancel
					</Button>
				</div>
			</Modal>
		);
	}

	if (isShown === false) {
		return null;
	}

	const onChange = (els: readonly any[], _: any, fls: any) => {
		setElements(els as any);
		setFiles(fls);
	};

	return createPortal(
		<div className={styles['ExcalidrawModal__overlay']} role='dialog'>
			<div
				className={styles['ExcalidrawModal__modal']}
				ref={excaliDrawModelRef}
				tabIndex={-1}
			>
				<div className={styles['ExcalidrawModal__row']}>
					{discardModalOpen && <ShowDiscardDialog />}
					<Excalidraw
						onChange={onChange}
						excalidrawAPI={api => setExcalidrawAPI(api as any)}
						initialData={{
							appState: initialAppState || { isLoading: false },
							elements: initialElements,
							files: initialFiles,
						}}
					/>
					<div className={styles['ExcalidrawModal__actions']}>
						<button
							className={styles['action-button']}
							onClick={discard}
						>
							Discard
						</button>
						<button
							className={styles['action-button']}
							onClick={save}
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.body,
	);
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isDOMNode } from 'lexical';
import * as React from 'react';
import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import styles from './Modal.module.css';
import type { JSX } from 'react';

function PortalImpl({
	onClose,
	children,
	title,
	closeOnClickOutside,
}: {
	children: ReactNode;
	closeOnClickOutside: boolean;
	onClose: () => void;
	title: string;
}) {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (modalRef.current !== null) {
			modalRef.current.focus();
		}
	}, []);

	useEffect(() => {
		let modalOverlayElement: HTMLElement | null = null;
		const handler = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};
		const clickOutsideHandler = (event: MouseEvent) => {
			const target = event.target;
			if (
				modalRef.current !== null &&
				isDOMNode(target) &&
				!modalRef.current.contains(target) &&
				closeOnClickOutside
			) {
				onClose();
			}
		};
		const modelElement = modalRef.current;
		if (modelElement !== null) {
			modalOverlayElement = modelElement.parentElement;
			if (modalOverlayElement !== null) {
				modalOverlayElement.addEventListener(
					'click',
					clickOutsideHandler,
				);
			}
		}

		window.addEventListener('keydown', handler);

		return () => {
			window.removeEventListener('keydown', handler);
			if (modalOverlayElement !== null) {
				modalOverlayElement?.removeEventListener(
					'click',
					clickOutsideHandler,
				);
			}
		};
	}, [closeOnClickOutside, onClose]);

	return (
		<ModalOverlay className={styles['Modal__overlay']} role='dialog'>
			<div
				className={styles['Modal__modal']}
				tabIndex={-1}
				ref={modalRef}
			>
				<h2 className={styles['Modal__title']}>{title}</h2>
				<button
					className={styles['Modal__closeButton']}
					aria-label='Close modal'
					type='button'
					onClick={onClose}
				>
					X
				</button>
				<div className={styles['Modal__content']}>{children}</div>
			</div>
		</ModalOverlay>
	);
}

export default function Modal({
	onClose,
	children,
	title,
	closeOnClickOutside = false,
}: {
	children: ReactNode;
	closeOnClickOutside?: boolean;
	onClose: () => void;
	title: string;
}): JSX.Element {
	return createPortal(
		<PortalImpl
			onClose={onClose}
			title={title}
			closeOnClickOutside={closeOnClickOutside}
		>
			{children}
		</PortalImpl>,
		document.body,
	);
}

const ModalOverlay = styled.div`
	.dialog-dropdown {
		background-color: #eee !important;
		margin-bottom: 10px;
		width: 100%;
	}

	button.toolbar-item {
		border: 0;
		display: flex;
		background: none;
		border-radius: 10px;
		padding: 8px;
		cursor: pointer;
		vertical-align: middle;
		flex-shrink: 0;
		align-items: center;
		justify-content: space-between;
	}

	button.toolbar-item:hover {
		background: #f0f0f0;
	}

	button.toolbar-item:active {
		background: #e0e0e0;
	}

	button.toolbar-item:focus {
		outline: 2px solid #007bff;
		outline-offset: 2px;
	}

	button.toolbar-item:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button.toolbar-item:disabled:hover {
		background: none;
	}

	button.toolbar-item:disabled:focus {
		outline: none;
	}

	button.toolbar-item:disabled:active {
		background: none;
	}
`;

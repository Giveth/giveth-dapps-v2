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
		<div className={styles['Modal__overlay']} role='dialog'>
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
		</div>
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

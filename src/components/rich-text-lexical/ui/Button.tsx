/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import joinClasses from '../utils/joinClasses';
import styles from './Button.module.css';
import type { JSX, ReactNode } from 'react';

export default function Button({
	'data-test-id': dataTestId,
	children,
	className,
	onClick,
	disabled,
	small,
	title,
}: {
	'data-test-id'?: string;
	children: ReactNode;
	className?: string;
	disabled?: boolean;
	onClick: () => void;
	small?: boolean;
	title?: string;
}): JSX.Element {
	return (
		<button
			disabled={disabled}
			className={joinClasses(
				styles['Button__root'],
				disabled && styles['Button__disabled'],
				small && styles['Button__small'],
				className,
			)}
			onClick={onClick}
			title={title}
			aria-label={title}
			{...(dataTestId && { 'data-test-id': dataTestId })}
		>
			{children}
		</button>
	);
}

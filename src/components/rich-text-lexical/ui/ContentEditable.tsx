/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import * as React from 'react';
import styles from './ContentEditable.module.css';
import type { JSX } from 'react';

type Props = {
	className?: string;
	placeholderClassName?: string;
	placeholder: string;
};

export default function LexicalContentEditable({
	className,
	placeholder,
	placeholderClassName,
}: Props): JSX.Element {
	return (
		<ContentEditable
			className={className ?? styles['ContentEditable__root']}
			aria-placeholder={placeholder}
			placeholder={
				<div
					className={
						placeholderClassName ??
						styles['ContentEditable__placeholder']
					}
				>
					{placeholder}
				</div>
			}
		/>
	);
}

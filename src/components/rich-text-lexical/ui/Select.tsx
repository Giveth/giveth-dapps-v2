/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import styles from './Select.module.css';
import type { JSX } from 'react';

type SelectIntrinsicProps = JSX.IntrinsicElements['select'];
interface SelectProps extends SelectIntrinsicProps {
	label: string;
}

export default function Select({
	children,
	label,
	className,
	...other
}: SelectProps): JSX.Element {
	return (
		<div
			className={`${styles['Input__wrapper']} ${styles['selectWrapper']}`}
		>
			<label
				style={{ marginTop: '-1em' }}
				className={styles['Input__label']}
			>
				{label}
			</label>
			<select
				{...other}
				className={
					className || `${styles['select-main']} ${styles['select']}`
				}
			>
				{children}
			</select>
		</div>
	);
}

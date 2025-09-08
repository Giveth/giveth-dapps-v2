/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import styled from 'styled-components';
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
		<SelectWrapper>
			<label style={{ marginTop: '-1em' }} className='Input__label'>
				{label}
			</label>
			<select {...other} className={className || `select-main select`}>
				{children}
			</select>
		</SelectWrapper>
	);
}

const SelectWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 10px;
	--select-border: #393939;
	--select-focus: #101484;

	.Input__label {
		display: flex;
		flex: 1;
		color: #666;
	}

	.select {
		padding: 3em 2em;
		min-width: 160px;
		max-width: 290px;
		border: 1px solid #393939;
		border-radius: 0.25em;
		padding: 0.25em 0.5em;
		font-size: 1rem;
		cursor: pointer;
		line-height: 1.4;
		background: linear-gradient(to bottom, #fff, #e5e5e5);
	}
`;

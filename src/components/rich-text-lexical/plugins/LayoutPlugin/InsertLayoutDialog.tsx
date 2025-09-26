/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LexicalEditor } from 'lexical';
import * as React from 'react';
import { useState } from 'react';

import styled from 'styled-components';
import Button from '../../ui/Button';
import DropDown, { DropDownItem } from '../../ui/DropDown';
import { INSERT_LAYOUT_COMMAND } from './LayoutPlugin';
import type { JSX } from 'react';

const LAYOUTS = [{ label: '2 columns (equal width)', value: '1fr 1fr' }];

export default function InsertLayoutDialog({
	activeEditor,
	onClose,
}: {
	activeEditor: LexicalEditor;
	onClose: () => void;
}): JSX.Element {
	const [layout, setLayout] = useState(LAYOUTS[0].value);
	const buttonLabel = LAYOUTS.find(item => item.value === layout)?.label;

	const onClick = () => {
		activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, layout);
		onClose();
	};

	return (
		<>
			<DropDownWrapper>
				<DropDown
					buttonClassName='button-toolbar-item dialog-dropdown'
					buttonLabel={buttonLabel}
				>
					{LAYOUTS.map(({ label, value }) => (
						<DropDownItem
							key={value}
							className='item'
							onClick={() => setLayout(value)}
						>
							<span className='text'>{label}</span>
						</DropDownItem>
					))}
				</DropDown>
			</DropDownWrapper>
			<Button onClick={onClick}>Insert</Button>
		</>
	);
}

const DropDownWrapper = styled.div`
	margin-bottom: 10px;
	min-width: 300px;

	button.dialog-dropdown {
		border: 0 !important;
		display: flex;
		background: none;
		border-radius: 10px;
		padding: 14px !important;
		cursor: pointer;
		vertical-align: middle;
		flex-shrink: 0;
		align-items: center;
		justify-content: space-between;
		background-color: #eee !important;
		margin-bottom: 10px;
		width: 100%;
		margin: 0em 0em 0em 0em;
		padding-block: 1px;
		padding-inline: 6px;

		&:disabled {
			cursor: not-allowed;
		}

		&.spaced {
			margin-right: 2px;
		}
	}

	.dropdown {
		z-index: 100;
		display: block;
		position: fixed;
		box-shadow:
			0 12px 28px #0003,
			0 2px 4px #0000001a,
			inset 0 0 0 1px #ffffff80;
		border-radius: 8px;
		min-height: 40px;
		background-color: #fff;
	}

	.dropdown .item {
		margin: 0 8px;
		padding: 8px;
		color: #050505;
		cursor: pointer;
		line-height: 16px;
		font-size: 15px;
		display: flex;
		align-content: center;
		flex-direction: row;
		flex-shrink: 0;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 8px;
		border: 0;
		max-width: 264px;
		min-width: 100px;
	}

	.dropdown .item.wide {
		align-items: center;
		width: 260px;
	}

	.dropdown .item.wide .icon-text-container {
		display: flex;
	}

	.dropdown .item.wide .icon-text-container .text {
		min-width: 120px;
	}

	.dropdown .item .shortcut {
		color: #939393;
		align-self: flex-end;
	}

	.dropdown .item .active {
		display: flex;
		width: 20px;
		height: 20px;
		background-size: contain;
	}

	.dropdown .item:first-child {
		margin-top: 8px;
	}

	.dropdown .item:last-child {
		margin-bottom: 8px;
	}

	.dropdown .item:hover {
		background-color: #eee;
	}

	.dropdown .item .text {
		display: flex;
		line-height: 20px;
		flex-grow: 1;
		min-width: 150px;
	}

	.dropdown .item .icon {
		display: flex;
		width: 20px;
		height: 20px;
		-webkit-user-select: none;
		user-select: none;
		margin-right: 12px;
		line-height: 16px;
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
	}

	.dropdown .divider {
		width: auto;
		background-color: #eee;
		margin: 4px 8px;
		height: 1px;
	}

	@media screen and (max-width: 1100px) {
		.dropdown-button-text {
			display: none !important;
		}

		.dialog-dropdown > .dropdown-button-text {
			display: flex !important;
		}

		.font-size .dropdown-button-text,
		.code-language .dropdown-button-text {
			display: flex !important;
		}
	}
`;

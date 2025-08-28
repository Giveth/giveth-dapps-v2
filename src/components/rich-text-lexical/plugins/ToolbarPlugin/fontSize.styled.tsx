import styled from 'styled-components';

import DropDown from '@/components/rich-text-lexical/ui/DropDown';

export const DropDownHolder = styled(DropDown)`
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

	&:disabled {
		cursor: not-allowed;
	}

	&.spaced {
		margin-right: 2px;
	}

	i.format {
		background-size: contain;
		display: inline-block;
		height: 18px;
		width: 18px;
		vertical-align: -0.25em;
		display: flex;
		opacity: 0.6;
	}

	&:disabled .icon,
	&:disabled .text,
	&:disabled i.format,
	&:disabled .chevron-down {
		opacity: 0.2;
	}

	&.active {
		background-color: rgba(223, 232, 250, 0.3);
	}

	&.active i {
		opacity: 1;
	}

	&:hover:not([disabled]) {
		background-color: #eee;
	}

	.font-family .text {
		display: block;
		max-width: 40px;
	}

	i.format {
		background-size: contain;
		display: inline-block;
		height: 18px;
		width: 18px;
		vertical-align: -0.25em;
		display: flex;
		opacity: 0.6;
	}

	.font-size-input {
		font-weight: bold;
		font-size: 14px;
		color: #777;
		border-radius: 5px;
		border-color: grey;
		height: 15px;
		padding: 2px 4px;
		text-align: center;
		width: 20px;
		align-self: center;
	}

	.font-size-input:disabled {
		opacity: 0.2;
		cursor: not-allowed;
	}

	.fontSizeInput::-webkit-outer-spin-button,
	.fontSizeInput::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}

	.add-icon {
		background-image: url(./images/rich-text-lexical/icons/add-sign.svg);
		background-repeat: no-repeat;
		background-position: center;
	}

	.minus-icon {
		background-image: url(./images/rich-text-lexical/icons/minus-sign.svg);
		background-repeat: no-repeat;
		background-position: center;
	}

	button.font-decrement {
		padding: 0px;
		margin-right: 3px;
	}
	button.font-increment {
		padding: 0px;
		margin-left: 3px;
	}

	.toolbar-item {
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

	.toolbar-item:disabled {
		cursor: not-allowed;
	}

	.format {
		background-size: contain;
		display: inline-block;
		height: 18px;
		width: 18px;
		margin-top: 2px;
		vertical-align: -0.25em;
		display: flex;
		opacity: 0.6;
	}
`;

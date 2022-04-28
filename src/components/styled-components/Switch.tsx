import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { brandColors, neutralColors } from '@giveth/ui-design-system';

interface IToggleSwitch {
	checked: boolean;
	disabled: boolean;
	setStateChange: Dispatch<SetStateAction<boolean>>;
}

const ToggleSwitch = ({ checked, disabled, setStateChange }: IToggleSwitch) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
		setStateChange(e.target.checked);

	return (
		<Label>
			<Input
				checked={checked}
				disabled={disabled}
				type='checkbox'
				onChange={handleChange}
			/>

			<Switch checked={checked} disabled={disabled} />
		</Label>
	);
};

const Label = styled.label`
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
`;

const Switch = styled.div<{ checked: boolean; disabled: boolean }>`
	position: relative;
	width: 30px;
	height: 16px;
	background: ${props =>
		props.disabled ? neutralColors.gray[700] : brandColors.giv[700]};
	border-radius: 32px;
	padding: 1px;
	transition: 300ms all;
	&:before {
		transition: 300ms all;
		content: '';
		position: absolute;
		width: 11px;
		height: 11px;
		border-radius: 7px;
		top: 50%;
		left: 1px;
		background: ${props =>
			props.checked
				? brandColors.pinky[500]
				: props.disabled
				? neutralColors.gray[200]
				: brandColors.pinky[200]};
		border: 3px solid ${brandColors.giv['000']};
		border-radius: 50%;
		transform: translate(0, -50%);
	}
`;

const Input = styled.input`
	display: none;
	&:checked + ${Switch} {
		&:before {
			transform: translate(14px, -50%);
		}
	}
`;

export default ToggleSwitch;

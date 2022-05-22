import React, { FC } from 'react';
import {
	GLink,
	neutralColors,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Input } from '@/components/styled-components/Input';
import { Relative } from '@/components/styled-components/Position';

interface IInputBox {
	onChange?: (i: string) => void;
	value: string;
	disabled?: boolean;
	label?: string;
	error?: string;
	placeholder?: string;
	maxLength?: number;
}

const InputBox: FC<IInputBox> = ({
	onChange,
	value,
	disabled,
	label,
	error,
	placeholder,
	maxLength,
}) => {
	return (
		<div>
			{label && <Label disabled={disabled}>{label}</Label>}
			<Relative>
				<Input
					onChange={i => onChange && onChange(i.target.value)}
					value={value}
					disabled={disabled}
					placeholder={placeholder}
					maxLength={maxLength}
					error={!!error}
				/>
				{maxLength && (
					<CharLength>
						{value.length}/{maxLength}
					</CharLength>
				)}
			</Relative>
			{error && <InputErrorMessage>{error}</InputErrorMessage>}
		</div>
	);
};

const Label = styled(GLink)<{ disabled?: boolean }>`
	color: ${props =>
		props.disabled ? neutralColors.gray[600] : neutralColors.gray[900]};
`;

export const InputErrorMessage = styled.div`
	color: ${semanticColors.punch[500]};
	font-size: 12px;
	margin-top: 5px;
	word-break: break-word;
`;

const CharLength = styled(SublineBold)`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 12px;
	background: ${neutralColors.gray[300]};
	color: ${neutralColors.gray[700]};
	font-weight: 500;
	border-radius: 64px;
	width: 52px;
	height: 30px;
	position: absolute;
	right: 16px;
	top: 0;
	bottom: 0;
	margin: auto 0;
`;

export default InputBox;

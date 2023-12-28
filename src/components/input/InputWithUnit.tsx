import { type FC } from 'react';
import styled from 'styled-components';
import { BaseInput } from './BaseInput';

interface IInputWithUnitProps {
	placeholder?: string;
	unit: string;
	value: string;
	onChange?: any;
	type?: string;
}

export const InputWithUnit: FC<IInputWithUnitProps> = ({
	placeholder,
	unit,
	value,
	onChange,
	type,
}) => {
	return (
		<InputContainer>
			<BaseInput
				type={type}
				placeholder={placeholder}
				value={value}
				onUserInput={onChange}
			/>
			<Unit>{unit}</Unit>
		</InputContainer>
	);
};

const Unit = styled.span`
	padding-right: 10px;
	color: #cabaff;
`;

const InputContainer = styled.div`
	background: #310bb5;
	border-radius: 34px;
	padding: 10px 10px 10px 32px;
	height: 68px;
	display: flex;
	width: 100%;
	align-items: center;
	margin: 8px 0;
`;

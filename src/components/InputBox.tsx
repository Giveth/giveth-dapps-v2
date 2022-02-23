import React, { useState } from 'react';
import {
	neutralColors,
	brandColors,
	semanticColors,
	B,
	GLink,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

type OnChangeFunction = (e: any) => void;

interface IInputBox {
	error: boolean;
}

const InputBox = (props: {
	value: string;
	onChange: OnChangeFunction;
	placeholder?: string;
	type?: string;
	errorHandler?: any;
	setError?: any;
	error?: any;
	onFocus?: any;
}) => {
	const {
		value,
		onChange,
		error,
		setError,
		errorHandler,
		type,
		placeholder,
		onFocus,
	} = props;
	return (
		<Box>
			<Wrapper>
				<B className='w-100 mr-2' color={neutralColors.gray[900]}>
					<Input
						id='input-box'
						value={value}
						type={type}
						onChange={(e: any) => {
							onChange(e.target.value);
							setError(
								errorHandler &&
									errorHandler?.condition(e.target.value),
							);
						}}
						onFocus={() => onFocus(true)}
						onBlur={() => onFocus(false)}
						placeholder={placeholder || 'Search Projects...'}
					/>
				</B>
			</Wrapper>
			{error && <ErrorMsg>{errorHandler?.message}</ErrorMsg>}
		</Box>
	);
};

const Box = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
`;

const Input = styled.input`
	border-width: 0;
	height: 100%;
	width: 100%;
	font-size: 16px;
	font-weight: inherit;
	background: inherit;
	font-family: inherit;

	&:focus {
		outline: none;
	}

	&::placeholder {
		color: ${neutralColors.gray[500]};
		font-size: 16px;
	}
`;

const Wrapper = styled.div`
	min-width: 320px;
	padding: 5px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 0 auto;

	height: 54px;
	* {
		width: 90%;
	}

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
`;

const ErrorMsg = styled(GLink)`
	position: absolute;
	margin-top: 58px;
	color: ${semanticColors.punch[500]};
`;

export default InputBox;

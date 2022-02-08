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
	onChange: OnChangeFunction;
	placeholder?: string;
	type?: string;
	errorHandler?: any;
}) => {
	const { onChange, errorHandler, type, placeholder } = props;
	const [error, setError] = useState<boolean>(false);
	return (
		<Box>
			<Wrapper error={error}>
				<B className='w-100 mr-2' color={neutralColors.gray[900]}>
					<Input
						type={type}
						onChange={(e: any) => {
							onChange(e.target.value);
							setError(
								errorHandler &&
									errorHandler?.condition(e.target.value),
							);
						}}
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
	font-weight: inherit;
	background: inherit;
	font-family: inherit;

	&:focus {
		outline: none;
	}

	&::placeholder {
		color: ${neutralColors.gray[500]};
	}
`;

const Wrapper = styled.div`
	min-width: 343px;
	padding: 5px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 0 auto;

	height: 54px;
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 0px 6px 6px 0px;
	* {
		width: 90%;
	}

	:active,
	:hover {
		border-color: ${(props: IInputBox) =>
			props.error === true
				? semanticColors.punch[500]
				: brandColors.giv[500]};
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
	color: ${semanticColors.punch[500]};
`;

export default InputBox;

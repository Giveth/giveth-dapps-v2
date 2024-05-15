import React, { FC, useEffect } from 'react';
import {
	neutralColors,
	semanticColors,
	B,
	GLink,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import useFocus from '@/hooks/useFocus';

interface IInputBox {
	value?: number;
	onChange: (e: number | undefined) => void;
	error?: boolean;
	onFocus: (i: boolean) => void;
	disabled?: boolean;
	className?: string;
}

const InputBox: FC<IInputBox> = ({
	value,
	onChange,
	error,
	onFocus,
	disabled,
	className,
}) => {
	const { formatMessage } = useIntl();
	const [inputRef, setFocus] = useFocus();

	useEffect(() => {
		setTimeout(() => setFocus(), 1000);
	}, []);

	return (
		<Box className={className}>
			<Wrapper>
				<Input
					id='input-box'
					value={value ?? ''}
					type='number'
					onChange={e => {
						const _value = e.target.value;
						const num =
							_value === '' ? undefined : Number(e.target.value);
						onChange(num);
					}}
					ref={inputRef}
					onFocus={() => onFocus(true)}
					onBlur={() => onFocus(false)}
					placeholder={formatMessage({ id: 'label.amount' })}
					disabled={disabled}
					onWheel={e => e.currentTarget.blur()}
				/>
			</Wrapper>
			{error && (
				<ErrorMsg>
					{formatMessage({ id: 'label.amount_is_too_small' })}
				</ErrorMsg>
			)}
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

const Wrapper = styled(B)`
	padding: 5px 16px;
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

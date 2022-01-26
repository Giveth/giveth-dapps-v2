import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { neutralColors, brandColors } from '@giveth/ui-design-system';

interface IHasBG {
	bg?: false;
}

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

const Input = styled.input`
	border: 0;
	background: #310bb5;
	color: white;
	flex: 1;
	font-size: 18px;
	line-height: 160%;
	::placeholder {
		color: white;
	}
	::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

const Unit = styled.span`
	padding-right: 10px;
	color: #cabaff;
`;

const Button = styled.button<IHasBG>`
	border: 0;
	border-radius: 24px;
	height: 48px;
	background: ${props => (props.bg ? props.bg : '#1B1657')};
	color: #ffffff;
	padding: 16px 32px;
	font-style: normal;
	font-weight: bold;
	font-size: 12px;
	line-height: 18px;
	text-transform: uppercase;
	cursor: pointer;
`;

interface IWalletAddressInputWithButtonProps {
	placeholder?: string;
	btnLable?: string;
	onSubmit: (address: string) => {};
	onUpdate?: () => void;
	walletAddress?: string;
	disabled?: boolean;
}

export const WalletAddressInputWithButton: FC<
	IWalletAddressInputWithButtonProps
> = ({
	placeholder,
	btnLable,
	onSubmit,
	walletAddress = '',
	disabled = false,
	onUpdate = () => {},
}) => {
	const [value, setValue] = useState<string>(walletAddress);

	useEffect(() => {
		setValue(walletAddress);
	}, [walletAddress]);

	const onValueChange = (e: any) => {
		onUpdate();
		setValue(e.target.value);
	};

	return (
		<InputContainer>
			<Input
				placeholder={placeholder}
				value={value}
				onChange={onValueChange}
				disabled={disabled}
			/>
			<Button onClick={() => onSubmit(value)} disabled={disabled}>
				{btnLable}
			</Button>
		</InputContainer>
	);
};

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Shamelessly copied from Sushiswap front-end
const BaseInput = React.memo(
	({
		value,
		onUserInput,
		placeholder,
		...rest
	}: {
		value: string;
		onUserInput: (input: string) => void;
		error?: boolean;
		fontSize?: string;
		align?: 'right' | 'left';
	} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
		const enforcer = (nextUserInput: string) => {
			if (
				nextUserInput === '' ||
				inputRegex.test(escapeRegExp(nextUserInput))
			) {
				onUserInput(nextUserInput);
			}
		};

		return (
			<Input
				{...rest}
				value={value}
				onChange={event => {
					// replace commas with periods, because uniswap exclusively uses period as the decimal separator
					enforcer(event.target.value.replace(/,/g, '.'));
				}}
				// universal input options
				inputMode='decimal'
				title='Token Amount'
				autoComplete='off'
				autoCorrect='off'
				// text-specific options
				type='text'
				pattern='^[0-9]*[.,]?[0-9]*$'
				placeholder={placeholder || '0.0'}
				min={0}
				minLength={1}
				maxLength={79}
				spellCheck='false'
				tabIndex={-1}
			/>
		);
	},
);

BaseInput.displayName = 'BaseInput';

export const NumericalInput = styled(BaseInput)`
	width: 100%;
	height: 54px;
	padding: 15px 16px;
	margin-top: 10px;
	margin-bottom: 8px;

	background: ${brandColors.giv[700]};
	color: ${neutralColors.gray[100]};

	border: 1px solid ${brandColors.giv[500]};
	border-radius: 8px;

	font-family: Red Hat Text;
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 150%;

	&:focus {
		outline: none;
	}
	&[type='number'] {
		-moz-appearance: textfield;
	}
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	${props => (props.disabled ? `color: ${brandColors.giv[300]};` : '')}
`;

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

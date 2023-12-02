import { memo } from 'react';
import styled from 'styled-components';

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Shamelessly copied from Sushiswap front-end
export const BaseInput = memo(
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

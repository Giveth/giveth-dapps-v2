import { neutralColors, B } from '@giveth/ui-design-system';
import styled from 'styled-components';

type OnChangeFunction = (e: any) => void;

const InputBox = (props: {
	onChange: OnChangeFunction;
	placeholder?: string;
	type?: string;
}) => {
	const { onChange, type, placeholder } = props;
	return (
		<Wrapper>
			<B className='w-100 mr-2' color={neutralColors.gray[900]}>
				<Input
					type={type}
					onChange={(e: any) => onChange(e.target.value)}
					placeholder={placeholder || 'Search Projects...'}
				/>
			</B>
		</Wrapper>
	);
};

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
	max-width: 610px;
	height: 54px;
	padding: 5px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 0 auto;

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

export default InputBox;

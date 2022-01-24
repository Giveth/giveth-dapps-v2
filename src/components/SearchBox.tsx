import Image from 'next/image';
import SearchIcon from '/public/images/search.svg';
import { neutralColors, B } from '@giveth/ui-design-system';
import styled from 'styled-components';

const SearchBox = (props: {
	onChange: (e: string) => void;
	placeholder?: string;
}) => {
	const { onChange, placeholder } = props;
	return (
		<Wrapper>
			<InputWrapper
				className='w-100 mr-2'
				color={neutralColors.gray[900]}
			>
				<Input
					onChange={e => onChange(e.target.value)}
					placeholder={placeholder || 'Search ...'}
				/>
			</InputWrapper>
			<Image src={SearchIcon} alt='Search Icon' />
		</Wrapper>
	);
};

const Input = styled.input`
	border-width: 0;
	height: 100%;
	width: 100%;
	font-weight: inherit;
	border-right: 1px solid ${neutralColors.gray[400]};
	background: inherit;
	font-family: inherit;

	&:focus {
		outline: none;
	}

	&::placeholder {
		color: ${neutralColors.gray[500]};
	}
`;

const InputWrapper = styled(B)`
	width: 100%;
	margin-right: 0.5rem;
`;

const Wrapper = styled.div`
	min-width: 343px;
	max-width: 610px;
	height: 54px;
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	padding: 5px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-left: auto;
	background: white;
`;

export default SearchBox;

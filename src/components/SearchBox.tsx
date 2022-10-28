import Image from 'next/image';
import { brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import SearchIcon from '/public/images/search.svg';
import { FlexCenter } from './styled-components/Flex';

const SearchBox = (props: {
	onChange: (e: string) => void;
	placeholder?: string;
	value: string;
}) => {
	const { onChange, placeholder, value } = props;
	const { formatMessage } = useIntl();

	return (
		<Wrapper>
			<Input
				onChange={e => onChange(e.target.value)}
				placeholder={
					placeholder ||
					`${formatMessage({ id: 'label.search' })} ...`
				}
				value={value}
			/>
			<Border />
			<Search>
				<Image src={SearchIcon} alt='Search Icon' />
			</Search>
		</Wrapper>
	);
};

const Search = styled(FlexCenter)`
	flex-shrink: 0;
`;

const Border = styled.div`
	border-right: 1px solid ${neutralColors.gray[400]};
	margin-right: 10px;
	margin-left: 10px;
	height: 22px;
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
	min-width: 150px;
	width: 100%;
	height: 54px;
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	padding: 5px 16px;
	display: flex;
	align-items: center;
	margin: 0 auto;
	background: white;

	&:focus-within {
		border: 2px solid ${brandColors.giv[600]};
	}
`;

export default SearchBox;

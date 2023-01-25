import {
	brandColors,
	ButtonText,
	IconSearch24,
	neutralColors,
} from '@giveth/ui-design-system';
import {
	Dispatch,
	SetStateAction,
	FC,
	KeyboardEvent,
	ChangeEvent,
	useState,
} from 'react';
import styled, { css } from 'styled-components';
import { ETheme } from '@/features/general/general.slice';
import { Flex } from './styled-components/Flex';
import { useAppSelector } from '@/features/hooks';

interface ISearchInputProps {
	setTerm: Dispatch<SetStateAction<string | undefined>>;
	className?: string;
}

export const SearchInput: FC<ISearchInputProps> = ({ setTerm, className }) => {
	const [value, setValue] = useState<string>('');
	const theme = useAppSelector(state => state.general.theme);

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.code === 'Enter' && value.length > 3) {
			setTerm(value);
		}
	}

	function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
		setValue(event.target.value);
	}

	return (
		<SearchInputContainer className={className} theme={theme}>
			<InputContainer theme={theme} onKeyDown={handleKeyDown}>
				<StyledInput
					onChange={handleOnChange}
					as='input'
					placeholder='Search for project...'
					theme={theme}
					value={value}
				/>
				<IconWrapper>
					<IconSearch24 />
				</IconWrapper>
			</InputContainer>
			<Flex>
				<Hint />
			</Flex>
		</SearchInputContainer>
	);
};

const SearchInputContainer = styled.div``;

const InputContainer = styled(Flex)`
	position: relative;
`;

const StyledInput = styled(ButtonText)`
	border: none;
	background-color: inherit;
	flex: 1;
	padding: 16px 48px 16px 24px;
	border-radius: 30px;
	${props =>
		props.theme === ETheme.Dark
			? css`
					background-color: ${brandColors.giv[600]};
					border: 1px solid ${brandColors.giv[500]};
					color: ${neutralColors.gray[100]};
					::placeholder {
						color: ${brandColors.giv[300]};
					}
			  `
			: css`
					background-color: ${neutralColors.gray[100]};
					border: 1px solid ${neutralColors.gray[400]};
					color: ${neutralColors.gray[900]};
					::placeholder {
						color: ${neutralColors.gray[700]};
					}
			  `}
`;

const IconWrapper = styled.div`
	width: 24px;
	height: 24px;
	position: absolute;
	top: 14px;
	right: 16px;
`;

const Hint = styled(ButtonText)``;

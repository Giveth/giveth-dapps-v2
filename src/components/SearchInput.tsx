import {
	brandColors,
	ButtonText,
	IconAlertCircle16,
	IconEnter24,
	IconSearch24,
	IconX24,
	neutralColors,
} from '@giveth/ui-design-system';
import {
	Dispatch,
	SetStateAction,
	FC,
	KeyboardEvent,
	ChangeEvent,
	useState,
	useEffect,
	useRef,
} from 'react';
import styled, { css } from 'styled-components';
import { useIntl } from 'react-intl';
import { ETheme } from '@/features/general/general.slice';
import { Flex } from './styled-components/Flex';
import { useAppSelector } from '@/features/hooks';

interface ISearchInputProps {
	setTerm: Dispatch<SetStateAction<string>>;
	className?: string;
}

export const SearchInput: FC<ISearchInputProps> = ({ setTerm, className }) => {
	const [value, setValue] = useState<string>('');
	const inputRef = useRef<HTMLInputElement>(null);
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.code === 'Enter' && value.length > 2) {
			setTerm(value);
		}
	}

	function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
		setValue(event.target.value);
	}

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [inputRef.current]);

	return (
		<SearchInputContainer className={className} theme={theme}>
			<InputContainer theme={theme} onKeyDown={handleKeyDown}>
				<StyledInput
					onChange={handleOnChange}
					as='input'
					placeholder={formatMessage({
						id: 'label.search_for_project',
					})}
					theme={theme}
					value={value}
					ref={inputRef}
				/>
				{value.length > 0 ? (
					<IconRemoveWrapper
						onClick={() => {
							setValue('');
							setTerm('');
						}}
					>
						<IconX24 />
					</IconRemoveWrapper>
				) : (
					<IconWrapper>
						<IconSearch24 />
					</IconWrapper>
				)}
			</InputContainer>
			<HintRow>
				{value.length > 0 ? (
					value.length > 2 ? (
						<>
							<Hint>
								{formatMessage({
									id: 'label.press_enter_to_search',
								})}
							</Hint>
							<IconEnter24 />
						</>
					) : (
						<>
							<Hint>
								{formatMessage({
									id: 'label.minimum_three_characters',
								})}
							</Hint>
							<IconAlertCircle16 />
						</>
					)
				) : (
					''
				)}
			</HintRow>
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

const IconRemoveWrapper = styled(IconWrapper)`
	cursor: pointer;
`;

const HintRow = styled(Flex)`
	height: 24px;
	align-items: center;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 4px;
	padding: 4px;
	color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[300]
			: neutralColors.gray[600]};
`;
const Hint = styled(ButtonText)``;

import {
	brandColors,
	ButtonText,
	IconAlertCircle16,
	IconEnter24,
	IconSearch24,
	IconX24,
	neutralColors,
	Flex,
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
import { useIntl } from 'react-intl';
import { ETheme } from '@/features/general/general.slice';
import { useAppSelector } from '@/features/hooks';
import useFocus from '@/hooks/useFocus';

interface ISearchInputProps {
	setTerm: Dispatch<SetStateAction<string>>;
	className?: string;
}

export const SearchInput: FC<ISearchInputProps> = ({ setTerm, className }) => {
	const [value, setValue] = useState<string>('');
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

	function handleFormSubmit(inputValue: string) {
		if (inputValue.length > 2) {
			setTerm(inputValue);
		}
	}

	const [inputRef] = useFocus();

	return (
		<SearchInputContainer className={className}>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleFormSubmit(value);
				}}
			>
				<InputContainer onKeyDown={handleKeyDown}>
					<StyledInput
						onChange={handleOnChange}
						as='input'
						placeholder={formatMessage({
							id: 'label.search_for_project_or_cause',
						})}
						$baseTheme={theme}
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
			</form>
			<HintRow $baseTheme={theme}>
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

const StyledInput = styled(ButtonText)<{ $baseTheme?: ETheme }>`
	border: none;
	background-color: inherit;
	flex: 1;
	padding: 16px 48px 16px 24px;
	border-radius: 30px;
	${props =>
		props.$baseTheme === ETheme.Dark
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

const HintRow = styled(Flex)<{ $baseTheme?: ETheme }>`
	height: 24px;
	align-items: center;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 4px;
	padding: 4px;
	color: ${props =>
		props.$baseTheme === ETheme.Dark
			? brandColors.giv[300]
			: neutralColors.gray[600]};
`;
const Hint = styled(ButtonText)``;

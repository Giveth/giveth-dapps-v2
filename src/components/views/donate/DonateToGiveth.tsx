import {
	brandColors,
	Caption,
	GLink,
	IconHelpFilled16,
	mediaQueries,
	neutralColors,
	Subline,
	Flex,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ChangeEvent, FC } from 'react';
import { useIntl } from 'react-intl';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import Input, { InputSize } from '@/components/Input';
import { InputSuffix } from '@/components/styled-components/Input';
import CheckBox from '@/components/Checkbox';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { useDonateData } from '@/context/donate.context';

interface IDonateToGiveth {
	donationToGiveth: number;
	givethDonationAmount?: number;
	setDonationToGiveth: (donationToGiveth: number) => void;
	title: string;
}

const givethDonationOptions = [5, 10, 15, 20];

const DonateToGiveth: FC<IDonateToGiveth> = ({
	donationToGiveth,
	givethDonationAmount,
	setDonationToGiveth,
	title,
}) => {
	const { formatMessage } = useIntl();

	const { selectedOneTimeToken } = useDonateData();

	const { isConnected } = useGeneralWallet();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newPercentage = +e.target.value;
		if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 90)
			return;
		setDonationToGiveth(newPercentage);
	};

	const handleCheckbox = (e: boolean) => {
		setDonationToGiveth(e ? 0 : 5);
	};

	// If givethDonationAmount props provided check if it's 0 and set donationToGiveth to 0
	// because we disabled percentage amount for minimal allowed main donation amount
	if (givethDonationAmount !== undefined) {
		donationToGiveth = givethDonationAmount === 0 ? 0 : donationToGiveth;
	}

	return (
		<Container disabled={!isConnected || !selectedOneTimeToken}>
			<Flex $alignItems='center' gap='4px'>
				<Caption $medium>{title}</Caption>
				<IconWithTooltip icon={<IconHelpFilled16 />} direction='top'>
					<TooltipContainer>
						{formatMessage({ id: 'label.support_giveth_with' })}
					</TooltipContainer>
				</IconWithTooltip>
			</Flex>
			<UserInput>
				<Options>
					{givethDonationOptions.map(option => (
						<OptionWrapper
							$isSelected={donationToGiveth === option}
							key={option}
							onClick={() => setDonationToGiveth(option)}
						>
							{option}%
						</OptionWrapper>
					))}
				</Options>
				<StyledInput
					value={donationToGiveth}
					onChange={handleChange}
					size={InputSize.SMALL}
					suffix={
						<Percentage $inputSize={InputSize.SMALL}>%</Percentage>
					}
				/>
			</UserInput>
			<CheckBox
				size={14}
				checked={donationToGiveth === 0}
				onChange={handleCheckbox}
				label={formatMessage({
					id: 'label.i_dont_want_to_support_giveth',
				})}
				labelSize='Small'
			/>
		</Container>
	);
};

const TooltipContainer = styled(Subline)`
	${mediaQueries.tablet} {
		width: 274px;
	}
	padding: 0 10px;
`;

const UserInput = styled(Flex)`
	margin-top: 16px;
	justify-content: space-between;
	gap: 10px;
	flex-wrap: wrap;
`;

const StyledInput = styled(Input)`
	width: 90px;
	flex: none;
`;

const Percentage = styled(InputSuffix)`
	color: ${neutralColors.gray[800]};
	user-select: none;
`;

const OptionWrapper = styled(GLink)<{ $isSelected: boolean }>`
	background: ${props =>
		props.$isSelected ? brandColors.giv[100] : brandColors.giv[50]};
	border: 1px solid
		${props => (props.$isSelected ? brandColors.giv[500] : 'transparent')};
	border-radius: 54px;
	width: 48px;
	height: 32px;
	display: flex !important;
	justify-content: center;
	align-items: center;
	color: ${brandColors.giv[500]};
	cursor: pointer;
`;

const Options = styled(Flex)`
	gap: 8px;
`;

const Container = styled.div<{ disabled?: boolean }>`
	margin: 16px 0 13px;
	opacity: ${props => (props.disabled ? 0.4 : 1)};
`;

export default DonateToGiveth;

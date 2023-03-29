import {
	brandColors,
	Caption,
	GLink,
	IconHelpFilled16,
	mediaQueries,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ChangeEvent, FC } from 'react';
import { useIntl } from 'react-intl';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { Flex } from '@/components/styled-components/Flex';
import Input, { InputSize } from '@/components/Input';
import { InputSuffix } from '@/components/styled-components/Input';
import CheckBox from '@/components/Checkbox';

interface IDonateToGiveth {
	donationToGiveth: number;
	setDonationToGiveth: (donationToGiveth: number) => void;
}

const givethDonationOptions = [5, 10, 15, 20];

const DonateToGiveth: FC<IDonateToGiveth> = props => {
	const { donationToGiveth, setDonationToGiveth } = props;

	const { formatMessage } = useIntl();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newPercentage = +e.target.value;
		if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 10000)
			return;
		setDonationToGiveth(newPercentage);
	};

	const handleCheckbox = (e: boolean) => {
		setDonationToGiveth(e ? 0 : 5);
	};

	return (
		<Container>
			<Flex alignItems='center' gap='4px'>
				<Caption medium>
					{formatMessage({ id: 'label.donation_to' }) + ' Giveth'}
				</Caption>
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
							isSelected={donationToGiveth === option}
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
						<Percentage inputSize={InputSize.SMALL}>%</Percentage>
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

const OptionWrapper = styled(GLink)<{ isSelected: boolean }>`
	background: ${props =>
		props.isSelected ? brandColors.giv[100] : brandColors.giv[50]};
	border: 1px solid
		${props => (props.isSelected ? brandColors.giv[500] : 'transparent')};
	border-radius: 54px;
	width: 48px;
	height: 32px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: ${brandColors.giv[500]};
	cursor: pointer;
`;

const Options = styled(Flex)`
	gap: 8px;
`;

const Container = styled.div`
	margin: 16px 0 13px;
`;

export default DonateToGiveth;

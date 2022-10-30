import {
	brandColors,
	Caption,
	GLink,
	IconHelp,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ChangeEvent, FC } from 'react';
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
				<Caption medium>Donate to Giveth</Caption>
				<IconWithTooltip icon={<IconHelp size={16} />} direction='top'>
					<TooltipContainer>
						Support Giveth with a donation to the Giveth DAO. The
						selected donation percentage will be added on top of
						your donation amount in the same token you are donating.
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
				size={12}
				checked={donationToGiveth === 0}
				onChange={handleCheckbox}
				label='I do not want to support Giveth with my donation'
			/>
		</Container>
	);
};

const TooltipContainer = styled(Subline)`
	width: 274px;
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

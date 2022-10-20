import {
	brandColors,
	Caption,
	GLink,
	IconHelp,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ChangeEvent, FC } from 'react';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { Flex } from '@/components/styled-components/Flex';
import Input, { InputSize } from '@/components/Input';
import { InputSuffix } from '@/components/styled-components/Input';

interface IDonateToGiveth {
	donationToGiveth: number;
	setDonationToGiveth: (donationToGiveth: number) => void;
}

const givethDonationOptions = [5, 10, 15, 0];

const DonateToGiveth: FC<IDonateToGiveth> = props => {
	const { donationToGiveth, setDonationToGiveth } = props;

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newPercentage = +e.target.value;
		if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 100)
			return;
		setDonationToGiveth(newPercentage);
	};

	return (
		<Container>
			<Flex alignItems='center' gap='4px'>
				<Caption medium>Donate to Giveth</Caption>
				<IconWithTooltip
					icon={<IconHelp size={16} />}
					direction={'top'}
				>
					Support Giveth to continue building the Future of Giving by
					making a donation to the Giveth DAO! The percentage you
					choose will be added on top of your donation amount, in the
					same token you are donating.
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
		</Container>
	);
};

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
	margin: 16px 0 3px;
`;

export default DonateToGiveth;

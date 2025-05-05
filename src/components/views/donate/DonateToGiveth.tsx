import {
	brandColors,
	Flex,
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
import Input, { InputSize } from '@/components/Input';
import { InputSuffix } from '@/components/styled-components/Input';
import ToggleSwitch, {
	EToggleSwitchSizes,
	EToggleSwitchThemes,
} from '@/components/ToggleSwitch';

interface IDonateToGiveth {
	donationToGiveth: number;
	setDonationToGiveth: (donationToGiveth: number) => void;
	title: string;
	disabled?: boolean;
}

const givethDonationOptions = [10, 15, 20, 25];

const DonateToGiveth: FC<IDonateToGiveth> = ({
	donationToGiveth,
	setDonationToGiveth,
	title,
	disabled,
}) => {
	const { formatMessage } = useIntl();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		const newPercentage = +e.target.value;
		if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 90)
			return;
		setDonationToGiveth(newPercentage);
	};

	const handleCheckbox = (e: boolean) => {
		setDonationToGiveth(e ? 5 : 0);
	};

	return (
		<Container>
			<Flex $alignItems='center' gap='4px'>
				<ToggleSwitch
					isOn={donationToGiveth !== 0}
					toggleOnOff={handleCheckbox}
					label={title}
					size={EToggleSwitchSizes.SMALL}
					theme={EToggleSwitchThemes.PURPLE_GRAY}
					style={{ marginLeft: '-14px' }}
					disabled={disabled}
				/>
				<IconWithTooltip
					style={{
						marginBottom: '-5px',
						opacity: disabled ? 0.4 : 1,
					}}
					icon={<IconHelpFilled16 />}
					direction='top'
				>
					<TooltipContainer>
						{formatMessage({ id: 'label.support_giveth_with' })}
					</TooltipContainer>
				</IconWithTooltip>
			</Flex>
			<UserInput disabled={disabled}>
				<Options>
					{givethDonationOptions.map(option => (
						<OptionWrapper
							$isSelected={donationToGiveth === option}
							size='Small'
							key={option}
							onClick={() =>
								!disabled && setDonationToGiveth(option)
							}
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
		</Container>
	);
};

const TooltipContainer = styled(Subline)`
	${mediaQueries.tablet} {
		width: 274px;
	}
	padding: 0 10px;
`;

const UserInput = styled(Flex)<{ disabled?: boolean }>`
	margin-top: 12px;
	justify-content: space-between;
	gap: 10px;
	flex-wrap: wrap;
	opacity: ${props => (props.disabled ? 0.4 : 1)};
`;

const StyledInput = styled(Input)`
	width: 50px;
	flex: none;
	margin-bottom: -20px;
	input {
		color: ${neutralColors.gray[900]};
		border-radius: 8px !important;
		border: 1px solid ${neutralColors.gray[300]} !important;
	}
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
	color: ${brandColors.giv[500]} !important;
	cursor: pointer;
`;

const Options = styled(Flex)`
	gap: 16px;
`;

const Container = styled.div`
	margin: 16px 0 13px;
	border-radius: 8px;
	border: 1px solid ${neutralColors.gray[300]};
	padding: 16px;
`;

export default DonateToGiveth;

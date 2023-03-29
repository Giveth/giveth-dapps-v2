import {
	brandColors,
	ButtonLink,
	Caption,
	H6,
	IconArrowLeft,
	IconExternalLink,
	neutralColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';
import { IntroCardConfig } from '@/types/config';
import { getSymbolIconWithName } from '../../StakingPoolImages';
import { Flex } from '../../styled-components/Flex';
import { StakeCardState } from './BaseStakingCard/BaseStakingCard';

interface IStakingCardIntro {
	setState: Dispatch<SetStateAction<StakeCardState>>;
	symbol: string;
	introCard?: IntroCardConfig;
}

const StakingCardIntro: FC<IStakingCardIntro> = ({
	symbol,
	introCard,
	setState,
}) => {
	const { formatMessage } = useIntl();
	const titleIcon = introCard?.icon
		? introCard?.icon
		: symbol.split(' / ')[0];
	return (
		<StakingCardIntroContainer>
			<HeaderRow>
				<Back onClick={() => setState(StakeCardState.NORMAL)}>
					<IconArrowLeft size={32} />
				</Back>
				{getSymbolIconWithName(titleIcon)}
				<H6 weight={700}>{introCard?.title}</H6>
			</HeaderRow>
			<ContentWrapper
				flexDirection='column'
				justifyContent='space-between'
			>
				<Description>{introCard?.description}</Description>
				<LearnMoreButton
					isExternal
					label={formatMessage({
						id: 'label.learn_more',
					})}
					href={introCard?.link}
					linkType='texty'
					size='small'
					target='_blank'
					icon={
						<IconExternalLink
							size={16}
							color={brandColors.deep[100]}
						/>
					}
				/>
			</ContentWrapper>
		</StakingCardIntroContainer>
	);
};

const StakingCardIntroContainer = styled.div``;

const HeaderRow = styled(Flex)`
	padding: 22px 19px;
	align-items: center;
	gap: 8px;
	color: ${neutralColors.gray[100]};
	margin-bottom: 8px;
`;

const Back = styled.div`
	margin-right: 10px;
	cursor: pointer;
`;

const ContentWrapper = styled(Flex)`
	height: 448px;
`;

const Description = styled(Caption)`
	padding: 0 32px;
	white-space: pre-line;
`;

const LearnMoreButton = styled(ButtonLink)`
	width: 90%;
	margin: 16px auto;
`;

export default StakingCardIntro;

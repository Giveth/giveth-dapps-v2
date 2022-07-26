import {
	brandColors,
	ButtonLink,
	Caption,
	H6,
	IconArrowLeft,
	IconExternalLink,
	neutralColors,
} from '@giveth/ui-design-system';
import { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';
import { SimplePoolStakingConfig } from '@/types/config';
import { getCurIconWithName } from '../StakingPoolImages';
import { Flex } from '../styled-components/Flex';
import { StakeCardState } from './BaseStakingCard';

interface IStakingCardIntro {
	poolStakingConfig: SimplePoolStakingConfig;
	setState: Dispatch<SetStateAction<StakeCardState>>;
}

const StakingCardIntro: FC<IStakingCardIntro> = ({
	poolStakingConfig,
	setState,
}) => {
	const { title, introCard } = poolStakingConfig;
	return (
		<StakingCardIntroContainer>
			<HeaderRow>
				<Back onClick={() => setState(StakeCardState.NORMAL)}>
					<IconArrowLeft size={32} />
				</Back>
				{getCurIconWithName(title.split(' / ')[0])}
				<H6 weight={700}>{introCard?.title}</H6>
			</HeaderRow>
			<ContentWrapper
				flexDirection='column'
				justifyContent='space-between'
			>
				<Description>{introCard?.description}</Description>
				<LearnMoreButton
					label='LEARN MORE'
					href={introCard?.link}
					linkType='texty'
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
	height: 380px;
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

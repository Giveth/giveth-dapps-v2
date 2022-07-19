import {
	P,
	H6,
	IconExternalLink,
	IconRocketInSpace32,
	IconX,
	neutralColors,
	// ButtonLink,
	Button,
	brandColors,
} from '@giveth/ui-design-system';
import { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';
// import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';
import TotalGIVpowerBox from '../modals/StakeLock/TotalGIVpowerBox';
import { Flex } from '../styled-components/Flex';
import { StakeCardState } from './BaseStakingCard';

interface IGIVpowerCardIntro {
	setState: Dispatch<SetStateAction<StakeCardState>>;
}

const GIVpowerCardIntro: FC<IGIVpowerCardIntro> = ({ setState }) => {
	return (
		<GIVpowerCardIntroContainer>
			<HeaderRow>
				<IconRocketInSpace32 />
				<H6 weight={700}>GIVpower</H6>
				<div style={{ flex: 1 }}></div>
				<CloseButton onClick={() => setState(StakeCardState.NORMAL)}>
					<IconX size={24} />
				</CloseButton>
			</HeaderRow>
			<TotalGIVpowerBox />
			<Desc>
				You get GIVpower when you stake &amp; lock GIV. GIVpower will
				allow you to boost projects to influence their ranking on
				Giveth.
			</Desc>
			<Desc>
				It will allow you to support the projects you believe in,
				without donating.
			</Desc>
			{/* <ButtonLink
				label='Boost projects with GIVpower'
				href={Routes.Projects}
			/> */}
			<LearnMoreButton
				label='Learn More'
				onClick={() => window.open(links.GIVPOWER_DOC)}
				buttonType='texty'
				icon={
					<IconExternalLink size={16} color={brandColors.deep[100]} />
				}
			/>
		</GIVpowerCardIntroContainer>
	);
};

const GIVpowerCardIntroContainer = styled.div`
	padding: 24px;
`;

const HeaderRow = styled(Flex)`
	align-items: center;
	gap: 8px;
	color: ${neutralColors.gray[100]};
	margin-bottom: 8px;
`;
const CloseButton = styled.div`
	cursor: pointer;
`;

const Desc = styled(P)`
	text-align: center;
	margin-bottom: 32px;
`;

const LearnMoreButton = styled(Button)`
	width: 100%;
	margin-bottom: 16px;
`;

export default GIVpowerCardIntro;

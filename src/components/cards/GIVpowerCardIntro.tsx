import {
	P,
	H6,
	IconExternalLink,
	IconRocketInSpace32,
	IconX,
	neutralColors,
	brandColors,
	ButtonLink,
} from '@giveth/ui-design-system';
import { useState } from 'react';
import styled from 'styled-components';
// import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';
import TotalGIVpowerBox from '../modals/StakeLock/TotalGIVpowerBox';
import { Flex, FlexSpacer } from '../styled-components/Flex';
import { StakeCardState } from './BaseStakingCard';
import { LockupDetailsModal } from '../modals/LockupDetailsModal';
import { useGIVpower } from '@/context/givpower.context';
import { useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import Routes from '@/lib/constants/Routes';
import type { Dispatch, FC, SetStateAction } from 'react';

interface IGIVpowerCardIntro {
	setState: Dispatch<SetStateAction<StakeCardState>>;
}

const GIVpowerCardIntro: FC<IGIVpowerCardIntro> = ({ setState }) => {
	const [showLockDetailModal, setShowLockDetailModal] = useState(false);
	const { stakedAmount } = useGIVpower();
	const currentValues = useAppSelector(state => state.subgraph.currentValues);

	const sdh = new SubgraphDataHelper(currentValues);
	const userGIVLocked = sdh.getUserGIVLockedBalance();

	return (
		<>
			<GIVpowerCardIntroContainer>
				<HeaderRow>
					<IconRocketInSpace32 />
					<H6 weight={700}>GIVpower</H6>
					<FlexSpacer />
					<CloseButton
						onClick={() => setState(StakeCardState.NORMAL)}
					>
						<IconX size={24} />
					</CloseButton>
				</HeaderRow>
				<TotalGIVpowerBox />
				<Desc>
					You get GIVpower when you stake & lock GIV. Use your
					GIVpower to boost projects on Giveth to influence their
					rank. Donors to top-ranked projects get more GIVbacks.
				</Desc>
				<Desc>
					With GIVpower, you can support the projects you believe in,
					without sacrificing!
				</Desc>
				<ButtonLink label='Boost Projects' href={Routes.Projects} />
				<LearnMoreButton
					label='Learn More'
					linkType='texty'
					href={links.GIVPOWER_DOC}
					target='_blank'
					icon={
						<IconExternalLink
							size={16}
							color={brandColors.deep[100]}
						/>
					}
				/>
			</GIVpowerCardIntroContainer>
			{showLockDetailModal && (
				<LockupDetailsModal
					setShowModal={setShowLockDetailModal}
					unstakeable={stakedAmount.sub(userGIVLocked.balance)}
				/>
			)}
		</>
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
	margin-bottom: 16px;
`;

const LearnMoreButton = styled(ButtonLink)`
	width: 100%;
	margin-top: 8px;
	margin-bottom: 16px;
`;

export default GIVpowerCardIntro;

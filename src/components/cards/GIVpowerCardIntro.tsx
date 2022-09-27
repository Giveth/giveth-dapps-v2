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
import { useState } from 'react';
import styled from 'styled-components';
// import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';
import TotalGIVpowerBox from '../modals/StakeLock/TotalGIVpowerBox';
import { Flex } from '../styled-components/Flex';
import { StakeCardState } from './BaseStakingCard';
import { LockupDetailsModal } from '../modals/LockupDetailsModal';
import { useGIVpower } from '@/context/givpower.context';
import { useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
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
					<div style={{ flex: 1 }}></div>
					<CloseButton
						onClick={() => setState(StakeCardState.NORMAL)}
					>
						<IconX size={24} />
					</CloseButton>
				</HeaderRow>
				<TotalGIVpowerBox />
				<Desc>
					You get GIVpower when you stake &amp; lock GIV. GIVpower
					will allow you to boost projects to influence their ranking
					on Giveth.
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
					label='locked GIV details'
					buttonType='texty'
					onClick={() => setShowLockDetailModal(true)}
				/>
				<LearnMoreButton
					label='Learn More'
					onClick={() => window.open(links.GIVPOWER_DOC)}
					buttonType='texty'
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
	margin-bottom: 32px;
`;

const LearnMoreButton = styled(Button)`
	width: 100%;
	margin-bottom: 16px;
`;

export default GIVpowerCardIntro;

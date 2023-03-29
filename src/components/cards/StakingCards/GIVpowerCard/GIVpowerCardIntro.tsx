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
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Link from 'next/link';
import links from '@/lib/constants/links';
import { useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import Routes from '@/lib/constants/Routes';
import { LockupDetailsModal } from '@/components/modals/LockupDetailsModal';
import TotalGIVpowerBox from '@/components/modals/StakeLock/TotalGIVpowerBox';
import { FlexSpacer, Flex } from '@/components/styled-components/Flex';
import { StakeCardState } from '../BaseStakingCard/BaseStakingCard';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { useStakingPool } from '@/hooks/useStakingPool';
import config from '@/configuration';
import type { Dispatch, FC, SetStateAction } from 'react';

interface IGIVpowerCardIntro {
	setState: Dispatch<SetStateAction<StakeCardState>>;
}

const GIVpowerCardIntro: FC<IGIVpowerCardIntro> = ({ setState }) => {
	const { formatMessage } = useIntl();
	const [showLockDetailModal, setShowLockDetailModal] = useState(false);
	const { stakedAmount } = useStakingPool(
		getGivStakingConfig(config.XDAI_CONFIG),
	);
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
					{formatMessage({
						id: 'label.you_get_givpower_when_you_stake',
					})}
				</Desc>
				<Desc>
					{formatMessage({
						id: 'label.with_givpower_you_can_support_projects',
					})}
				</Desc>
				<Link href={Routes.Projects}>
					<ButtonLink
						label={formatMessage({ id: 'label.boost_projects' })}
					/>
				</Link>
				<LearnMoreButton
					isExternal
					label={formatMessage({ id: 'label.learn_more' })}
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

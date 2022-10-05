import { useState, FC, useEffect } from 'react';
import {
	neutralColors,
	brandColors,
	IconRocketInSpace32,
	IconHelp,
	IconUnlock32,
	H5,
	H6,
	Caption,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { smallFormatDate } from '@/lib/helpers';
import { Flex } from '../styled-components/Flex';
import { Modal } from './Modal';
import { IconWithTooltip } from '../IconWithToolTip';
import { formatEthHelper, formatWeiHelper } from '@/helpers/number';
import { useGIVpower } from '@/context/givpower.context';
import { fetchSubgraph } from '@/services/subgraph.service';
import config from '@/configuration';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { mediaQueries } from '@/lib/constants/constants';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { RowWrapper, TableCell, TableHeader } from '../styled-components/Table';
import type { IGIVpowerPosition } from '@/types/subgraph';
import type { BigNumber } from 'ethers';
import type { IModal } from '@/types/common';

interface ILockupDetailsModal extends IModal {
	unstakeable: BigNumber;
}

export const LockupDetailsModal: FC<ILockupDetailsModal> = ({
	unstakeable,
	setShowModal,
}) => {
	const { apr, stakedAmount } = useGIVpower();
	const { account } = useWeb3React();
	const [locksInfo, setLocksInfo] = useState<IGIVpowerPosition[]>([]);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	useEffect(() => {
		async function fetchGIVLockDetails() {
			if (!account) return;
			const LocksInfo = await fetchSubgraph(
				SubgraphQueryBuilder.getTokenLocksInfoQuery(account),
				config.XDAI_NETWORK_NUMBER,
			);
			setLocksInfo(LocksInfo.tokenLocks);
		}

		fetchGIVLockDetails();
	}, [account]);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Locked GIV Details'
			headerTitlePosition='left'
			headerIcon={<IconRocketInSpace32 />}
		>
			<LockupDetailsContainer>
				<Desc>
					Review your staked GIV, lockup periods, multipliers &amp;
					earnings.
				</Desc>
				<Subtitle>Available to unstake</Subtitle>
				<UnstakeContainer>
					<div>
						<IconUnlock32 />
						<CloseText>
							<Subtitle>{formatWeiHelper(unstakeable)}</Subtitle>
							<H6>GIV</H6>
						</CloseText>
					</div>
					<div>
						<H6>
							{apr ? formatEthHelper(apr.effectiveAPR) : ' ? '}%
						</H6>
						<CloseText>
							<H6>APR</H6>
							<IconWithTooltip
								icon={<IconHelp />}
								direction='top'
								align='right'
							>
								<TooltipContent>
									The minimum APR for staked (not locked) GIV.
									Lock your GIV to increase your rewards.
								</TooltipContent>
							</IconWithTooltip>
						</CloseText>
					</div>
				</UnstakeContainer>

				<LockedContainer>
					<Subtitle>Locked GIV</Subtitle>
					{locksInfo?.length > 0 ? (
						<LockedTable>
							<LockTableHeader>GIV Amount</LockTableHeader>
							<LockTableHeader>Rounds Locked for</LockTableHeader>
							<LockTableHeader>Multiplier</LockTableHeader>
							<LockTableHeader>APR</LockTableHeader>
							<LockTableHeader>Unlock Date</LockTableHeader>
							{locksInfo?.map(
								(locksInfo: IGIVpowerPosition, key) => {
									const multiplier = Math.sqrt(
										1 + locksInfo.rounds,
									);
									return (
										<RowWrapper key={key}>
											<LockTableCell>
												{formatWeiHelper(
													locksInfo.amount,
												)}
											</LockTableCell>
											<LockTableCell>
												{`${locksInfo.rounds}  Round${
													locksInfo.rounds > 1
														? 's'
														: ''
												}`}
											</LockTableCell>
											<LockTableCell>
												{multiplier.toFixed(2)}
											</LockTableCell>
											<LockTableCell>
												{apr
													? formatEthHelper(
															apr.effectiveAPR.multipliedBy(
																multiplier,
															),
													  )
													: ' ? '}
												%
											</LockTableCell>
											<LockTableCell>
												{smallFormatDate(
													new Date(
														Number(
															locksInfo.unlockableAt,
														) * 1000,
													),
												)}
											</LockTableCell>
										</RowWrapper>
									);
								},
							)}
						</LockedTable>
					) : (
						<Subtitle>0</Subtitle>
					)}
				</LockedContainer>

				<StakedContainer>
					<SubtitleWithTooltip>
						<Subtitle>Total staked GIV</Subtitle>
						<IconWithTooltip icon={<IconHelp />} direction='top'>
							<TooltipContent>
								All your staked GIV, including GIV that is
								locked.
							</TooltipContent>
						</IconWithTooltip>
					</SubtitleWithTooltip>

					<TotalContainer>
						<SubtitleH5>{formatWeiHelper(stakedAmount)}</SubtitleH5>
						<H6>GIV</H6>
					</TotalContainer>
				</StakedContainer>
			</LockupDetailsContainer>
		</Modal>
	);
};

const LockupDetailsContainer = styled.div`
	padding: 24px;
	background-repeat: no-repeat;
	color: ${neutralColors.gray[100]};
	text-align: left;
	${mediaQueries.tablet} {
		width: 592px;
	}
`;

const Desc = styled(H6)`
	margin: 0 0 24px 0;
`;

const BlueContainer = styled(Flex)`
	background-color: ${brandColors.giv[500]};
	text-align: center;
	padding: 18.5px;
	margin: 0 0 24px 0;
	border-radius: 16px;
`;

const UnstakeContainer = styled(BlueContainer)`
	display: flex;
	justify-content: space-between;
	margin: 24px 0 0 0;
	div {
		display: flex;
		align-items: center;
		gap: 14px;
	}
`;

const CloseText = styled.div`
	gap: 4px !important;
`;

const LockedContainer = styled.div`
	overflow-x: auto;
	padding: 24px 0;
`;

const StakedContainer = styled.div`
	margin: 24px 0;
`;

const TotalContainer = styled(BlueContainer)`
	display: flex;
	justify-content: center;
	margin: 24px 0 0 0;
	gap: 4px;
	align-items: center;
`;

const Subtitle = styled(H6)`
	font-weight: 700;
`;

const SubtitleWithTooltip = styled.div`
	display: flex;
	align-items: baseline;
	gap: 10px;
`;

const TooltipContent = styled(Caption)`
	width: 200px;
`;

const SubtitleH5 = styled(H5)`
	font-weight: 700;
`;

const LockedTable = styled.div`
	display: grid;
	min-width: min-content;
	grid-template-columns: 2fr 2.5fr 1.5fr 1.2fr 1.6fr;
	overflow: auto;
	max-height: 364px;
	margin: 10px 0 0 0;
	color: ${brandColors.deep[100]};
`;

const LockTableHeader = styled(TableHeader)`
	white-space: nowrap;
	padding: 0 10px 0 0;
`;

const LockTableCell = styled(TableCell)`
	height: 60px;
	border-bottom: 1px solid ${brandColors.deep[100]};
	padding: 0 10px 0 0;
	white-space: nowrap;
	min-width: min-content;
`;

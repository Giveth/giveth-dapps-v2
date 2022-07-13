import { useState, FC, useEffect } from 'react';
import {
	neutralColors,
	brandColors,
	IconRocketInSpace32,
	IconHelp,
	IconUnlock32,
	H5,
	H6,
	B,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { smallFormatDate } from '@/lib/helpers';
import { Flex } from '../styled-components/Flex';
import { Modal } from './Modal';
import { IconWithTooltip } from '../IconWithToolTip';
import { formatEthHelper, formatWeiHelper } from '@/helpers/number';
import { useGIVpower } from '@/context/givpower.context';
import { IGIVpowerPosition } from '@/types/subgraph';
import { fetchSubgraph } from '@/services/subgraph.service';
import config from '@/configuration';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { useAppSelector } from '@/features/hooks';
import { mediaQueries } from '@/lib/constants/constants';
import type { BigNumber } from 'ethers';
import type { IModal } from '@/types/common';

interface ILockupDetailsModal extends IModal {
	unstakeable: BigNumber;
}

export const LockupDetailsModal: FC<ILockupDetailsModal> = ({
	unstakeable,
	setShowModal,
}) => {
	const { apr } = useGIVpower();
	const { account } = useWeb3React();
	const [locksInfo, setLocksInfo] = useState<IGIVpowerPosition[]>([]);
	const { balances } = useAppSelector(state => state.subgraph.xDaiValues);

	useEffect(() => {
		async function fetchGIVLockDetails() {
			if (!account) return;
			const LocksInfo = await fetchSubgraph(
				SubgraphQueryBuilder.getTokenLocksInfoQuery(account),
				config.XDAI_NETWORK_NUMBER,
				true,
			);
			setLocksInfo(LocksInfo.tokenLocks);
		}

		fetchGIVLockDetails();
	}, [account]);

	return (
		<Modal
			setShowModal={setShowModal}
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
							<Subtitle>
								{formatWeiHelper(unstakeable, 2)}
							</Subtitle>
							<H6>GIV</H6>
						</CloseText>
					</div>
					<div>
						<H6>{apr ? formatEthHelper(apr) : ' ? '}%</H6>
						<CloseText>
							<H6>APR</H6>
							<IconWithTooltip
								icon={<IconHelp />}
								direction='top'
							>
								<P>APR</P>
							</IconWithTooltip>
						</CloseText>
					</div>
				</UnstakeContainer>

				<LockedContainer>
					<Subtitle>Locked GIV</Subtitle>
					{locksInfo?.length > 0 ? (
						<LockedTable>
							<TableHeader>GIV Amount</TableHeader>
							<TableHeader>Rounds Locked for</TableHeader>
							<TableHeader>Multiplier</TableHeader>
							<TableHeader>APR</TableHeader>
							<TableHeader>Unlock Date</TableHeader>
							{locksInfo?.map(
								(locksInfo: IGIVpowerPosition, key) => {
									const multiplier = Math.sqrt(
										1 + locksInfo.rounds,
									);
									return (
										<RowWrapper key={key}>
											<TableCell>
												{formatWeiHelper(
													locksInfo.amount,
													2,
												)}
											</TableCell>
											<TableCell>
												{locksInfo.rounds} Rounds
											</TableCell>
											<TableCell>
												{multiplier.toPrecision(1)}
											</TableCell>
											<TableCell>
												{apr
													? formatEthHelper(
															apr.multipliedBy(
																multiplier,
															),
													  )
													: ' ? '}
												%
											</TableCell>
											<TableCell>
												{smallFormatDate(
													new Date(
														Number(
															locksInfo.unlockableAt,
														) * 1000,
													),
												)}
											</TableCell>
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
							<P>some explanation here</P>
						</IconWithTooltip>
					</SubtitleWithTooltip>

					<TotalContainer>
						<SubtitleH5>
							{formatWeiHelper(balances.gGIV, 2)}
						</SubtitleH5>
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
	margin: 24px 0 0 0;
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
	flex-direction: row;
	gap: 4px;
`;

const SubtitleH5 = styled(H5)`
	font-weight: 700;
`;

const LockedTable = styled.div`
	display: grid;
	grid-template-columns: 2fr 2fr 1fr 2fr 2fr;
	overflow: auto;
	max-height: 364px;
	margin: 10px 0 0 0;
	color: ${brandColors.deep[100]};
`;

const TableHeader = styled(B)`
	display: flex;
	height: 40px;
	border-bottom: 1px solid ${brandColors.deep[100]};
	align-items: center;
	padding: 32px 29px 32px 0;
	margin: 8px 0;
`;

const RowWrapper = styled.div`
	display: contents;
	& > div:first-child {
		padding-left: 4px;
	}
`;

const TableCell = styled(P)`
	display: flex;
	height: 60px;
	border-bottom: 1px solid ${brandColors.deep[100]};
	padding: 0 10px 0 0;
	align-items: center;
	gap: 8px;
	overflow-x: auto;
`;

import { useState, FC, useEffect } from 'react';
import {
	neutralColors,
	brandColors,
	IconRocketInSpace32,
	IconUnlock32,
	H5,
	H6,
	Caption,
	IconHelpFilled,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useAccount, useNetwork } from 'wagmi';
import { smallFormatDate } from '@/lib/helpers';
import { Flex, FlexCenter } from '../styled-components/Flex';
import { Modal } from './Modal';
import { IconWithTooltip } from '../IconWithToolTip';
import { formatEthHelper, formatWeiHelper } from '@/helpers/number';
import { fetchSubgraph } from '@/services/subgraph.service';
import config from '@/configuration';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { mediaQueries } from '@/lib/constants/constants';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { RowWrapper, TableCell, TableHeader } from '../styled-components/Table';
import { useStakingPool } from '@/hooks/useStakingPool';
import { Spinner } from '../Spinner';
import type { IGIVpowerPosition } from '@/types/subgraph';
import type { IModal } from '@/types/common';

interface ILockupDetailsModal extends IModal {
	unstakeable: bigint;
}

export const LockupDetailsModal: FC<ILockupDetailsModal> = ({
	unstakeable,
	setShowModal,
}) => {
	const { chain } = useNetwork();
	const chainId = chain?.id;
	const { address } = useAccount();
	const { apr, stakedAmount } = useStakingPool(
		config.NETWORKS_CONFIG[chainId!].GIVPOWER ||
			config.GNOSIS_CONFIG.GIVPOWER,
	);
	const [loading, setLoading] = useState(true);
	const [locksInfo, setLocksInfo] = useState<IGIVpowerPosition[]>([]);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	useEffect(() => {
		async function fetchGIVLockDetails() {
			if (!address) return;
			setLoading(true);
			const LocksInfo = await fetchSubgraph(
				SubgraphQueryBuilder.getTokenLocksInfoQuery(address),
				chainId || config.GNOSIS_NETWORK_NUMBER,
			);
			setLocksInfo(LocksInfo.tokenLocks);
			setLoading(false);
		}

		fetchGIVLockDetails();
	}, [address, chainId]);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({ id: 'label.locked_giv_details' })}
			headerTitlePosition='left'
			headerIcon={<IconRocketInSpace32 />}
		>
			<LockupDetailsContainer>
				<Desc>
					{formatMessage({
						id: 'label.review_your_staked_giv_lockup_period',
					})}
				</Desc>
				<Subtitle>
					{formatMessage({ id: 'label.available_to_unstake' })}
				</Subtitle>
				<UnstakeContainer>
					<div>
						<IconUnlock32 />
						<CloseText>
							<Subtitle>
								{formatWeiHelper(unstakeable.toString())}
							</Subtitle>
							<H6>GIV</H6>
						</CloseText>
					</div>
					<div>
						<H6>
							{apr
								? formatEthHelper(apr.effectiveAPR.toString())
								: ' ? '}
							%
						</H6>
						<CloseText>
							<H6>APR</H6>
							<IconWithTooltip
								icon={<IconHelpFilled />}
								direction='top'
								align='right'
							>
								<TooltipContent>
									{formatMessage({
										id: 'label.the_min_apr_for_staked_not_locked_giv',
									})}
								</TooltipContent>
							</IconWithTooltip>
						</CloseText>
					</div>
				</UnstakeContainer>

				<LockedContainer>
					<Subtitle>
						{formatMessage({ id: 'label.locekd_giv' })}
					</Subtitle>
					{loading ? (
						<FlexCenter>
							<Spinner />
						</FlexCenter>
					) : locksInfo?.length > 0 ? (
						<LockedTable>
							<LockTableHeader>GIV</LockTableHeader>
							<LockTableHeader>
								{formatMessage({ id: 'label.locked_for' })}
							</LockTableHeader>
							<LockTableHeader>
								{formatMessage({ id: 'label.multiplier' })}
							</LockTableHeader>
							<LockTableHeader>APR</LockTableHeader>
							<LockTableHeader>
								{formatMessage({ id: 'label.unlock_date' })}
							</LockTableHeader>
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
												{`${
													locksInfo.rounds > 1
														? formatMessage(
																{
																	id: 'label.number_of_rounds',
																},
																{
																	rounds: locksInfo.rounds,
																},
														  )
														: formatMessage({
																id: 'label.one_round',
														  })
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
						<FlexCenter>
							<P>There is no data</P>
						</FlexCenter>
					)}
				</LockedContainer>

				<StakedContainer>
					<SubtitleWithTooltip>
						<Subtitle>
							{formatMessage({ id: 'label.total_staked_giv' })}
						</Subtitle>
						<IconWithTooltip
							icon={<IconHelpFilled />}
							direction='top'
						>
							<TooltipContent>
								{formatMessage({
									id: 'label.all_your_staked_giv_including_the_locked',
								})}
							</TooltipContent>
						</IconWithTooltip>
					</SubtitleWithTooltip>

					<TotalContainer>
						<SubtitleH5>
							{formatWeiHelper(stakedAmount.toString())}
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

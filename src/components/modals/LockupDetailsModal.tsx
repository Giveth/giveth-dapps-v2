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
import { utils } from 'ethers';
import styled from 'styled-components';
import { smallFormatDate } from '@/lib/helpers';
import { Flex } from '../styled-components/Flex';
import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { IconWithTooltip } from '../IconWithToolTip';
import { formatEthHelper } from '@/helpers/number';
import { useAppSelector } from '@/features/hooks';
import { IGIVpower, IGIVpowerLock } from '@/types/subgraph';
import { useGIVpower } from '@/context/givpower.context';

export const LockupDetailsModal: FC<IModal> = ({ setShowModal }) => {
	const currentValues = useAppSelector(state => state.subgraph.currentValues);
	const GIVpower: IGIVpower | undefined = currentValues.GIVPowerPositions;

	const { apr } = useGIVpower();
	const [average, setAverage] = useState(1);
	const [stakedGIV, setStakedGIV] = useState('0');
	const [availableToUnstake, setAvailableToUnstake] = useState('0');
	const [lockedGIV, setLockedGIV] = useState<IGIVpowerLock[]>([]);

	const setupValues = () => {
		if (!GIVpower) return;
		const GIVPowers = GIVpower?.givPowers;
		setStakedGIV(
			parseFloat(
				utils.formatEther(GIVPowers?.totalGIVLocked),
			)?.toPrecision(1),
		);
		// setAvailableToUnstake(
		// 	parseFloat(
		// 		utils.formatEther(
		// 			BigNumber.from(GIVPowers?.totalGIVLocked)?.sub(
		// 				BigNumber.from(GIVPowers?.totalGIVPower),
		// 			),
		// 		),
		// 	)?.toFixed(4),
		// );
		setLockedGIV(
			GIVpower?.tokenLocks &&
				[...GIVpower.tokenLocks].sort((a: any, b: any) => {
					return a?.unlockableAt < b?.unlockableAt ? -1 : 1;
				}),
		);
	};

	useEffect(() => {
		setupValues();
	}, [currentValues]);

	return (
		<Modal
			setShowModal={setShowModal}
			headerTitle='Lockup Details'
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
							<Subtitle>{availableToUnstake}</Subtitle>
							<H6>GIV</H6>
						</CloseText>
					</div>
					<div>
						<H6>
							{apr
								? `${formatEthHelper(
										apr.multipliedBy(average),
								  )}`
								: ' ? '}
							%
						</H6>
						<CloseText>
							<H6>APR</H6>
							<IconWithTooltip
								icon={<IconHelp />}
								direction='top'
							>
								<H6>APR</H6>
							</IconWithTooltip>
						</CloseText>
					</div>
				</UnstakeContainer>

				<LockedContainer>
					<Subtitle>Locked GIV</Subtitle>
					{lockedGIV?.length > 0 ? (
						<LockedTable>
							<TableHeader>GIV Amount</TableHeader>
							<TableHeader>Rounds Locked for</TableHeader>
							<TableHeader>Multiplier</TableHeader>
							<TableHeader>APR</TableHeader>
							<TableHeader>Unlock Date</TableHeader>
							{lockedGIV?.map((i: any, key) => {
								return (
									<RowWrapper key={key}>
										<TableCell>
											{parseFloat(
												i?.amount,
											)?.toLocaleString()}
										</TableCell>
										<TableCell>
											{i?.rounds} Rounds
										</TableCell>
										<TableCell>
											{Math.sqrt(
												i?.rounds + 1,
											)?.toPrecision(1)}
										</TableCell>
										<TableCell>
											{apr
												? `${formatEthHelper(
														apr.multipliedBy(
															average,
														),
												  )}`
												: ' ? '}
											%
										</TableCell>
										<TableCell>
											{smallFormatDate(
												new Date(
													i?.unlockableAt * 1000,
												),
											)}
										</TableCell>
									</RowWrapper>
								);
							})}
						</LockedTable>
					) : (
						<Subtitle>0</Subtitle>
					)}
				</LockedContainer>

				<StakedContainer>
					<SubtitleWithTooltip>
						<Subtitle>Total staked GIV</Subtitle>
						<IconWithTooltip icon={<IconHelp />} direction='top'>
							<H6>some explanation here</H6>
						</IconWithTooltip>
					</SubtitleWithTooltip>

					<TotalContainer>
						<SubtitleH5>{stakedGIV}</SubtitleH5>
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
	width: 552px;
	color: ${neutralColors.gray[100]};
	text-align: left;
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

const SubtitleWithTooltip = styled(Subtitle)`
	display: flex;
	flex-direction: row;
	gap: 4px;
`;

const SubtitleH5 = styled(H5)`
	font-weight: 700;
`;

const LockedTable = styled.div`
	display: grid;
	grid-template-columns: 2fr 2fr 1fr 1fr 2fr;
	overflow: auto;
	min-width: 489px;
	height: 364px;
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
	padding: 0 0 0 10px;
	align-items: center;
	gap: 8px;
	overflow-x: auto;
`;

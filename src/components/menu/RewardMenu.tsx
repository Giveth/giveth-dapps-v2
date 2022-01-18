import {
	Overline,
	P,
	B,
	GLink,
	brandColors,
	Caption,
	IconHelp,
} from '@giveth/ui-design-system';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row } from '../styled-components/Grid';
import { RewardMenuContainer } from './RewardMenu.sc';
import Image from 'next/image';
import { switchNetwork } from '@/lib/metamask';
import config from '@/configuration';
import BigNumber from 'bignumber.js';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { Zero } from '@ethersproject/constants';
import { formatWeiHelper } from '@/helpers/number';
import Link from 'next/link';
import { WhatisGIVstreamModal } from '@/components/modals/WhatisGIVstream';
import { useSubgraph } from '@/context';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { UnipoolHelper } from '@/lib/contractHelper/UnipoolHelper';
import { getUserStakeInfo } from '@/lib/stakingPool';
import { constants } from 'ethers';
import { useStakingNFT } from '@/hooks/useStakingNFT';
import { StakingType } from '@/types/config';
import { useWeb3React } from '@web3-react/core';

export const RewardMenu = () => {
	const [isMounted, setIsMounted] = useState(false);
	const [farmsLiquidPart, setFarmsLiquidPart] = useState(Zero);
	const [givStreamLiquidPart, setGIVstreamLiquidPart] = useState(Zero);
	const [flowRateNow, setFlowRateNow] = useState<BigNumber.Value>(0);
	const [showWhatIsGIVstreamModal, setShowWhatIsGIVstreamModal] =
		useState(false);
	const { tokenDistroHelper } = useTokenDistro();
	const { currentValues } = useSubgraph();
	const { rewardBalance } = useStakingNFT();
	const { chainId, library } = useWeb3React();
	const { balances } = currentValues;
	const { allocatedTokens, claimed, givbackLiquidPart } = balances;

	const switchNetworkHandler = () => {
		if (chainId === config.XDAI_NETWORK_NUMBER) {
			switchNetwork(config.MAINNET_NETWORK_NUMBER);
		} else {
			switchNetwork(config.XDAI_NETWORK_NUMBER);
		}
	};

	useEffect(() => {
		setGIVstreamLiquidPart(
			tokenDistroHelper
				.getLiquidPart(allocatedTokens.sub(givbackLiquidPart))
				.sub(claimed),
		);
		setFlowRateNow(
			tokenDistroHelper.getStreamPartTokenPerWeek(
				allocatedTokens.sub(givbackLiquidPart),
			),
		);
	}, [allocatedTokens, claimed, givbackLiquidPart, tokenDistroHelper]);

	useEffect(() => {
		let pools;
		if (chainId === config.XDAI_NETWORK_NUMBER) {
			pools = [
				...config.XDAI_CONFIG.pools,
				getGivStakingConfig(config.XDAI_CONFIG),
			];
		} else if (chainId === config.MAINNET_NETWORK_NUMBER) {
			pools = [
				...config.MAINNET_CONFIG.pools,
				getGivStakingConfig(config.MAINNET_CONFIG),
			];
		}
		if (pools) {
			let _farmRewards = constants.Zero;
			pools.forEach(pool => {
				const { type } = pool;
				const unipoolInfo = currentValues[type];
				if (unipoolInfo) {
					const unipoolHelper = new UnipoolHelper(unipoolInfo);
					_farmRewards = _farmRewards.add(
						getUserStakeInfo(type, balances, unipoolHelper).earned,
					);
				} else if (type === StakingType.UNISWAP) {
					_farmRewards = _farmRewards.add(rewardBalance);
				}
			});
			setFarmsLiquidPart(tokenDistroHelper.getLiquidPart(_farmRewards));
		}
	}, [balances, currentValues, chainId, rewardBalance, tokenDistroHelper]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<>
			<RewardMenuContainer isMounted={isMounted}>
				<Overline styleType='Small'>Network</Overline>
				<NetworkRow>
					<B>{library?._network?.name}</B>
					<SwithNetwork onClick={switchNetworkHandler}>
						Switch network
					</SwithNetwork>
				</NetworkRow>
				<FlowrateBox>
					<Overline styleType='Small'>GIVStream Flowrate</Overline>
					<FlowrateRow>
						<Image
							src='/images/icons/thunder.svg'
							height='16'
							width='12'
							alt='Thunder image'
						/>
						<FlowrateAmount>
							{formatWeiHelper(flowRateNow)}
						</FlowrateAmount>
						<FlowrateUnit>GIV/week</FlowrateUnit>
						<IconHelpWraper
							onClick={() => {
								setShowWhatIsGIVstreamModal(true);
							}}
						>
							<IconHelp color='currentColor' />
						</IconHelpWraper>
					</FlowrateRow>
				</FlowrateBox>
				<Link href='/givstream' passHref>
					<a>
						<PartRow>
							<PartInfo>
								<PartTitle>From Givstream</PartTitle>
								<Row gap='4px'>
									<PartAmount medium>
										{formatWeiHelper(givStreamLiquidPart)}
									</PartAmount>
									<PartUnit>GIV</PartUnit>
								</Row>
							</PartInfo>
							<Image
								src='/images/rarrow1.svg'
								height='32'
								width='16'
								alt='Thunder image'
							/>
						</PartRow>
					</a>
				</Link>
				<Link href='/givfarm' passHref>
					<a>
						<PartRow>
							<PartInfo>
								<PartTitle>GIVFarm & Givgarden</PartTitle>
								<Row gap='4px'>
									<PartAmount medium>
										{formatWeiHelper(farmsLiquidPart)}
									</PartAmount>
									<PartUnit>GIV</PartUnit>
								</Row>
							</PartInfo>
							<Image
								src='/images/rarrow1.svg'
								height='32'
								width='16'
								alt='Thunder image'
							/>
						</PartRow>
					</a>
				</Link>
				<Link href='/givbacks' passHref>
					<a>
						<PartRow>
							<PartInfo>
								<PartTitle>GIVBacks</PartTitle>
								<Row gap='4px'>
									<PartAmount medium>
										{formatWeiHelper(givbackLiquidPart)}
									</PartAmount>
									<PartUnit>GIV</PartUnit>
								</Row>
							</PartInfo>
							<Image
								src='/images/rarrow1.svg'
								height='32'
								width='16'
								alt='Thunder image'
							/>
						</PartRow>
					</a>
				</Link>
			</RewardMenuContainer>
			{showWhatIsGIVstreamModal && (
				<WhatisGIVstreamModal
					showModal={showWhatIsGIVstreamModal}
					setShowModal={setShowWhatIsGIVstreamModal}
				/>
			)}
		</>
	);
};

export const NetworkRow = styled(Row)`
	justify-content: space-between;
	align-items: center;
`;

export const SwithNetwork = styled(GLink)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

export const FlowrateBox = styled.div`
	background-color: ${brandColors.giv[500]};
	margin: 16px 0;
	border-radius: 8px;
	padding: 8px 16px;
`;

export const FlowrateRow = styled(Row)`
	align-items: center;
	margin-top: 8px;
	gap: 4px;
`;

export const FlowrateAmount = styled(P)`
	padding-left: 4px;
`;

export const FlowrateUnit = styled(P)`
	color: ${brandColors.giv[200]};
`;

export const PartRow = styled(Row)`
	justify-content: space-between;
	margin: 16px 0;
	border-radius: 8px;
	padding: 4px 16px;
	cursor: pointer;
	&:hover {
		background-color: ${brandColors.giv[800]};
	}
`;

export const PartInfo = styled.div``;

export const PartTitle = styled(Overline)`
	margin-bottom: 10px;
`;
export const PartAmount = styled(Caption)``;
export const PartUnit = styled(Caption)``;

export const ArrowImage = styled(GLink)`
	width: 40px;
	cursor: pointer;
	text-align: right;
`;

const IconHelpWraper = styled.div`
	cursor: pointer;
	color: ${brandColors.giv[200]};
`;

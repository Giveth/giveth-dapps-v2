import {
	Overline,
	P,
	B,
	GLink,
	brandColors,
	Caption,
	IconHelp,
	neutralColors,
} from '@giveth/ui-design-system';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Flex } from '../styled-components/Flex';
import { MenuContainer } from './Menu.sc';
import Image from 'next/image';
import { switchNetworkHandler } from '@/lib/wallet';
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
import { ETheme, useGeneral } from '@/context/general.context';
import Routes from '@/lib/constants/Routes';
import { networkInfo } from '@/lib/constants/NetworksObj';

export const RewardMenu = () => {
	const [isMounted, setIsMounted] = useState(false);
	const [farmsLiquidPart, setFarmsLiquidPart] = useState(Zero);
	const [givStreamLiquidPart, setGIVstreamLiquidPart] = useState(Zero);
	const [flowRateNow, setFlowRateNow] = useState<BigNumber.Value>(0);
	const [showWhatIsGIVstreamModal, setShowWhatIsGIVstreamModal] =
		useState(false);
	const { givTokenDistroHelper } = useTokenDistro();
	const { currentValues } = useSubgraph();
	const { rewardBalance } = useStakingNFT();
	const { chainId, library } = useWeb3React();
	const { balances } = currentValues;
	const { allocatedTokens, claimed, givbackLiquidPart } = balances;
	const { theme } = useGeneral();
	const { networkName, networkToken } = networkInfo(chainId);

	useEffect(() => {
		setGIVstreamLiquidPart(
			givTokenDistroHelper
				.getLiquidPart(allocatedTokens.sub(givbackLiquidPart))
				.sub(claimed),
		);
		setFlowRateNow(
			givTokenDistroHelper.getStreamPartTokenPerWeek(
				allocatedTokens.sub(givbackLiquidPart),
			),
		);
	}, [allocatedTokens, claimed, givbackLiquidPart, givTokenDistroHelper]);

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
						getUserStakeInfo(
							type,
							undefined,
							balances,
							unipoolHelper,
						).earned,
					);
				} else if (type === StakingType.UNISWAP) {
					_farmRewards = _farmRewards.add(rewardBalance);
				}
			});
			setFarmsLiquidPart(
				givTokenDistroHelper.getLiquidPart(_farmRewards),
			);
		}
	}, [balances, currentValues, chainId, rewardBalance, givTokenDistroHelper]);

	useEffect(() => {
		setIsMounted(true);
	}, []);
	return (
		<>
			<RewardMenuContainer isMounted={isMounted} theme={theme}>
				<Overline>NETWORK</Overline>
				<NetworkRow>
					<B>{networkName}</B>
					<SwithNetwork onClick={() => switchNetworkHandler(chainId)}>
						Switch network
					</SwithNetwork>
				</NetworkRow>
				<FlowrateBox theme={theme}>
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
				<Link href={Routes.GIVstream} passHref>
					<a>
						<PartRow theme={theme}>
							<PartInfo>
								<PartTitle as='span'>From Givstream</PartTitle>
								<Flex gap='4px'>
									<PartAmount medium>
										{formatWeiHelper(givStreamLiquidPart)}
									</PartAmount>
									<PartUnit>GIV</PartUnit>
								</Flex>
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
				<Link href={Routes.GIVfarm} passHref>
					<a>
						<PartRow theme={theme}>
							<PartInfo>
								<PartTitle as='span'>
									GIVFarm & Givgarden
								</PartTitle>
								<Flex gap='4px'>
									<PartAmount medium>
										{formatWeiHelper(farmsLiquidPart)}
									</PartAmount>
									<PartUnit>GIV</PartUnit>
								</Flex>
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
				<Link href={Routes.GIVbacks} passHref>
					<a>
						<PartRow theme={theme}>
							<PartInfo>
								<PartTitle as='span'>GIVBacks</PartTitle>
								<Flex gap='4px'>
									<PartAmount medium>
										{formatWeiHelper(givbackLiquidPart)}
									</PartAmount>
									<PartUnit>GIV</PartUnit>
								</Flex>
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

export const NetworkRow = styled(Flex)`
	justify-content: space-between;
	align-items: center;
`;

export const SwithNetwork = styled(GLink)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

export const FlowrateBox = styled.div`
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[500]
			: neutralColors.gray[200]};
	margin: 16px 0;
	border-radius: 8px;
	padding: 8px 16px;
`;

export const FlowrateRow = styled(Flex)`
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

export const PartRow = styled(Flex)`
	justify-content: space-between;
	margin: 16px 0;
	border-radius: 8px;
	padding: 4px 16px;
	cursor: pointer;
	&:hover {
		background-color: ${props =>
			props.theme === ETheme.Dark
				? brandColors.giv[800]
				: neutralColors.gray[200]};
	}
`;

export const PartInfo = styled.div``;

export const PartTitle = styled(Overline)`
	margin-bottom: 10px;
`;
export const PartAmount = styled(Caption)``;
export const PartUnit = styled(Caption)``;

const IconHelpWraper = styled.div`
	cursor: pointer;
	color: ${brandColors.giv[200]};
`;

const RewardMenuContainer = styled(MenuContainer)`
	max-height: 380px;
`;

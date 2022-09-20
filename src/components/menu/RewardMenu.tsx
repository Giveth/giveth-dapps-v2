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
import Image from 'next/image';
import BigNumber from 'bignumber.js';
import { Zero } from '@ethersproject/constants';
import Link from 'next/link';
import { constants } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Flex } from '../styled-components/Flex';
import { MenuContainer } from './Menu.sc';
import { switchNetworkHandler } from '@/lib/wallet';
import config from '@/configuration';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { BN, formatWeiHelper } from '@/helpers/number';
import { WhatisStreamModal } from '@/components/modals/WhatisStream';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { getUserStakeInfo } from '@/lib/stakingPool';
import Routes from '@/lib/constants/Routes';
import { networkInfo } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { SimplePoolStakingConfig, StakingType } from '@/types/config';

interface IRewardMenu {
	showWhatIsGIVstreamModal: boolean;
	setShowWhatIsGIVstreamModal: (value: boolean) => void;
}

export const RewardMenu = ({
	showWhatIsGIVstreamModal,
	setShowWhatIsGIVstreamModal,
}: IRewardMenu) => {
	const [isMounted, setIsMounted] = useState(false);
	const [farmsLiquidPart, setFarmsLiquidPart] = useState(Zero);
	const [givStreamLiquidPart, setGIVstreamLiquidPart] = useState(Zero);
	const [flowRateNow, setFlowRateNow] = useState<BigNumber.Value>(0);

	const currentValues = useAppSelector(state => state.subgraph.currentValues);
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();
	const { chainId } = useWeb3React();
	const theme = useAppSelector(state => state.general.theme);

	const sdh = new SubgraphDataHelper(currentValues);

	const tokenDistroBalance = sdh.getGIVTokenDistroBalance();
	const { givbackLiquidPart } = tokenDistroBalance;
	const { networkName } = networkInfo(chainId);

	useEffect(() => {
		const _allocatedTokens = BN(tokenDistroBalance.allocatedTokens);
		const _givbackLiquidPart = BN(tokenDistroBalance.givbackLiquidPart);
		const _claimed = BN(tokenDistroBalance.claimed);
		setGIVstreamLiquidPart(
			givTokenDistroHelper
				.getLiquidPart(_allocatedTokens.sub(_givbackLiquidPart))
				.sub(_claimed),
		);
		setFlowRateNow(
			givTokenDistroHelper.getStreamPartTokenPerWeek(
				_allocatedTokens.sub(_givbackLiquidPart),
			),
		);
	}, [currentValues, givTokenDistroHelper]);

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
				if (pool.type !== StakingType.UNISWAPV3_ETH_GIV) {
					_farmRewards = _farmRewards.add(
						getUserStakeInfo(
							currentValues,
							pool as SimplePoolStakingConfig,
						).earned,
					);
				}
			});
			setFarmsLiquidPart(
				givTokenDistroHelper.getLiquidPart(_farmRewards),
			);
		}
	}, [currentValues, chainId, givTokenDistroHelper]);

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
					<Overline styleType='Small'>GIVstream Flowrate</Overline>
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
								<PartTitle as='span'>From GIVstream</PartTitle>
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
									GIVfarm & GIVgarden
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
								<PartTitle as='span'>GIVbacks</PartTitle>
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
				<WhatisStreamModal
					tokenDistroHelper={givTokenDistroHelper}
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
	max-height: 400px;
	overflow-y: scroll;
`;

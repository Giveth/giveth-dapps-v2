import {
	Overline,
	P,
	B,
	GLink,
	brandColors,
	Caption,
	neutralColors,
	IconHelpFilled16,
} from '@giveth/ui-design-system';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
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
	const { formatMessage } = useIntl();
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
				<RewardMenuItem theme={theme}>
					<RewardMenuTitle theme={theme}>
						{formatMessage({ id: 'label.network' })}
					</RewardMenuTitle>
					<NetworkRow>
						<B>{networkName}</B>
						<SwitchNetwork
							onClick={() => switchNetworkHandler(chainId)}
						>
							{formatMessage({ id: 'label.switch_network' })}
						</SwitchNetwork>
					</NetworkRow>
				</RewardMenuItem>
				<RewardMenuItem isHighlighted theme={theme}>
					<RewardMenuTitle theme={theme}>
						{formatMessage({ id: 'label.givstream_flowrate' })}
					</RewardMenuTitle>
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
						<FlowrateUnit>
							GIV/{formatMessage({ id: 'label.week' })}
						</FlowrateUnit>
						<IconHelpWrapper
							onClick={() => {
								setShowWhatIsGIVstreamModal(true);
							}}
						>
							<IconHelpFilled16 />
						</IconHelpWrapper>
					</FlowrateRow>
				</RewardMenuItem>
				<Link href={Routes.GIVstream}>
					<RewardMenuItem theme={theme}>
						<RewardMenuTitle theme={theme}>
							{formatMessage({ id: 'label.from' })} GIVstream
						</RewardMenuTitle>
						<Flex gap='4px'>
							<PartAmount medium>
								{formatWeiHelper(givStreamLiquidPart)}
							</PartAmount>
							<PartUnit>GIV</PartUnit>
						</Flex>
					</RewardMenuItem>
				</Link>
				<Link href={Routes.GIVfarm}>
					<RewardMenuItem theme={theme}>
						<RewardMenuTitle theme={theme}>
							GIVfarm & GIVgarden
						</RewardMenuTitle>
						<Flex gap='4px'>
							<PartAmount medium>
								{formatWeiHelper(farmsLiquidPart)}
							</PartAmount>
							<PartUnit>GIV</PartUnit>
						</Flex>
					</RewardMenuItem>
				</Link>
				<Link href={Routes.GIVbacks}>
					<RewardMenuItem theme={theme}>
						<RewardMenuTitle theme={theme}>
							GIVbacks
						</RewardMenuTitle>
						<Flex gap='4px'>
							<PartAmount medium>
								{formatWeiHelper(givbackLiquidPart)}
							</PartAmount>
							<PartUnit>GIV</PartUnit>
						</Flex>
					</RewardMenuItem>
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

const RewardMenuItem = styled(Flex)<{ isHighlighted?: boolean }>`
	padding: 8px;
	gap: 6px;
	flex-direction: column;
	border-radius: 8px;
	background-color: ${props =>
		props.isHighlighted
			? props.theme === ETheme.Dark
				? brandColors.giv[500]
				: neutralColors.gray[200]
			: 'unset'};
`;

const RewardMenuTitle = styled(Overline)`
	color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[300]
			: neutralColors.gray[800]};
`;

export const NetworkRow = styled(Flex)`
	justify-content: space-between;
	align-items: center;
`;

export const SwitchNetwork = styled(GLink)`
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

export const FlowrateAmount = styled(B)`
	padding-left: 4px;
`;

export const FlowrateUnit = styled(P)`
	color: ${brandColors.deep[100]};
`;

export const PartRow = styled(Flex)`
	justify-content: space-between;
	margin: 16px 0;
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

const NetworkTitle = styled(Overline)`
	text-transform: uppercase;
`;

const IconHelpWrapper = styled.div`
	cursor: pointer;
	color: ${brandColors.deep[100]};
`;

const RewardMenuContainer = styled(MenuContainer)`
	max-height: 380px;
`;

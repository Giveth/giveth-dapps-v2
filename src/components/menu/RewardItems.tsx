import { B, IconHelpFilled16 } from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import BigNumber from 'bignumber.js';
import { Zero } from '@ethersproject/constants';
import Link from 'next/link';
import { constants } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Flex } from '../styled-components/Flex';
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
import {
	RewardMenuItem,
	RewardMenuTitle,
	NetworkRow,
	SwitchNetwork,
	FlowrateRow,
	FlowrateAmount,
	FlowrateUnit,
	IconHelpWrapper,
	PartAmount,
	PartUnit,
} from './RewardItems.sc';
import { IRewardMenuProps } from './RewardMenu';

export interface IRewardItemsProps extends IRewardMenuProps {
	theme: ETheme;
}

export const RewardItems: FC<IRewardItemsProps> = ({
	showWhatIsGIVstreamModal,
	setShowWhatIsGIVstreamModal,
	theme,
}) => {
	const { formatMessage } = useIntl();
	const [farmsLiquidPart, setFarmsLiquidPart] = useState(Zero);
	const [givStreamLiquidPart, setGIVstreamLiquidPart] = useState(Zero);
	const [flowRateNow, setFlowRateNow] = useState<BigNumber.Value>(0);

	const currentValues = useAppSelector(state => state.subgraph.currentValues);
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();
	const { chainId } = useWeb3React();

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
	return (
		<>
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
					<RewardMenuTitle theme={theme}>GIVbacks</RewardMenuTitle>
					<Flex gap='4px'>
						<PartAmount medium>
							{formatWeiHelper(givbackLiquidPart)}
						</PartAmount>
						<PartUnit>GIV</PartUnit>
					</Flex>
				</RewardMenuItem>
			</Link>
			{showWhatIsGIVstreamModal && (
				<WhatisStreamModal
					tokenDistroHelper={givTokenDistroHelper}
					setShowModal={setShowWhatIsGIVstreamModal}
				/>
			)}
		</>
	);
};

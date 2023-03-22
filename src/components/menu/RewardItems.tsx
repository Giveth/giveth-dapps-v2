import {
	Caption,
	IconForward16,
	IconHelpFilled16,
	OutlineLinkButton,
} from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import BigNumber from 'bignumber.js';
import { Zero } from '@ethersproject/constants';
import Link from 'next/link';
import { constants } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Flex } from '../styled-components/Flex';
import config from '@/configuration';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { BN, formatWeiHelper } from '@/helpers/number';
import { WhatIsStreamModal } from '@/components/modals/WhatIsStream';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { getUserStakeInfo } from '@/lib/stakingPool';
import Routes from '@/lib/constants/Routes';
import { networkInfo } from '@/lib/helpers';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { SimplePoolStakingConfig, StakingType } from '@/types/config';
import {
	FlowrateRow,
	FlowrateAmount,
	FlowrateUnit,
	IconHelpWrapper,
	PartAmount,
	PartUnit,
	ForwardWrapper,
} from './RewardItems.sc';
import { ItemAction, ItemRow, ItemTitle } from './common';
import { Item } from './Item';
import { useItemsContext } from '@/context/Items.context';
import { setShowSwitchNetworkModal } from '@/features/modal/modal.slice';

export interface IRewardItemsProps {
	showWhatIsGIVstreamModal: boolean;
	setShowWhatIsGIVstreamModal: (value: boolean) => void;
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
	const dispatch = useAppDispatch();

	const sdh = new SubgraphDataHelper(currentValues);

	const tokenDistroBalance = sdh.getGIVTokenDistroBalance();
	const { givbackLiquidPart } = tokenDistroBalance;
	const { networkName } = networkInfo(chainId);
	const { close } = useItemsContext();

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
			<Item theme={theme}>
				<ItemTitle upperCase theme={theme}>
					{formatMessage({ id: 'label.network' })}
				</ItemTitle>
				<ItemRow>
					<Caption medium>{networkName}</Caption>
					<ItemAction
						size='Small'
						onClick={() =>
							dispatch(setShowSwitchNetworkModal(true))
						}
					>
						{formatMessage({ id: 'label.switch_network' })}
					</ItemAction>
				</ItemRow>
			</Item>
			<Link href={Routes.GIVstream_FlowRate}>
				<Item isHighlighted theme={theme}>
					<ItemTitle upperCase theme={theme}>
						{formatMessage({ id: 'label.givstream_flowrate' })}
					</ItemTitle>
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
							onClick={e => {
								e.preventDefault();
								e.stopPropagation();
								setShowWhatIsGIVstreamModal(true);
							}}
						>
							<IconHelpFilled16 />
						</IconHelpWrapper>
					</FlowrateRow>
				</Item>
			</Link>
			<Link href={Routes.GIVstream}>
				<Item theme={theme}>
					<ItemTitle upperCase theme={theme}>
						{formatMessage({ id: 'label.from' })} GIVstream
					</ItemTitle>
					<Flex gap='4px'>
						<PartAmount medium>
							{formatWeiHelper(givStreamLiquidPart)}
						</PartAmount>
						<PartUnit>GIV</PartUnit>
						<ForwardWrapper>
							<IconForward16 />
						</ForwardWrapper>
					</Flex>
				</Item>
			</Link>
			<Link href={Routes.GIVfarm}>
				<Item theme={theme}>
					<ItemTitle upperCase theme={theme}>
						GIVfarm & GIVgarden
					</ItemTitle>
					<Flex gap='4px'>
						<PartAmount medium>
							{formatWeiHelper(farmsLiquidPart)}
						</PartAmount>
						<PartUnit>GIV</PartUnit>
						<ForwardWrapper>
							<IconForward16 />
						</ForwardWrapper>
					</Flex>
				</Item>
			</Link>
			<Link href={Routes.GIVbacks}>
				<Item theme={theme}>
					<ItemTitle upperCase theme={theme}>
						GIVbacks
					</ItemTitle>
					<Flex gap='4px'>
						<PartAmount medium>
							{formatWeiHelper(givbackLiquidPart)}
						</PartAmount>
						<PartUnit>GIV</PartUnit>
						<ForwardWrapper>
							<IconForward16 />
						</ForwardWrapper>
					</Flex>
				</Item>
			</Link>
			<OutlineLinkButton
				isExternal
				label={formatMessage({ id: 'label.get_giv_token' })}
				size='small'
				linkType='primary'
				href={config.XDAI_CONFIG.GIV.BUY_LINK}
				target='_blank'
			/>
			{showWhatIsGIVstreamModal && (
				<WhatIsStreamModal
					tokenDistroHelper={givTokenDistroHelper}
					setShowModal={setShowWhatIsGIVstreamModal}
					cb={close}
				/>
			)}
		</>
	);
};

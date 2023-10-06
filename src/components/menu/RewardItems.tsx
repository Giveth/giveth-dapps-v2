import {
	Caption,
	IconForward16,
	IconHelpFilled16,
	OutlineLinkButton,
} from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useChainId } from 'wagmi';
import { Flex } from '../styled-components/Flex';
import config from '@/configuration';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { formatWeiHelper } from '@/helpers/number';
import { WhatIsStreamModal } from '@/components/modals/WhatIsStream';
import { getUserStakeInfo } from '@/lib/stakingPool';
import Routes from '@/lib/constants/Routes';
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
import { chainNameById } from '@/lib/network';
import { getNetworkConfig } from '@/helpers/givpower';

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
	const [farmsLiquidPart, setFarmsLiquidPart] = useState(0n);
	const [givStreamLiquidPart, setGIVstreamLiquidPart] = useState(0n);
	const [flowRateNow, setFlowRateNow] = useState(0n);

	const currentValues = useAppSelector(state => state.subgraph.currentValues);
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();
	const chainId = useChainId();
	const dispatch = useAppDispatch();

	const sdh = new SubgraphDataHelper(currentValues);

	const tokenDistroBalance = sdh.getGIVTokenDistroBalance();
	const { givbackLiquidPart } = tokenDistroBalance;
	const networkName = chainNameById(chainId);
	const { close } = useItemsContext();
	const _config = getNetworkConfig(config.GNOSIS_NETWORK_NUMBER, chainId);

	useEffect(() => {
		const _allocatedTokens = BigInt(tokenDistroBalance.allocatedTokens);
		const _givbackLiquidPart = BigInt(tokenDistroBalance.givbackLiquidPart);
		const _claimed = BigInt(tokenDistroBalance.claimed);
		setGIVstreamLiquidPart(
			givTokenDistroHelper.getLiquidPart(
				_allocatedTokens - _givbackLiquidPart,
			) - _claimed,
		);
		setFlowRateNow(
			givTokenDistroHelper.getStreamPartTokenPerWeek(
				_allocatedTokens - _givbackLiquidPart,
			),
		);
	}, [currentValues, givTokenDistroHelper]);

	useEffect(() => {
		if (!chainId) return;
		const networkConfig = config.NETWORKS_CONFIG[chainId];

		if (!networkConfig || !networkConfig.pools) return;
		let pools = [];
		if (networkConfig.GIVPOWER) {
			pools = [networkConfig.GIVPOWER, ...networkConfig.pools];
		} else {
			pools = networkConfig.pools;
		}

		if (pools) {
			let _farmRewards = 0n;
			pools.forEach(pool => {
				if (pool.type !== StakingType.UNISWAPV3_ETH_GIV) {
					if (!pool?.exploited) {
						_farmRewards += getUserStakeInfo(
							currentValues,
							pool as SimplePoolStakingConfig,
						).earned;
					}
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
							{formatWeiHelper(flowRateNow.toString())}
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
							{formatWeiHelper(givStreamLiquidPart.toString())}
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
							{formatWeiHelper(farmsLiquidPart.toString())}
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
				href={_config.GIV_BUY_LINK}
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

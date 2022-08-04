import React, { useEffect, useState } from 'react';
import {
	IconGIVFarm,
	IconExternalLink,
	GLink,
	IconCopy,
} from '@giveth/ui-design-system';
import { BigNumber } from 'bignumber.js';
import { constants } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Flex } from '@/components/styled-components/Flex';
import StakingPoolCard from '@/components/cards/StakingPoolCard';
import config from '@/configuration';
import {
	BasicNetworkConfig,
	SimplePoolStakingConfig,
	StakingType,
} from '@/types/config';
import {
	GIVfarmTopContainer,
	Subtitle,
	Title,
	GIVfarmRewardCard,
	PoolRow,
	ContractRow,
	CopyWrapper,
	GIVfarmBottomContainer,
	ArchivedPoolsToggle,
} from './GIVfarm.sc';
import RadioButton from '@/components/RadioButton';
import { NetworkSelector } from '@/components/NetworkSelector';
import StakingPositionCard from '@/components/cards/StakingPositionCard';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { useFarms } from '@/context/farm.context';
import { TopInnerContainer, ExtLinkRow } from './commons';
import { givEconomySupportedNetworks } from '@/lib/constants/constants';
import { shortenAddress } from '@/lib/helpers';
import { Col, Container, Row } from '@/components/Grid';

import { GIVfrens } from '@/components/givfarm/GIVfrens';
import GIVpowerStakingPoolCard from '../cards/GIVpowerStakingPoolCard';
import { GIVpowerProvider } from '@/context/givpower.context';

const renderPools = (
	pools: BasicNetworkConfig['pools'],
	network: number,
	showArchivedPools?: boolean,
) => {
	return pools
		.filter(p => (showArchivedPools ? true : p.active && !p.archived))
		.map((poolStakingConfig, idx) => ({ poolStakingConfig, idx }))
		.sort(
			(
				{
					idx: idx1,
					poolStakingConfig: { active: active1, archived: archived1 },
				},
				{
					idx: idx2,
					poolStakingConfig: { active: active2, archived: archived2 },
				},
			) =>
				+active2 - +active1 ||
				+!!archived2 - +!!archived1 ||
				idx1 - idx2,
		)
		.map(({ poolStakingConfig }, index) => {
			return (
				<Col
					sm={6}
					lg={4}
					key={`staking_pool_card_${network}_${index}`}
				>
					{poolStakingConfig.type ===
					StakingType.UNISWAPV3_ETH_GIV ? (
						<StakingPositionCard
							poolStakingConfig={poolStakingConfig}
						/>
					) : (
						<StakingPoolCard
							key={`staking_pool_card_${network}_${index}`}
							network={network}
							poolStakingConfig={
								poolStakingConfig as SimplePoolStakingConfig
							}
						/>
					)}
				</Col>
			);
		});
};

export const TabGIVfarmTop = () => {
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();
	const { totalEarned } = useFarms();
	const { chainId } = useWeb3React();

	useEffect(() => {
		setRewardLiquidPart(givTokenDistroHelper.getLiquidPart(totalEarned));
		setRewardStream(
			givTokenDistroHelper.getStreamPartTokenPerWeek(totalEarned),
		);
	}, [totalEarned, givTokenDistroHelper]);

	return (
		<GIVfarmTopContainer>
			<TopInnerContainer>
				<Row style={{ alignItems: 'flex-end' }}>
					<Col xs={12} sm={7} xl={8}>
						<Flex alignItems='baseline' gap='16px'>
							<Title>GIVfarm</Title>
							<IconGIVFarm size={64} />
						</Flex>
						<Subtitle size='medium'>
							Stake tokens in the GIVfarm to grow your rewards.
						</Subtitle>
					</Col>
					<Col xs={12} sm={5} xl={4}>
						<GIVfarmRewardCard
							title='Your GIVfarm rewards'
							wrongNetworkText='GIVfarm is only available on Mainnet and Gnosis Chain.'
							liquidAmount={rewardLiquidPart}
							stream={rewardStream}
							network={chainId}
							targetNetworks={[
								config.MAINNET_NETWORK_NUMBER,
								config.XDAI_NETWORK_NUMBER,
							]}
						/>
					</Col>
				</Row>
			</TopInnerContainer>
		</GIVfarmTopContainer>
	);
};

export const TabGIVfarmBottom = () => {
	const { chainId } = useWeb3React();
	const [showArchivedPools, setArchivedPools] = useState(false);

	return (
		<GIVfarmBottomContainer>
			<Container>
				<Flex alignItems='center' gap='24px' wrap={1}>
					<NetworkSelector />
					<ExtLinkRow alignItems='center'>
						<GLink
							size='Big'
							target='_blank'
							rel='noreferrer'
							href='https://omni.xdaichain.com/bridge'
						>
							Bridge your GIV
						</GLink>
						<IconExternalLink />
					</ExtLinkRow>
					<ExtLinkRow alignItems='center'>
						<GLink
							size='Big'
							target='_blank'
							rel='noreferrer'
							href={
								chainId === config.XDAI_NETWORK_NUMBER
									? config.XDAI_CONFIG.GIV.BUY_LINK
									: config.MAINNET_CONFIG.GIV.BUY_LINK
							}
						>
							Buy GIV token
						</GLink>
						<IconExternalLink />
					</ExtLinkRow>
					<ContractRow>
						<GLink>{`Contract (${
							chainId === config.XDAI_NETWORK_NUMBER
								? config.XDAI_CONFIG.chainName
								: config.MAINNET_CONFIG.chainName
						}):`}</GLink>
						<GLink>
							{shortenAddress(
								chainId === config.XDAI_NETWORK_NUMBER
									? config.XDAI_CONFIG.TOKEN_ADDRESS
									: config.MAINNET_CONFIG.TOKEN_ADDRESS,
							)}
						</GLink>
						<CopyWrapper
							onClick={() => {
								navigator.clipboard.writeText(
									chainId === config.XDAI_NETWORK_NUMBER
										? config.XDAI_CONFIG.TOKEN_ADDRESS
										: config.MAINNET_CONFIG.TOKEN_ADDRESS,
								);
							}}
						>
							<IconCopy />
						</CopyWrapper>
					</ContractRow>
				</Flex>
				<ArchivedPoolsToggle>
					<RadioButton
						title='Show archived pools'
						toggleRadio={() => setArchivedPools(!showArchivedPools)}
						isSelected={showArchivedPools}
					/>
				</ArchivedPoolsToggle>
				{chainId === config.XDAI_NETWORK_NUMBER && (
					<>
						<PoolRow>
							<GIVpowerProvider>
								<Col sm={6} lg={4} key={`givpower_card`}>
									<GIVpowerStakingPoolCard />
								</Col>
							</GIVpowerProvider>
							{renderPools(
								config.XDAI_CONFIG.pools,
								config.XDAI_NETWORK_NUMBER,
								showArchivedPools,
							)}
						</PoolRow>
						<GIVfrens
							regenFarms={config.XDAI_CONFIG.regenFarms}
							network={config.XDAI_NETWORK_NUMBER}
						/>
					</>
				)}
				{(!chainId ||
					chainId === config.MAINNET_NETWORK_NUMBER ||
					!givEconomySupportedNetworks.includes(chainId)) && (
					<>
						<PoolRow
							disabled={
								!chainId ||
								!givEconomySupportedNetworks.includes(chainId)
							}
						>
							<GIVpowerProvider>
								<Col sm={6} lg={4} key={`givpower_card`}>
									<GIVpowerStakingPoolCard />
								</Col>
							</GIVpowerProvider>
							{renderPools(
								config.MAINNET_CONFIG.pools,
								config.MAINNET_NETWORK_NUMBER,
								showArchivedPools,
							)}
						</PoolRow>
						<GIVfrens
							regenFarms={config.MAINNET_CONFIG.regenFarms}
							network={config.MAINNET_NETWORK_NUMBER}
						/>
					</>
				)}
				<Col xs={12}></Col>
			</Container>
		</GIVfarmBottomContainer>
	);
};

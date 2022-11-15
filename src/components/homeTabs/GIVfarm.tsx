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
	SimplePoolStakingConfig,
	StakingType,
	UniswapV3PoolStakingConfig,
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
import { getGivStakingConfig } from '@/helpers/networkProvider';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { useFarms } from '@/context/farm.context';
import { TopInnerContainer, ExtLinkRow } from './commons';
import { shortenAddress } from '@/lib/helpers';
import { Col, Container, Row } from '@/components/Grid';

import { GIVfrens } from '@/components/givfarm/GIVfrens';
import GIVpowerStakingPoolCard from '../cards/GIVpowerStakingPoolCard';
import { GIVpowerProvider } from '@/context/givpower.context';
import { DaoCard } from '../givfarm/DaoCard';
import { getNowUnixMS } from '@/helpers/time';
import { TWO_WEEK } from '@/lib/constants/constants';

const renderPool = (
	pool: SimplePoolStakingConfig | UniswapV3PoolStakingConfig,
	id: number,
) => (
	<Col sm={6} lg={4} key={`staking_pool_card_${pool.network}_${id}`}>
		{pool.type === StakingType.UNISWAPV3_ETH_GIV ? (
			<StakingPositionCard poolStakingConfig={pool} />
		) : (
			<StakingPoolCard
				poolStakingConfig={pool as SimplePoolStakingConfig}
			/>
		)}
	</Col>
);

const renderPools = (chainId?: number, showArchivedPools?: boolean) => {
	const pools =
		chainId === config.XDAI_NETWORK_NUMBER
			? [...config.XDAI_CONFIG.pools, ...config.MAINNET_CONFIG.pools]
			: [...config.MAINNET_CONFIG.pools, ...config.XDAI_CONFIG.pools];

	const now = getNowUnixMS();
	const filteredPools = [];
	const discontinuedPools = [];
	for (let i = 0; i < pools.length; i++) {
		const pool = pools[i];
		const { farmEndTimeMS } = pool;
		const archived = farmEndTimeMS && now > farmEndTimeMS + TWO_WEEK;
		if (!showArchivedPools && archived) continue;
		if (farmEndTimeMS && now > farmEndTimeMS) {
			discontinuedPools.push(renderPool(pool, i));
		} else {
			filteredPools.push(renderPool(pool, i));
		}
	}
	return [...filteredPools, ...discontinuedPools];
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
				<Flex
					alignItems='center'
					gap='24px'
					wrap={1}
					justifyContent='space-between'
				>
					<NetworkSelector />
					<Flex alignItems='center' gap='24px' wrap={1}>
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
											: config.MAINNET_CONFIG
													.TOKEN_ADDRESS,
									);
								}}
							>
								<IconCopy />
							</CopyWrapper>
						</ContractRow>
					</Flex>
				</Flex>
				<ArchivedPoolsToggle>
					<RadioButton
						title='Show archived pools'
						toggleRadio={() => setArchivedPools(!showArchivedPools)}
						isSelected={showArchivedPools}
					/>
				</ArchivedPoolsToggle>
				<PoolRow>
					<GIVpowerProvider>
						<Col sm={6} lg={4} key={`givpower_card`}>
							<GIVpowerStakingPoolCard />
						</Col>
					</GIVpowerProvider>
					{showArchivedPools && (
						<Col sm={6} lg={4}>
							<StakingPoolCard
								poolStakingConfig={getGivStakingConfig(
									config.MAINNET_CONFIG,
								)}
							/>
						</Col>
					)}
					{renderPools(chainId, showArchivedPools)}
				</PoolRow>
				<GIVfrens showArchivedPools={showArchivedPools} />
				<Col xs={12}>
					<DaoCard />
				</Col>
			</Container>
		</GIVfarmBottomContainer>
	);
};

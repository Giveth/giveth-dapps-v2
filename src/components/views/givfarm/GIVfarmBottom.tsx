import React, { useState } from 'react';
import { IconExternalLink, GLink, IconCopy } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import { Flex } from '@/components/styled-components/Flex';
import config from '@/configuration';
import {
	SimplePoolStakingConfig,
	UniswapV3PoolStakingConfig,
} from '@/types/config';
import {
	PoolRow,
	ContractRow,
	CopyWrapper,
	GIVfarmBottomContainer,
	ArchivedPoolsToggle,
} from '../../GIVeconomyPages/GIVfarm.sc';
import RadioButton from '@/components/RadioButton';
import { NetworkSelector } from '@/components/NetworkSelector';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { ExtLinkRow } from '../../GIVeconomyPages/commons';
import { shortenAddress } from '@/lib/helpers';
import { Col, Container } from '@/components/Grid';

import { DaoCard } from '../../givfarm/DaoCard';
import { getNowUnixMS } from '@/helpers/time';
import { TWO_WEEK } from '@/lib/constants/constants';
import StakingPoolCard from '../../cards/StakingCards/StakingPoolCard';
import { RegenStreamSection } from '@/components/givfarm/RegenStreamSection';

const renderPool = (
	pool: SimplePoolStakingConfig | UniswapV3PoolStakingConfig,
	id: number,
) => (
	<Col sm={6} lg={4} key={`staking_pool_card_${pool.network}_${id}`}>
		{/* {pool.type === StakingType.UNISWAPV3_ETH_GIV ? (
			<StakingPositionCard poolStakingConfig={pool} />
		) : (
			)} */}
		<StakingPoolCard poolStakingConfig={pool as SimplePoolStakingConfig} />
	</Col>
);

const renderPools = (chainId?: number, showArchivedPools?: boolean) => {
	const pools =
		chainId === config.XDAI_NETWORK_NUMBER
			? [
					...config.XDAI_CONFIG.pools,
					...config.XDAI_CONFIG.regenPools,
					...config.MAINNET_CONFIG.pools,
					...config.MAINNET_CONFIG.regenPools,
			  ]
			: [
					...config.MAINNET_CONFIG.pools,
					...config.MAINNET_CONFIG.regenPools,
					...config.XDAI_CONFIG.pools,
					...config.XDAI_CONFIG.regenPools,
			  ];

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

export const GIVfarmBottom = () => {
	const { formatMessage } = useIntl();
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
								as='a'
								size='Big'
								target='_blank'
								rel='noreferrer'
								href='https://omni.xdaichain.com/bridge'
							>
								{formatMessage({ id: 'label.bridge_your_giv' })}
							</GLink>
							<IconExternalLink />
						</ExtLinkRow>
						<ExtLinkRow alignItems='center'>
							<GLink
								as='a'
								size='Big'
								target='_blank'
								rel='noreferrer'
								href={
									chainId === config.XDAI_NETWORK_NUMBER
										? config.XDAI_CONFIG.GIV.BUY_LINK
										: config.MAINNET_CONFIG.GIV.BUY_LINK
								}
							>
								{formatMessage({ id: 'label.buy_giv_token' })}
							</GLink>
							<IconExternalLink />
						</ExtLinkRow>
						<ContractRow>
							<GLink>{`${formatMessage({
								id: 'label.contract',
							})} (${
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
						title={formatMessage({
							id: 'label.show_archived_pools',
						})}
						toggleRadio={() => setArchivedPools(!showArchivedPools)}
						isSelected={showArchivedPools}
					/>
				</ArchivedPoolsToggle>
				<PoolRow>
					<Col sm={6} lg={4} key={`givpower_card`}>
						<StakingPoolCard
							poolStakingConfig={getGivStakingConfig(
								config.XDAI_CONFIG,
							)}
						/>
					</Col>
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
				<RegenStreamSection showArchivedPools={showArchivedPools} />
				<Col xs={12}>
					<DaoCard />
				</Col>
			</Container>
		</GIVfarmBottomContainer>
	);
};

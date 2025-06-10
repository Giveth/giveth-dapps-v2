import React, { useState } from 'react';
import {
	IconExternalLink,
	GLink,
	IconCopy,
	Col,
	Container,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useAccount } from 'wagmi';
import config from '@/configuration';
import {
	BalancerPoolStakingConfig,
	ICHIPoolStakingConfig,
	SimplePoolStakingConfig,
} from '@/types/config';
import {
	PoolRow,
	ContractRow,
	CopyWrapper,
	GIVfarmBottomContainer,
	GIVfarmToolBoxRow,
} from '../../GIVeconomyPages/GIVfarm.sc';
import { NetworkSelector } from '@/components/NetworkSelector';
import { ExtLinkRow } from '../../GIVeconomyPages/commons';
import { shortenAddress } from '@/lib/helpers';

import { DaoCard } from '../../givfarm/DaoCard';
import { getNowUnixMS } from '@/helpers/time';
import { TWO_WEEK } from '@/lib/constants/constants';
import StakingPoolCard from '@/components/cards/StakingCards/BaseStakingCard/BaseStakingCard';
import { RegenStreamSection } from '@/components/givfarm/RegenStreamSection';
import ToggleSwitch from '@/components/ToggleSwitch';
import { getNetworkConfig } from '@/helpers/givpower';

const renderPool = (
	pool: SimplePoolStakingConfig,
	id: number,
	isArchived: boolean = false,
) => (
	<Col sm={6} lg={4} key={`staking_pool_card_${pool.network}_${id}`}>
		<StakingPoolCard
			poolStakingConfig={pool as SimplePoolStakingConfig}
			isArchived={isArchived}
		/>
	</Col>
);

const getPoolsInfoByChainID = (
	chainId?: number,
): Array<
	SimplePoolStakingConfig | BalancerPoolStakingConfig | ICHIPoolStakingConfig
> => {
	switch (chainId) {
		case config.GNOSIS_NETWORK_NUMBER:
			return [
				...(config.GNOSIS_CONFIG.GIVPOWER
					? [config.GNOSIS_CONFIG.GIVPOWER]
					: []),
				...(config.OPTIMISM_CONFIG.GIVPOWER
					? [config.OPTIMISM_CONFIG.GIVPOWER]
					: []),
				...(config.ZKEVM_CONFIG.GIVPOWER
					? [config.ZKEVM_CONFIG.GIVPOWER]
					: []),
				...config.GNOSIS_CONFIG.pools,
				...config.GNOSIS_CONFIG.regenPools,
				...(config.MAINNET_CONFIG.pools || []),
				...(config.MAINNET_CONFIG.regenPools || []),
			];

		case config.OPTIMISM_NETWORK_NUMBER:
			return [
				...(config.OPTIMISM_CONFIG.GIVPOWER
					? [config.OPTIMISM_CONFIG.GIVPOWER]
					: []),
				...(config.GNOSIS_CONFIG.GIVPOWER
					? [config.GNOSIS_CONFIG.GIVPOWER]
					: []),
				...(config.ZKEVM_CONFIG.GIVPOWER
					? [config.ZKEVM_CONFIG.GIVPOWER]
					: []),
				...config.GNOSIS_CONFIG.pools,
				...config.GNOSIS_CONFIG.regenPools,
				...(config.MAINNET_CONFIG.pools || []),
				...(config.MAINNET_CONFIG.regenPools || []),
			];
		case config.ZKEVM_NETWORK_NUMBER:
			return [
				...(config.ZKEVM_CONFIG.GIVPOWER
					? [config.ZKEVM_CONFIG.GIVPOWER]
					: []),
				...(config.GNOSIS_CONFIG.GIVPOWER
					? [config.GNOSIS_CONFIG.GIVPOWER]
					: []),
				...(config.OPTIMISM_CONFIG.GIVPOWER
					? [config.OPTIMISM_CONFIG.GIVPOWER]
					: []),
				...config.GNOSIS_CONFIG.pools,
				...config.GNOSIS_CONFIG.regenPools,
				...(config.MAINNET_CONFIG.pools || []),
				...(config.MAINNET_CONFIG.regenPools || []),
			];

		default:
			return [
				...(config.ZKEVM_CONFIG.GIVPOWER
					? [config.ZKEVM_CONFIG.GIVPOWER]
					: []),
				...(config.GNOSIS_CONFIG.GIVPOWER
					? [config.GNOSIS_CONFIG.GIVPOWER]
					: []),
				...(config.OPTIMISM_CONFIG.GIVPOWER
					? [config.OPTIMISM_CONFIG.GIVPOWER]
					: []),
				...(config.MAINNET_CONFIG.pools || []),
				...(config.MAINNET_CONFIG.regenPools || []),
				...config.GNOSIS_CONFIG.pools,
				...config.GNOSIS_CONFIG.regenPools,
			];
	}
};

const POLYGON_ZKEVM_HIDE_DATE_MS = Date.UTC(2025, 6, 10, 0, 0, 0); // July 10, 2025

const ZKEVM_CHAIN_ID = config.ZKEVM_NETWORK_NUMBER; // Polygon zkEVM chain ID

const renderPools = (chainId?: number, showArchivedPools?: boolean) => {
	const pools = getPoolsInfoByChainID(chainId);

	const now = getNowUnixMS();
	const filteredPools = [];
	const archivedPools = [];
	for (let i = 0; i < pools.length; i++) {
		const pool = pools[i];
		const { farmEndTimeMS, network } = pool;

		const isZkEvmPool = network === ZKEVM_CHAIN_ID;

		const archivedByFarmEnd =
			farmEndTimeMS && now > farmEndTimeMS + TWO_WEEK;

		const zkEvmArchived = isZkEvmPool && now >= POLYGON_ZKEVM_HIDE_DATE_MS;

		const archived = archivedByFarmEnd || zkEvmArchived;

		if (archived) {
			archivedPools.push(renderPool(pool, i, true));
		} else {
			filteredPools.push(renderPool(pool, i, false));
		}
	}

	return showArchivedPools ? archivedPools : filteredPools;
};

export const GIVfarmBottom = () => {
	const { formatMessage } = useIntl();
	const { chain } = useAccount();
	const chainId = chain?.id;
	const [showArchivedPools, setShowArchivedPools] = useState(false);

	const _config = getNetworkConfig(config.GNOSIS_NETWORK_NUMBER, chainId);

	return (
		<GIVfarmBottomContainer>
			<Container>
				<GIVfarmToolBoxRow
					$alignItems='center'
					gap='24px'
					$flexWrap
					$justifyContent='space-between'
				>
					<NetworkSelector />
					<ExtLinkRow $alignItems='center'>
						<GLink
							as='a'
							size='Big'
							target='_blank'
							rel='noreferrer'
							href='https://linktr.ee/GIVtoken'
						>
							{formatMessage({ id: 'label.bridge_your_giv' })}
						</GLink>
						<IconExternalLink />
					</ExtLinkRow>
					<ContractRow>
						<GLink>{`${formatMessage({
							id: 'label.contract',
						})} (${_config.name}):`}</GLink>
						<GLink>
							{shortenAddress(_config.GIV_TOKEN_ADDRESS)}
						</GLink>
						<CopyWrapper
							onClick={() => {
								navigator.clipboard.writeText(
									_config.GIV_TOKEN_ADDRESS || '',
								);
							}}
						>
							<IconCopy />
						</CopyWrapper>
					</ContractRow>
					<ToggleSwitch
						label={formatMessage({
							id: 'label.switch_to_archive_cards',
						})}
						isOn={showArchivedPools}
						toggleOnOff={setShowArchivedPools}
					/>
				</GIVfarmToolBoxRow>
				<PoolRow>{renderPools(chainId, showArchivedPools)}</PoolRow>
				<RegenStreamSection showArchivedPools={showArchivedPools} />
				<DaoCard />
			</Container>
		</GIVfarmBottomContainer>
	);
};

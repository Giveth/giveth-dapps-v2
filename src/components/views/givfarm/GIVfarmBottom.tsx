import React, { useState } from 'react';
import {
	IconExternalLink,
	GLink,
	IconCopy,
	Col,
	Container,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import config from '@/configuration';
import {
	GIVTokenConfig,
	SimplePoolStakingConfig,
	UniswapV3PoolStakingConfig,
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
import ToggleSwitch from '@/components/styled-components/Switch';

const renderPool = (
	pool: SimplePoolStakingConfig | UniswapV3PoolStakingConfig,
	id: number,
) => (
	<Col sm={6} lg={4} key={`staking_pool_card_${pool.network}_${id}`}>
		<StakingPoolCard poolStakingConfig={pool as SimplePoolStakingConfig} />
	</Col>
);

const renderPools = (chainId?: number, showArchivedPools?: boolean) => {
	const pools =
		chainId === config.GNOSIS_NETWORK_NUMBER
			? [
					config.GNOSIS_CONFIG.GIVPOWER,
					config.OPTIMISM_CONFIG.GIVPOWER,
					...config.GNOSIS_CONFIG.pools,
					...config.GNOSIS_CONFIG.regenPools,
					...config.MAINNET_CONFIG.pools,
					...config.MAINNET_CONFIG.regenPools,
			  ]
			: chainId === config.OPTIMISM_NETWORK_NUMBER
			? [
					config.OPTIMISM_CONFIG.GIVPOWER,
					config.GNOSIS_CONFIG.GIVPOWER,
					...config.GNOSIS_CONFIG.pools,
					...config.GNOSIS_CONFIG.regenPools,
					...config.MAINNET_CONFIG.pools,
					...config.MAINNET_CONFIG.regenPools,
			  ]
			: [
					config.GNOSIS_CONFIG.GIVPOWER,
					config.OPTIMISM_CONFIG.GIVPOWER,
					...config.MAINNET_CONFIG.pools,
					...config.MAINNET_CONFIG.regenPools,
					...config.GNOSIS_CONFIG.pools,
					...config.GNOSIS_CONFIG.regenPools,
			  ];

	const now = getNowUnixMS();
	const filteredPools = [];
	const archivedPools = [];
	for (let i = 0; i < pools.length; i++) {
		const pool = pools[i];
		const { farmEndTimeMS } = pool;
		const archived = farmEndTimeMS && now > farmEndTimeMS + TWO_WEEK;
		if (archived) {
			archivedPools.push(renderPool(pool, i));
		} else {
			filteredPools.push(renderPool(pool, i));
		}
	}
	return showArchivedPools ? archivedPools : filteredPools;
};

export const GIVfarmBottom = () => {
	const { formatMessage } = useIntl();
	const { chainId } = useWeb3React();
	const [showArchivedPools, setShowArchivedPools] = useState(false);

	const _config =
		config.NETWORKS_CONFIG[chainId || config.GNOSIS_NETWORK_NUMBER];

	return (
		<GIVfarmBottomContainer>
			<Container>
				<GIVfarmToolBoxRow
					alignItems='center'
					gap='24px'
					flexWrap
					justifyContent='space-between'
				>
					<NetworkSelector />
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
							href={(_config as GIVTokenConfig).GIV_BUY_LINK}
						>
							{formatMessage({ id: 'label.buy_giv_token' })}
						</GLink>
						<IconExternalLink />
					</ExtLinkRow>
					<ContractRow>
						<GLink>{`${formatMessage({
							id: 'label.contract',
						})} (${_config.chainName}):`}</GLink>
						<GLink>
							{shortenAddress(
								(_config as GIVTokenConfig).GIV_TOKEN_ADDRESS,
							)}
						</GLink>
						<CopyWrapper
							onClick={() => {
								navigator.clipboard.writeText(
									(_config as GIVTokenConfig)
										.GIV_TOKEN_ADDRESS,
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
						checked={showArchivedPools}
						setStateChange={setShowArchivedPools}
					/>
				</GIVfarmToolBoxRow>
				<PoolRow>{renderPools(chainId, showArchivedPools)}</PoolRow>
				<RegenStreamSection showArchivedPools={showArchivedPools} />
				<DaoCard />
			</Container>
		</GIVfarmBottomContainer>
	);
};

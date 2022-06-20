import React, { FC } from 'react';
import { H3 } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import {
	DAOContainer,
	GIVfrensLink,
	Subtitle,
	DAOChangeNetwork,
} from '@/components/givfarm/GIVfrens.sc';
import { PoolRow } from '@/components/homeTabs/GIVfarm.sc';
import StakingPoolCard from '@/components/cards/StakingPoolCard';
import config from '@/configuration';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { Col, Row } from '../Grid';
import DAOChangeNetworkModal from './DAOChangeNetworkModal';
import { GIVpowerDescCard } from './GIVpowerDescCard';

interface IGIVpowerProps {}

export const GIVpower: FC<IGIVpowerProps> = () => {
	const { chainId } = useWeb3React();

	return (
		<>
			<H3 weight={700}>GIVpower</H3>
			<Col md={8} lg={6}>
				<Subtitle>
					Explore a multiverse of projects changing the world and earn
					rewards for staking liquidity.&nbsp;
					<GIVfrensLink size='Big' href='/givpower'>
						Learn more
					</GIVfrensLink>
					.
				</Subtitle>
			</Col>
			<PoolRow>
				<DAOContainer key={`givpower_staking_pool_card`} xs={12}>
					<Row>
						<Col xs={12} md={6} lg={4}>
							<StakingPoolCard
								network={chainId || config.XDAI_NETWORK_NUMBER}
								poolStakingConfig={getGivStakingConfig(
									config.XDAI_CONFIG,
								)}
							/>
						</Col>
						<Col xs={12} md={6} lg={8}>
							<GIVpowerDescCard />
						</Col>
					</Row>
					{chainId !== config.MAINNET_NETWORK_NUMBER &&
						chainId !== config.XDAI_NETWORK_NUMBER && (
							<>
								<DAOChangeNetwork />
								<DAOChangeNetworkModal
									network={config.MAINNET_NETWORK_NUMBER}
								/>
							</>
						)}
				</DAOContainer>
			</PoolRow>
		</>
	);
};

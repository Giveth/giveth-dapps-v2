import React, { FC } from 'react';
import { H3 } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { RegenPoolStakingConfig } from '@/types/config';
import { DAOContainer, GIVfrensLink, Subtitle } from '@/components/GIVfrens.sc';
import { PoolRow } from '@/components/homeTabs/GIVfarm.sc';
import StakingPoolCard from '@/components/cards/StakingPoolCard';
import { Col, Row } from './Grid';
import config from '@/configuration';
import { givEconomySupportedNetworks } from '@/lib/constants/constants';
import { RegenStreamCard } from './RegenStreamCard';

interface IGIVfrensProps {
	regenFarms: RegenPoolStakingConfig[];
	network: number;
}

interface IChangeNetworkModal {
	network: number;
}

export const GIVfrens: FC<IGIVfrensProps> = ({ regenFarms, network }) => {
	const { chainId } = useWeb3React();
	if (regenFarms.length === 0) return null;

	return (
		<>
			<H3 weight={700}>RegenFarms</H3>
			<Col md={8} lg={6}>
				<Subtitle>
					Explore a multiverse of projects changing the world and earn
					rewards for staking liquidity.&nbsp;
					<GIVfrensLink
						size='Big'
						href=' https://medium.com/giveth/regenfarms-the-next-generation-of-refi-opportunities-7a46f3cf1e09'
						target='_blank'
						rel='noreferrer'
					>
						Learn more
					</GIVfrensLink>
					.
				</Subtitle>
			</Col>
			<PoolRow>
				{regenFarms.map((poolStakingConfig, index) => {
					const regenStream = config.NETWORKS_CONFIG[
						network
					].regenStreams.find(
						s => s.type === poolStakingConfig.regenStreamType,
					);
					return (
						<DAOContainer
							key={`regen_staking_pool_card_${network}_${index}`}
							xs={12}
						>
							<Row>
								<Col xs={12} sm={6} lg={4}>
									<StakingPoolCard
										network={network}
										poolStakingConfig={poolStakingConfig}
									/>
								</Col>
								<Col xs={12} sm={6} lg={8}>
									{regenStream && (
										<RegenStreamCard
											streamConfig={regenStream}
											network={
												givEconomySupportedNetworks.includes(
													chainId as number,
												)
													? (chainId as number)
													: config.MAINNET_NETWORK_NUMBER
											}
										/>
									)}
								</Col>
							</Row>
						</DAOContainer>
					);
				})}
			</PoolRow>
		</>
	);
};

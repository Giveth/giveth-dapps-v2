import { RegenPoolStakingConfig } from '@/types/config';
import React, { FC } from 'react';
import { H3 } from '@giveth/ui-design-system';
import { GIVfrensLink, Subtitle } from '@/components/GIVfrens.sc';
import { PoolRow } from '@/components/homeTabs/GIVfarm.sc';
import { useWeb3React } from '@web3-react/core';
import StakingPoolCard from '@/components/cards/StakingPoolCard';
import { Col } from './Grid';

interface IGIVfrensProps {
	regenFarms: RegenPoolStakingConfig[];
	network: number;
}

export const GIVfrens: FC<IGIVfrensProps> = ({ regenFarms, network }) => {
	const { chainId } = useWeb3React();

	if (regenFarms.length === 0) return null;
	return (
		<>
			<H3 weight={700}>RegenFarms</H3>

			<Subtitle>
				Explore a multiverse of projects changing the world and earn
				rewards for staking liquidity.&nbsp;
				<GIVfrensLink
					size='Big'
					href='https://medium.com/giveth/farm-to-table-yields-with-decentralized-philanthropy-a5d71d28ef0d'
				>
					Learn more
				</GIVfrensLink>
				.
			</Subtitle>
			<PoolRow disabled={!chainId || chainId !== network}>
				{regenFarms.map((poolStakingConfig, index) => {
					return (
						<Col
							sm={6}
							lg={4}
							key={`regen_staking_pool_card_${network}_${index}`}
						>
							<StakingPoolCard
								network={network}
								poolStakingConfig={poolStakingConfig}
							/>
						</Col>
					);
				})}
			</PoolRow>
		</>
	);
};

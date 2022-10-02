import React, { FC } from 'react';
import { useWeb3React } from '@web3-react/core';
import { givEconomySupportedNetworks } from '@/lib/constants/constants';
import StakingPoolCard from './cards/StakingPoolCard';
import { DAOContainer } from './GIVfrens.sc';
import { Row, Col } from './Grid';
import { PoolRow } from './homeTabs/GIVfarm.sc';
import { RegenStreamCard } from './RegenStreamCard';
import config from '@/configuration';
import { RegenFarmConfig } from '@/types/config';

interface IRegenFarmProps {
	regenFarm: RegenFarmConfig;
}

export const RegenFarm: FC<IRegenFarmProps> = ({ regenFarm }) => {
	const { chainId } = useWeb3React();
	const { pools } = regenFarm;

	return (
		<PoolRow>
			<DAOContainer key={`regenStream_${regenFarm.type}`} xs={12}>
				<Row>
					{pools.map((poolStakingConfig, idx) => (
						<Col key={idx} xs={12} sm={6} lg={4}>
							<StakingPoolCard
								poolStakingConfig={poolStakingConfig}
								regenStreamConfig={regenFarm}
							/>
						</Col>
					))}
					<Col xs={12} lg={4}>
						{regenFarm && (
							<RegenStreamCard
								streamConfig={regenFarm}
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
				{/* {chainId !== config.MAINNET_NETWORK_NUMBER &&
					chainId !== config.XDAI_NETWORK_NUMBER && (
						<>
							<DAOChangeNetwork />
							<DAOChangeNetworkModal
								network={config.MAINNET_NETWORK_NUMBER}
							/>
						</>
					)} */}
			</DAOContainer>
		</PoolRow>
	);
};

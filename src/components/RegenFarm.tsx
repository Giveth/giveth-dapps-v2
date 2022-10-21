import React, { FC } from 'react';
import { useWeb3React } from '@web3-react/core';
import { H4 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import {
	givEconomySupportedNetworks,
	regenFarmStreamCardCol,
} from '@/lib/constants/constants';
import StakingPoolCard from './cards/StakingPoolCard';
import { Row, Col } from './Grid';
import { PoolRow } from './homeTabs/GIVfarm.sc';
import config from '@/configuration';
import { RegenFarmConfig } from '@/types/config';
import { DAOChangeNetworkModal } from './DAOChangeNetworkModal';
import { DAOContainer, DAOChangeNetwork } from './givfarm/GIVfrens.sc';
import { RegenStreamCard } from './givfarm/RegenStreamCard';

interface IRegenFarmProps {
	regenFarm: RegenFarmConfig;
	showArchivedPools: boolean;
}

export const RegenFarm: FC<IRegenFarmProps> = ({
	regenFarm,
	showArchivedPools,
}) => {
	const { chainId } = useWeb3React();
	const { pools } = regenFarm;

	const filteredPools = showArchivedPools
		? pools
		: pools.filter(pool => pool.archived !== true);

	return (
		<PoolRow>
			<DAOContainer key={`regenStream_${regenFarm.type}`} xs={12}>
				<DaoTitle>{regenFarm.title}</DaoTitle>
				<Row>
					{filteredPools.map((poolStakingConfig, idx) => (
						<Col key={idx} xs={12} sm={6} lg={4}>
							<StakingPoolCard
								poolStakingConfig={poolStakingConfig}
								regenStreamConfig={regenFarm}
							/>
						</Col>
					))}
					<Col
						xs={12}
						sm={regenFarmStreamCardCol.sm[filteredPools.length]} // TODO: use mod()
						lg={regenFarmStreamCardCol.lg[filteredPools.length]} // TODO: use mod()
					>
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
	);
};

const DaoTitle = styled(H4)`
	margin-top: 32px;
	margin-bottom: 24px;
`;

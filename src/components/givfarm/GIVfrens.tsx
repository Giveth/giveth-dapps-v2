import React, { FC } from 'react';
import { H3 } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import config from '@/configuration';
import { Col } from '../Grid';
import { RegenFarm } from '../RegenFarm';
import { Subtitle, GIVfrensLink } from './GIVfrens.sc';

interface IGIVfrensProps {}

export const GIVfrens: FC<IGIVfrensProps> = () => {
	const { chainId } = useWeb3React();
	const regenFarms =
		chainId === config.XDAI_NETWORK_NUMBER
			? config.XDAI_CONFIG.regenFarms
			: config.MAINNET_CONFIG.regenFarms;

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
			{regenFarms.map((regenFarm, index) => (
				<RegenFarm key={index} regenFarm={regenFarm} />
			))}
		</>
	);
};

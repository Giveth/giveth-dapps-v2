import React, { FC } from 'react';
import { H3 } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { useIntl } from 'react-intl';
import { Col } from '../Grid';
import { Subtitle, GIVfrensLink } from './RegenStreamSection.sc';

interface IRegenStreamSectionProps {
	showArchivedPools: boolean;
}

export const RegenStreamSection: FC<IRegenStreamSectionProps> = ({
	showArchivedPools,
}) => {
	const { chainId } = useWeb3React();
	const { formatMessage } = useIntl();
	// const regenFarms =
	// 	chainId === config.XDAI_NETWORK_NUMBER
	// 		? config.XDAI_CONFIG.regenFarms
	// 		: config.MAINNET_CONFIG.regenFarms;

	return (
		<>
			<H3 weight={700}>RegenStreams</H3>
			<Col md={8} lg={6}>
				<Subtitle>
					{formatMessage({
						id: 'label.explore_a_multiverse_of_projects',
					})}
					&nbsp;
					<GIVfrensLink
						as='a'
						size='Big'
						href='https://docs.giveth.io/regenFarms'
						target='_blank'
						rel='noreferrer'
					>
						{formatMessage({ id: 'label.learn_more' })}
					</GIVfrensLink>
					.
				</Subtitle>
			</Col>
			{/* {regenFarms.map((regenFarm, index) => (
				<RegenFarm
					key={index}
					regenFarm={regenFarm}
					showArchivedPools={showArchivedPools}
				/>
			))} */}
		</>
	);
};

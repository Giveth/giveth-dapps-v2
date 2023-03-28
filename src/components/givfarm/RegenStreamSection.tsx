import React, { FC } from 'react';
import { Col, H3, Row } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { useIntl } from 'react-intl';
import { Subtitle, GIVfrensLink } from './RegenStreamSection.sc';
import config from '@/configuration';
import { RegenStreamCard } from './RegenStreamCard';

interface IRegenStreamSectionProps {
	showArchivedPools: boolean;
}

export const RegenStreamSection: FC<IRegenStreamSectionProps> = ({
	showArchivedPools,
}) => {
	const { chainId } = useWeb3React();
	const { formatMessage } = useIntl();
	const _regenStreams =
		chainId === config.XDAI_NETWORK_NUMBER
			? [
					...config.XDAI_CONFIG.regenStreams,
					...config.MAINNET_CONFIG.regenStreams,
			  ]
			: [
					...config.MAINNET_CONFIG.regenStreams,
					...config.XDAI_CONFIG.regenStreams,
			  ];
	const regenStreams = showArchivedPools
		? _regenStreams.filter(regenStream => regenStream.archived)
		: _regenStreams.filter(regenStream => !regenStream.archived);

	return (
		<>
			<H3 weight={700}>RegenStreams</H3>
			<Row>
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
			</Row>
			{regenStreams.map(regenStream => (
				<RegenStreamCard
					key={regenStream.type}
					streamConfig={regenStream}
				/>
			))}
		</>
	);
};

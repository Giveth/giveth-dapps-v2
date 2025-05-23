import React, { FC } from 'react';
import { Col, H3, Row } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useAccount } from 'wagmi';
import { Subtitle, GIVfrensLink } from './RegenStreamSection.sc';
import config from '@/configuration';
import { RegenStreamCard } from './RegenStreamCard';
import links from '@/lib/constants/links';

interface IRegenStreamSectionProps {
	showArchivedPools: boolean;
}

export const RegenStreamSection: FC<IRegenStreamSectionProps> = ({
	showArchivedPools,
}) => {
	const { chain } = useAccount();
	const chainId = chain?.id;
	const { formatMessage } = useIntl();
	const _regenStreams =
		chainId === config.GNOSIS_NETWORK_NUMBER
			? [
					...config.GNOSIS_CONFIG.regenStreams,
					...(config.MAINNET_CONFIG.regenStreams || []),
				]
			: [
					...(config.MAINNET_CONFIG.regenStreams || []),
					...config.GNOSIS_CONFIG.regenStreams,
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
							href={links.REGEN_FARM_DOCS}
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

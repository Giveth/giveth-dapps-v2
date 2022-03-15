import config from '@/configuration';
import { givEconomySupportedNetworks } from '@/utils/constants';
import { H3, Lead } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { GIVfrensLink } from './GIVfrens.sc';
import { RegenStream } from './RegenStream';
import { Flex } from './styled-components/Flex';

const RegenStreamBlock = () => {
	const { chainId } = useWeb3React();

	const networkConfig =
		chainId === config.XDAI_NETWORK_NUMBER
			? config.XDAI_CONFIG
			: config.MAINNET_CONFIG;
	const { regenStreams } = networkConfig;

	return regenStreams.length > 0 ? (
		<RegenStreamBlockContainer>
			<Title weight={700}>RegenStreams</Title>
			<Desc>
				When you harvest farming rewards from the RegenFarms, a portion
				of the rewards is added to a RegenStream. Each stream flows
				continuously until its respective end date.{' '}
				<GIVfrensLink
					size='Big'
					href='https://medium.com/giveth/farm-to-table-yields-with-decentralized-philanthropy-a5d71d28ef0d'
				>
					Learn more
				</GIVfrensLink>
				.
			</Desc>
			<RegenStreamsContainer>
				{regenStreams.map(streamConfig => {
					return (
						<RegenStreamContainer key={streamConfig.type}>
							<RegenStream
								streamConfig={streamConfig}
								network={
									givEconomySupportedNetworks.includes(
										chainId as number,
									)
										? (chainId as number)
										: config.MAINNET_NETWORK_NUMBER
								}
							/>
						</RegenStreamContainer>
					);
				})}
			</RegenStreamsContainer>
			<RegenStreamsContainer>
				{regenStreams.map(streamConfig => {
					return (
						<RegenStreamWithRewardCardContainer
							key={streamConfig.type}
						>
							<RegenStream
								streamConfig={streamConfig}
								network={
									givEconomySupportedNetworks.includes(
										chainId as number,
									)
										? (chainId as number)
										: config.MAINNET_NETWORK_NUMBER
								}
								showRewardCard
							/>
						</RegenStreamWithRewardCardContainer>
					);
				})}
			</RegenStreamsContainer>
		</RegenStreamBlockContainer>
	) : null;
};

const RegenStreamBlockContainer = styled.div`
	margin: 48px 0;
`;

const Title = styled(H3)`
	margin-bottom: 16px;
`;

const Desc = styled(Lead)`
	width: 70%;
	margin-bottom: 48px;
`;

const RegenStreamsContainer = styled(Flex)`
	flex-wrap: wrap;
	gap: 64px 128px;
	margin-bottom: 64px;
`;
const RegenStreamContainer = styled.div`
	width: calc(50% - 64px);
`;
const RegenStreamWithRewardCardContainer = styled.div`
	flex: 1;
`;

export default RegenStreamBlock;

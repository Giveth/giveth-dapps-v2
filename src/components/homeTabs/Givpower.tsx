import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import { Col, Row } from '../Grid';
import { Flex } from '../styled-components/Flex';
import { TopInnerContainer } from './commons';
import { GIVpowerTopContainer, Title, Subtitle } from './Givpower.sc';
import RocketImage from '../../../public/images/rocket.svg';
import { GIVstreamRewardCard } from './GIVstream.sc';
import config from '@/configuration';
import { BN } from '@/helpers/number';

export default function TabPowerTop() {
	const { chainId } = useWeb3React();
	return (
		<GIVpowerTopContainer>
			<TopInnerContainer>
				<Row style={{ alignItems: 'flex-end' }}>
					<Col xs={12} sm={7} xl={8}>
						<Flex alignItems='baseline' gap='16px'>
							<Title>GIVpower</Title>
							{/* <IconGIVFarm size={64} /> */}
							<Image
								src={RocketImage}
								width='58'
								height='53'
								alt='givpower'
							/>
						</Flex>
						<Subtitle size='medium'>
							Use GIV to boost projects to new heights!
						</Subtitle>
					</Col>
					<Col xs={12} sm={5} xl={4}>
						{/* //TODO: add The Card Functionality  */}
						<GIVstreamRewardCard
							wrongNetworkText='GIVstream is only available on Mainnet and Gnosis Chain.'
							liquidAmount={BN(1321231321)}
							stream='2'
							actionLabel='HARVEST'
							network={chainId}
							targetNetworks={[
								config.MAINNET_NETWORK_NUMBER,
								config.XDAI_NETWORK_NUMBER,
							]}
						/>
					</Col>
				</Row>
			</TopInnerContainer>
		</GIVpowerTopContainer>
	);
}

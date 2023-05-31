import { H4, H6, brandColors, neutralColors } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import NetworkLogo from '@/components/NetworkLogo';
import { OptimismNetworkConfig } from '@/types/config';

interface IGIVsavingsAccountCard {
	network: OptimismNetworkConfig;
}

export const GIVsavingsAccountCard: FC<IGIVsavingsAccountCard> = ({
	network,
}) => {
	return (
		<Wrapper>
			<DepositCard>
				<Header justifyContent='space-between'>
					<Flex alignItems='center' gap='8px'>
						<NetworkLogo
							chainId={parseInt(network.chainId)}
							logoSize={40}
						/>
						<H4 weight={700}>Account</H4>
					</Flex>
					<NetworkCard gap='12px'>
						<NetworkLogo
							chainId={parseInt(network.chainId)}
							logoSize={32}
						/>
						<H6>{network.chainName}</H6>
					</NetworkCard>
				</Header>
			</DepositCard>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 24px;
	background-color: ${brandColors.giv['000']};
`;

const DepositCard = styled.div`
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
`;

const Header = styled(Flex)``;

const NetworkCard = styled(Flex)`
	padding: 12px;
	background-color: ${neutralColors.gray[300]};
	border-radius: 8px;
`;

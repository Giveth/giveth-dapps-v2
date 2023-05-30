import React from 'react';
import styled from 'styled-components';
import { GLink } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import config from '@/configuration';
import NetworkLogo from '@/components/NetworkLogo';

const networks = [config.MAINNET_CONFIG, config.OPTIMISM_CONFIG];

export const GIVsavingsTabs = () => {
	const { formatMessage } = useIntl();

	return (
		<Wrapper>
			<Tab>{formatMessage({ id: 'label.all' })}</Tab>
			{networks.map(network => (
				<Tab key={network.chainId} gap='8px' alignItems='center'>
					<NetworkLogo
						chainId={parseInt(network.chainId)}
						logoSize={24}
					/>
					<GLink>{network.chainName}</GLink>
				</Tab>
			))}
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	padding: 8px 24px;
`;

const Tab = styled(Flex)`
	padding: 10px 16px;
`;

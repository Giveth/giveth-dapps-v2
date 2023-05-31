import React, { useState } from 'react';
import styled from 'styled-components';
import { GLink, neutralColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import config from '@/configuration';
import NetworkLogo from '@/components/NetworkLogo';
import { GIVsavingsAccountCard } from './GIVsavingsAccountCard';

const networks = [config.OPTIMISM_CONFIG];

enum EGIVsavingsTabs {
	ALL = 0,
	MAINNET = parseInt(config.MAINNET_CONFIG.chainId),
	OPTIMISM = parseInt(config.OPTIMISM_CONFIG.chainId),
}

export const GIVsavingsTabs = () => {
	const [activeTab, setActiveTab] = useState(EGIVsavingsTabs.OPTIMISM);
	const { formatMessage } = useIntl();

	const activeNetwork = networks.find(
		network => parseInt(network.chainId) === activeTab,
	);
	return (
		<>
			<Wrapper>
				{/* Disable it for MVP <Tab>{formatMessage({ id: 'label.all' })}</Tab> */}
				{networks.map(network => (
					<Tab
						isActive={activeTab === parseInt(network.chainId)}
						key={network.chainId}
						gap='8px'
						alignItems='center'
					>
						<NetworkLogo
							chainId={parseInt(network.chainId)}
							logoSize={24}
						/>
						<GLink>{network.chainName}</GLink>
					</Tab>
				))}
			</Wrapper>
			{activeNetwork && <GIVsavingsAccountCard network={activeNetwork} />}
		</>
	);
};

const Wrapper = styled(Flex)`
	padding: 8px 24px;
`;

interface ITab {
	isActive: boolean;
}

const Tab = styled(Flex)<ITab>`
	padding: 10px 16px;
	border-bottom: ${props =>
		props.isActive && `2px solid ${neutralColors.gray[900]}`};
`;

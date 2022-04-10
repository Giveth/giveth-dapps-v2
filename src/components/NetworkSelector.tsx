import { useState } from 'react';
import styled from 'styled-components';
import { B, brandColors } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';

import { switchNetwork } from '@/lib/wallet';
import { givEconomySupportedNetworks } from '@/utils/constants';
import { Flex } from './styled-components/Flex';
import { IconGnosisChain } from './Icons/GnosisChain';
import { IconEthereum } from './Icons/Eth';
import { ChangeNetworkModal } from './modals/ChangeNetwork';
import config from '../configuration';

interface NetworkSelectorProps {
	disabled?: boolean;
}

interface ISelecetor {
	isSelected: boolean;
}

export const NetworkSelector = () => {
	const [showChangeNetworkModal, setShowChangeNetworkModal] = useState(false);
	const [targetNetwork, setTargetNetwork] = useState(
		config.MAINNET_NETWORK_NUMBER,
	);

	const { chainId } = useWeb3React();

	const handleChangeNetwork = async (networkNumber: number) => {
		setTargetNetwork(networkNumber);
		if (chainId !== networkNumber) {
			if (typeof (window as any).ethereum !== 'undefined') {
				switchNetwork(networkNumber);
			} else {
				setShowChangeNetworkModal(true);
			}
		}
	};

	return (
		<>
			{chainId ? (
				<NetworkSelectorContainer
					disabled={!givEconomySupportedNetworks.includes(chainId)}
				>
					<XDaiSelecor
						isSelected={chainId === config.XDAI_NETWORK_NUMBER}
						onClick={() =>
							handleChangeNetwork(config.XDAI_NETWORK_NUMBER)
						}
					>
						<IconGnosisChain size={24} />
						<B>Gnosis Chain</B>
					</XDaiSelecor>
					<EthSelector
						isSelected={
							chainId === config.MAINNET_NETWORK_NUMBER ||
							!givEconomySupportedNetworks.includes(chainId)
						}
						onClick={() =>
							handleChangeNetwork(config.MAINNET_NETWORK_NUMBER)
						}
					>
						<IconEthereum size={24} />
						<B>Ethereum</B>
					</EthSelector>
				</NetworkSelectorContainer>
			) : (
				'' // TODO: show connect your wallet
			)}
			{showChangeNetworkModal && (
				<ChangeNetworkModal
					setShowModal={setShowChangeNetworkModal}
					targetNetwork={targetNetwork}
				/>
			)}
		</>
	);
};

const NetworkSelectorContainer = styled(Flex)<NetworkSelectorProps>`
	width: 360px;
	height: 48px;
	border-radius: 88px;
	border: 1px solid ${brandColors.giv[600]};
	overflow: hidden;
	cursor: pointer;
	opacity: ${props => (props.disabled ? '0.2' : '1')};
	pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;

const Selector = styled(Flex)<ISelecetor>`
	align-items: center;
	justify-content: center;
	padding: 12px 24px;
	gap: 8px;
	${props => (props.isSelected ? `background: ${brandColors.giv[600]}` : '')}
`;

const XDaiSelecor = styled(Selector)`
	width: 50%;
`;

const EthSelector = styled(Selector)`
	width: 50%;
`;

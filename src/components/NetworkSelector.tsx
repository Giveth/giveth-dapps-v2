import { useState } from 'react';
import styled from 'styled-components';
import config from '../configuration';
import { B, brandColors } from '@giveth/ui-design-system';
import { Row } from './styled-components/Grid';
import { IconXDAI } from './Icons/XDAI';
import { IconEthereum } from './Icons/Eth';
import { BasicNetworkConfig } from '../types/config';
import { ChangeNetworkModal } from './modals/ChangeNetwork';
import { useWeb3React } from '@web3-react/core';
import { switchNetwork } from '@/lib/wallet';

interface NetworkSelectorProps {
	disabled?: boolean;
}

const NetworkSelectorContainer = styled(Row)<NetworkSelectorProps>`
	width: 270px;
	height: 48px;
	border-radius: 88px;
	border: 1px solid ${brandColors.giv[600]};
	overflow: hidden;
	cursor: pointer;
	opacity: ${props => (props.disabled ? '0.2' : '1')};
	pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;

interface ISelecetor {
	isSelected: boolean;
}

const Selector = styled(Row)<ISelecetor>`
	align-items: center;
	padding: 12px 24px;
	gap: 8px;
	${props => (props.isSelected ? `background: ${brandColors.giv[600]}` : '')}
`;

const XDaiSelecor = styled(Selector)`
	width: 116px;
`;

const EthSelector = styled(Selector)`
	width: 154px;
`;

export const NetworkSelector = () => {
	const [showChangeNetworkModal, setShowChangeNetworkModal] = useState(false);
	const [targetNetwork, setTargetNetwork] = useState(1);
	const supportedNetworks = [
		config.MAINNET_NETWORK_NUMBER,
		config.XDAI_NETWORK_NUMBER,
	];

	const { chainId } = useWeb3React();

	const handleChangeNetwork = async (
		networkNumber: number,
		network: BasicNetworkConfig,
	) => {
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
					disabled={!supportedNetworks.includes(chainId)}
				>
					<XDaiSelecor
						isSelected={chainId === config.XDAI_NETWORK_NUMBER}
						onClick={() => {
							handleChangeNetwork(
								config.XDAI_NETWORK_NUMBER,
								config.XDAI_CONFIG,
							);
						}}
					>
						<IconXDAI size={24} />
						<B>xDai</B>
					</XDaiSelecor>
					<EthSelector
						isSelected={
							chainId === config.MAINNET_NETWORK_NUMBER ||
							!supportedNetworks.includes(chainId)
						}
						onClick={() => {
							handleChangeNetwork(
								config.MAINNET_NETWORK_NUMBER,
								config.MAINNET_CONFIG,
							);
						}}
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
					showModal={showChangeNetworkModal}
					setShowModal={setShowChangeNetworkModal}
					targetNetwork={targetNetwork}
				/>
			)}
		</>
	);
};

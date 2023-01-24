import { useState } from 'react';
import styled from 'styled-components';
import { B, brandColors, mediaQueries } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';

import { switchNetwork } from '@/lib/wallet';
import { givEconomySupportedNetworks } from '@/lib/constants/constants';
import { Flex } from './styled-components/Flex';
import { IconGnosisChain } from './Icons/GnosisChain';
import { IconEthereum } from './Icons/Eth';
import { ChangeNetworkModal } from './modals/ChangeNetwork';
import config from '../configuration';

interface NetworkSelectorProps {
	disabled?: boolean;
}

interface ISelector {
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
					<Selector
						isSelected={chainId === config.XDAI_NETWORK_NUMBER}
						onClick={() =>
							handleChangeNetwork(config.XDAI_NETWORK_NUMBER)
						}
					>
						<IconGnosisChain size={24} />
						<B>Gnosis Chain</B>
					</Selector>
					<Selector
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
					</Selector>
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
	height: 48px;
	border-radius: 88px;
	border: 1px solid ${brandColors.giv[600]};
	overflow: hidden;
	cursor: pointer;
	opacity: ${props => (props.disabled ? '0.2' : '1')};
	pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
	${mediaQueries.mobileL} {
		width: 360px;
	}
`;

const Selector = styled(Flex)<ISelector>`
	align-items: center;
	justify-content: center;
	padding: 12px 24px;
	gap: 8px;
	width: 50%;
	background: ${props => (props.isSelected ? brandColors.giv[600] : '')};
	& > div {
		display: none;
	}
	${mediaQueries.mobileL} {
		& > div {
			display: block;
		}
	}
`;

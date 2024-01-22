import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { Caption } from '@giveth/ui-design-system';
import { Chain, useSwitchNetwork } from 'wagmi';
import { getNetworkNames } from '@/components/views/donate/helpers';
import {
	NetworkToast,
	SwitchCaption,
} from '@/components/views/donate/common.styled';
import { INetworkIdWithChain } from './common.types'; // Import the type
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { ChainType } from '@/types/config';
import config from '@/configuration';

const SwitchToAcceptedChain: FC<{ acceptedChains: INetworkIdWithChain[] }> = ({
	acceptedChains,
}) => {
	const { formatMessage } = useIntl();
	const {
		chain,
		walletChainType,
		handleSignOutAndSignInWithSolana,
		handleSingOutAndSignInWithEVM,
	} = useGeneralWallet();

	const networkId = (chain as Chain)?.id;

	const { switchNetwork } = useSwitchNetwork();

	const handleSwitchNetwork = () => {
		const firstAcceptedChainType = acceptedChains[0].chainType;
		switch (walletChainType) {
			case ChainType.EVM:
				if (firstAcceptedChainType === config.SOLANA_CONFIG.chainType) {
					handleSignOutAndSignInWithSolana();
				} else {
					switchNetwork?.(acceptedChains[0].networkId);
				}
				break;
			case ChainType.SOLANA:
				handleSingOutAndSignInWithEVM();
				break;
			default:
				switchNetwork?.(acceptedChains[0].networkId);
		}
	};

	if (
		!acceptedChains ||
		acceptedChains.some(
			chain =>
				chain.networkId === networkId ||
				(chain.chainType === ChainType.SOLANA &&
					walletChainType === ChainType.SOLANA),
		)
	) {
		return null;
	}

	// Assuming getNetworkNames is updated to handle INetworkIdWithChain array
	return (
		<NetworkToast>
			<Caption medium>
				{formatMessage({
					id: 'label.this_project_only_accept_on',
				})}{' '}
				{getNetworkNames(acceptedChains, 'and')}.
			</Caption>
			{/* Use the first accepted chain's networkId for the switchNetwork call */}
			<SwitchCaption onClick={handleSwitchNetwork}>
				{formatMessage({ id: 'label.switch_network' })}
			</SwitchCaption>
		</NetworkToast>
	);
};

export default SwitchToAcceptedChain;

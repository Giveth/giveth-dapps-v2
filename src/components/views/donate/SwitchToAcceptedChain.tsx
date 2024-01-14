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

const SwitchToAcceptedChain: FC<{ acceptedChains: INetworkIdWithChain[] }> = ({
	acceptedChains,
}) => {
	const { formatMessage } = useIntl();
	const { chain, walletChainType } = useGeneralWallet();

	const networkId = (chain as Chain)?.id;

	const { switchNetwork } = useSwitchNetwork();
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
			<SwitchCaption
				onClick={() => switchNetwork?.(acceptedChains[0].networkId)}
			>
				{formatMessage({ id: 'label.switch_network' })}
			</SwitchCaption>
		</NetworkToast>
	);
};

export default SwitchToAcceptedChain;

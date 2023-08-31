import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { Caption } from '@giveth/ui-design-system';
import { useChainId } from 'wagmi';
import { getNetworkNames } from '@/components/views/donate/helpers';
import { switchNetwork } from '@/lib/wallet';
import {
	NetworkToast,
	SwitchCaption,
} from '@/components/views/donate/common.styled';
import { ISwitchNetworkToast } from '@/components/views/donate/common.types';

const SwitchToAcceptedChain: FC<ISwitchNetworkToast> = ({ acceptedChains }) => {
	const { formatMessage } = useIntl();
	const chainId = useChainId();

	if (!chainId || !acceptedChains || acceptedChains?.includes(chainId)) {
		return null;
	}

	return (
		<NetworkToast>
			<Caption medium>
				{formatMessage({
					id: 'label.this_project_only_accept_on',
				})}{' '}
				{getNetworkNames(acceptedChains, 'and')}.
			</Caption>
			<SwitchCaption onClick={() => switchNetwork(acceptedChains[0])}>
				{formatMessage({ id: 'label.switch_network' })}
			</SwitchCaption>
		</NetworkToast>
	);
};

export default SwitchToAcceptedChain;

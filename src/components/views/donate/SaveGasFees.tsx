import { Caption, IconGasStation } from '@giveth/ui-design-system';
import React, { FC } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useIntl } from 'react-intl';
import config from '@/configuration';
import { switchNetwork } from '@/lib/wallet';
import { Flex } from '@/components/styled-components/Flex';
import {
	NetworkToast,
	SwitchCaption,
} from '@/components/views/donate/common.styled';
import { ISwitchNetworkToast } from '@/components/views/donate/common.types';

const SaveGasFees: FC<ISwitchNetworkToast> = ({ acceptedChains }) => {
	const { chainId } = useWeb3React();
	const { formatMessage } = useIntl();

	if (
		!chainId ||
		!acceptedChains?.includes(config.XDAI_NETWORK_NUMBER) ||
		chainId !== config.MAINNET_NETWORK_NUMBER
	) {
		return null;
	}

	return (
		<NetworkToast>
			<Flex alignItems='center' gap='9px'>
				<IconGasStation />
				<Caption medium>
					{formatMessage({
						id: 'label.save_on_gas_fees',
					})}
				</Caption>
			</Flex>
			<SwitchCaption
				onClick={() => switchNetwork(config.XDAI_NETWORK_NUMBER)}
			>
				{formatMessage({ id: 'label.switch_network' })}
			</SwitchCaption>
		</NetworkToast>
	);
};

export default SaveGasFees;

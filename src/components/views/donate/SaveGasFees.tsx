import { Caption, IconGasStation } from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import config from '@/configuration';
import { Flex } from '@/components/styled-components/Flex';
import {
	NetworkToast,
	SwitchCaption,
} from '@/components/views/donate/common.styled';
import { ISwitchNetworkToast } from '@/components/views/donate/common.types';
import SwitchNetwork from '@/components/modals/SwitchNetwork';
import { useChainId } from 'wagmi';

const SaveGasFees: FC<ISwitchNetworkToast> = ({ acceptedChains }) => {
	const [showModal, setShowModal] = useState(false);
	const chainId = useChainId();
	const { formatMessage } = useIntl();

	if (
		!chainId ||
		chainId !== config.MAINNET_NETWORK_NUMBER ||
		acceptedChains?.length === 1
	) {
		return null;
	}

	return (
		<NetworkToast justifyContent='space-between'>
			<Flex alignItems='center' gap='9px'>
				<IconGasStation />
				<Caption medium>
					{formatMessage({
						id: 'label.save_on_gas_fees',
					})}
				</Caption>
			</Flex>
			<StyledSwitchCaption onClick={() => setShowModal(true)}>
				{formatMessage({ id: 'label.switch_network' })}
			</StyledSwitchCaption>
			{showModal && (
				<SwitchNetwork
					setShowModal={setShowModal}
					customNetworks={acceptedChains}
				/>
			)}
		</NetworkToast>
	);
};

const StyledSwitchCaption = styled(SwitchCaption)`
	margin: 0;
`;

export default SaveGasFees;

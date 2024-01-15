import { Caption, IconGasStation } from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useNetwork } from 'wagmi';
import config from '@/configuration';
import { Flex } from '@/components/styled-components/Flex';
import {
	NetworkToast,
	SwitchCaption,
} from '@/components/views/donate/common.styled';
import { INetworkIdWithChain } from './common.types'; // Import the type
import SwitchNetwork from '@/components/modals/SwitchNetwork';

const SaveGasFees: FC<{ acceptedChains: INetworkIdWithChain[] }> = ({
	acceptedChains,
}) => {
	const [showModal, setShowModal] = useState(false);
	const { chain } = useNetwork();
	const chainId = chain?.id;
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

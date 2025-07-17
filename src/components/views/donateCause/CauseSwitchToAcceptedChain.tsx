import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
	brandColors,
	FlexCenter,
	IconWrongNetwork24,
	neutralColors,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { Chain } from 'viem';
import styled from 'styled-components';
import { useGeneralWallet } from '@/providers/generalWalletProvider';

import config from '@/configuration';

interface ISwitchToAcceptedChain {
	openNetworkModal: (show: boolean) => void;
}

const CauseSwitchToAcceptedChain: FC<ISwitchToAcceptedChain> = ({
	openNetworkModal,
}) => {
	const { formatMessage } = useIntl();
	const { chain } = useGeneralWallet();
	const [show, setShow] = useState(false);

	const networkId = (chain as Chain)?.id || config.SOLANA_CONFIG.networkId;
	const networkName = config.NETWORKS_CONFIG_WITH_ID[networkId]?.name;

	useEffect(() => {
		// To prevent SwitchToAcceptedChain flickering
		setTimeout(() => setShow(true), 1000);
	}, []);

	if (!show || config.CAUSES_CONFIG.acceptedNetworks.includes(networkId)) {
		return null;
	}

	return (
		<NetworkToast>
			<FlexCenter gap='4px'>
				<IconWrongNetwork24 color={semanticColors.punch[500]} />
				<SublineBold>
					{formatMessage({
						id: 'label.cause.this_cause_doesnt_accept_on',
					})}
					{' ' + networkName}
				</SublineBold>
			</FlexCenter>
			<SublineBoldStyled
				onClick={() => {
					openNetworkModal(true);
				}}
			>
				{formatMessage({ id: 'label.switch_to_supported' })}
			</SublineBoldStyled>
		</NetworkToast>
	);
};

const SublineBoldStyled = styled(SublineBold)`
	cursor: pointer;
	color: ${brandColors.giv[500]};
`;

const NetworkToast = styled.div`
	display: flex;
	margin: 12px 0 24px;
	gap: 10px;
	justify-content: space-between;
	align-items: center;
	padding: 4px 8px;
	border-radius: 8px;
	border: 1px solid ${semanticColors.punch[200]};
	color: ${neutralColors.gray[800]};
`;

export default CauseSwitchToAcceptedChain;

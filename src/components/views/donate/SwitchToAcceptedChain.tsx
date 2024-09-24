import React, { FC } from 'react';
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
import { INetworkIdWithChain } from './common/common.types'; // Import the type
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { ChainType } from '@/types/config';
import config from '@/configuration';

interface ISwitchToAcceptedChain {
	acceptedChains: INetworkIdWithChain[];
	setShowChangeNetworkModal: (show: boolean) => void;
}

const SwitchToAcceptedChain: FC<ISwitchToAcceptedChain> = ({
	acceptedChains,
	setShowChangeNetworkModal,
}) => {
	const { formatMessage } = useIntl();
	const { chain, walletChainType } = useGeneralWallet();

	const networkId = (chain as Chain)?.id || config.SOLANA_CONFIG.networkId;
	const networkName = config.NETWORKS_CONFIG_WITH_ID[networkId]?.name;

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

	return (
		<NetworkToast>
			<FlexCenter gap='4px'>
				<IconWrongNetwork24 color={semanticColors.punch[500]} />
				<SublineBold>
					{formatMessage({
						id: 'label.this_project_doesnt_accept_on',
					})}
					{' ' + networkName}
				</SublineBold>
			</FlexCenter>
			<SublineBoldStyled
				onClick={() => {
					setShowChangeNetworkModal(true);
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

export default SwitchToAcceptedChain;

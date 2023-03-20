import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { H4, B, brandColors, Caption } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';

import { useIntl } from 'react-intl';
import { mediaQueries } from '@/lib/constants/constants';
import config from '@/configuration';
import { IconEthereum } from '../Icons/Eth';
import { IconGnosisChain } from '../Icons/GnosisChain';
import { Modal } from './Modal';
import { switchNetwork } from '@/lib/wallet';
import { IModal } from '@/types/common';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IChangeNetworkModalProps extends IModal {
	targetNetwork: number;
}

export const ChangeNetworkModal: FC<IChangeNetworkModalProps> = ({
	setShowModal,
	targetNetwork,
}) => {
	const { chainId } = useWeb3React();
	const theme = useAppSelector(state => state.general.theme);

	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	useEffect(() => {
		if (chainId === targetNetwork) {
			closeModal();
		}
	}, [chainId, targetNetwork]);

	const NetworkName =
		targetNetwork === config.MAINNET_NETWORK_NUMBER
			? 'Ethereum Mainnet'
			: formatMessage({ id: 'label.ethereum_mainnet_or_gnosis_chain' });

	return (
		<Modal closeModal={closeModal} isAnimating={isAnimating}>
			<ChangeNetworkModalContainer>
				{targetNetwork === config.MAINNET_NETWORK_NUMBER ? (
					<IconEthereum size={64} />
				) : (
					<>
						<IconEthereum size={64} />
						<IconGnosisChain size={64} />
					</>
				)}
				<Title theme={theme}>
					{formatMessage(
						{ id: 'label.switch_to_network_name' },
						{ networkNames: NetworkName },
					)}
				</Title>
				<B>
					{formatMessage(
						{
							id: 'label.please_switch_your_wallet_net_to_net_name',
						},
						{ networkName: NetworkName },
					)}
				</B>
				<SwitchCaption
					onClick={() => switchNetwork(config.MAINNET_NETWORK_NUMBER)}
				>
					{formatMessage({ id: 'label.switch_network' })}
				</SwitchCaption>
			</ChangeNetworkModalContainer>
		</Modal>
	);
};

const SwitchCaption = styled(Caption)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	margin: 20px auto 0;
`;

const ChangeNetworkModalContainer = styled.div`
	padding: 62px 60px;
	color: ${brandColors.giv[700]};
	width: 100%;
	${mediaQueries.tablet} {
		width: 500px;
	}
`;

const Title = styled(H4)`
	margin: 18px 0 24px;
	color: ${props =>
		props.theme === ETheme.Dark ? 'white' : brandColors.giv[700]};
`;

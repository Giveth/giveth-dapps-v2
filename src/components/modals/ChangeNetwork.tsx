import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { H4, B, brandColors, Caption } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';

import { mediaQueries } from '@/lib/constants/constants';
import { ETheme, useGeneral } from '@/context/general.context';
import config from '@/configuration';
import { IconEthereum } from '../Icons/Eth';
import { IconGnosisChain } from '../Icons/GnosisChain';
import { Modal } from './Modal';
import { switchNetwork } from '@/lib/wallet';
import { IModal } from '@/types/common';

interface IChangeNetworkModalProps extends IModal {
	targetNetwork: number;
}

export const ChangeNetworkModal: FC<IChangeNetworkModalProps> = ({
	setShowModal,
	targetNetwork,
}) => {
	const { chainId } = useWeb3React();
	const { theme } = useGeneral();

	useEffect(() => {
		if (chainId === targetNetwork) {
			setShowModal(false);
		}
	}, [chainId, targetNetwork]);

	const NetworkName =
		targetNetwork === config.MAINNET_NETWORK_NUMBER
			? 'Ethereum Mainnet'
			: 'Ethereum Mainnet or Gnosis Chain';

	return (
		<Modal setShowModal={setShowModal}>
			<ChangeNetworkModalContainer>
				{targetNetwork === config.MAINNET_NETWORK_NUMBER ? (
					<IconEthereum size={64} />
				) : (
					<>
						<IconEthereum size={64} />
						<IconGnosisChain size={64} />
					</>
				)}
				<Title theme={theme}>Switch to {NetworkName}</Title>
				<B>Please switch your wallet network to {NetworkName}.</B>
				<SwitchCaption
					onClick={() => switchNetwork(config.MAINNET_NETWORK_NUMBER)}
				>
					Switch network
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

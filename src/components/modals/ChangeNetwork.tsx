import { FC, useEffect } from 'react';
import styled from 'styled-components';
import { H4, B, brandColors } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';

import { mediaQueries } from '@/utils/constants';
import { ETheme, useGeneral } from '@/context/general.context';
import config from '@/configuration';
import { IconEthereum } from '../Icons/Eth';
import { IconGnosisChain } from '../Icons/GnosisChain';
import { Modal, IModal } from './Modal';

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
	}, [chainId, setShowModal, targetNetwork]);

	const NetworkName =
		targetNetwork === config.MAINNET_NETWORK_NUMBER
			? 'Ethereum Mainnet'
			: 'Ethereum Mainnet or Gnosis Chain';

	return (
		<Modal showModal setShowModal={setShowModal}>
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
			</ChangeNetworkModalContainer>
		</Modal>
	);
};

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

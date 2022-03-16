import { FC, useEffect } from 'react';
import { Modal, IModal } from './Modal';
import styled from 'styled-components';
import config from '@/configuration';
import { IconEthereum } from '../Icons/Eth';
import { IconXDAI } from '../Icons/XDAI';
import { IconGnosisChain } from '../Icons/GnosisChain';
import { H4, B, neutralColors, brandColors } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { mediaQueries } from '@/utils/constants';
import { ETheme, useGeneral } from '@/context/general.context';

interface IChangeNetworkModalProps extends IModal {
	targetNetwork: number;
}

export const ChangeNetworkModal: FC<IChangeNetworkModalProps> = ({
	showModal,
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
			? 'Ethereum'
			: 'Gnosis Chain';

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<ChangeNetworkModalContainer>
				{targetNetwork === config.MAINNET_NETWORK_NUMBER ? (
					<IconEthereum size={64} />
				) : (
					<IconGnosisChain size={64} />
				)}
				<Title theme={theme}>Switch to {NetworkName}</Title>
				<Desc>Please switch your wallet network to {NetworkName}.</Desc>
			</ChangeNetworkModalContainer>
		</Modal>
	);
};

const ChangeNetworkModalContainer = styled.div`
	width: 500px;
	padding: 62px 60px;
	color: ${brandColors.giv[700]};
	width: 100%;
	${mediaQueries['tablet']} {
		width: 500px;
	}
`;

const Title = styled(H4)`
	margin: 18px 0 24px;
	color: ${props =>
		props.theme === ETheme.Dark ? 'white' : brandColors.giv[700]};
`;

const Desc = styled(B)``;

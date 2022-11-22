import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { P, H4, brandColors, Caption } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';

import { mediaQueries } from '@/lib/constants/constants';
import config from '@/configuration';
import { IconEthereum } from '../Icons/Eth';
import { IconGnosisChain } from '../Icons/GnosisChain';
import { Modal } from './Modal';
import { switchNetwork } from '@/lib/wallet';
import { getNetworkNames } from '@/components/views/donate/helpers';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { ISwitchNetworkToast } from '@/components/views/donate/common.types';

interface IDonateWrongNetwork extends IModal, ISwitchNetworkToast {}

const { PRIMARY_NETWORK, SECONDARY_NETWORK } = config;
const { id: primaryId } = PRIMARY_NETWORK;
const { id: secondaryId } = SECONDARY_NETWORK;

export const DonateWrongNetwork: FC<IDonateWrongNetwork> = props => {
	const { setShowModal, acceptedChains } = props;
	const { chainId } = useWeb3React();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	useEffect(() => {
		if (chainId && acceptedChains?.includes(chainId)) {
			closeModal();
		}
	}, [chainId, acceptedChains]);

	const NetworkName = getNetworkNames(acceptedChains!, 'or');

	const gnosisOnly =
		acceptedChains?.length === 1 && acceptedChains[0] === secondaryId;
	const ethereumOnly =
		acceptedChains?.length === 1 && acceptedChains[0] === primaryId;

	return (
		<Modal closeModal={closeModal} isAnimating={isAnimating}>
			<ModalContainer>
				{gnosisOnly ? (
					<IconGnosisChain size={64} />
				) : ethereumOnly ? (
					<IconEthereum size={64} />
				) : (
					<>
						<IconEthereum size={64} />
						<IconGnosisChain size={64} />
					</>
				)}
				<Title>Switch to {NetworkName}</Title>
				<P>
					This project doesn&apos;t accept donations in your connected
					network. Please switch your wallet network to {NetworkName}.
				</P>
				<SwitchCaption
					onClick={() => switchNetwork(acceptedChains![0])}
				>
					Switch network
				</SwitchCaption>
			</ModalContainer>
		</Modal>
	);
};

const SwitchCaption = styled(Caption)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	margin: 20px auto 0;
`;

const ModalContainer = styled.div`
	padding: 62px 60px;
	color: ${brandColors.giv[700]};
	width: 100%;
	${mediaQueries.tablet} {
		width: 500px;
	}
`;

const Title = styled(H4)`
	margin: 18px 0 24px;
	color: ${brandColors.giv[700]};
`;

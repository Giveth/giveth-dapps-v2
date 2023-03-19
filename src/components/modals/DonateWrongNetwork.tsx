import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	Caption,
	IconNetwork32,
	Lead,
} from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';

import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { ISwitchNetworkToast } from '@/components/views/donate/common.types';
import { useAppDispatch } from '@/features/hooks';
import { setShowSwitchNetworkModal } from '@/features/modal/modal.slice';
import config from '@/configuration';
import { BasicNetworkConfig } from '@/types/config';

interface IDonateWrongNetwork extends IModal, ISwitchNetworkToast {}

const networks = [
	config.MAINNET_CONFIG,
	config.XDAI_CONFIG,
	config.POLYGON_CONFIG,
];

export const DonateWrongNetwork: FC<IDonateWrongNetwork> = props => {
	const { setShowModal, acceptedChains } = props;
	const { chainId } = useWeb3React();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const dispatch = useAppDispatch();
	console.log('acceptedChains', acceptedChains, networks[0].chainId);

	const eligibleNetworks: BasicNetworkConfig[] = networks.filter(network =>
		acceptedChains?.includes(parseInt(network.chainId)),
	);

	console.log('eligibleNetworks', eligibleNetworks);

	useEffect(() => {
		if (chainId && acceptedChains?.includes(chainId)) {
			closeModal();
		}
	}, [chainId, acceptedChains]);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Switch Network'
			headerIcon={<IconNetwork32 />}
			hiddenClose
			headerTitlePosition='left'
		>
			<ModalContainer>
				<Lead>
					Sorry, this project doesn’t support your current network.
				</Lead>
				<br />
				<Lead>Please switch your network</Lead>
				<SwitchCaption
					onClick={() => dispatch(setShowSwitchNetworkModal(true))}
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
	padding: 24px;
	text-align: left;
`;

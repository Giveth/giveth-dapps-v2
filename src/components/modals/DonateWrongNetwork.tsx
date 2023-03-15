import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { P, H4, brandColors, Caption } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';

import { mediaQueries } from '@/lib/constants/constants';
import { Modal } from './Modal';
import { getNetworkNames } from '@/components/views/donate/helpers';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { ISwitchNetworkToast } from '@/components/views/donate/common.types';
import NetworkLogo from '@/components/NetworkLogo';
import { FlexCenter } from '@/components/styled-components/Flex';
import { useAppDispatch } from '@/features/hooks';
import { setShowSwitchNetworkModal } from '@/features/modal/modal.slice';

interface IDonateWrongNetwork extends IModal, ISwitchNetworkToast {}

export const DonateWrongNetwork: FC<IDonateWrongNetwork> = props => {
	const { setShowModal, acceptedChains } = props;
	const { chainId } = useWeb3React();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (chainId && acceptedChains?.includes(chainId)) {
			closeModal();
		}
	}, [chainId, acceptedChains]);

	const networkNames = getNetworkNames(acceptedChains!, 'or');

	return (
		<Modal closeModal={closeModal} isAnimating={isAnimating}>
			<ModalContainer>
				<FlexCenter gap='8px'>
					{acceptedChains?.map(chainId => (
						<NetworkLogo
							logoSize={64}
							chainId={chainId}
							key={chainId}
						/>
					))}
				</FlexCenter>
				<Title>Switch to {networkNames}</Title>
				<P>
					This project doesn&apos;t accept donations in your connected
					network. Please switch your wallet network to {networkNames}
					.
				</P>
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

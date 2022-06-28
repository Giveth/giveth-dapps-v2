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

interface IDonateWrongNetwork extends IModal {
	targetNetworks: number[];
}

export const DonateWrongNetwork: FC<IDonateWrongNetwork> = ({
	setShowModal,
	targetNetworks,
}) => {
	const { chainId } = useWeb3React();

	useEffect(() => {
		if (chainId && targetNetworks.includes(chainId)) {
			setShowModal(false);
		}
	}, [chainId, targetNetworks]);

	const NetworkName = getNetworkNames(targetNetworks, 'or');

	return (
		<Modal setShowModal={setShowModal}>
			<ModalContainer>
				{!targetNetworks.includes(config.SECONDARY_NETWORK.id) ? (
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
					onClick={() => switchNetwork(config.PRIMARY_NETWORK.id)}
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

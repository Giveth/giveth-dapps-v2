import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { B, IconNetwork32, Lead } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';

import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { ISwitchNetworkToast } from '@/components/views/donate/common.types';
import { useAppDispatch } from '@/features/hooks';
import config from '@/configuration';
import { BasicNetworkConfig } from '@/types/config';
import { switchNetwork } from '@/lib/metamask';
import NetworkLogo from '../NetworkLogo';
import { NetworkItem, SelectedNetwork } from './SwitchNetwork';
import { useAppSelector } from '@/features/hooks';
import { Flex } from '../styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

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
	const theme = useAppSelector(state => state.general.theme);
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
				<br />
				<Flex gap='70px'>
					{eligibleNetworks.map(network => {
						const _chainId = parseInt(network.chainId);
						return (
							<NetworkItem
								onClick={() => {
									switchNetwork(_chainId);
									closeModal();
								}}
								isSelected={_chainId === chainId}
								key={_chainId}
								theme={theme}
							>
								<NetworkLogo chainId={_chainId} logoSize={32} />
								<B>{network.chainName}</B>
								{_chainId === chainId && (
									<SelectedNetwork
										styleType='Small'
										theme={theme}
									>
										Selected
									</SelectedNetwork>
								)}
							</NetworkItem>
						);
					})}
				</Flex>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	padding: 24px;
	text-align: left;
	${mediaQueries.laptopS} {
		min-width: 866px;
	}
`;

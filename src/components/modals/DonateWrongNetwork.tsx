import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import {
	B,
	brandColors,
	IconBackward24,
	IconNetwork32,
	Lead,
	neutralColors,
	ButtonText,
} from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { ISwitchNetworkToast } from '@/components/views/donate/common.types';
import config from '@/configuration';
import { BasicNetworkConfig } from '@/types/config';
import { switchNetwork } from '@/lib/metamask';
import NetworkLogo from '../NetworkLogo';
import { NetworkItem, SelectedNetwork } from './SwitchNetwork';
import { useAppSelector } from '@/features/hooks';
import { Flex, FlexCenter } from '../styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';
import Routes from '@/lib/constants/Routes';

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
	const router = useRouter();

	const { slug } = router.query;

	const eligibleNetworks: BasicNetworkConfig[] = networks.filter(network =>
		acceptedChains?.includes(parseInt(network.chainId)),
	);

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
			<CustomHr margin='32px' />
			<ModalContainer>
				<Lead>
					Sorry, this project doesn’t support your current network.
				</Lead>
				<br />
				<Lead>Please switch your network</Lead>
				<br />
				<Flex gap='60px'>
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
				<br />
				<CustomHr margin='0' />
				<FlexCenter direction='column'>
					<FooterText>or</FooterText>
					<Link href={`${Routes.Project}/${slug}`}>
						<Flex gap='12px' alignItems='center'>
							<IconBackward24 color={brandColors.giv[500]} />
							<BackButton>GO BACK TO PROJECT DETAILS</BackButton>
						</Flex>
					</Link>
				</FlexCenter>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	padding: 32px;
	text-align: left;
	${mediaQueries.laptopS} {
		min-width: 866px;
	}
`;

const CustomHr = styled.hr<{ margin: string }>`
	margin-left: ${props => props.margin};
	margin-right: ${props => props.margin};
	border: 1px solid ${neutralColors.gray[400]};
`;

const FooterText = styled(Lead)`
	color: ${neutralColors.gray[700]};
	margin: 16px 0;
`;

const BackButton = styled(ButtonText)`
	color: ${brandColors.giv[500]};
`;

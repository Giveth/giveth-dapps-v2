import React, { FC, useState, useEffect } from 'react';
import {
	B,
	brandColors,
	IconNetwork32,
	neutralColors,
	Overline,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useSwitchChain } from 'wagmi';
import { Chain } from 'viem';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import NetworkLogo from '@/components/NetworkLogo';
import { useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import { ETheme } from '@/features/general/general.slice';
import { getChainName } from '@/lib/network';
import { INetworkIdWithChain } from '../views/donate/common.types';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { ChainType } from '@/types/config';

const networksConfig = config.EVM_NETWORKS_CONFIG;
const defaultNetworks = Object.keys(networksConfig).map(key => ({
	networkId: Number(key),
	chainType: networksConfig[Number(key)].chainType,
}));

interface ISwitchNetworkModal extends IModal {
	desc?: string;
	customNetworks?: INetworkIdWithChain[];
}

const SwitchNetwork: FC<ISwitchNetworkModal> = ({
	desc,
	customNetworks,
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { switchChain } = useSwitchChain();
	const { formatMessage } = useIntl();
	const {
		walletChainType,
		handleSingOutAndSignInWithEVM,
		pendingNetworkId,
		setPendingNetworkId,
		chain,
	} = useGeneralWallet();
	const chainId = (chain as Chain)?.id;
	const theme = useAppSelector(state => state.general.theme);

	const networks =
		customNetworks?.map(network => {
			return {
				networkId: network.networkId,
				chainType: network.chainType,
			};
		}) || defaultNetworks;

	const handleNetworkItemClick = (networkId: number) => {
		if (walletChainType === ChainType.SOLANA) {
			setPendingNetworkId(networkId);
			handleSingOutAndSignInWithEVM();
			closeModal(); // Close the modal since we cannot control the wallet modal
		} else {
			switchChain?.({ chainId: networkId });
			closeModal();
		}
	};

	return (
		<Modal
			headerTitle={formatMessage({ id: 'label.switch_network' })}
			headerIcon={<IconNetwork32 />}
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			<Wrapper>
				{desc && <P>{desc}</P>}
				{networks?.map(({ networkId, chainType }) => (
					<NetworkItem
						onClick={() => handleNetworkItemClick(networkId)}
						$isSelected={networkId === chainId}
						key={networkId}
						$baseTheme={theme}
					>
						<NetworkLogo
							chainId={networkId}
							chainType={chainType}
							logoSize={32}
						/>
						<B>{getChainName(networkId, chainType)}</B>
						{networkId === chainId && (
							<SelectedNetwork
								$styleType='Small'
								$baseTheme={theme}
							>
								{formatMessage({ id: 'label.selected' })}
							</SelectedNetwork>
						)}
					</NetworkItem>
				))}
			</Wrapper>
		</Modal>
	);
};

export const SelectedNetwork = styled(Overline)<{
	$baseTheme: ETheme;
}>`
	color: ${props =>
		props.$baseTheme === ETheme.Dark
			? brandColors.giv[100]
			: brandColors.giv[500]};
	position: absolute;
	top: -8px;
	left: 10px;
	background: ${props =>
		props.$baseTheme === ETheme.Dark
			? brandColors.giv[600]
			: neutralColors.gray[100]};
	padding: 0 3px;
	border-radius: 4px;
`;

export const NetworkItem = styled.div<{
	$isSelected: boolean;
	$baseTheme: ETheme;
}>`
	position: relative;
	padding: 8px;
	width: 213px;
	border-radius: 12px;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 16px;
	&:hover {
		background-color: ${props =>
			props.$baseTheme === ETheme.Dark
				? brandColors.giv[700]
				: neutralColors.gray[200]};
	}
	border: 1px solid
		${props => (props.$isSelected ? brandColors.giv[500] : 'transparent')};
`;

const Wrapper = styled.div`
	padding: 40px 24px;
	display: flex;
	gap: 24px;
	flex-wrap: wrap;
	max-width: 510px;
`;

export default SwitchNetwork;

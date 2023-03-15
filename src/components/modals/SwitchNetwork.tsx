import React, { FC } from 'react';
import {
	B,
	brandColors,
	IconNetwork32,
	neutralColors,
	Overline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import NetworkLogo from '@/components/NetworkLogo';
import { switchNetwork } from '@/lib/wallet';
import { useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import { ETheme } from '@/features/general/general.slice';

const networks = [
	config.MAINNET_CONFIG,
	config.XDAI_CONFIG,
	config.POLYGON_CONFIG,
];

const SwitchNetwork: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { chainId } = useWeb3React();
	const theme = useAppSelector(state => state.general.theme);

	return (
		<Modal
			headerTitle='Switch Network'
			headerIcon={<IconNetwork32 />}
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			<Wrapper>
				{networks.map(network => {
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
								<Selected styleType='Small' theme={theme}>
									Selected
								</Selected>
							)}
						</NetworkItem>
					);
				})}
			</Wrapper>
		</Modal>
	);
};

const Selected = styled(Overline)`
	color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[100]
			: brandColors.giv[500]};
	position: absolute;
	top: -8px;
	left: 10px;
	background: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[600]
			: neutralColors.gray[100]};
	padding: 0 3px;
`;

const NetworkItem = styled.div<{ isSelected: boolean }>`
	position: relative;
	padding: 8px;
	width: 213px;
	border-radius: 12px;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 16px;
	:hover {
		background-color: ${props =>
			props.theme === ETheme.Dark
				? brandColors.giv[700]
				: neutralColors.gray[200]};
	}
	border: 1px solid
		${({ isSelected }) =>
			isSelected ? brandColors.giv[500] : 'transparent'};
`;

const Wrapper = styled.div`
	padding: 40px 24px;
	display: flex;
	gap: 24px;
	flex-wrap: wrap;
	max-width: 510px;
`;

export default SwitchNetwork;

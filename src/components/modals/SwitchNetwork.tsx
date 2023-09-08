import React, { FC } from 'react';
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
import { useWeb3React } from '@web3-react/core';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import NetworkLogo from '@/components/NetworkLogo';
import { switchNetwork } from '@/lib/wallet';
import { useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import { ETheme } from '@/features/general/general.slice';
import { networksParams } from '@/helpers/blockchain';

const networksConfig = config.NETWORKS_CONFIG;
const defaultNetworkIds = Object.keys(networksConfig).map(Number);

interface ISwitchNetworkModal extends IModal {
	desc?: string;
	customNetworks?: number[];
}

const SwitchNetwork: FC<ISwitchNetworkModal> = ({
	desc,
	customNetworks,
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { chainId } = useWeb3React();
	const { formatMessage } = useIntl();
	const theme = useAppSelector(state => state.general.theme);
	const networkIds = customNetworks || defaultNetworkIds;

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
				{networkIds.map(networkId => (
					<NetworkItem
						onClick={() => {
							switchNetwork(networkId);
							closeModal();
						}}
						isSelected={networkId === chainId}
						key={networkId}
						theme={theme}
					>
						<NetworkLogo chainId={networkId} logoSize={32} />
						<B>{networksParams[networkId].chainName}</B>
						{networkId === chainId && (
							<SelectedNetwork styleType='Small' theme={theme}>
								{formatMessage({ id: 'label.selected' })}
							</SelectedNetwork>
						)}
					</NetworkItem>
				))}
			</Wrapper>
		</Modal>
	);
};

export const SelectedNetwork = styled(Overline)`
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
	border-radius: 4px;
`;

export const NetworkItem = styled.div<{ isSelected: boolean }>`
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

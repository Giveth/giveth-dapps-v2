import React, { FC } from 'react';
import {
	B,
	brandColors,
	IconNetwork32,
	Overline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import NetworkLogo from '@/components/NetworkLogo';
import { switchNetwork } from '@/lib/wallet';

const SwitchNetwork: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { chainId } = useWeb3React();

	return (
		<Modal
			headerTitle='Switch Network'
			headerIcon={<IconNetwork32 />}
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			<Wrapper>
				{networks.map(i => (
					<NetworkItem
						onClick={() => {
							switchNetwork(i.id);
							closeModal();
						}}
						isSelected={i.id === chainId}
						key={i.id}
					>
						<NetworkLogo chainId={i.id} logoSize={32} />
						<B>{i.name}</B>
						{i.id === chainId && (
							<Selected styleType='Small'>Selected</Selected>
						)}
					</NetworkItem>
				))}
			</Wrapper>
		</Modal>
	);
};

const networks = [
	{
		id: 1,
		name: 'Ethereum Mainnet',
	},
	{
		id: 100,
		name: 'Gnosis',
	},
	{
		id: 137,
		name: 'Polygon Mainnet',
	},
];

const Selected = styled(Overline)`
	color: ${brandColors.giv[500]};
	position: absolute;
	top: -8px;
	left: 10px;
	background: white;
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

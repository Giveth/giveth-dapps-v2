import { useWallet, useWalletList } from '@meshsdk/react';
import Image from 'next/image';
import styled from 'styled-components';
import { brandColors, neutralColors } from '@giveth/ui-design-system';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { handleWalletSelection } from './helpers';
import { CardanoWalletInfo } from './types';

interface ICardanoConnectWalletModalProps {
	setShowCardanoConnectWalletModal: (value: boolean) => void;
	setSelectedCardanoWallet: (wallet: CardanoWalletInfo) => void;
}

export const CardanoConnectWalletModal = ({
	setShowCardanoConnectWalletModal,
	setSelectedCardanoWallet,
}: ICardanoConnectWalletModalProps) => {
	const { connect } = useWallet();
	const wallets = useWalletList();
	const { isAnimating } = useModalAnimation(setShowCardanoConnectWalletModal);

	const closeModal = () => {
		setShowCardanoConnectWalletModal(false);
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Connect Wallet'
			headerTitlePosition='left'
		>
			<WalletWrapper>
				{wallets.map(wallet => {
					console.log('wallet', wallet);
					const walletIcon =
						wallet.name === 'Typhon Wallet'
							? '/images/typhon.svg'
							: wallet.icon;
					return (
						<WalletItem
							key={wallet.name}
							onClick={() => {
								handleWalletSelection(
									wallet,
									setSelectedCardanoWallet,
									connect,
								);
								closeModal();
							}}
						>
							<Image
								src={walletIcon}
								alt={wallet.name}
								width={24}
								height={24}
							/>
							{wallet.name}
						</WalletItem>
					);
				})}
			</WalletWrapper>
		</Modal>
	);
};

const WalletWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 40px;
	padding: 30px;
	min-width: 300px;
`;

const WalletItem = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 22px;
	font-weight: 600;
	color: ${neutralColors.gray[800]};
	cursor: pointer;
	text-transform: capitalize;
	&::first-letter {
		text-transform: uppercase;
	}
	&:first-child {
		color: ${neutralColors.gray[800]};
	}
	&:hover {
		color: ${brandColors.pinky[500]};
		opacity: 0.85;
	}
`;

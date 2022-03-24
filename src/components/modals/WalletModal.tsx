import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import {
	EWallets,
	TWalletConnector,
	useWalletName,
	walletsArray,
} from '@/lib/wallet/walletTypes';
import { brandColors, H5, Lead, neutralColors } from '@giveth/ui-design-system';
import { IModal, Modal } from '@/components/modals/Modal';
import styled from 'styled-components';
import { ETheme } from '@/context/general.context';

interface IWalletModal extends IModal {
	closeParentModal?: () => void;
}

const WalletModal = ({
	showModal,
	setShowModal,
	closeParentModal,
}: IWalletModal) => {
	const context = useWeb3React();
	const { activate, deactivate } = context;
	const selectedWallet = useWalletName(context);

	const handleSelect = (selected: {
		connector: TWalletConnector;
		value: EWallets;
	}) => {
		if (selectedWallet !== selected.value) {
			deactivate();
			let timeOut = 0;
			if (selectedWallet === EWallets.METAMASK) {
				timeOut = 500;
			}
			setTimeout(() => {
				activate(selected.connector)
					.then(() => {
						window.localStorage.setItem(
							'selectedWallet',
							selected.value,
						);
						closeParentModal ? closeParentModal() : undefined;
					})
					.catch(e => {
						// toast to inform error
						console.log(e);
					});
			}, timeOut);
		}
		setShowModal(false);
	};

	if (!showModal) return null;

	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			customTheme={ETheme.Light}
		>
			<IconsContainer>
				{walletsArray.map(i => (
					<WalletItem
						onClick={() => handleSelect(i)}
						key={i.value}
						selected={selectedWallet === i.value}
					>
						<Image
							src={i.image}
							alt={i.name}
							height={64}
							width={64}
						/>
						<WalletName>{i.name}</WalletName>
						<WalletDesc>Connect with your {i.name}</WalletDesc>
					</WalletItem>
				))}
			</IconsContainer>
		</Modal>
	);
};

const IconsContainer = styled.div`
	padding: 18px 20px 50px;
	display: grid;
	grid-gap: 4px;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	background-color: ${neutralColors.gray['100']};
	grid-template-columns: 1fr 1fr;
`;

interface IWalletItem {
	selected: boolean;
}

const WalletItem = styled.div<IWalletItem>`
	background: radial-gradient(
		#fff,
		${props => (props.selected ? brandColors.giv['100'] : 'white')}
	);
	flex-direction: column;
	gap: 2px;
	padding: 20px 40px;
	border-radius: 10px;
	cursor: pointer;

	&:hover {
		background: radial-gradient(#fff, ${neutralColors.gray['500']});
	}
`;

const WalletName = styled(H5)`
	color: ${neutralColors.gray['900']};
`;

const WalletDesc = styled(Lead)`
	color: ${neutralColors.gray['600']};
`;

export default WalletModal;

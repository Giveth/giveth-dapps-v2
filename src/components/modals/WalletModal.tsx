import { FC, useState } from 'react';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { brandColors, H5, Lead, neutralColors } from '@giveth/ui-design-system';

import { captureException } from '@sentry/nextjs';
import { useRouter } from 'next/router';
import {
	EWallets,
	IWallet,
	torusWallet,
	useWalletName,
	walletsArray,
} from '@/lib/wallet/walletTypes';
import { Modal } from '@/components/modals/Modal';
import { ETheme } from '@/features/general/general.slice';
import { detectBrave, showToastError } from '@/lib/helpers';
import StorageLabel from '@/lib/localStorage';
import LowerShields from '@/components/modals/LowerShields';
import { IModal } from '@/types/common';
import { useAppDispatch } from '@/features/hooks';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { EModalEvents } from '@/hooks/useModalCallback';

const WalletModal: FC<IModal> = ({ setShowModal }) => {
	const [showLowerShields, setShowLowerShields] = useState<boolean>();
	const { formatMessage } = useIntl();

	const router = useRouter();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const context = useWeb3React();
	const { activate, deactivate } = context;
	const selectedWallet = useWalletName(context);
	const dispatch = useAppDispatch();

	const handleSelect = (selected: IWallet) => {
		if (selectedWallet !== selected.value) {
			localStorage.removeItem(StorageLabel.WALLET);
			deactivate();
			let timeOut = 0;
			if (selectedWallet === EWallets.METAMASK) {
				timeOut = 500;
			}
			setTimeout(() => {
				localStorage.setItem(StorageLabel.WALLET, selected.value);
				activate(selected.connector, showToastError, true)
					.then(() => {
						//Temporary Disable FirstWelcomeModal
						// const isGIVeconomyRoute = isGIVeconomyRoute(
						// 	router.route,
						// );
						// const isModalShowedBefor =
						// 	localStorage.getItem(
						// 		StorageLabel.FIRSTMODALSHOWED,
						// 	) === '1';
						// if (!isGIVeconomyRoute && !isModalShowedBefor) {
						// 	dispatch(setShowFirstWelcomeModal(true));
						// }

						//Add a small delay to make sure the wallet is connected
						setTimeout(() => {
							const event = new Event(EModalEvents.CONNECTED);
							window.dispatchEvent(event);
						}, 100);
					})
					.catch(error => {
						showToastError(error);
						captureException(error, {
							tags: {
								section: 'activateWallet',
							},
						});
					});
			}, timeOut);
		}
		closeModal();
	};

	const checkLowerShields = async (selected: IWallet) => {
		const isBrave = await detectBrave();
		if (selected.value === EWallets.TORUS && isBrave) {
			setShowLowerShields(true);
		} else {
			handleSelect(selected);
		}
	};

	const onCloseLowerShields = () => {
		handleSelect(torusWallet);
		setShowLowerShields(false);
	};

	return (
		<>
			{showLowerShields && <LowerShields onClose={onCloseLowerShields} />}
			<Modal
				closeModal={closeModal}
				isAnimating={isAnimating}
				customTheme={ETheme.Light}
			>
				<IconsContainer>
					{walletsArray.map(i => (
						<WalletItem
							onClick={() => checkLowerShields(i)}
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
							<WalletDesc>
								{formatMessage({
									id: 'label.connect_with_your',
								})}{' '}
								{i.name}
							</WalletDesc>
						</WalletItem>
					))}
				</IconsContainer>
			</Modal>
		</>
	);
};

const IconsContainer = styled.div`
	padding: 18px 20px 50px;
	display: grid;
	grid-gap: 4px;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	background-color: ${neutralColors.gray[100]};
	grid-template-columns: 1fr 1fr;
`;

const WalletItem = styled.div<{ selected: boolean }>`
	background: radial-gradient(
		#fff,
		${props => (props.selected ? brandColors.giv[100] : 'white')}
	);
	flex-direction: column;
	gap: 2px;
	padding: 20px 40px;
	border-radius: 10px;
	cursor: pointer;

	&:hover {
		background: radial-gradient(#fff, ${neutralColors.gray[500]});
	}
`;

const WalletName = styled(H5)`
	color: ${neutralColors.gray[900]};
`;

const WalletDesc = styled(Lead)`
	color: ${neutralColors.gray[600]};
`;

export default WalletModal;

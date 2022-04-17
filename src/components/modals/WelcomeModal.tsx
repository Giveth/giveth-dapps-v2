import React, { useState } from 'react';
import { H3, P, brandColors, neutralColors, B } from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';

import { Shadow } from '@/components/styled-components/Shadow';
import ethIcon from '/public/images/tokens/eth.png';
import googleIcon from '/public/images/google_icon.svg';
import twitterIcon from '/public/images/social-tt.svg';
import facebookIcon from '/public/images/social-fb2.svg';
import discordIcon from '/public/images/social-disc.svg';
import torusBrand from '/public/images/torus_pwr.svg';
import { EWallets, torusConnector } from '@/lib/wallet/walletTypes';
import { mediaQueries } from '@/lib/constants/constants';
import { detectBrave, showToastError } from '@/lib/helpers';
import useModal from '@/context/ModalProvider';
import StorageLabel from '@/lib/localStorage';
import LowerShields from '@/components/modals/LowerShields';
import { Modal } from './Modal';

interface ISignInModal {
	setShowModal: (x: boolean) => void;
}

const WelcomeModal = ({ setShowModal }: ISignInModal) => {
	const [showLowerShields, setShowLowerShields] = useState<boolean>();

	const { activate } = useWeb3React();
	const {
		actions: { showWalletModal },
	} = useModal();

	const closeModal = () => setShowModal(false);

	const checkIsBrave = async () => {
		const isBrave = await detectBrave();
		if (isBrave) {
			setShowLowerShields(true);
		} else {
			connectTorus();
		}
	};

	const connectTorus = (): void => {
		activate(torusConnector)
			.then(() => {
				localStorage.setItem(StorageLabel.WALLET, EWallets.TORUS);
				closeModal();
			})
			.catch(showToastError);
	};

	const onCloseLowerShields = () => {
		connectTorus();
		setShowLowerShields(false);
	};

	return (
		<>
			{showLowerShields && <LowerShields onClose={onCloseLowerShields} />}
			<Modal setShowModal={setShowModal} fullScreen hiddenHeader>
				<ModalGrid>
					<BGContainer />
					<ContentContainer>
						<H3>Sign in to Giveth</H3>
						<ContentSubtitle>
							Please sign in to your account and start using
							Giveth.
						</ContentSubtitle>
						<IconContentContainer>
							<EthIconContainer onClick={showWalletModal}>
								<Image src={ethIcon} alt='Ether icon' />
								<B>Sign in with Ethereum</B>
							</EthIconContainer>
							<BreakPoint>
								<BreakLine />
								<P>or</P>
								<BreakLine />
							</BreakPoint>
							<SocialContentContainer>
								{socialArray.map(elem => (
									<IconsContainer
										key={elem.alt}
										onClick={checkIsBrave}
									>
										{' '}
										{/* best way to activate torus here? */}
										<Image src={elem.icon} alt={elem.alt} />
									</IconsContainer>
								))}
							</SocialContentContainer>
							<Image src={torusBrand} alt='Powered by Torus' />
						</IconContentContainer>
					</ContentContainer>
				</ModalGrid>
			</Modal>
		</>
	);
};

const ModalGrid = styled.div`
	position: relative;
	display: flex;
	width: 100%;
	background: white !important;
	height: 100%;
`;

const BGContainer = styled.div`
	display: none;
	width: 55%;
	max-width: 640px;
	background-color: ${brandColors.giv[500]};
	background-image: url('/images/sign_bg.svg');
	background-repeat: no-repeat;
	${mediaQueries.laptop} {
		display: block;
	}
`;

const ContentContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: center;
	margin: auto;
	padding: 10px;
	${mediaQueries.laptop} {
		width: 45%;
	}
`;

const ContentSubtitle = styled(P)`
	color: ${brandColors.deep[800]};
	margin: 24px 0;
`;

const IconContentContainer = styled.div`
	width: 100%;
	max-width: 370px;
	display: flex;
	flex-direction: column;
`;

const IconsContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 3px 16px;
	border-radius: 8px;
	box-shadow: ${Shadow.Neutral[500]};
	cursor: pointer;
`;

const EthIconContainer = styled(IconsContainer)`
	padding: 20px 24px;
	border-radius: 4px;
`;

const SocialContentContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	justify-content: space-between;
	margin-bottom: 24px;
`;

const BreakPoint = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 48px 0;
`;

const BreakLine = styled.hr`
	width: 45%;
	margin: auto 0;
	border-top: 1px solid ${neutralColors.gray[300]};
`;

const socialArray = [
	{ icon: googleIcon, alt: 'Google icon.' },
	{ icon: twitterIcon, alt: 'Twitter icon.' },
	{ icon: facebookIcon, alt: 'Facebook icon.' },
	{ icon: discordIcon, alt: 'Discord icon.' },
];

export default WelcomeModal;

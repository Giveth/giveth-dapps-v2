import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { H3, P, brandColors, neutralColors, B } from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';
import { Shadow } from '@/components/styled-components/Shadow';
import ethIcon from '/public/images/tokens/ETH.svg';
import solanaIcon from '/public/images/tokens/SOLANA.svg';
import { mediaQueries } from '@/lib/constants/constants';
import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { useAppDispatch } from '@/features/hooks';
import { useModalAnimation } from '@/hooks/useModalAnimation';

const WelcomeModal: FC<IModal> = ({ setShowModal }) => {
	const { formatMessage } = useIntl();

	const { open: openConnectModal } = useWeb3Modal();
	const dispatch = useAppDispatch();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { setVisible } = useWalletModal();

	return (
		<>
			<Modal
				closeModal={closeModal}
				isAnimating={isAnimating}
				fullScreen
				hiddenHeader
			>
				<ModalGrid>
					<BGContainer />
					<ContentContainer>
						<SignInTitle>
							{formatMessage({ id: 'label.sign_in_to_giveth' })}
						</SignInTitle>
						<ContentSubtitle>
							{formatMessage({
								id: 'label.please_sign_in_to_your_account',
							})}
						</ContentSubtitle>
						<IconContentContainer>
							<ChainIconContainer
								onClick={() => {
									openConnectModal && openConnectModal();
									dispatch(setShowWelcomeModal(false));
								}}
							>
								<Image src={ethIcon} alt='Ether icon' />
								<B>
									{formatMessage({
										id: 'label.sign_in_with_ethereum',
									})}
								</B>
							</ChainIconContainer>
							<ChainIconContainer
								style={{ marginTop: '32px' }}
								onClick={() => {
									// openConnectModal && openConnectModal();
									setVisible(true);
									dispatch(setShowWelcomeModal(false));
								}}
							>
								<Image src={solanaIcon} alt='Solana icon' />
								<B>
									{formatMessage({
										id: 'label.sign_in_with_solana',
									})}
								</B>
							</ChainIconContainer>
						</IconContentContainer>
					</ContentContainer>
				</ModalGrid>
			</Modal>
		</>
	);
};

const ModalGrid = styled.div`
	color: ${neutralColors.gray[100]};
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
	${mediaQueries.laptopS} {
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
	${mediaQueries.laptopS} {
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

const ChainIconContainer = styled(IconsContainer)`
	padding: 20px 24px;
	border-radius: 4px;
	color: ${brandColors.deep[800]};
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
	color: ${brandColors.deep[800]};
`;

const BreakLine = styled.hr`
	width: 45%;
	margin: auto 0;
	border-top: 1px solid ${neutralColors.gray[300]};
`;

const SignInTitle = styled(H3)`
	color: ${brandColors.deep[800]};
	font-weight: 700;
`;

export default WelcomeModal;

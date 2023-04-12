import { useState } from 'react';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Button, B, neutralColors, H4 } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { InputSize } from '@/components/Input';
import InputStyled from '@/components/styled-components/Input';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { FiatDonationConfirmationModal } from '@/components/modals/FiatDonationConfirmationModal';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { useDonateData } from '@/context/donate.context';
import config from '@/configuration';

const FiatDonation = () => {
	const { formatMessage } = useIntl();
	const { project } = useDonateData();
	const { account } = useWeb3React();
	const dispatch = useAppDispatch();
	const [onramperConfirmationModal, setOnramperConfirmationModal] =
		useState(false);
	const [donorboxConfirmationModal, setDonorboxConfirmationModal] =
		useState(false);
	const { id } = project;
	const { userData, isSignedIn, isEnabled } = useAppSelector(
		state => state.user,
	);
	const givethProjectId = '1';
	const [temporaryEmail, setTemporaryEmail] = useState('');
	const [emailReady, setEmailReady] = useState(false);
	const [openOnramper, setOpenOnramper] = useState(false);
	const [openDonorBox, setOpenDonorBox] = useState(false);
	const mainnetAddress = project.addresses?.find(
		i => i.networkId === config.MAINNET_NETWORK_NUMBER,
	)?.address;
	const partnerContext = {
		userId: userData?.id,
		userWallet: userData?.walletAddress,
		projectWallet: mainnetAddress,
		projectId: id,
		email: userData?.email || temporaryEmail,
	};
	const wallets = {
		ETH: { address: mainnetAddress },
	};

	return (
		<FiatContainer style={{ marginTop: 40 }}>
			<H4>{formatMessage({ id: 'label.coming_soon' })}</H4>
		</FiatContainer>
	);

	return (
		<>
			<FiatContainer>
				{emailReady || isSignedIn ? (
					openOnramper && mainnetAddress ? (
						<div
							style={{
								width: '440px',
								height: '595px',
								boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.1)',
								borderRadius: '10px',
								margin: '20px auto',
							}}
						>
							<iframe
								src={`https://buy.onramper.com?color=266677&API_KEY=${
									process.env.NEXT_PUBLIC_ONRAMPER_API_KEY
								}&isAddressEditable=false&supportSwap=false&supportSell=false&onlyCryptos=ETH,USDC,DAI_ERC20&defaultFiat=USD&defaultCrypto=USDC&wallets=ETH:${mainnetAddress},USDC:${mainnetAddress},DAI_ERC20:${mainnetAddress}&partnerContext=${JSON.stringify(
									partnerContext,
								)}`}
								height='660px'
								width='100%'
								title='Onramper widget'
								allow='accelerometer;
  autoplay; camera; gyroscope; payment'
								style={{
									boxShadow:
										'1px 1px 1px 1px rgba(0,0,0,0.2)',
									margin: '0 0 20px 0',
								}}
							/>
						</div>
					) : openDonorBox ? (
						<>
							<script src='https://donorbox.org/widget.js'></script>
							<iframe
								src='https://donorbox.org/embed/giveth'
								name='donorbox'
								scrolling='no'
								height='520px'
								width='100%'
								style={{
									maxWidth: '500px',
									minWidth: '250px',
									maxHeight: 'none !important',
								}}
							></iframe>
						</>
					) : (
						<Buttons>
							{onramperConfirmationModal && (
								<FiatDonationConfirmationModal
									setShowModal={setOnramperConfirmationModal}
									continueProcess={() =>
										setOpenOnramper(true)
									}
									type='onramper'
								/>
							)}
							{donorboxConfirmationModal && (
								<FiatDonationConfirmationModal
									setShowModal={setDonorboxConfirmationModal}
									continueProcess={() =>
										setOpenDonorBox(true)
									}
									type='donorbox'
								/>
							)}
							<ImageContainer>
								<Image
									src='/images/powered_by_onramper.png'
									width='220'
									height='60'
									alt={'Powered by OnRamper'}
								/>
							</ImageContainer>
							<Info>
								{formatMessage({
									id: 'label.buy_crypto_with_your_credit_card_without_leaving_the_platform',
								})}
							</Info>
							<Button
								label='CONTINUE WITH ONRAMPER'
								onClick={() => {
									setOnramperConfirmationModal(true);
								}}
							/>
							{id === givethProjectId && (
								<DonorBoxContainer>
									<ImageContainer>
										<Image
											src='/images/powered_by_donorbox.png'
											width='220'
											height='60'
											alt={'Powered by Donorbox'}
										/>
									</ImageContainer>
									<Info>
										{formatMessage({
											id: 'label.easily_connect_a_paypal_or_stripe_account',
										})}
									</Info>
									<Button
										label={formatMessage({
											id: 'label.continue_with_donorbox',
										})}
										onClick={() =>
											setDonorboxConfirmationModal(true)
										}
										// disabled
									/>
								</DonorBoxContainer>
							)}
						</Buttons>
					)
				) : (
					<FirstContainer>
						<InputStyled
							inputSize={InputSize.LARGE}
							hasLeftIcon={false}
							value={temporaryEmail}
							placeholder={formatMessage({
								id: 'label.proceed_with_an_email',
							})}
							onChange={e => setTemporaryEmail(e.target.value)}
						/>
						<StyledButton
							label={formatMessage({
								id: 'label.donate_with_email',
							})}
							buttonType='secondary'
							size='medium'
							disabled={!temporaryEmail}
							onClick={() => {
								setEmailReady(true);
							}}
						/>
						{formatMessage({ id: 'label.or' })}
						{!isSignedIn && (
							<StyledButton
								label={formatMessage({
									id: 'label.sign_wallet',
								})}
								buttonType='secondary'
								size='medium'
								onClick={() => {
									dispatch(setShowSignWithWallet(true));
								}}
							/>
						)}
					</FirstContainer>
				)}
			</FiatContainer>
		</>
	);
};

const FiatContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	align-items: center;
`;
const FirstContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px 0;
	width: 100%;
`;
const ImageContainer = styled.div`
	width: 100%;
	text-align: center;
	margin-top: 23px;
	img {
		object-fit: cover;
	}
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 18px;
	margin: 40px 0;
	button {
		margin: 16px 0 0 0;
	}
`;

const Info = styled(B)`
	font-weight: 400;
	font-size: 16px;
	line-height: 150%;
	color: ${neutralColors.gray[800]};
`;

const DonorBoxContainer = styled(Buttons)`
	border-top: 1px solid ${neutralColors.gray[400]};
`;

const StyledButton = styled(Button)`
	width: 100%;
	margin: 20px 0;
`;

export default FiatDonation;

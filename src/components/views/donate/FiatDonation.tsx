import { useState } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/features/hooks';
import { Button } from '@giveth/ui-design-system';
import OnramperWidget from '@onramper/widget';
import styled from 'styled-components';
import { IProject } from '@/apollo/types/types';
import { ISuccessDonation } from '@/components/views/donate/CryptoDonation';
import config from '@/configuration';

const FiatDonation = (props: {
	project: IProject;
	setSuccessDonation: (i: ISuccessDonation) => void;
}) => {
	const isProd = process.env.NEXT_PUBLIC_ENV === 'production';
	const { setSuccessDonation, project } = props;
	const { id } = project;
	const { userData, isSignedIn, isEnabled } = useAppSelector(
		state => state.user,
	);
	const givethProjectId = isProd ? '1' : '41';
	const [openOnramper, setOpenOnramper] = useState(false);
	const [openDonorBox, setOpenDonorBox] = useState(false);
	const mainnetAddress = project.addresses?.find(
		i => i.networkId === config.PRIMARY_NETWORK.id,
	)?.address;
	const partnerContext = {
		userId: isEnabled && userData && userData!.id,
		userWallet: isEnabled && userData && userData?.walletAddress,
		projectWallet: mainnetAddress,
		projectId: id,
	};
	const wallets = {
		ETH: { address: mainnetAddress },
	};

	return (
		<FiatContainer>
			{openOnramper && mainnetAddress ? (
				<div
					style={{
						width: '440px',
						height: '595px',
						boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.1)',
						borderRadius: '10px',
						margin: '20px auto',
					}}
				>
					<OnramperWidget
						API_KEY={process.env.NEXT_PUBLIC_ONRAMPER_API_KEY}
						filters={{
							onlyCryptos: ['ETH', 'USDC', 'USDT', 'RAI', 'DAI'],
						}}
						defaultFiat='USD'
						defaultCrypto='USDC'
						defaultAddrs={wallets}
						redirectURL={'https://giveth.io/'}
						partnerContext={partnerContext}
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
					{id === givethProjectId && (
						<ButtonContainer>
							<Button
								label='CONTINUE WITH DONORBOX'
								onClick={() => setOpenDonorBox(true)}
								// disabled
							/>
							<ImageContainer>
								<Image
									src='/images/powered_by_donorbox.png'
									width='165px'
									height='24px'
									alt={'Powered by Donorbox'}
								/>
							</ImageContainer>
						</ButtonContainer>
					)}

					<ButtonContainer>
						<Button
							label='CONTINUE WITH ONRAMPER'
							// onClick={() => setSuccessDonation()}
							onClick={() => setOpenOnramper(true)}
							// disabled
						/>
					</ButtonContainer>
					<ImageContainer>
						<Image
							src='/images/powered_by_onramper.png'
							width='165px'
							height='24px'
							alt={'Powered by OnRamper'}
						/>
					</ImageContainer>
				</Buttons>
			)}
		</FiatContainer>
	);
};

const FiatContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	align-items: center;
`;
const ImageContainer = styled.div`
	width: 100%;
	text-align: center;
	margin-top: 23px;
	img {
		object-fit: cover;
	}
`;
const ButtonContainer = styled.div`
	padding: 32px 0 0 0;
`;

const Buttons = styled.div`
	margin: 40px 0 0 0;
`;

export default FiatDonation;

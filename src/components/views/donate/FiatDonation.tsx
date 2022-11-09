import { useState } from 'react';
import Image from 'next/image';
import { Button, H4 } from '@giveth/ui-design-system';
import OnramperWidget from '@onramper/widget';
import styled from 'styled-components';
import { IProject } from '@/apollo/types/types';
import { ISuccessDonation } from '@/components/views/donate/CryptoDonation';
import config from '@/configuration';

const FiatDonation = (props: {
	project: IProject;
	setSuccessDonation: (i: ISuccessDonation) => void;
}) => {
	const { setSuccessDonation, project } = props;
	const [openOnramper, setOpenOnramper] = useState(false);
	const mainnetAddress = project.addresses?.find(
		i => i.networkId === config.PRIMARY_NETWORK.id,
	)?.address;
	const wallets = {
		ETH: { address: mainnetAddress },
		// BTC: { address: '2N3oefVeg6stiTb5Kh3ozCSkaqmx91FDbsm' }, // Only for testing
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
							// onlyCryptos: ['ETH', 'BTC'],
							onlyCryptos: ['ETH'],
						}}
						defaultFiat='USD'
						defaultAddrs={wallets}
						redirectURL={'http://localhost:3000/donate/'}
					/>
				</div>
			) : (
				<>
					<H4>Coming soon ...</H4>
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
				</>
			)}
		</FiatContainer>
	);
};

const FiatContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	> h4 {
		margin: 90px 0;
	}
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

export default FiatDonation;

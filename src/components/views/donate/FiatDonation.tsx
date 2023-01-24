import Image from 'next/image';
import { Button, H4 } from '@giveth/ui-design-system';
import styled from 'styled-components';

const FiatDonation = () => {
	return (
		<FiatContainer>
			<H4>Coming soon ...</H4>
			<ButtonContainer>
				<Button
					label='CONTINUE WITH TRANSAK'
					// onClick={() => setSuccessDonation()}
					disabled
				/>
			</ButtonContainer>
			<ImageContainer>
				<Image
					src='/images/powered_by_transak.svg'
					width='165'
					height='24'
					alt={'Powered by Transak'}
				/>
			</ImageContainer>
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
`;
const ButtonContainer = styled.div`
	padding: 32px 0 0 0;
`;

export default FiatDonation;

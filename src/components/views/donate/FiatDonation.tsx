import Image from 'next/image';
import { IProject } from '@/apollo/types/types';
import { Button, H4 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ISuccessDonation } from '@/components/views/donate/CryptoDonation';

const FiatDonation = (props: {
	project: IProject;
	setSuccessDonation: (i: ISuccessDonation) => void;
}) => {
	// const { setSuccessDonation } = props;

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
					width='165px'
					height='24px'
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

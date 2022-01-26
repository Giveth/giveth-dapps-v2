import Image from 'next/image';
import { IProject } from '@/apollo/types/types';
import { Button } from '@giveth/ui-design-system';
import styled from 'styled-components';

type SuccessFunction = (param: boolean) => void;

const FiatDonation = (props: {
	project: IProject;
	setSuccessDonation: SuccessFunction;
}) => {
	const { setSuccessDonation } = props;

	return (
		<FiatContainer>
			<ButtonContainer>
				<Button
					label='CONTINUE WITH TRANSAK'
					onClick={() => setSuccessDonation(true)}
				></Button>
			</ButtonContainer>
			<ImageContainer>
				<Image
					src='/images/powered_by_transak.svg'
					width='165px'
					height='24px'
				/>
			</ImageContainer>
		</FiatContainer>
	);
};

const FiatContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
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

import { FC } from 'react';
import {
	B,
	brandColors,
	ButtonText,
	H5,
	IconX,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Modal } from '@/components/modals/Modal';
import { mediaQueries } from '@/lib/constants/constants';
import { FlexCenter } from '@/components/styled-components/Flex';
import { IModalProps } from '@/types/common';

const FailedDonation: FC<IModalProps> = ({ setShowModal }) => {
	return (
		<Modal
			setShowModal={setShowModal}
			headerTitle='Donation failed'
			headerTitlePosition='left'
			headerIcon={
				<img src='/images/icons/donation.svg' alt='Donation icon' />
			}
		>
			<Container>
				<Error>
					<IconX size={70} color='white' />
				</Error>
				<H5 weight={700}>Sorry!</H5>
				<B>
					Your transaction has failed. Please go back and try again.
				</B>
				<Button onClick={() => setShowModal(false)}>GO BACK</Button>
			</Container>
		</Modal>
	);
};

const Button = styled(ButtonText)`
	color: ${brandColors.deep[100]};
	margin: 44px 0;
	cursor: pointer;
`;

const Error = styled(FlexCenter)`
	width: 125px;
	height: 125px;
	border-radius: 50%;
	background: ${semanticColors.punch[300]};
	margin-top: 21px;
	margin-bottom: 12px;
`;

const Container = styled(FlexCenter)`
	max-width: 500px;
	padding: 0 20px;
	text-align: center;
	flex-direction: column;

	> h5 {
		color: ${semanticColors.punch[500]};
	}
	> :nth-child(3) {
		color: ${brandColors.deep[700]};
		margin-top: 8px;
		max-width: 280px;
	}

	${mediaQueries.mobileL} {
		padding: 0 50px;
	}
	${mediaQueries.tablet} {
		padding: 0 108px;
	}
`;

export default FailedDonation;

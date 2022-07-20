import { FC } from 'react';
import { Lead, semanticColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import { Modal } from '@/components/modals/Modal';
import { mediaQueries } from '@/lib/constants/constants';
import { FlexCenter } from '@/components/styled-components/Flex';
import { IModal } from '@/types/common';
import ExternalLink from '@/components/ExternalLink';
import DangerIcon from '/public/images/icons/danger_triangle.svg';
import links from '@/lib/constants/links';
import { useModalAnimation } from '@/hooks/useModalAnimation';

export enum EDonationFailedType {
	REJECTED = 'REJECTED',
	FAILED = 'FAILED',
	CANCELLED = 'CANCELLED',
	NOT_SAVED = 'NOT_SAVED',
}

interface IProps extends IModal {
	txUrl?: string;
	type: EDonationFailedType;
}

const FailedDonation: FC<IProps> = ({ setShowModal, txUrl, type }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const messageContent = () => {
		switch (type) {
			case EDonationFailedType.REJECTED:
				return <div>Transaction was rejected!</div>;
			case EDonationFailedType.CANCELLED:
				return (
					<div>
						<p>Your transaction has been cancelled!</p>
						Please go back and try again.
					</div>
				);
			case EDonationFailedType.NOT_SAVED:
				return (
					<NotSaved>
						<p>Your donation has NOT been saved!</p>
						<ExternalLink
							href={links.DISCORD_SUPPORT}
							title='Please contact our support team'
						/>
						.
					</NotSaved>
				);
			default:
				return (
					<div>
						<p>Your transaction has failed!</p>
						Please go back and try again.
					</div>
				);
		}
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Donation failed!'
			headerTitlePosition='left'
			headerColor={semanticColors.punch[500]}
			headerIcon={<Image src={DangerIcon} alt='danger' />}
		>
			<Container>
				<Content>{messageContent()}</Content>
				{txUrl && (
					<ExternalLink href={txUrl} title='View on Etherscan' />
				)}
			</Container>
		</Modal>
	);
};

const NotSaved = styled.div`
	> :last-child {
		font-weight: 500;
		text-decoration: underline;
	}
`;

const Content = styled(Lead)`
	border-radius: 16px;
	background: ${semanticColors.punch[100]};
	padding: 30px 20px;
	color: ${semanticColors.punch[700]};
	border: 1px solid ${semanticColors.punch[700]};
	margin-top: 42px;
	margin-bottom: 48px;
	p {
		margin: 0 0 5px;
	}

	${mediaQueries.mobileL} {
		padding: 38px 50px;
	}
	${mediaQueries.tablet} {
		padding: 38px 93px;
	}
`;

const Container = styled(FlexCenter)`
	max-width: 500px;
	padding: 0 15px;
	text-align: center;
	flex-direction: column;

	> :nth-child(2) {
		color: ${semanticColors.punch[500]};
		margin-bottom: 40px;
		max-width: 280px;
		font-size: 12px;
		font-weight: 700;
	}

	${mediaQueries.mobileL} {
		padding: 0 24px;
	}
`;

export default FailedDonation;

import { FC } from 'react';
import { Lead, semanticColors, FlexCenter } from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { mediaQueries } from '@/lib/constants/constants';
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
	const { formatMessage } = useIntl();

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
						<p>We were not able to record your donation.</p>
						<p>
							Please check if the transaction was successful and
							report this to our support team.
						</p>
						<ExternalLink
							href={links.REPORT_FAILED_DONATION}
							title='Send Report'
						/>
					</NotSaved>
				);
			case EDonationFailedType.FAILED:
				return (
					<div>
						<p>
							Low liquidity, please reduce swap amount and try
							again
						</p>
					</div>
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
					<ExternalLink
						href={txUrl}
						title={formatMessage({
							id: 'label.view_on_block_explorer',
						})}
					/>
				)}
			</Container>
		</Modal>
	);
};

const NotSaved = styled.div`
	> a > span {
		font-weight: 500;
		text-decoration: underline;
		margin-top: 16px;
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
		padding: 24px;
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

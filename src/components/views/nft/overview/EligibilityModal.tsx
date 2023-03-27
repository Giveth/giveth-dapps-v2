import React from 'react';
import {
	brandColors,
	ButtonLink,
	IconAlertTriangleFilled32,
	IconCheckCircleFilled32,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import Routes from '@/lib/constants/Routes';

interface IEligibilityModal extends IModal {
	isSuccess: boolean;
}

const EligibilityModal = ({ isSuccess, setShowModal }: IEligibilityModal) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: isSuccess
					? 'label.congratulations'
					: 'component.pfp_eligibility_modal.title.not_eligible',
			})}
			headerTitlePosition='left'
			headerIcon={
				isSuccess ? (
					<IconCheckCircleFilled32 />
				) : (
					<IconAlertTriangleFilled32 />
				)
			}
		>
			<ModalContentContainer>
				{formatMessage({
					id: isSuccess
						? 'component.pfp_eligibility_modal.content.success'
						: 'component.pfp_eligibility_modal.content.not_eligible',
				})}
			</ModalContentContainer>
			{isSuccess ? (
				<CustomizedLink href={Routes.NFTMint} passHref>
					<CustomizedButtonLink
						linkType='texty-secondary'
						label='GO TO MINTING PAGE'
					/>
				</CustomizedLink>
			) : (
				// if it is not successful we should link to the documentation article - mitch needs to publish this!!
				<CustomizedLink
					href='https://docs.giveth.io/dapps/giverspfp/'
					passHref
					target='_blank'
				>
					<CustomizedButtonLink
						linkType='texty-secondary'
						label='LEARN MORE'
					/>
				</CustomizedLink>
			)}

			<br />
			<br />
		</Modal>
	);
};

const ModalContentContainer = styled.div`
	padding: 42px 24px;
	max-width: 445px;
`;

const CustomizedButtonLink = styled(ButtonLink)`
	margin: 0 auto;
	max-width: 200px;
	color: ${brandColors.deep[100]};
`;

const CustomizedLink = styled(Link)`
	display: contents;
`;

export default EligibilityModal;

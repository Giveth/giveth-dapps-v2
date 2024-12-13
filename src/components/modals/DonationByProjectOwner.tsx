import React, { useEffect, useState } from 'react';
import {
	brandColors,
	Button,
	IconAlertTriangleFilled32,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Modal } from '@/components/modals/Modal';
import Routes from '@/lib/constants/Routes';
import { mediaQueries } from '@/lib/constants/constants';

// Define the props interface
interface DonationByProjectOwnerProps {
	closeModal: () => void;
}

export const DonationByProjectOwner: React.FC<DonationByProjectOwnerProps> = ({
	closeModal,
}) => {
	const { formatMessage } = useIntl();
	const router = useRouter();
	const [isRedirecting, setIsRedirecting] = useState(false);

	const navigateToAllProjects = () => {
		setIsRedirecting(true);
		router.push(Routes.AllProjects);
	};

	useEffect(() => {
		const handleRouteChangeComplete = () => {
			closeModal();
			setIsRedirecting(false);
		};
		if (isRedirecting) {
			router.events.on('routeChangeComplete', handleRouteChangeComplete);
		}
		return () => {
			router.events.off('routeChangeComplete', handleRouteChangeComplete);
		};
	}, [isRedirecting]);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={false}
			headerTitle={formatMessage({
				id: 'label.project_owner_address_detected',
			})}
			headerTitlePosition='left'
			hiddenClose={true}
			headerIcon={<IconAlertTriangleFilled32 size={32} />}
			doNotCloseOnClickOutside
		>
			<ModalContainer>
				<ModalBox>
					<Lead>
						{formatMessage({
							id: 'label.project_owner_cant_donate_to_own_project',
						})}
					</Lead>
				</ModalBox>
				<Buttons>
					<ModalButton
						buttonType='primary'
						disabled={false}
						label={formatMessage({
							id: 'label.view_all_projects',
						})}
						onClick={navigateToAllProjects} // Navigate to the All Projects route
					/>
				</Buttons>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	background: white;
	color: black;
	padding: 24px 24px 38px;
	margin: 0;
	width: 100%;

	${mediaQueries.tablet} {
		width: 494px;
	}
`;

const ModalBox = styled.div`
	color: ${brandColors.deep[900]};

	> :first-child {
		margin-bottom: 8px;
	}

	h3 {
		margin-top: -5px;
	}

	h6 {
		color: ${neutralColors.gray[700]};
		margin-top: -5px;
	}

	> :last-child {
		margin: 12px 0 32px 0;

		> span {
			font-weight: 500;
		}
	}
`;

const ModalButton = styled(Button)`
	background: ${props =>
		props.disabled ? brandColors.giv[200] : brandColors.giv[500]};

	&:hover:enabled {
		background: ${brandColors.giv[700]};
	}

	:disabled {
		cursor: not-allowed;
	}

	> :first-child > div {
		border-top: 3px solid ${brandColors.giv[200]};
		animation-timing-function: linear;
	}

	text-transform: uppercase;
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;

	> :first-child {
		margin: 15px 0;
	}
`;

export default DonationByProjectOwner;

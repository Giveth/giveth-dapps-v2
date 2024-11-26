import { FC } from 'react';
import router from 'next/router';
import styled from 'styled-components';
import {
	brandColors,
	Button,
	H5,
	IconProfile,
	Lead,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';

import { Modal } from '@/components/modals/Modal';
import Routes from '@/lib/constants/Routes';
import { IModal } from '@/types/common';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { useModalAnimation } from '@/hooks/useModalAnimation';

export const VerifyEmailModal: FC<IModal> = ({ setShowModal }) => {
	const theme = useAppSelector(state => state.general.theme);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	const handleClick = () => {
		router.push(
			{
				pathname: Routes.MyAccount,
				query: { opencheck: 'true' },
			},
			undefined,
			{ shallow: true },
		);
		closeModal();
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<IconProfile size={32} />}
			headerTitle={formatMessage({ id: 'label.complete_your_profile' })}
			headerTitlePosition='left'
		>
			<Container>
				<Title>
					{formatMessage({
						id: 'label.email_modal_verify_your',
					})}
				</Title>
				<div>
					{formatMessage({
						id: 'label.email_modal_need_verify',
					})}
				</div>
				<br />
				<div>
					{formatMessage({
						id: 'label.email_modal_verifying',
					})}
				</div>
				<br />
				<div>
					{formatMessage({
						id: 'label.email_modal_to_verifying',
					})}
				</div>
				<OkButton
					label={formatMessage({ id: 'label.email_modal_button' })}
					onClick={handleClick}
					buttonType={theme === ETheme.Dark ? 'primary' : 'secondary'}
				/>
				<SkipButton
					label={formatMessage({ id: 'label.skip_for_now' })}
					onClick={closeModal}
					buttonType='primary'
				/>
			</Container>
		</Modal>
	);
};

const Container = styled(Lead)`
	max-width: 528px;
	padding: 24px;
	text-align: left;
	color: ${brandColors.deep[900]};
`;

const OkButton = styled(Button)`
	width: 300px;
	height: 48px;
	margin: 48px auto 0;
`;

const SkipButton = styled(Button)`
	width: 300px;
	margin: 0 auto 0;
	background: transparent !important;
	color: ${brandColors.pinky[500]} !important;
	&:hover {
		background: transparent !important;
		color: ${brandColors.pinky[300]} !important;
	}
`;

const Title = styled(H5)`
	margin: 24px 0;
	font-weight: 700;
`;

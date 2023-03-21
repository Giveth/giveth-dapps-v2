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
import { Bullets } from '@/components/styled-components/Bullets';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { useModalAnimation } from '@/hooks/useModalAnimation';

export const CompleteProfileModal: FC<IModal> = ({ setShowModal }) => {
	const theme = useAppSelector(state => state.general.theme);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	const handleClick = () => {
		router.push(Routes.Onboard);
		closeModal();
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<IconProfile />}
			headerTitle={formatMessage({ id: 'label.complete_your_profile' })}
			headerTitlePosition='left'
		>
			<Container>
				<Title>
					{formatMessage({
						id: 'label.now_its_time_to_complete_your_profile',
					})}
				</Title>
				<div>
					{formatMessage({
						id: 'label.with_a_complete_profile_you_can',
					})}
				</div>
				<Bullets>
					<li>
						{formatMessage({
							id: 'label.create_projects_and_receive_funds',
						})}
					</li>
					<li>
						{formatMessage({
							id: 'label.better_communicate_with_the_community',
						})}
					</li>
					<li>
						{formatMessage({
							id: 'label.let_others_know_you_a_little_better',
						})}
					</li>
				</Bullets>
				<OkButton
					label='OK'
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
	background: transparent;
	color: ${brandColors.deep[100]};
	:hover {
		background: transparent;
		color: ${brandColors.deep[200]};
	}
`;

const Title = styled(H5)`
	margin: 24px 0;
	font-weight: 700;
`;

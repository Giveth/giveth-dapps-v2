import { FC } from 'react';
import router from 'next/router';
import styled from 'styled-components';
import { IconProfile } from '@giveth/ui-design-system/lib/cjs/components/icons/Profile';
import { brandColors, Button, H5, Lead } from '@giveth/ui-design-system';

import { Modal } from '@/components/modals/Modal';
import Routes from '@/lib/constants/Routes';
import { IModal } from '@/types/common';
import { Bullets } from '@/components/styled-components/Bullets';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.sclie';

export const CompleteProfileModal: FC<IModal> = ({ setShowModal }) => {
	const theme = useAppSelector(state => state.general.theme);

	const handleClick = () => {
		router.push(Routes.Onboard);
		setShowModal(false);
	};

	return (
		<Modal
			setShowModal={setShowModal}
			headerIcon={<IconProfile />}
			headerTitle='Complete your profile'
			headerTitlePosition='left'
		>
			<Container>
				<Title>Now it’s time to complete your profile!</Title>
				<div>With a complete profile you can:</div>
				<Bullets>
					<li>Create projects and receive funds.</li>
					<li>Better communicate with the community.</li>
					<li>Let others know you a little better.</li>
				</Bullets>
				<OkButton
					label='OK'
					onClick={handleClick}
					buttonType={theme === ETheme.Dark ? 'primary' : 'secondary'}
				/>
				<SkipButton
					label='SKIP FOR NOW'
					onClick={() => setShowModal(false)}
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

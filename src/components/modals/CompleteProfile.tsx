import router from 'next/router';
import styled from 'styled-components';
import { IconProfile } from '@giveth/ui-design-system/lib/cjs/components/icons/Profile';
import {
	brandColors,
	Button,
	H5,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';

import { Modal } from '@/components/modals/Modal';
import { ETheme, useGeneral } from '@/context/general.context';
import Routes from '@/lib/constants/Routes';

export const CompleteProfile = (props: { closeModal: () => void }) => {
	const { closeModal } = props;
	const { theme } = useGeneral();

	const handleClick = () => {
		router.push(Routes.Onboard);
		closeModal();
	};

	return (
		<Modal
			setShowModal={closeModal}
			hiddenClose={false}
			headerIcon={<IconProfile />}
			headerTitle='Complete your profile'
			headerTitlePosition='left'
		>
			<Container>
				<Title>Now it’s time to complete your profile!</Title>
				<Description>With a complete profile you can:</Description>
				<Bullets>
					<li>
						<Lead>Create projects and receive funds.</Lead>
					</li>
					<li>
						<Lead>Better communicate with the community.</Lead>
					</li>
					<li>
						<Lead>Let other know you a little better.</Lead>
					</li>
				</Bullets>
				<OkButton
					label='OK'
					onClick={handleClick}
					buttonType={theme === ETheme.Dark ? 'primary' : 'secondary'}
				/>
				<SkipButton
					label='SKIP FOR NOW'
					onClick={() => closeModal()}
					buttonType='primary'
				/>
			</Container>
		</Modal>
	);
};

const Bullets = styled.ul`
	padding-left: 17px;
	list-style-image: url('/images/bullet_tiny.svg');
	margin-bottom: 30px;
	li {
		margin: 10px 0;
		color: ${neutralColors.gray[900]};
	}
`;

const Container = styled.div`
	max-width: 528px;
	padding: 24px;
	text-align: left;
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
	margin-top: 24px;
	font-weight: 700;
`;

const Description = styled(Lead)`
	margin-top: 24px;
	color: ${brandColors.deep[900]};
`;

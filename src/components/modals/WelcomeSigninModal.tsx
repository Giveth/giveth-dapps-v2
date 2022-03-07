import { IModal, Modal } from '@/components/modals/Modal';
import { FC } from 'react';
import styled from 'styled-components';
import useUser from '@/context/UserProvider';
import { IconWalletApprove } from '@giveth/ui-design-system/lib/cjs/components/icons/WalletApprove';
import {
	brandColors,
	Button,
	H5,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import { ETheme, useGeneral } from '@/context/general.context';

export const WelcomeSigninModal: FC<IModal> = ({
	showModal,
	setShowModal,
	callback,
}) => {
	const { theme } = useGeneral();
	const {
		actions: { signIn },
	} = useUser();
	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			hiddenClose={false}
			headerIcon={<IconWalletApprove />}
			headerTitle='Sign Wallet'
			headerTitlePosition='left'
		>
			<Container>
				{/* <Title>Welcome to Giveth</Title> */}
				<Description>
					You need to Sign your wallet to be able to use it on Giveth.
				</Description>
				<NoteDescription color='red'>
					Note: only after you Sign your wallet, you can donate to
					projects or receive donations.
				</NoteDescription>
				<OkButton
					label='SIGN IN'
					onClick={async () => {
						let signature: string | boolean = false;
						signIn && (signature = await signIn());
						setShowModal(false);
						!!signature && callback && callback();
					}}
					buttonType={theme === ETheme.Dark ? 'secondary' : 'primary'}
				/>
				<SkipButton
					label='SKIP FOR NOW'
					onClick={() => setShowModal(false)}
					buttonType='texty'
				/>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	width: 528px;
	padding: 48px 24px;
`;

const OkButton = styled(Button)`
	width: 300px;
	margin: 48px auto 0;
`;

const SkipButton = styled(Button)`
	width: 300px;
	margin: 10px auto 0;
	:hover {
		background: transparent;
		color: ${brandColors.deep[200]};
	}
`;

const Description = styled(Lead)`
	margin-top: 24px;
`;

const NoteDescription = styled(Lead)`
	margin-top: 24px;
	color: ${neutralColors.gray[600]};
	font-size: 18px;
`;

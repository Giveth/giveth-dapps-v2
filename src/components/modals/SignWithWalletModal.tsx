import { FC } from 'react';
import styled from 'styled-components';
import { IconWalletApprove } from '@giveth/ui-design-system/lib/cjs/components/icons/WalletApprove';
import {
	brandColors,
	Button,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';

import { Modal } from '@/components/modals/Modal';
import { ETheme } from '@/features/general/general.slice';
import { mediaQueries } from '@/lib/constants/constants';
import { IModal } from '@/types/common';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { signToGetToken } from '@/features/user/user.thunks';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IProps extends IModal {
	callback?: () => void;
}

export const SignWithWalletModal: FC<IProps> = ({ setShowModal, callback }) => {
	const theme = useAppSelector(state => state.general.theme);
	const { account, library, chainId } = useWeb3React();
	const router = useRouter();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const dispatch = useAppDispatch();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<IconWalletApprove />}
			headerTitle='Sign Wallet'
			headerTitlePosition='left'
		>
			<Container>
				<Description>
					You need to authorize your wallet to be able to use it on
					Giveth.
				</Description>
				<NoteDescription color='red'>
					Note: This is necessary to be able to donate to projects or
					receive funding.
				</NoteDescription>
				<OkButton
					label='SIGN IN'
					onClick={async () => {
						if (!account) {
							return dispatch(setShowWelcomeModal(true));
						}
						const signature = await dispatch(
							signToGetToken({
								address: account,
								chainId,
								signer: library?.getSigner(),
								pathname: router.pathname,
							}),
						);
						closeModal();
						!!signature && callback && callback();
					}}
					buttonType={theme === ETheme.Dark ? 'secondary' : 'primary'}
				/>
				<SkipButton
					label='SKIP FOR NOW'
					onClick={closeModal}
					buttonType='texty'
				/>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	padding: 48px 24px;
	width: 100%;
	${mediaQueries.desktop} {
		width: 528px;
	}
	${mediaQueries.tablet} {
		width: 528px;
	}
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

import { FC, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import {
	brandColors,
	Button,
	IconWalletApprove32,
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
import { EModalEvents } from '@/hooks/useModalCallback';

interface IProps extends IModal {
	callback?: () => void;
}

export const SignWithWalletModal: FC<IProps> = ({ setShowModal, callback }) => {
	const [loading, setLoading] = useState(false);
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();
	const { account, library, chainId } = useWeb3React();
	const router = useRouter();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const dispatch = useAppDispatch();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<IconWalletApprove32 />}
			headerTitle={formatMessage({ id: 'label.sign_wallet' })}
			headerTitlePosition='left'
		>
			<Container>
				<Description>
					{formatMessage({
						id: 'label.you_need_to_authorize_your_wallet',
					})}
				</Description>
				<NoteDescription color='red'>
					{formatMessage({
						id: 'label.note:this_is_necessary_to_donate_to_projects_or_receive_funding',
					})}
				</NoteDescription>
				<OkButton
					label={formatMessage({ id: 'component.button.sign_in' })}
					loading={loading}
					onClick={async () => {
						if (!account) {
							return dispatch(setShowWelcomeModal(true));
						}
						setLoading(true);
						const signature = await dispatch(
							signToGetToken({
								address: account,
								chainId,
								signer: library?.getSigner(),
								pathname: router.pathname,
							}),
						);
						setLoading(false);
						if (
							signature &&
							signature.type === 'user/signToGetToken/fulfilled'
						) {
							const event = new Event(EModalEvents.SIGNEDIN);
							window.dispatchEvent(event);
							callback && callback();
							closeModal();
						}
					}}
					buttonType={theme === ETheme.Dark ? 'secondary' : 'primary'}
				/>
				<SkipButton
					label={formatMessage({ id: 'label.skip_for_now' })}
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

import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { disconnect } from '@wagmi/core';

import {
	brandColors,
	Button,
	IconWalletApprove32,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import { useRouter } from 'next/router';

import { useAccount, useConnect, useNetwork } from 'wagmi';
import { Modal } from '@/components/modals/Modal';
import { ETheme } from '@/features/general/general.slice';
import { mediaQueries } from '@/lib/constants/constants';
import { IModal } from '@/types/common';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { signToGetToken } from '@/features/user/user.thunks';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { EModalEvents } from '@/hooks/useModalCallback';
import { Dropdown } from './Dropdown';
import { Flex } from '../styled-components/Flex';

interface IProps extends IModal {
	callback?: () => void;
	isGSafeConnector?: boolean;
}

const expirations = [1, 2];

export const SignWithWalletModal: FC<IProps> = ({
	setShowModal,
	isGSafeConnector,
	callback,
}) => {
	const [loading, setLoading] = useState(false);
	const [expiration, setExpiration] = useState(expirations[0]);
	const [safeSecondaryConnection, setSafeSecondaryConnection] =
		useState(false);
	const [secondaryConnector, setSecondaryConnnector] = useState<any>(null);
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();

	const { address, connector } = useAccount();
	const { connectors } = useConnect();
	const { chain } = useNetwork();
	const { open } = useWeb3Modal();

	const chainId = chain?.id;
	const router = useRouter();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (safeSecondaryConnection) {
			setSecondaryConnnector(connector);
			startSignature(connector, true);
		}
	}, [address]);

	useEffect(() => {
		const checkSecondaryConnection = async () => {
			if (safeSecondaryConnection) {
				disconnect();
				open({ view: 'Connect' });
			}
		};
		checkSecondaryConnection();
	}, [safeSecondaryConnection]);

	const startSignature = async (connector?: any, fromGnosis?: boolean) => {
		if (!address) {
			return dispatch(setShowWelcomeModal(true));
		}
		setLoading(true);
		const signature = await dispatch(
			signToGetToken({
				address,
				chainId,
				connector,
				connectors,
				pathname: router.pathname,
				isGSafeConnector: fromGnosis || isGSafeConnector,
			}),
		);
		setLoading(false);
		if (signature && signature.type === 'user/signToGetToken/fulfilled') {
			const event = new Event(EModalEvents.SIGNEDIN);
			window.dispatchEvent(event);
			callback && callback();
			closeModal();
		}
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<IconWalletApprove32 />}
			headerTitle={formatMessage({
				id: isGSafeConnector ? 'Sign Gnosis Safe' : 'label.sign_wallet',
			})}
			headerTitlePosition='left'
		>
			<Container>
				<Description>
					{formatMessage({
						id: isGSafeConnector
							? 'All wallet owners should sign the login message to continue.'
							: 'label.you_need_to_authorize_your_wallet',
					})}
				</Description>
				<NoteDescription color='red'>
					{formatMessage({
						id: isGSafeConnector
							? 'This is necessary to be able to donate to projects or receive funding.'
							: 'label.note:this_is_necessary_to_donate_to_projects_or_receive_funding',
					})}
				</NoteDescription>
				{isGSafeConnector && (
					<ExpirationContainer>
						How long do you want this section to be active?
						<Dropdown
							label='Expiration date'
							items={expirations}
							selection={expiration}
							select={(item: number) =>
								setExpiration(expirations[item])
							}
						/>
					</ExpirationContainer>
				)}
				<OkButton
					label={formatMessage({ id: 'component.button.sign_in' })}
					loading={loading}
					onClick={async () => {
						if (isGSafeConnector) {
							return setSafeSecondaryConnection(true);
						}
						await startSignature();
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

const ExpirationContainer = styled(Flex)`
	position: relative;
	background: ${brandColors.giv[50]};
	border: 1px solid ${brandColors.giv[300]};
	border-radius: 8px;
	padding: 8px 16px;
	margin: 10px 0 0 0;
	text-align: left;
	justify-content: space-between;
	align-items: center;
`;

import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { connect } from '@wagmi/core';

import {
	brandColors,
	Button,
	IconWalletApprove32,
	Lead,
	neutralColors,
	IconExternalLink16,
} from '@giveth/ui-design-system';
import { useRouter } from 'next/router';

import { useConnect, useAccount } from 'wagmi';
import { Address } from 'viem';
import { Modal } from '@/components/modals/Modal';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';
import { ETheme } from '@/features/general/general.slice';
import { mediaQueries } from '@/lib/constants/constants';
import { IModal } from '@/types/common';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { checkMultisigSession } from '@/lib/helpers';
import { signToGetToken } from '@/features/user/user.thunks';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { EModalEvents } from '@/hooks/useModalCallback';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { Dropdown } from './ExpirationDropdown';
import { Flex } from '../styled-components/Flex';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { createSwisMessage } from '@/lib/authentication';
import { ISolanaSignToGetToken } from '@/features/user/user.types';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { ChainType } from '@/types/config';
import { wagmiConfig } from '@/wagmiConfigs';

interface IProps extends IModal {
	callback?: () => void;
	isGSafeConnector?: boolean;
}

const expirations = [3, 8, 30]; // days

export const SignWithWalletModal: FC<IProps> = ({
	setShowModal,
	isGSafeConnector,
	callback,
}) => {
	const [loading, setLoading] = useState(false);
	const [expiration, setExpiration] = useState(0);
	const [multisigAddress, setMultisigAddress] = useState('');
	const [currentMultisigSession, setCurrentMultisigSession] = useState(false);
	const [safeSecondaryConnection, setSafeSecondaryConnection] =
		useState(false);
	const [multisigLastStep, setMultisigLastStep] = useState(false);
	const [secondaryConnector, setSecondaryConnnector] = useState<any>(null);
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();

	const { address, connector, isConnected } = useAccount();
	const { connectors } = useConnect();
	const { chain } = useAccount();
	const { open } = useWeb3Modal();
	const isSafeEnv = useIsSafeEnvironment();

	const chainId = chain?.id;
	const { walletAddress, signMessage, walletChainType } = useGeneralWallet();
	const router = useRouter();
	const { isAnimating, closeModal: _closeModal } =
		useModalAnimation(setShowModal);
	const dispatch = useAppDispatch();
	useEffect(() => {
		const multisigConnection = async () => {
			if (loading) return;
			if (safeSecondaryConnection && address && isConnected) {
				setSecondaryConnnector(connector);
				// Check session before calling a new one
				const { status } = await checkMultisigSession({
					safeAddress: multisigAddress,
					chainId,
				});
				if (status === 'successful') {
					// close modal and move directly to fetch the token
					await startSignature(connector, true);
				} else if (status === 'pending') {
					setCurrentMultisigSession(true);
					setMultisigLastStep(true);
				} else {
					setMultisigLastStep(true);
				}
			}
		};
		multisigConnection();
	}, [address, isConnected]);

	useEffect(() => {
		const checkSecondaryConnection = async () => {
			if (safeSecondaryConnection) {
				setMultisigAddress(address as Address);
				open({ view: 'Connect' });
			}
		};
		checkSecondaryConnection();
	}, [safeSecondaryConnection]);

	const reset = () => {
		setMultisigLastStep(false);
		setCurrentMultisigSession(false);
		setSafeSecondaryConnection(false);
	};

	const closeModal = async () => {
		try {
			if (
				isSafeEnv ||
				(safeSecondaryConnection && connector?.id !== 'safe')
			) {
				const safeConnector = connectors.find(i => i.id === 'safe');
				safeConnector &&
					(await connect(wagmiConfig, {
						chainId,
						connector: safeConnector,
					}));
			}
			_closeModal();
			reset();
		} catch (e) {
			_closeModal();
			reset();
		}
	};

	const startSignature = async (connector?: any, fromGnosis?: boolean) => {
		if (!address) {
			return dispatch(setShowWelcomeModal(true));
		}
		setLoading(true);
		const signature = await dispatch(
			signToGetToken({
				address,
				safeAddress: multisigAddress,
				chainId,
				connector,
				connectors,
				pathname: router.pathname,
				isGSafeConnector: fromGnosis,
				expiration: fromGnosis ? expirations[expiration] : 0,
			}),
		);
		setLoading(false);
		if (signature && signature.type === 'user/signToGetToken/fulfilled') {
			const event = new Event(EModalEvents.SIGNEDIN);
			window.dispatchEvent(event);
			if (!fromGnosis) {
				callback && callback();
			}
			closeModal();
		}
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<IconWalletApprove32 />}
			headerTitle={formatMessage({
				id:
					isGSafeConnector || isSafeEnv
						? currentMultisigSession
							? 'Uncompleted Multisig Tx'
							: 'Sign Gnosis Safe'
						: 'label.sign_wallet',
			})}
			headerTitlePosition='left'
		>
			<Container>
				{!multisigLastStep && (
					<Description>
						{formatMessage({
							id: isGSafeConnector
								? currentMultisigSession
									? "You'll need to execute the pending Multisig transaction to complete your log-in to Giveth & proceed to this area"
									: 'Sign a message with your Safe signer address to continue the log in process'
								: 'label.you_need_to_authorize_your_wallet',
						})}
					</Description>
				)}
				{!multisigLastStep && (
					<NoteDescription color='red'>
						{formatMessage({
							id: isGSafeConnector
								? 'This is necessary to be able to create projects, manage your profile or use GIVpower.'
								: 'label.note:this_is_necessary_to_donate_to_projects_or_receive_funding',
						})}
					</NoteDescription>
				)}

				{multisigLastStep && !currentMultisigSession ? (
					<Flex flexDirection='column'>
						<Description>
							You will be redirected to the Multisig transaction
							that requires signatures. You can safely close that
							page.
						</Description>
						<ExpirationContainer>
							How long do you want this session to be active?
							<Dropdown
								label='Expiration date'
								items={expirations}
								selection={expiration}
								select={(item: number) => setExpiration(item)}
							/>
						</ExpirationContainer>
						<NoteDescription>
							While waiting for the required signatures you can
							continue to browse Giveth
						</NoteDescription>
					</Flex>
				) : (
					multisigLastStep &&
					currentMultisigSession && (
						<Flex flexDirection='column'>
							<Description>
								You'll need to execute the pending Multisig tx
								to complete your log-in to Giveth & proceed to
								this area.
							</Description>
						</Flex>
					)
				)}
				{isSafeEnv && (
					<MultisigGuideLink href={links.MULTISIG_GUIDE}>
						<Purple>
							Read the Giveth MultiSig Sign-in Guide{' '}
							<IconExternalLink16 />
						</Purple>
					</MultisigGuideLink>
				)}
				<OkButton
					label={formatMessage({
						id: multisigLastStep
							? currentMultisigSession
								? 'Okay, got it'
								: "okay let's go"
							: 'component.button.sign_in',
					})}
					loading={loading}
					onClick={async () => {
						try {
							let signature;
							if (walletChainType === ChainType.SOLANA) {
								setLoading(true);
								const { message, nonce } =
									await createSwisMessage(
										walletAddress!,
										'Login into Giveth services',
									);
								const signedMessage =
									await signMessage(message);
								signature = await dispatch(
									signToGetToken({
										address: walletAddress,
										chainId,
										pathname: router.pathname,
										solanaSignedMessage: signedMessage,
										message,
										nonce,
									} as ISolanaSignToGetToken),
								);
								setLoading(false);
								if (
									signature &&
									signature.type ===
										'user/signToGetToken/fulfilled'
								) {
									const event = new Event(
										EModalEvents.SIGNEDIN,
									);
									window.dispatchEvent(event);
									callback && callback();
									closeModal();
								}
							} else if (multisigLastStep) {
								if (currentMultisigSession) return closeModal();
								return startSignature(connector, true);
							} else if (isGSafeConnector) {
								reset();
								return setSafeSecondaryConnection(true);
							} else {
								await startSignature();
							}
						} catch (error) {
						} finally {
							setLoading(false);
						}
					}}
					buttonType={
						theme === ETheme.Dark || multisigLastStep
							? 'secondary'
							: 'primary'
					}
				/>
				{!multisigLastStep && (
					<SkipButton
						label={formatMessage({ id: 'label.skip_for_now' })}
						onClick={closeModal}
						buttonType='texty'
					/>
				)}
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
	&:hover {
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

const Purple = styled.div`
	color: ${brandColors.giv[500]};
`;

const MultisigGuideLink = styled(ExternalLink)`
	color: ${brandColors.giv[500]};
	margin-top: 10px;
	margin-bottom: 10px;
`;
// const MultisigMsgContainer = styled(Flex)`
// 	position: relative;
// 	background: ${brandColors.giv[50]};
// 	border: 1px solid ${brandColors.giv[300]};
// 	border-radius: 8px;
// 	padding: 16px;
// 	margin: 10px 0 0 0;
// 	text-align: center;
// 	justify-content: space-between;
// 	align-items: center;
// `;

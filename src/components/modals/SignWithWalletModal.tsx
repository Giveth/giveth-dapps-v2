import { FC, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { connect, switchChain } from '@wagmi/core';

import {
	brandColors,
	Button,
	IconWalletApprove32,
	Lead,
	IconExternalLink16,
	Flex,
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
	const { connectors } = useConnect();
	const [loading, setLoading] = useState(false);
	const [expiration, setExpiration] = useState(0);
	const [multisigState, setMultisigState] = useState({
		address: '',
		currentSession: false,
		lastStep: false,
		secondaryConnection: false,
	});
	const [secondaryWallet, setSecondaryWallet] = useState({
		connector: connectors[connectors?.length - 1],
		address: null as Address | null,
		isValid: false,
	});
	const [hasOpenedConnectionModal, setHasOpenedConnectionModal] =
		useState(false);
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();

	const { address, connector, isConnected } = useAccount();
	const { chain } = useAccount();
	const { open } = useWeb3Modal();
	const isSafeEnv = useIsSafeEnvironment();

	const chainId = chain?.id;
	const { walletAddress, signMessage, walletChainType, isContractWallet } =
		useGeneralWallet();
	const router = useRouter();
	const { isAnimating, closeModal: _closeModal } =
		useModalAnimation(setShowModal);
	const dispatch = useAppDispatch();

	const handleMultisigConnection = useCallback(async () => {
		if (loading || !secondaryWallet.isValid) return;
		if (multisigState.secondaryConnection && address && isConnected) {
			try {
				const { status } = await checkMultisigSession({
					safeAddress: multisigState.address,
					chainId,
				});
				if (status === 'successful') {
					closeModal();
					await startSignature(secondaryWallet.connector, true);
				} else {
					setMultisigState(prev => ({
						...prev,
						currentSession: status === 'pending',
						lastStep: true,
					}));
				}
			} catch (error) {
				console.error('Error checking multisig session:', error);
			}
		}
	}, [
		loading,
		secondaryWallet.isValid,
		multisigState.secondaryConnection,
		address,
		isConnected,
	]);

	useEffect(() => {
		handleMultisigConnection();
	}, [handleMultisigConnection]);

	useEffect(() => {
		if (connector?.type === 'safe') return;
		setSecondaryWallet(prev => ({
			connector: connector || prev.connector,
			address: address || prev.address,
			isValid: !!(connector && address),
		}));
	}, [connector, address]);

	const checkSecondaryConnection = useCallback(() => {
		if (multisigState.secondaryConnection && !hasOpenedConnectionModal) {
			setMultisigState(prev => ({
				...prev,
				address: address as Address,
			}));
			open({ view: 'Connect' });
			setHasOpenedConnectionModal(true);
		}
	}, [
		multisigState.secondaryConnection,
		address,
		open,
		hasOpenedConnectionModal,
	]);

	useEffect(() => {
		checkSecondaryConnection();
	}, [checkSecondaryConnection, hasOpenedConnectionModal]);

	const reset = () => {
		setMultisigState({
			address: '',
			currentSession: false,
			lastStep: false,
			secondaryConnection: false,
		});
		setSecondaryWallet(prev => ({ ...prev, address: null }));
		setHasOpenedConnectionModal(false);
	};

	const closeModal = async () => {
		try {
			if (
				isSafeEnv ||
				(multisigState.secondaryConnection && connector?.id !== 'safe')
			) {
				const safeConnector = connectors.find(i => i.id === 'safe');
				if (safeConnector) {
					await connect(wagmiConfig, {
						chainId,
						connector: safeConnector,
					});
				}
			}
		} catch (error) {
			console.error('Error closing modal:', error);
		} finally {
			_closeModal();
			reset();
		}
	};

	const startSignature = async (connector?: any, fromGnosis?: boolean) => {
		if (!address) {
			return dispatch(setShowWelcomeModal(true));
		}
		if (fromGnosis && !secondaryWallet.isValid) {
			console.log('Waiting for valid secondary connector...');
			return;
		}
		setLoading(true);
		try {
			console.log('walletChainType', walletChainType);
			console.log('isContractWallet', isContractWallet);
			console.log('isGSafeConnector', isGSafeConnector);
			if (
				walletChainType === ChainType.EVM &&
				isContractWallet &&
				!isGSafeConnector
			) {
				console.log('Switching chain to Polygon');
				await switchChain(wagmiConfig, {
					chainId: 137,
				});
			}
			const signature = await dispatch(
				signToGetToken({
					address,
					safeAddress: multisigState.address,
					secondarySignerAddress: secondaryWallet.address,
					chainId,
					connector,
					connectors,
					pathname: router.pathname,
					isGSafeConnector: fromGnosis,
					expiration: fromGnosis ? expirations[expiration] : 0,
				}),
			);
			if (
				signature &&
				signature.type === 'user/signToGetToken/fulfilled'
			) {
				const event = new Event(EModalEvents.SIGNEDIN);
				window.dispatchEvent(event);
				if (!fromGnosis) {
					callback && callback();
				}
				closeModal();
			}
		} catch (error) {
			console.error('Error during signature:', error);
		} finally {
			setLoading(false);
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
						? multisigState.currentSession
							? 'label.uncompleted_multisig_tx'
							: 'label.sign_gnosis_safe'
						: 'label.sign_wallet',
			})}
			headerTitlePosition='left'
		>
			<Container>
				{!multisigState.lastStep && (
					<Description>
						{formatMessage({
							id: isGSafeConnector
								? multisigState.currentSession
									? 'label.you_need_to_execute_the_pending_multisig'
									: 'label.sign_a_message_with_your_safe_signer'
								: 'label.you_need_to_authorize_your_wallet',
						})}
					</Description>
				)}
				{!multisigState.lastStep && isSafeEnv && (
					<NoteDescription color='red'>
						{formatMessage({
							id: isGSafeConnector
								? 'label.this_is_necessary_to_create_projects'
								: 'label.note:this_is_necessary_to_donate_to_projects_or_receive_funding',
						})}
					</NoteDescription>
				)}

				{multisigState.lastStep && !multisigState.currentSession ? (
					<Flex $flexDirection='column'>
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
					multisigState.lastStep &&
					multisigState.currentSession && (
						<Flex $flexDirection='column'>
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
						id: multisigState.lastStep
							? multisigState.currentSession
								? 'label.got_it'
								: 'label.lets_do_it'
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
							} else if (multisigState.lastStep) {
								if (multisigState.currentSession)
									return closeModal();
								return startSignature(
									secondaryWallet.connector,
									true,
								);
							} else if (isGSafeConnector) {
								reset();
								return setMultisigState(prev => ({
									...prev,
									secondaryConnection: true,
								}));
							} else {
								await startSignature();
							}
						} catch (error) {
							console.error(
								'Error in button click handler:',
								error,
							);
						} finally {
							setLoading(false);
						}
					}}
					buttonType={
						theme === ETheme.Dark || multisigState.lastStep
							? 'secondary'
							: 'primary'
					}
				/>
				{!multisigState.lastStep && (
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

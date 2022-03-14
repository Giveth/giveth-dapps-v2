import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import UserContext from '../../context/UserProvider';
import Image from 'next/image';
import {
	brandColors,
	H3,
	H6,
	P,
	B,
	neutralColors,
	Button,
	semanticColors,
} from '@giveth/ui-design-system';
import { IModal, Modal } from '@/components/modals/Modal';
import { InsufficientFundModal } from '@/components/modals/InsufficientFund';
import { WrongNetworkModal } from '@/components/modals/WrongNetwork';
import { IProject } from '../../apollo/types/types';
import { Flex } from '../styled-components/Flex';
import Logger from '../../utils/Logger';
import { checkNetwork } from '../../utils';
import { isAddressENS, getAddressFromENS } from '../../lib/wallet';
import { sendTransaction } from '../../lib/helpers';
import * as transaction from '../../services/transaction';
import { saveDonation, saveDonationTransaction } from '../../services/donation';
import { mediaQueries } from '@/utils/constants';
import FixedToast from '@/components/FixedToast';
import config from '@/configuration';
import styled from 'styled-components';

const xdaiChain = config.SECONDARY_NETWORK;

interface IToken {
	value: string;
	label: string;
	chainId?: number;
	symbol?: string;
	icon?: string;
	address?: string;
}

interface IDonateModal extends IModal {
	closeParentModal?: () => void;
	project: IProject;
	token: IToken;
	amount: number;
	price?: number;
	userTokenBalance?: number;
	anonymous?: boolean;
	setInProgress?: any;
	setUnconfirmed?: any;
	setSuccessDonation?: any;
	givBackEligible?: boolean;
}

const DonateModal = ({
	showModal,
	setShowModal,
	closeParentModal,
	project,
	token,
	userTokenBalance,
	amount,
	price,
	anonymous,
	setInProgress,
	setSuccessDonation,
	setUnconfirmed,
	givBackEligible,
}: IDonateModal) => {
	const { account, library, chainId } = useWeb3React();
	const {
		state: { isSignedIn },
		actions: { showSignModal },
	} = UserContext();
	const [donating, setDonating] = useState(false);
	const [donationSaved, setDonationSaved] = useState(false);
	const [showInsufficientModal, setShowInsufficientModal] = useState(false);
	const [showWrongNetworkModal, setShowWrongNetworkModal] = useState(false);
	if (!showModal) return null;

	const avgPrice = price && price * amount;
	const isGivingBlockProject = project?.givingBlocksId;
	const isXdai = chainId === xdaiChain.id;
	const confirmDonation = async () => {
		try {
			// Traceable by default if it comes from Trace only
			// Depends on the toggle if it's an IO to Trace project
			// let traceable = project?.fromTrace
			//   ? true
			//   : isTraceable
			//   ? isTraceable
			//   : switchTraceable
			let traceable = false;
			// Sign message for registered users to get user info, no need to sign for anonymous
			if (!isSignedIn && !anonymous) {
				showSignModal();
				return;
			}
			if (!project?.walletAddress) {
				// return Toast({
				//   content: 'There is no eth address assigned for this project',
				//   type: 'error'
				// })
				// TODO: SET RIGHT MODAL
				alert('There is no eth address assigned for this project');
			}

			const isCorrectNetwork = checkNetwork(chainId!);
			if (isGivingBlockProject && chainId !== config.PRIMARY_NETWORK.id)
				return setShowWrongNetworkModal(true);
			if (!isCorrectNetwork) {
				return setShowWrongNetworkModal(true);
			}

			if (!amount || amount <= 0) {
				// TODO: SET RIGHT MODAL
				// return Toast({ content: 'Please set an amount', type: 'warn' })
				alert('Please set an amount');
			}

			if (userTokenBalance! < amount) {
				return setShowInsufficientModal(true);
			}

			// Toast({
			//   content: 'Donation in progress...',
			//   type: 'dark',
			//   customPosition: 'top-left',
			//   isLoading: true,
			//   noAutoClose: true
			// })
			const toAddress = isAddressENS(project.walletAddress!)
				? await getAddressFromENS(project.walletAddress!, library)
				: project.walletAddress;
			const web3Provider = library;
			await transaction.send(
				library,
				toAddress,
				token.address!,
				amount,
				sendTransaction,
				{
					onTransactionHash: async (transactionHash: string) => {
						// Save initial txn details to db
						const {
							donationId,
							savedDonation,
							saveDonationErrors,
						} = await saveDonation(
							account!,
							toAddress,
							transactionHash,
							chainId!,
							Number(amount),
							token.symbol!,
							Number(project.id),
							token.address!,
							anonymous!,
						);
						console.log('DONATION RESPONSE: ', {
							donationId,
							savedDonation,
							saveDonationErrors,
						});
						setDonationSaved(true);
						// onTransactionHash callback for event emitter
						if (saveDonationErrors?.length > 0) {
							// TODO: ADD TOAST
							alert(JSON.stringify(saveDonationErrors));
						}
						transaction.confirmEtherTransaction(
							transactionHash,
							(res: transaction.IEthTxConfirmation) => {
								try {
									if (!res) return;
									// toast.dismiss()
									if (res?.tooSlow === true) {
										// Tx is being too slow
										// toast.dismiss()
										setSuccessDonation({
											transactionHash,
											tokenSymbol: token.symbol,
											subtotal: amount,
											givBackEligible,
											tooSlow: true,
										});
										setInProgress(true);
									} else if (res?.status) {
										// Tx was successful
										// toast.dismiss()
										setSuccessDonation({
											transactionHash,
											tokenSymbol: token.symbol,
											subtotal: amount,
											givBackEligible,
										});
										setUnconfirmed(false);
									} else {
										// EVM reverted the transaction, it failed
										setSuccessDonation({
											transactionHash,
											tokenSymbol: token.symbol,
											subtotal: amount,
											givBackEligible,
										});
										setUnconfirmed(true);
										if (res?.error) {
											// Toast({
											//   content: res?.error?.message,
											//   type: 'error'
											// })
											// TODO
											alert(res?.error?.message);
										} else {
											// Toast({
											//   content: `Transaction couldn't be confirmed or it failed`,
											//   type: 'error'
											// })
											// TODO
											alert(
												"Transaction couldn't be confirmed or it failed",
											);
										}
									}
								} catch (error) {
									Logger.captureException(error);
									console.log({ error });
									// toast.dismiss()
								}
							},
							0,
							library,
						);
						await saveDonationTransaction(
							transactionHash,
							donationId,
						);
					},
					onReceiptGenerated: (receipt: any) => {
						console.log({ receipt });
						setSuccessDonation({
							transactionHash: receipt?.transactionHash,
							tokenSymbol: token.symbol,
							subtotal: amount,
						});
					},
					onError: (error: any) => {
						console.log({ error });
						// toast.dismiss()
						// the outside catch handles any error here
						// Toast({
						//   content: error?.error?.message || error?.message || error,
						//   type: 'error'
						// })
					},
				},
				traceable,
			);

			// Commented notify and instead we are using our own service
			// transaction.notify(transactionHash)
		} catch (error: any) {
			// toast.dismiss()
			console.log({ error });
			setDonating(false);
			Logger.captureException(error);
			if (
				error?.data?.code === 'INSUFFICIENT_FUNDS' ||
				error?.data?.code === 'UNPREDICTABLE_GAS_LIMIT'
			) {
				// TODO: change this to custom alert
				// return triggerPopup('InsufficientFunds')
				alert('Insufficient Funds');
			}
			// return Toast({
			//   content:
			//     error?.data?.data?.message ||
			//     error?.data?.message ||
			//     error?.error?.message ||
			//     error?.message ||
			//     error,
			//   type: 'error'
			// })

			// TODO: Add toast for errors
			alert(JSON.stringify(error));
		}
	};

	if (showInsufficientModal) {
		return (
			<InsufficientFundModal
				showModal={showInsufficientModal}
				setShowModal={setShowInsufficientModal}
			/>
		);
	}

	if (showWrongNetworkModal) {
		return (
			<WrongNetworkModal
				showModal={showWrongNetworkModal}
				setShowModal={setShowWrongNetworkModal}
				targetNetworks={[config.XDAI_NETWORK_NUMBER]}
			/>
		);
	}
	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<DonateContainer>
				<DonateTopTitle>
					<Image
						src='/images/wallet_icon.svg'
						width='32px'
						height='32px'
					/>
					<H6>Donating</H6>
				</DonateTopTitle>
				<DonatingBox>
					<P>You are donating</P>
					<H3>
						{parseFloat(String(amount)).toLocaleString('en-US', {
							maximumFractionDigits: 6,
						})}
						{token.symbol}
					</H3>
					{avgPrice && (
						<H6>
							{parseFloat(String(avgPrice)).toLocaleString(
								'en-US',
								{ maximumFractionDigits: 6 },
							)}{' '}
							USD{' '}
						</H6>
					)}
					<div style={{ margin: '12px 0 32px 0' }}>
						<P>
							To{' '}
							<B style={{ marginLeft: '6px' }}>{project.title}</B>
						</P>
					</div>
				</DonatingBox>
				<Buttons>
					{donationSaved && (
						<ToastContainer>
							<FixedToast
								message='Your donation is being processed, you can close this modal.'
								color={semanticColors.blueSky[700]}
								backgroundColor={semanticColors.blueSky[100]}
								icon={() => <img src='/images/info-icon.svg' />}
							/>
						</ToastContainer>
					)}
					<DonateButton
						donating={donating}
						label={donating ? 'DONATING' : 'DONATE'}
						onClick={() => {
							setDonating(!donating);
							confirmDonation();
						}}
					/>
					{donationSaved && (
						<CloseButton
							label='CLOSE THIS MODAL'
							buttonType='texty'
							onClick={() => {
								setShowModal(false);
							}}
						/>
					)}
				</Buttons>
			</DonateContainer>
		</Modal>
	);
};

const DonateContainer = styled.div`
	width: 494px;
	background: white;
	color: black;
	padding: 0 24px 38px 24px;
	margin: -30px 0 0 0;
	${mediaQueries['mobileS']} {
		width: 100%;
	}
	${mediaQueries['mobileM']} {
		width: 100%;
	}
	${mediaQueries['mobileL']} {
		width: 100%;
	}
`;

const DonateTopTitle = styled(Flex)`
	gap: 14px;
	h6 {
		padding: 24px 0;
		font-weight: bold;
		color: ${neutralColors.gray[900]};
	}
`;

const DonatingBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	color: ${brandColors.deep[900]};
	div:first-child {
		margin-bottom: 8px;
	}
	h3 {
		margin-top: -5px;
	}
	h6 {
		color: ${neutralColors.gray[700]};
		margin-top: -5px;
	}
	div:last-child {
		display: flex;
		flex-direction: row;
	}
`;

const DonateButton = styled(Button)`
	display: flex;
	justify-content: center;
	algin-items: center;
	border-color: transparent;
	width: 100%;
	background: ${(props: { donating: boolean }) =>
		props.donating ? brandColors.giv[200] : brandColors.giv[500]};
	:hover {
		background: ${(props: { donating: boolean }) => brandColors.giv[700]};
	}
	* {
		margin: auto 0;
		padding: 0 8px 0 0;
		font-weight: bold;
	}
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: column;
	jusitfy-content: center;
`;

const CloseButton = styled(Button)`
	margin: 5px 0 0 0;
	:hover {
		background: transparent;
	}
`;

const ToastContainer = styled.div`
	margin: 15px 0;
`;

export default DonateModal;

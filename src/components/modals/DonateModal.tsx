import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import UserContext from '../../context/UserProvider';
import styled from 'styled-components';
import {
	brandColors,
	H3,
	H6,
	P,
	B,
	neutralColors,
	Button,
	semanticColors,
	IconInfo,
} from '@giveth/ui-design-system';
import { IconWalletApprove } from '@giveth/ui-design-system/lib/cjs/components/icons/WalletApprove';

import { IModal, Modal } from '@/components/modals/Modal';
import { InsufficientFundModal } from '@/components/modals/InsufficientFund';
import { WrongNetworkModal } from '@/components/modals/WrongNetwork';
import { IProject } from '@/apollo/types/types';
import Logger from '../../utils/Logger';
import { checkNetwork } from '@/utils';
import { isAddressENS, getAddressFromENS } from '@/lib/wallet';
import { sendTransaction, showToastError } from '@/lib/helpers';
import * as transaction from '../../services/transaction';
import { saveDonation, saveDonationTransaction } from '@/services/donation';
import FixedToast from '@/components/toasts/FixedToast';
import { mediaQueries } from '@/utils/constants';
import config from '@/configuration';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { ORGANIZATION } from '@/lib/constants/organizations';

interface IDonateModal extends IModal {
	closeParentModal?: () => void;
	project: IProject;
	token: IProjectAcceptedToken;
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
		actions: { showSignWithWallet },
	} = UserContext();

	const [donating, setDonating] = useState(false);
	const [donationSaved, setDonationSaved] = useState(false);
	const [showInsufficientModal, setShowInsufficientModal] = useState(false);
	const [showWrongNetworkModal, setShowWrongNetworkModal] = useState(false);

	if (!showModal) return null;

	const { walletAddress, organization, id, title } = project || {};

	const avgPrice = price && price * amount;
	const isGivingBlockProject =
		organization?.label === ORGANIZATION.givingBlock;
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
				showSignWithWallet();
				return;
			}
			if (!walletAddress) {
				showToastError(
					'There is no eth address assigned for this project',
				);
			}

			const isCorrectNetwork = checkNetwork(chainId!);
			if (isGivingBlockProject && chainId !== config.PRIMARY_NETWORK.id)
				return setShowWrongNetworkModal(true);
			if (!isCorrectNetwork) {
				return setShowWrongNetworkModal(true);
			}

			if (!amount || amount <= 0) {
				showToastError('Please set an amount');
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
			const toAddress = isAddressENS(walletAddress!)
				? await getAddressFromENS(walletAddress!, library)
				: walletAddress;
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
							Number(id),
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
							showToastError(saveDonationErrors);
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
											showToastError(res.error);
										} else {
											showToastError(
												"Transaction couldn't be confirmed or it failed",
											);
										}
									}
								} catch (error) {
									Logger.captureException(error);
									console.log({ error });
									showToastError(error);
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
					onError: showToastError,
				},
				traceable,
			);

			// Commented notify, and instead we are using our own service
			// transaction.notify(transactionHash)
		} catch (error: any) {
			setDonating(false);
			Logger.captureException(error);
			if (
				error?.data?.code === 'INSUFFICIENT_FUNDS' ||
				error?.data?.code === 'UNPREDICTABLE_GAS_LIMIT'
			) {
				showToastError('Insufficient Funds');
			} else showToastError(error);
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
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			headerTitle='Donating'
			headerTitlePosition='left'
			headerIcon={<IconWalletApprove size={32} />}
		>
			<DonateContainer>
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
								{
									maximumFractionDigits: 6,
								},
							)}{' '}
							USD{' '}
						</H6>
					)}
					<div style={{ margin: '12px 0 32px 0' }}>
						<P>
							To <B style={{ marginLeft: '6px' }}>{title}</B>
						</P>
					</div>
				</DonatingBox>
				<Buttons>
					{donationSaved && (
						<FixedToast
							message='Your donation is being processed, you can close this modal.'
							color={semanticColors.blueSky[700]}
							backgroundColor={semanticColors.blueSky[100]}
							icon={
								<IconInfo
									size={16}
									color={semanticColors.blueSky[700]}
								/>
							}
						/>
					)}
					<DonateButton
						donating={donating}
						disabled={donating}
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
							onClick={() => setShowModal(false)}
						/>
					)}
				</Buttons>
			</DonateContainer>
		</Modal>
	);
};

const DonateContainer = styled.div`
	background: white;
	color: black;
	padding: 24px 24px 38px;
	margin: 0;
	width: 100%;
	${mediaQueries.tablet} {
		width: 494px;
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
	align-items: center;
	border-color: transparent;
	width: 100%;
	background: ${(props: { donating: boolean }) =>
		props.donating ? brandColors.giv[200] : brandColors.giv[500]};
	:hover {
		background: ${brandColors.giv[700]};
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
	justify-content: center;

	> :first-child {
		margin: 15px 0;
	}
`;

const CloseButton = styled(Button)`
	margin: 5px 0 0 0;
	:hover {
		background: transparent;
	}
`;

export default DonateModal;

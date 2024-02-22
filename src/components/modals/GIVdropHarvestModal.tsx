import { FC, useState, useEffect } from 'react';
import {
	B,
	brandColors,
	Caption,
	IconGIVStream,
	Lead,
	IconHelpFilled16,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import BigNumber from 'bignumber.js';
import { captureException } from '@sentry/nextjs';
import { useAccount } from 'wagmi';
import { WriteContractReturnType } from 'viem';
import { Modal } from './Modal';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from './ConfirmSubmit';
import {
	CancelButton,
	GIVRate,
	HarvestAllDesc,
	HarvestAllModalContainer,
	HarvestBoxes,
	HarvestButton,
	HelpRow,
	RateRow,
	TooltipContent,
} from './HarvestAll.sc';
import { formatWeiHelper } from '@/helpers/number';
import { IconWithTooltip } from '../IconWithToolTip';
import { AmountBoxWithPrice } from '../AmountBoxWithPrice';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { claimAirDrop } from '@/lib/claim';
import { waitForTransaction } from '@/lib/transaction';
import config from '@/configuration';
import { IModal } from '@/types/common';
import { useAppSelector } from '@/features/hooks';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';

enum ClaimState {
	UNKNOWN,
	WAITING,
	SUBMITTING,
	CLAIMED,
	ERROR,
}

interface IGIVdropHarvestModal extends IModal {
	network: number;
	givdropAmount: bigint;
	checkNetworkAndWallet: () => Promise<boolean>;
	onSuccess: (tx: WriteContractReturnType) => void;
}

export const GIVdropHarvestModal: FC<IGIVdropHarvestModal> = ({
	setShowModal,
	network,
	givdropAmount,
	checkNetworkAndWallet,
	onSuccess,
}) => {
	const isSafeEnv = useIsSafeEnvironment();
	const { formatMessage } = useIntl();
	const [givBackLiquidPart, setGivBackLiquidPart] = useState(0n);
	const [txResp, setTxResp] = useState<WriteContractReturnType | undefined>();
	const [givBackStream, setGivBackStream] = useState(0n);
	const [givDropStream, setGivDropStream] = useState(0n);
	const [givDropAccStream, setGivDropAccStream] = useState(0n);
	const [claimableNow, setClaimableNow] = useState(0n);
	const [claimState, setClaimState] = useState<ClaimState>(
		ClaimState.UNKNOWN,
	);

	const { givTokenDistroHelper } = useGIVTokenDistroHelper();
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.currentValues),
	);
	const givTokenDistroBalance = sdh.getGIVTokenDistroBalance();
	const givPrice = useAppSelector(state => state.price.givPrice);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { chain } = useAccount();
	const chainId = chain?.id;
	const { address } = useAccount();

	useEffect(() => {
		const bnGIVback = BigInt(givTokenDistroBalance.givback);
		setClaimableNow(
			givTokenDistroHelper.getUserClaimableNow(givTokenDistroBalance),
		);
		setGivBackLiquidPart(givTokenDistroHelper.getLiquidPart(bnGIVback));
		setGivBackStream(
			givTokenDistroHelper.getStreamPartTokenPerWeek(bnGIVback),
		);
	}, [givTokenDistroBalance, givTokenDistroHelper]);

	useEffect(() => {
		setGivDropStream(
			givTokenDistroHelper.getStreamPartTokenPerWeek(givdropAmount),
		);
		const amount = new BigNumber(givdropAmount.toString()).multipliedBy(
			0.9,
		);
		const percent = givTokenDistroHelper.percent / 100;
		let givDropAcc = BigInt(amount.multipliedBy(percent).toFixed(0));
		if (claimableNow !== 0n) {
			givDropAcc = givDropAcc + claimableNow - givBackLiquidPart;
		}
		setGivDropAccStream(givDropAcc);
	}, [givdropAmount, givTokenDistroHelper, claimableNow, givBackLiquidPart]);

	const calcUSD = (amount: string) => {
		const _givPrice = new BigNumber(givPrice);
		return _givPrice.isNaN() ? '0' : _givPrice.times(amount).toFixed(2);
	};

	const onClaim = async () => {
		const check = checkNetworkAndWallet();
		if (!check) return;
		if (!chainId) return;
		if (!address) return;

		try {
			setClaimState(ClaimState.WAITING);
			const tx = await claimAirDrop(address, chainId);
			// This is for test;
			// const tx: TransactionResponse = {
			// 	hash: '0x8162815a31ba2ffc6a815ec76f79231fd7bc4a8c49f9e5ec7d923a6c069ef938',
			// 	nonce: 0,
			// 	gasLimit: ethers.BigNumber.from(0),
			// 	gasPrice: undefined,
			// 	data: '0',
			// 	value: ethers.BigNumber.from(0),
			// 	chainId: 0,
			// 	confirmations: 0,
			// 	from: '0',
			// 	wait: confirmations => {
			// 		return new Promise(resolve => {
			// 			setTimeout(() => {
			// 				const _tx: TransactionReceipt = {
			// 					to: '',
			// 					from: '',
			// 					contractAddress: '',
			// 					transactionIndex: 0,
			// 					root: '',
			// 					gasUsed: ethers.BigNumber.from(0),
			// 					logsBloom: '',
			// 					blockHash: '',
			// 					transactionHash:
			// 						'0x9162815a31ba2ffc6a815ec76f79231fd7bc4a8c49f9e5ec7d923a6c069ef938',
			// 					logs: [
			// 						{
			// 							blockNumber: 0,
			// 							blockHash: '',
			// 							transactionIndex: 0,
			// 							removed: false,
			// 							address: '',
			// 							data: '',
			// 							topics: [''],
			// 							transactionHash: '',
			// 							logIndex: 0,
			// 						},
			// 					],
			// 					blockNumber: 0,
			// 					confirmations: 0,
			// 					cumulativeGasUsed: ethers.BigNumber.from(0),
			// 					effectiveGasPrice: ethers.BigNumber.from(0),
			// 					byzantium: false,
			// 					type: 0,
			// 					status: 1,
			// 				};
			// 				resolve(_tx);
			// 			}, 2000);
			// 		});
			// 	},
			// };
			if (tx) {
				setTxResp(tx);
				setClaimState(ClaimState.SUBMITTING);
				const { status } = await waitForTransaction(tx, isSafeEnv);

				if (status) {
					setClaimState(ClaimState.CLAIMED);
					onSuccess(tx);
				} else {
					setClaimState(ClaimState.ERROR);
				}
			}
		} catch (e) {
			setClaimState(ClaimState.ERROR);
			console.error(e);
			captureException(e, {
				tags: {
					section: 'onClaimGivDropHarvestModal',
				},
			});
		}
	};

	return (
		<Modal
			closeModal={closeModal}
			headerTitle={'GIVdrop'}
			isAnimating={isAnimating}
		>
			<HarvestAllModalContainer>
				{(claimState === ClaimState.UNKNOWN ||
					claimState === ClaimState.WAITING) && (
					<HarvestBoxes>
						{givdropAmount > 0n && (
							<>
								{/* <HelpRow alignItems='center'>
									<B>Claimable from GIVdrop</B>
								</HelpRow> */}
								<AmountBoxWithPrice
									amount={givdropAmount / 10n}
									price={calcUSD(
										formatWeiHelper(
											givdropAmount / 10n,
											config.TOKEN_PRECISION,
											false,
										),
									)}
								/>
								<HelpRow alignItems='center'>
									<Caption>
										Your initial GIVstream flowrate
									</Caption>
								</HelpRow>
								<RateRow alignItems='center'>
									<IconGIVStream size={24} />
									<GIVRate>
										{formatWeiHelper(givDropStream)}
									</GIVRate>
									<Lead>
										GIV
										{formatMessage({ id: 'label./week' })}
									</Lead>
								</RateRow>
							</>
						)}
						{BigInt(givTokenDistroBalance.givback) > 0 && (
							<>
								<HelpRow alignItems='center'>
									<B>Claimable from GIVbacks</B>
								</HelpRow>
								<AmountBoxWithPrice
									amount={givBackLiquidPart}
									price={calcUSD(
										formatWeiHelper(
											givBackLiquidPart,
											config.TOKEN_PRECISION,
											false,
										),
									)}
								/>
								<HelpRow alignItems='center'>
									<Caption>
										Added to your GIVstream flowrate
									</Caption>
									<IconWithTooltip
										icon={
											<IconHelpFilled16
												color={brandColors.deep[100]}
											/>
										}
										direction={'top'}
									>
										<TooltipContent>
											Increase your GIVstream flowrate
											when you claim liquid rewards!
										</TooltipContent>
									</IconWithTooltip>
								</HelpRow>
								<RateRow alignItems='center'>
									<IconGIVStream size={24} />
									<GIVRate>
										{formatWeiHelper(givBackStream)}
									</GIVRate>
									<Lead>
										GIV
										{formatMessage({ id: 'label./week' })}
									</Lead>
								</RateRow>
							</>
						)}
						{givdropAmount > 0n && (
							<>
								<HelpRow alignItems='center'>
									<B>Claimable from GIVstream</B>
								</HelpRow>
								<AmountBoxWithPrice
									amount={givDropAccStream}
									price={calcUSD(
										formatWeiHelper(
											givDropAccStream,
											config.TOKEN_PRECISION,
											false,
										),
									)}
								/>
							</>
						)}
						<HarvestAllDesc>
							When you Claim GIV rewards, all liquid GIV allocated
							to you is sent to your wallet.
						</HarvestAllDesc>
						<HarvestButton
							label={
								claimState === ClaimState.WAITING
									? 'CLAIM PENDING'
									: 'CLAIM'
							}
							loading={claimState === ClaimState.WAITING}
							size='medium'
							buttonType='primary'
							onClick={() => {
								onClaim();
							}}
						/>
						<CancelButton
							label='CANCEL'
							size='medium'
							buttonType='texty'
							onClick={closeModal}
							disabled={claimState === ClaimState.WAITING}
						/>
					</HarvestBoxes>
				)}
				{claimState === ClaimState.SUBMITTING && (
					<SubmittedInnerModal title='GIV' txHash={txResp} />
				)}
				{claimState === ClaimState.CLAIMED && (
					<ConfirmedInnerModal title='GIV' txHash={txResp} />
				)}
				{claimState === ClaimState.ERROR && (
					<>
						<ErrorInnerModal
							title='GIV'
							txHash={txResp}
							message='Something went wrong.'
						/>
						<CancelButton
							label='CLOSE'
							size='medium'
							buttonType='texty'
							onClick={() => {
								closeModal();
								setClaimState(ClaimState.UNKNOWN);
							}}
						/>
					</>
				)}
			</HarvestAllModalContainer>
		</Modal>
	);
};

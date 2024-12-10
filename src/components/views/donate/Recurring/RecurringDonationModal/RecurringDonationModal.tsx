import { FC, useEffect, useState } from 'react';
import {
	Button,
	IconDonation32,
	mediaQueries,
	Flex,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Framework, type Operation } from '@superfluid-finance/sdk-core';
import { useAccount } from 'wagmi';
import { useIntl } from 'react-intl';
import { formatUnits } from 'viem';
import { ethers } from 'ethers';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { useDonateData } from '@/context/donate.context';
import { Item } from './Item';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { showToastError } from '@/lib/helpers';
import { DonateSteps } from './DonateSteps';
import { approveERC20tokenTransfer } from '@/lib/stakingPool';
import config, { isProduction } from '@/configuration';
import {
	findSuperTokenByTokenAddress,
	findUserActiveStreamOnSelectedToken,
	checkIfRecurringFlowExist,
} from '@/helpers/donate';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { RunOutInfo } from '../RunOutInfo';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { wagmiConfig } from '@/wagmiConfigs';
import { ChainType } from '@/types/config';
import {
	ICreateDraftRecurringDonation,
	createDraftRecurringDonation,
	createRecurringDonation,
	updateRecurringDonation,
	updateRecurringDonationStatus,
} from '@/services/donation';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { ERecurringDonationStatus } from '@/apollo/types/types';
import { findAnchorContractAddress } from '@/helpers/superfluid';
import { ensureCorrectNetwork } from '@/helpers/network';
interface IRecurringDonationModalProps extends IModal {
	donationToGiveth: number;
	amount: bigint;
	perMonthAmount: bigint;
	isUpdating?: boolean;
	anonymous: boolean;
}

export enum EDonationSteps {
	APPROVE,
	APPROVING,
	DONATE,
	DONATING,
	SUBMITTED,
}

const headerTitleGenerator = (step: EDonationSteps) => {
	switch (step) {
		case EDonationSteps.APPROVE:
		case EDonationSteps.APPROVING:
		case EDonationSteps.DONATE:
			return 'label.confirm_your_donation';
		case EDonationSteps.DONATING:
			return 'label.donating';
		case EDonationSteps.SUBMITTED:
			return 'label.donation_submitted';
	}
};

const buttonLabel = {
	[EDonationSteps.APPROVE]: 'label.approve',
	[EDonationSteps.APPROVING]: 'label.approving',
	[EDonationSteps.DONATE]: 'label.donate',
	[EDonationSteps.DONATING]: 'label.donating',
	[EDonationSteps.SUBMITTED]: 'label.done',
};

export const RecurringDonationModal: FC<IRecurringDonationModalProps> = ({
	setShowModal,
	...props
}) => {
	const [step, setStep] = useState(EDonationSteps.APPROVE);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const { formatMessage } = useIntl();

	const disableClose =
		step === EDonationSteps.DONATING || step === EDonationSteps.APPROVING;

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({ id: headerTitleGenerator(step) })}
			headerTitlePosition='left'
			headerIcon={<IconDonation32 />}
			hiddenClose={disableClose}
			doNotCloseOnClickOutside={disableClose}
		>
			<RecurringDonationInnerModal
				setShowModal={setShowModal}
				step={step}
				setStep={setStep}
				{...props}
			/>
		</Modal>
	);
};

interface IRecurringDonationInnerModalProps
	extends IRecurringDonationModalProps {
	step: EDonationSteps;
	setStep: (step: EDonationSteps) => void;
}

const RecurringDonationInnerModal: FC<IRecurringDonationInnerModalProps> = ({
	step,
	setStep,
	amount,
	perMonthAmount,
	donationToGiveth,
	setShowModal,
	isUpdating,
	anonymous,
}) => {
	const {
		project,
		selectedRecurringToken,
		tokenStreams,
		setSuccessDonation,
	} = useDonateData();
	const { address, chain } = useAccount();
	const recurringNetworkID = chain?.id ?? 0;
	const tokenPrice = useTokenPrice(selectedRecurringToken?.token);
	const isSafeEnv = useIsSafeEnvironment();
	const { formatMessage } = useIntl();

	useEffect(() => {
		if (!selectedRecurringToken) return;
		if (
			selectedRecurringToken.token.isSuperToken ||
			selectedRecurringToken.token.symbol === 'ETH'
		) {
			setStep(EDonationSteps.DONATE);
		}
	}, [selectedRecurringToken, setStep]);

	const onApprove = async () => {
		try {
			await ensureCorrectNetwork(recurringNetworkID);
			console.log(
				'amount',
				formatUnits(
					amount,
					selectedRecurringToken?.token.decimals || 18,
				),
			);
			setStep(EDonationSteps.APPROVING);
			if (!address || !selectedRecurringToken) return;
			const superToken = findSuperTokenByTokenAddress(
				selectedRecurringToken.token.id,
				recurringNetworkID,
			);
			if (!superToken) throw new Error('SuperToken not found');
			const approve = await approveERC20tokenTransfer(
				amount,
				address,
				superToken.id, //superTokenAddress
				selectedRecurringToken?.token.id, //tokenAddress
				recurringNetworkID,
				isSafeEnv,
			);
			if (approve) {
				setStep(EDonationSteps.DONATE);
			} else {
				setStep(EDonationSteps.APPROVE);
			}
		} catch (error) {
			setStep(EDonationSteps.APPROVE);
		}
	};

	const onDonate = async () => {
		try {
			await ensureCorrectNetwork(recurringNetworkID);
			setStep(EDonationSteps.DONATING);
			const projectAnchorContract = findAnchorContractAddress(
				project?.anchorContracts,
			);
			if (!projectAnchorContract) {
				throw new Error('Project anchor address not found');
			}
			if (!address || !selectedRecurringToken) {
				throw new Error('address not found');
			}
			const provider = await getEthersProvider(wagmiConfig);
			const signer = await getEthersSigner(wagmiConfig);

			if (!provider || !signer)
				throw new Error('Provider or signer not found');
			let _superToken = selectedRecurringToken.token;
			if (!_superToken.isSuperToken) {
				const sp = findSuperTokenByTokenAddress(
					_superToken.id,
					recurringNetworkID,
				);
				if (!sp) {
					throw new Error('Super token not found');
				} else {
					_superToken = sp;
				}
			}

			const _options = {
				chainId: recurringNetworkID,
				provider: provider,
				resolverAddress: isProduction
					? undefined
					: '0x554c06487bEc8c890A0345eb05a5292C1b1017Bd',
			};
			const sf = await Framework.create(_options);

			// EThx is not a Wrapper Super Token and should load separately
			let superToken;
			if (_superToken.symbol === 'ETHx') {
				superToken = await sf.loadNativeAssetSuperToken(_superToken.id);
			} else {
				superToken = await sf.loadWrapperSuperToken(_superToken.id);
			}

			const operations: Operation[] = [];

			let newAmount = amount;
			let newPerMonthAmount = perMonthAmount;

			// This is a special case with tokens that have 6 decimals
			// We need to convert the amount to 18 decimals for the upgrade operation
			// And also for the flow rate calculation
			if (selectedRecurringToken.token.decimals === 6) {
				const divisor = BigInt(
					10 ** selectedRecurringToken.token.decimals,
				);
				const currentAmount = Number(amount) / Number(divisor);
				newAmount = ethers.utils
					.parseUnits(currentAmount.toString(), 18)
					.toBigInt();

				const currentPerMonth =
					Number(perMonthAmount) / Number(divisor);
				newPerMonthAmount = ethers.utils
					.parseUnits(currentPerMonth.toString(), 18)
					.toBigInt();
			}

			// isUpdating is local variable to check if we are updating/modifying the flow
			let willUpdateFlow = isUpdating;

			// if isUpdating is false we need to check if there is an existing flow in the network
			if (willUpdateFlow === false) {
				const existingFlow = await checkIfRecurringFlowExist(
					sf,
					_superToken.id,
					address,
					projectAnchorContract,
					signer,
				);
				if (existingFlow.exists && existingFlow.flowRate !== '0') {
					willUpdateFlow = true;
				}
			}

			// Upgrade the token to super token
			if (!willUpdateFlow && !selectedRecurringToken.token.isSuperToken) {
				const upgradeOperation = await superToken.upgrade({
					amount: newAmount.toString(),
				});

				// Upgrading ETHx is a special case and can't be batched
				if (_superToken.symbol === 'ETHx') {
					await upgradeOperation.exec(signer);
				} else {
					operations.push(upgradeOperation);
				}
			}

			if (!projectAnchorContract) {
				throw new Error('Project wallet address not found');
			}

			let _flowRate =
				(newPerMonthAmount * BigInt(100 - donationToGiveth)) /
				100n /
				ONE_MONTH_SECONDS;

			const options = {
				sender: address,
				receiver: projectAnchorContract,
				flowRate: _flowRate.toString(),
			};

			let projectFlowOp = willUpdateFlow
				? superToken.updateFlow(options)
				: superToken.createFlow(options);

			operations.push(projectFlowOp);
			const isDonatingToGiveth = !willUpdateFlow && donationToGiveth > 0;
			console.log(
				'isDonatingToGiveth',
				isDonatingToGiveth,
				willUpdateFlow,
				donationToGiveth > 0,
			);
			let givethOldStream;
			let givethFlowRate = 0n;
			if (isDonatingToGiveth) {
				const givethAnchorContract =
					config.OPTIMISM_CONFIG.GIVETH_ANCHOR_CONTRACT_ADDRESS;

				if (!givethAnchorContract) {
					throw new Error('Giveth wallet address not found');
				}

				const _newFlowRate =
					(newPerMonthAmount * BigInt(donationToGiveth)) /
					100n /
					ONE_MONTH_SECONDS;

				givethOldStream = findUserActiveStreamOnSelectedToken(
					address,
					givethAnchorContract,
					tokenStreams,
					_superToken,
				);

				if (givethOldStream) {
					givethFlowRate =
						_newFlowRate + BigInt(givethOldStream.currentFlowRate);

					const givethFlowOp = superToken.updateFlow({
						sender: address,
						receiver: givethAnchorContract,
						flowRate: givethFlowRate.toString(),
					});
					operations.push(givethFlowOp);
				} else {
					givethFlowRate = _newFlowRate;
					const givethFlowOp = superToken.createFlow({
						sender: address,
						receiver: givethAnchorContract,
						flowRate: _newFlowRate.toString(),
					});
					operations.push(givethFlowOp);
				}
			}

			let tx;
			const isBatch = operations.length > 1;

			const projectDraftDonationInfo: ICreateDraftRecurringDonation = {
				projectId: +project.id,
				anonymous,
				chainId: recurringNetworkID,
				flowRate: _flowRate,
				superToken: _superToken,
				isBatch,
				isForUpdate: willUpdateFlow,
			};

			// Save Draft Donation
			const projectDraftDonationId = await createDraftRecurringDonation(
				projectDraftDonationInfo,
			);

			const givethDraftDonationInfo: ICreateDraftRecurringDonation = {
				projectId: config.GIVETH_PROJECT_ID,
				anonymous,
				chainId: recurringNetworkID,
				flowRate: givethFlowRate,
				superToken: _superToken,
				isBatch,
				isForUpdate: willUpdateFlow,
			};
			let givethDraftDonationId = 0;
			if (isDonatingToGiveth) {
				givethDraftDonationId = await createDraftRecurringDonation(
					givethDraftDonationInfo,
				);
			}

			await ensureCorrectNetwork(recurringNetworkID);

			if (isBatch) {
				const batchOp = sf.batchCall(operations);
				tx = await batchOp.exec(signer);
			} else {
				tx = await operations[0].exec(signer);
			}

			// saving project donation to backend
			let projectDonationId = 0;
			try {
				const projectDonationInfo = {
					...projectDraftDonationInfo,
					txHash: tx.hash,
					draftDonationId: projectDraftDonationId,
				};
				if (willUpdateFlow) {
					console.log('Start Update Project Donation Info');
					projectDonationId =
						await updateRecurringDonation(projectDonationInfo);
					console.log(
						'Project Donation Update Info',
						projectDonationId,
					);
				} else {
					console.log('Start Creating Project Donation Info');
					projectDonationId =
						await createRecurringDonation(projectDonationInfo);
					console.log(
						'Project Donation Create Info',
						projectDonationId,
					);
				}
			} catch (error) {
				showToastError(error);
			}

			// saving giveth donation to backend
			let givethDonationId = 0;
			if (isDonatingToGiveth) {
				const givethDonationInfo = {
					...givethDraftDonationInfo,
					txHash: tx.hash,
					draftDonationId: givethDraftDonationId,
				};
				try {
					if (givethOldStream) {
						console.log('Start Update Giveth Donation Info');
						givethDonationId =
							await updateRecurringDonation(givethDonationInfo);
						console.log(
							'Giveth Donation Update Info',
							givethDonationId,
						);
					} else {
						console.log('Start Creating Giveth Donation Info');
						givethDonationId =
							await createRecurringDonation(givethDonationInfo);
						console.log(
							'Giveth Donation Create Info',
							givethDonationId,
						);
					}
				} catch (error) {
					showToastError(error);
				}
			}

			const res = await tx.wait();
			if (res.status) {
				try {
					if (projectDonationId) {
						updateRecurringDonationStatus(
							projectDonationId,
							ERecurringDonationStatus.VERIFIED,
						);
					}
					if (isDonatingToGiveth && givethDonationId) {
						updateRecurringDonationStatus(
							givethDonationId,
							ERecurringDonationStatus.VERIFIED,
						);
					}
				} catch (error) {
					showToastError(error);
				}
			} else {
				try {
					if (projectDonationId) {
						updateRecurringDonationStatus(
							projectDonationId,
							ERecurringDonationStatus.FAILED,
						);
					}
					if (isDonatingToGiveth && givethDonationId) {
						updateRecurringDonationStatus(
							givethDonationId,
							ERecurringDonationStatus.FAILED,
						);
					}
				} catch (error) {
					showToastError(error);
				}
				throw new Error('Transaction failed');
			}
			setStep(EDonationSteps.SUBMITTED);
			if (tx.hash) {
				if (isDonatingToGiveth) {
					setSuccessDonation({
						txHash: [
							{ txHash: tx.hash, chainType: ChainType.EVM },
							{ txHash: tx.hash, chainType: ChainType.EVM },
						],
						isRecurring: true,
						givBackEligible: true,
						chainId: recurringNetworkID,
					});
				} else {
					setSuccessDonation({
						txHash: [{ txHash: tx.hash, chainType: ChainType.EVM }],
						isRecurring: true,
						givBackEligible: true,
						chainId: recurringNetworkID,
					});
				}
			}
		} catch (error: any) {
			setStep(EDonationSteps.DONATE);
			if (error?.code !== 'ACTION_REJECTED') {
				showToastError(error);
			}
			console.error('Error on recurring donation', { error });
		}
	};

	const handleAction = () => {
		switch (step) {
			case EDonationSteps.APPROVE:
				onApprove();
				break;
			case EDonationSteps.DONATE:
				onDonate();
				break;
			case EDonationSteps.SUBMITTED:
				setShowModal(false);
				break;
		}
	};

	const projectPerMonth =
		(perMonthAmount * BigInt(100 - donationToGiveth)) / 100n;
	const givethPerMonth = perMonthAmount - projectPerMonth;

	return (
		<Wrapper>
			<DonateSteps donateState={step} />
			<Items $flexDirection='column' gap='16px'>
				{!selectedRecurringToken?.token.isSuperToken && (
					<Item
						title='Deposit into your stream balance'
						amount={amount}
						price={tokenPrice}
						token={selectedRecurringToken?.token!}
					/>
				)}
				<Item
					title={`Donate to ${project.title}`}
					subtext={'per month'}
					amount={projectPerMonth}
					price={tokenPrice}
					token={selectedRecurringToken?.token!}
				/>
				{donationToGiveth > 0 && (
					<Item
						title='Donate to the Giveth DAO'
						subtext={'per month'}
						amount={givethPerMonth}
						price={tokenPrice}
						token={selectedRecurringToken?.token!}
					/>
				)}
			</Items>
			<RunOutInfo
				superTokenBalance={amount}
				streamFlowRatePerMonth={perMonthAmount}
				symbol={selectedRecurringToken?.token.symbol || ''}
			/>
			<ActionButton
				label={formatMessage({ id: buttonLabel[step] })}
				onClick={handleAction}
				loading={
					step === EDonationSteps.APPROVING ||
					step === EDonationSteps.DONATING
				}
				disabled={
					step === EDonationSteps.APPROVING ||
					step === EDonationSteps.DONATING
				}
			/>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	gap: 16px;
	width: 100%;
	padding: 16px 24px 24px 24px;
	${mediaQueries.tablet} {
		width: 430px;
	}
`;

const Items = styled(Flex)`
	max-width: 100%;
`;

const ActionButton = styled(Button)`
	width: 100%;
`;

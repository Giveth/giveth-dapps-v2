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
import BigNumber from 'bignumber.js';
import { formatUnits } from 'viem';
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
} from '@/helpers/donate';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { RunOutInfo } from '../RunOutInfo';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { wagmiConfig } from '@/wagmiConfigs';
import { ChainType } from '@/types/config';
import {
	createRecurringDonation,
	updateRecurringDonation,
	updateRecurringDonationStatus,
} from '@/services/donation';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { ERecurringDonationStatus } from '@/apollo/types/types';
interface IRecurringDonationModalProps extends IModal {
	donationToGiveth: number;
	amount: bigint;
	percentage: number;
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
	percentage,
	donationToGiveth,
	setShowModal,
	isUpdating,
	anonymous,
}) => {
	const { project, selectedToken, tokenStreams, setSuccessDonation } =
		useDonateData();
	const { address } = useAccount();
	const tokenPrice = useTokenPrice(selectedToken?.token);
	const isSafeEnv = useIsSafeEnvironment();
	const { formatMessage } = useIntl();

	useEffect(() => {
		if (!selectedToken) return;
		if (
			selectedToken.token.isSuperToken ||
			selectedToken.token.symbol === 'ETH'
		) {
			setStep(EDonationSteps.DONATE);
		}
	}, [selectedToken, setStep]);

	const onApprove = async () => {
		console.log(
			'amount',
			formatUnits(amount, selectedToken?.token.decimals || 18),
		);
		setStep(EDonationSteps.APPROVING);
		if (!address || !selectedToken) return;
		const superToken = findSuperTokenByTokenAddress(selectedToken.token.id);
		if (!superToken) return;
		try {
			const approve = await approveERC20tokenTransfer(
				amount,
				address,
				superToken.id, //superTokenAddress
				selectedToken?.token.id, //tokenAddress
				config.OPTIMISM_CONFIG.id,
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
		setStep(EDonationSteps.DONATING);
		try {
			const projectAnchorContract = project?.anchorContracts[0]?.address;
			if (!projectAnchorContract) {
				throw new Error('Project anchor address not found');
			}
			if (!address || !selectedToken) {
				throw new Error('address not found');
			}
			const provider = await getEthersProvider(wagmiConfig);
			const signer = await getEthersSigner(wagmiConfig);

			if (!provider || !signer)
				throw new Error('Provider or signer not found');
			let _superToken = selectedToken.token;
			if (!_superToken.isSuperToken) {
				const sp = findSuperTokenByTokenAddress(_superToken.id);
				if (!sp) {
					throw new Error('Super token not found');
				} else {
					_superToken = sp;
				}
			}

			const _options = {
				chainId: config.OPTIMISM_CONFIG.id,
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

			// Upgrade the token to super token
			if (!isUpdating && !selectedToken.token.isSuperToken) {
				const upgradeOperation = await superToken.upgrade({
					amount: amount.toString(),
				});

				//Upgrading ETHx is a special case and can't be batched
				if (_superToken.symbol === 'ETHx') {
					await upgradeOperation.exec(signer);
				} else {
					operations.push(upgradeOperation);
				}
			}

			if (!projectAnchorContract) {
				throw new Error('Project wallet address not found');
			}

			const _flowRate =
				(totalPerMonth * BigInt(100 - donationToGiveth)) /
				100n /
				ONE_MONTH_SECONDS;

			const options = {
				sender: address,
				receiver: projectAnchorContract,
				flowRate: _flowRate.toString(),
			};

			let projectFlowOp = isUpdating
				? superToken.updateFlow(options)
				: superToken.createFlow(options);

			operations.push(projectFlowOp);
			const isDonatingToGiveth = !isUpdating && donationToGiveth > 0;
			console.log(
				'isDonatingToGiveth',
				isDonatingToGiveth,
				isUpdating,
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
					(totalPerMonth * BigInt(donationToGiveth)) /
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

			// Save Draft Donation

			let tx;
			const isBatch = operations.length > 1;
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
					projectId: +project.id,
					anonymous,
					chainId: config.OPTIMISM_NETWORK_NUMBER,
					txHash: tx.hash,
					flowRate: _flowRate,
					superToken: _superToken,
					isBatch,
				};
				if (isUpdating) {
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
					projectId: config.GIVETH_PROJECT_ID,
					anonymous,
					chainId: config.OPTIMISM_NETWORK_NUMBER,
					txHash: tx.hash,
					flowRate: givethFlowRate,
					superToken: _superToken,
					isBatch,
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
							ERecurringDonationStatus.ACTIVE,
						);
					}
					if (isDonatingToGiveth && givethDonationId) {
						updateRecurringDonationStatus(
							givethDonationId,
							ERecurringDonationStatus.ACTIVE,
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
					});
				} else {
					setSuccessDonation({
						txHash: [{ txHash: tx.hash, chainType: ChainType.EVM }],
					});
				}
			}
		} catch (error: any) {
			setStep(EDonationSteps.DONATE);
			if (error?.code !== 'ACTION_REJECTED') {
				showToastError(error);
			}
			console.log('Error on recurring donation', { error });
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

	const totalPerMonth =
		BigInt(
			new BigNumber((amount || 0n).toString())
				.multipliedBy(percentage)
				.toFixed(0),
		) / 100n;
	const projectPerMonth =
		(totalPerMonth * BigInt(100 - donationToGiveth)) / 100n;
	const givethPerMonth = totalPerMonth - projectPerMonth;

	return (
		<Wrapper>
			<DonateSteps donateState={step} />
			<Items $flexDirection='column' gap='16px'>
				{!selectedToken?.token.isSuperToken && (
					<Item
						title='Deposit into your stream balance'
						amount={amount}
						price={tokenPrice}
						token={selectedToken?.token!}
					/>
				)}
				<Item
					title={`Donate to ${project.title}`}
					subtext={'per month'}
					amount={projectPerMonth}
					price={tokenPrice}
					token={selectedToken?.token!}
				/>
				{donationToGiveth > 0 && (
					<Item
						title='Donate to the Giveth DAO'
						subtext={'per month'}
						amount={givethPerMonth}
						price={tokenPrice}
						token={selectedToken?.token!}
					/>
				)}
			</Items>
			<RunOutInfo
				superTokenBalance={amount}
				streamFlowRatePerMonth={totalPerMonth}
				symbol={selectedToken?.token.symbol || ''}
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

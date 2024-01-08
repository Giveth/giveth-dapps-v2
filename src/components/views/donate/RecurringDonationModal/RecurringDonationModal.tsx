import { FC, useEffect, useState } from 'react';
import { Button, IconDonation32, mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Framework, type Operation } from '@superfluid-finance/sdk-core';
import { useAccount } from 'wagmi';
import { useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { Flex } from '@/components/styled-components/Flex';
import { useDonateData } from '@/context/donate.context';
import { Item } from './Item';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { showToastError } from '@/lib/helpers';
import { DonateSteps } from './DonateSteps';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { approveERC20tokenTransfer } from '@/lib/stakingPool';
import config from '@/configuration';
import { findSuperTokenByTokenAddress } from '@/helpers/donate';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { RunOutInfo } from '../RunOutInfo';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';

interface IRecurringDonationModalProps extends IModal {
	donationToGiveth: number;
	amount: bigint;
	percentage: number;
	isUpdating?: boolean;
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
		console.log('amount', amount);
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
			const _provider = getEthersProvider({
				chainId: config.OPTIMISM_CONFIG.id,
			});

			const signer = await getEthersSigner({
				chainId: config.OPTIMISM_CONFIG.id,
			});

			if (!_provider || !signer || !address || !selectedToken)
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
			const sf = await Framework.create({
				chainId: config.OPTIMISM_CONFIG.id,
				provider: _provider,
			});

			// EThx is not a Wrapper Super Token and should load separately
			let superToken;
			if (_superToken.symbol === 'ETHx') {
				superToken = await sf.loadNativeAssetSuperToken(_superToken.id);
			} else {
				superToken = await sf.loadWrapperSuperToken(_superToken.id);
			}

			const operations: Operation[] = [];

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

			const projectOpWalletAddress = project?.addresses?.find(
				address => address.networkId === config.OPTIMISM_CONFIG.id,
			)?.address;

			if (!projectOpWalletAddress) {
				throw new Error('Project wallet address not found');
			}

			const _flowRate =
				(totalPerMonth * BigInt(100 - donationToGiveth)) /
				100n /
				ONE_MONTH_SECONDS;

			const options = {
				sender: address,
				receiver: projectOpWalletAddress, // should change with anchor contract address
				flowRate: _flowRate.toString(),
			};

			let projectFlowOp = isUpdating
				? superToken.updateFlow(options)
				: superToken.createFlow(options);

			operations.push(projectFlowOp);

			if (donationToGiveth > 0) {
				const givethOpWalletAddress = project?.givethAddresses?.find(
					address => address.networkId === config.OPTIMISM_CONFIG.id,
				)?.address;

				if (!givethOpWalletAddress) {
					throw new Error('Giveth wallet address not found');
				}

				const _newFlowRate =
					(totalPerMonth * BigInt(donationToGiveth)) /
					100n /
					ONE_MONTH_SECONDS;

				const oldStream =
					tokenStreams[_superToken.id] &&
					tokenStreams[_superToken.id].find(
						stream =>
							stream.receiver.id.toLowerCase() ===
							givethOpWalletAddress.toLowerCase(),
					);

				if (oldStream) {
					const givethFlowRate =
						_newFlowRate + BigInt(oldStream.currentFlowRate);

					const givethFlowOp = superToken.updateFlow({
						sender: address,
						receiver: givethOpWalletAddress, // should change with anchor contract address
						flowRate: givethFlowRate.toString(),
					});

					operations.push(givethFlowOp);
				} else {
					const givethFlowOp = superToken.createFlow({
						sender: address,
						receiver: givethOpWalletAddress, // should change with anchor contract address
						flowRate: _newFlowRate.toString(),
					});

					operations.push(givethFlowOp);
				}
			}
			const batchOp = sf.batchCall(operations);
			const tx = await batchOp.exec(signer);
			const res = await tx.wait();
			if (!res.status) {
				throw new Error('Transaction failed');
			}
			setStep(EDonationSteps.SUBMITTED);
			if (tx.hash) {
				setSuccessDonation({ txHash: [tx.hash] });
			}
		} catch (error) {
			setStep(EDonationSteps.DONATE);
			showToastError(error);
			console.log('error', error);
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

	const totalPerMonth = ((amount || 0n) * BigInt(percentage)) / 100n;
	const projectPerMonth =
		(totalPerMonth * BigInt(100 - donationToGiveth)) / 100n;
	const givethPerMonth = totalPerMonth - projectPerMonth;

	return (
		<Wrapper>
			<DonateSteps donateState={step} />
			<Items flexDirection='column' gap='16px'>
				{!selectedToken?.token.isSuperToken && (
					<Item
						title='Deposit into your stream balance'
						amount={amount}
						price={tokenPrice}
						token={selectedToken?.token!}
					/>
				)}
				<Item
					title={`Donate Monthly to ${project.title}`}
					amount={projectPerMonth}
					price={tokenPrice}
					token={selectedToken?.token!}
				/>
				{donationToGiveth > 0 && (
					<Item
						title='Donate Monthly to the Giveth DAO'
						amount={givethPerMonth}
						price={tokenPrice}
						token={selectedToken?.token!}
					/>
				)}
			</Items>
			<RunOutInfo amount={amount} totalPerMonth={totalPerMonth} />
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

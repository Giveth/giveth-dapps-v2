import { FC, useEffect, useState } from 'react';
import {
	B,
	Button,
	IconDonation32,
	P,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Framework, type Operation } from '@superfluid-finance/sdk-core';
import { useAccount } from 'wagmi';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { Flex } from '@/components/styled-components/Flex';
import { ITokenStreams } from '../RecurringDonationCard';
import { useDonateData } from '@/context/donate.context';
import { Item } from './Item';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { formatDate, showToastError } from '@/lib/helpers';
import { DonateSteps } from './DonateSteps';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { approveERC20tokenTransfer } from '@/lib/stakingPool';
import config from '@/configuration';
import { findSuperTokenByTokenAddress } from '@/helpers/donate';

interface IRecurringDonationModalProps extends IModal {
	tokenStreams: ITokenStreams;
	donationToGiveth: number;
	amount: bigint;
	percentage: number;
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
			return 'Confirm your donation';
		case EDonationSteps.DONATING:
			return 'Donating';
		case EDonationSteps.SUBMITTED:
			return 'Donation Submitted';
	}
};

const buttonLabel = {
	[EDonationSteps.APPROVE]: 'Approve',
	[EDonationSteps.APPROVING]: 'Approving...',
	[EDonationSteps.DONATE]: 'Donate',
	[EDonationSteps.DONATING]: 'Donating...',
	[EDonationSteps.SUBMITTED]: 'Done',
};

export const RecurringDonationModal: FC<IRecurringDonationModalProps> = ({
	setShowModal,
	...props
}) => {
	const [step, setStep] = useState(EDonationSteps.APPROVE);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={headerTitleGenerator(step)}
			headerTitlePosition='left'
			headerIcon={<IconDonation32 />}
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
	tokenStreams,
	setShowModal,
}) => {
	const { project, selectedToken } = useDonateData();
	const { address } = useAccount();
	const tokenPrice = useTokenPrice(selectedToken?.token);

	console.log('tokenPrice', tokenPrice);

	console.log('project', project);
	console.log('tokenStreams', tokenStreams);

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

			const superToken = await sf.loadWrapperSuperToken(_superToken.id);

			const operations: Operation[] = [];

			const upgradeOperation = await superToken.upgrade({
				amount: amount.toString(),
			});

			operations.push(upgradeOperation);

			const projectOpWalletAddress = project?.addresses?.find(
				address => address.networkId === config.OPTIMISM_CONFIG.id,
			)?.address;

			if (!projectOpWalletAddress) {
				throw new Error('Project wallet address not found');
			}

			const _flowRate =
				(totalPerMonth * BigInt(100 - donationToGiveth)) /
				100n /
				BigInt(30 * 24 * 60 * 60);

			let projectFlowOp = superToken.createFlow({
				sender: address,
				receiver: projectOpWalletAddress, // should change with anchor contract address
				flowRate: _flowRate.toString(),
			});

			operations.push(projectFlowOp);

			if (donationToGiveth > 0) {
				const givethOpWalletAddress = project?.givethAddresses?.find(
					address => address.networkId === config.OPTIMISM_CONFIG.id,
				)?.address;

				if (!givethOpWalletAddress) {
					throw new Error('Giveth wallet address not found');
				}

				console.log(
					'tokenStreams',
					tokenStreams,
					tokenStreams[_superToken.id],
				);

				const _flowRate =
					(totalPerMonth * BigInt(donationToGiveth)) /
					100n /
					BigInt(30 * 24 * 60 * 60);

				const givethFlowOp = superToken.createFlow({
					sender: address,
					receiver: givethOpWalletAddress, // should change with anchor contract address
					flowRate: _flowRate.toString(),
				});

				operations.push(givethFlowOp);
			}

			const batchOp = sf.batchCall(operations);
			const res = await batchOp.exec(signer);
			console.log('res', res);
			setStep(EDonationSteps.SUBMITTED);
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
	const totalPerSecond = totalPerMonth / BigInt(30 * 24 * 60 * 60);
	const secondsUntilRunOut = amount / totalPerSecond;
	const date = new Date();
	date.setSeconds(date.getSeconds() + Number(secondsUntilRunOut.toString()));

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
			<RunOutSection>
				<P>Your stream balance will run out funds on </P>
				<B>{formatDate(date)}</B>
				<P>Top-up before then!</P>
			</RunOutSection>
			<ActionButton
				label={buttonLabel[step]}
				onClick={handleAction}
				loading={
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

const RunOutSection = styled(Flex)`
	flex-direction: column;
	gap: 8px;
	border-top: 1px solid ${neutralColors.gray[600]};
	padding-top: 16px;
	align-items: flex-start;
`;

const ActionButton = styled(Button)`
	width: 100%;
`;
